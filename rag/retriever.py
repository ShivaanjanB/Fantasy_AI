"""
FantasyCoach AI - Retrieval Engine (L5)
Hybrid search: vector + BM25 -> weighted RRF fusion -> cross-encoder reranking.
Integrates QueryRouter for adaptive retrieval and QueryDecomposer for complex queries.
"""

import logging
import re
import time
from dataclasses import dataclass, field
from typing import Any, Optional

from config import VECTOR_TOP_K, BM25_TOP_K, RRF_K, RERANK_MODEL, RERANK_TOP_N
from rag.embedder import Embedder
from rag.router import QueryRouter
from rag.decomposer import QueryDecomposer

logger = logging.getLogger("fantasycoach.retriever")


@dataclass
class RetrievalResult:
    """A single retrieval result with scores from each stage."""
    chunk_id: str
    text: str
    metadata: dict[str, Any] = field(default_factory=dict)
    vector_score: float = 0.0
    bm25_score: float = 0.0
    rrf_score: float = 0.0
    rerank_score: float = 0.0




def _expand_player_name(query: str) -> str:
    """Expand common short player names to full names for better BM25 matching."""
    expansions = {
        "haaland": "Erling Haaland",
        "m.salah": "Mohamed Salah",
        "m. salah": "Mohamed Salah",
        "salah": "Mohamed Salah",
        "saka": "Bukayo Saka",
        "palmer": "Cole Palmer",
        "alexander-arnold": "Trent Alexander-Arnold",
        "trent": "Trent Alexander-Arnold",
        "odegaard": "Martin Odegaard",
        "de bruyne": "Kevin De Bruyne",
        "isak": "Alexander Isak",
        "watkins": "Ollie Watkins",
        "mbeumo": "Bryan Mbeumo",
        "rice": "Declan Rice",
        "fernandes": "Bruno Fernandes",
        "rashford": "Marcus Rashford",
        "maddison": "James Maddison",
        "trippier": "Kieran Trippier",
        "gabriel": "Gabriel Magalhaes",
        "raya": "David Raya",
        "flekken": "Mark Flekken",
        "neto": "Pedro Neto",
        "diogo": "Diogo Jota",
        "jota": "Diogo Jota",
    }
    # Normalise dotted abbreviations like "M.Salah" -> "M Salah" for matching
    import re
    query_normalised = re.sub(r"([A-Z])\.([A-Z])", r"\1 \2", query)
    q_lower = query_normalised.lower()
    for short, full in expansions.items():
        if short in q_lower and full.lower() not in q_lower:
            query = query + f" {full}"
            break
    return query

class RetrieverPipeline:
    """Full retrieval pipeline: route -> search -> fuse -> rerank -> assemble."""

    def __init__(self, embedder: Embedder) -> None:
        self.embedder = embedder
        self._cross_encoder = None

    def _get_cross_encoder(self):
        """Lazy-load cross-encoder reranking model."""
        if self._cross_encoder is None:
            from sentence_transformers import CrossEncoder
            logger.info(f"Loading cross-encoder: {RERANK_MODEL}")
            self._cross_encoder = CrossEncoder(RERANK_MODEL)
            logger.info("Cross-encoder loaded")
        return self._cross_encoder

    # --- Vector Search ---

    def vector_search(
        self,
        query: str,
        top_k: int = VECTOR_TOP_K,
        where: Optional[dict[str, Any]] = None,
    ) -> list[RetrievalResult]:
        """Dense vector search via ChromaDB."""
        raw = self.embedder.query(query, n_results=top_k, where=where)

        results = []
        for i in range(len(raw["ids"])):
            distance = raw["distances"][i] if raw["distances"] else 1.0
            similarity = 1.0 - (distance / 2.0)

            results.append(RetrievalResult(
                chunk_id=raw["ids"][i],
                text=raw["documents"][i],
                metadata=raw["metadatas"][i] if raw["metadatas"] else {},
                vector_score=similarity,
            ))

        return results

    def bm25_search(
        self,
        query: str,
        top_k: int = BM25_TOP_K,
        where: Optional[dict] = None,
    ) -> list[RetrievalResult]:
        """Sparse BM25 keyword search with optional metadata filter."""
        # Fetch more candidates so we have enough after filtering
        fetch_k = top_k * 3 if where else top_k
        raw = self.embedder.bm25_search(query, top_k=fetch_k)

        results = []
        for chunk_id, score, text, meta in raw:
            # Apply metadata filter if provided
            if where:
                match = True
                for key, condition in where.items():
                    val = meta.get(key, "")
                    if isinstance(condition, dict):
                        op = list(condition.keys())[0]
                        expected = list(condition.values())[0]
                        if op == "$eq" and val != expected:
                            match = False
                            break
                    elif val != condition:
                        match = False
                        break
                if not match:
                    continue
            results.append(RetrievalResult(
                chunk_id=chunk_id,
                text=text,
                metadata=meta,
                bm25_score=score,
            ))
            if len(results) >= top_k:
                break

        return results

    # --- Weighted RRF Fusion ---

    @staticmethod
    def weighted_rrf_fuse(
        vector_results: list[RetrievalResult],
        bm25_results: list[RetrievalResult],
        vector_weight: float = 0.5,
        bm25_weight: float = 0.5,
        k: int = RRF_K,
    ) -> list[RetrievalResult]:
        """Weighted Reciprocal Rank Fusion: merge two ranked lists with adaptive weights.

        Unlike standard RRF which gives equal weight to both lists, this applies
        the router's recommended weights to bias toward vector or BM25 as appropriate.
        """
        scores: dict[str, float] = {}
        result_map: dict[str, RetrievalResult] = {}

        # Score from vector results (weighted)
        for rank, r in enumerate(vector_results):
            rrf_score = vector_weight * (1.0 / (k + rank + 1))
            scores[r.chunk_id] = scores.get(r.chunk_id, 0) + rrf_score
            if r.chunk_id not in result_map:
                result_map[r.chunk_id] = r

        # Score from BM25 results (weighted)
        for rank, r in enumerate(bm25_results):
            rrf_score = bm25_weight * (1.0 / (k + rank + 1))
            scores[r.chunk_id] = scores.get(r.chunk_id, 0) + rrf_score
            if r.chunk_id not in result_map:
                result_map[r.chunk_id] = r
            else:
                result_map[r.chunk_id].bm25_score = r.bm25_score

        # Sort by fused score
        sorted_ids = sorted(scores.keys(), key=lambda cid: scores[cid], reverse=True)

        fused = []
        for cid in sorted_ids:
            result = result_map[cid]
            result.rrf_score = scores[cid]
            fused.append(result)

        return fused

    # --- Cross-Encoder Reranking ---

    def rerank(
        self,
        query: str,
        candidates: list[RetrievalResult],
        top_n: int = RERANK_TOP_N,
    ) -> list[RetrievalResult]:
        """Rerank candidates using cross-encoder for precision."""
        if not candidates:
            return []

        cross_encoder = self._get_cross_encoder()

        pairs = [(query, r.text[:1000]) for r in candidates]
        scores = cross_encoder.predict(pairs)

        for i, score in enumerate(scores):
            candidates[i].rerank_score = float(score)

        reranked = sorted(candidates, key=lambda r: r.rerank_score, reverse=True)
        return reranked[:top_n]

    # --- Full Pipeline ---

    def retrieve(
        self,
        query: str,
        top_n: int = 5,
        team_context: Optional[list[str]] = None,
    ) -> list[RetrievalResult]:
        """Full retrieval pipeline: route -> search -> fuse -> rerank.

        Uses QueryRouter for adaptive retrieval strategy and
        QueryDecomposer for complex comparison queries.
        """
        start = time.time()

        # Expand short player name queries before routing
        query = _expand_player_name(query)

        # Route query to get optimal retrieval config
        config = QueryRouter.classify(query)
        logger.info(
            f"Query routed as '{config['type']}' | "
            f"weights: vec={config['vector_weight']}, bm25={config['bm25_weight']} | "
            f"top_k={config['top_k']}, rerank_n={config['rerank_top_n']}"
        )

        # Use router's top_k and rerank_top_n
        top_k = config["top_k"]
        rerank_top_n = config["rerank_top_n"]

        # Build metadata filter from router
        where = config.get("metadata_filter")

        # Check if decomposition is needed (comparison queries)
        if config.get("decompose"):
            sub_queries = QueryDecomposer.decompose(query, config["type"])

            if len(sub_queries) > 1:
                # Multi-query retrieval path
                all_results: list[list[RetrievalResult]] = []

                for sq in sub_queries:
                    vec = self.vector_search(sq, top_k=top_k, where=where)
                    bm25 = self.bm25_search(sq, top_k=top_k)
                    fused = self.weighted_rrf_fuse(
                        vec, bm25,
                        vector_weight=config["vector_weight"],
                        bm25_weight=config["bm25_weight"],
                    )
                    all_results.append(fused)

                # Merge and deduplicate
                merged = QueryDecomposer.merge_results(all_results, query)

                # Rerank merged set against ORIGINAL query
                reranked = self.rerank(query, merged[:40], top_n=rerank_top_n)
            else:
                # Decomposition didn't produce sub-queries, fall through
                reranked = self._standard_retrieve(
                    query, top_k, rerank_top_n, where, config
                )
        else:
            # Standard single-query retrieval path
            reranked = self._standard_retrieve(
                query, top_k, rerank_top_n, where, config
            )

        # Inject team context if provided (for squad analysis)
        if team_context and config.get("inject_squad", False):
            context_query = " ".join(team_context)
            extra = self.vector_search(context_query, top_k=5)
            # Add squad-relevant chunks that aren't already in results
            existing_ids = {r.chunk_id for r in reranked}
            for r in extra:
                if r.chunk_id not in existing_ids:
                    reranked.append(r)

        # Deduplicate by chunk_id
        seen: set[str] = set()
        final: list[RetrievalResult] = []
        for r in reranked:
            if r.chunk_id not in seen:
                seen.add(r.chunk_id)
                final.append(r)

        latency = (time.time() - start) * 1000
        if final:
            logger.info(
                f"Retrieval complete: {len(final)} results in {latency:.0f}ms "
                f"(top score: {final[0].rerank_score:.3f})"
            )
        else:
            logger.info(f"Retrieval complete: 0 results in {latency:.0f}ms")

        return final[:top_n]

    def _standard_retrieve(
        self,
        query: str,
        top_k: int,
        rerank_top_n: int,
        where: Optional[dict],
        config: dict,
    ) -> list[RetrievalResult]:
        """Standard single-query retrieval with weighted fusion."""
        # Vector search
        vector_results = self.vector_search(query, top_k=top_k, where=where)
        logger.debug(f"Vector search: {len(vector_results)} results")

        # BM25 search (with metadata filter to match vector search)
        bm25_results = self.bm25_search(query, top_k=top_k, where=where)
        logger.debug(f"BM25 search: {len(bm25_results)} results")

        # Weighted RRF fusion
        fused = self.weighted_rrf_fuse(
            vector_results, bm25_results,
            vector_weight=config["vector_weight"],
            bm25_weight=config["bm25_weight"],
        )
        logger.debug(f"Weighted RRF fusion: {len(fused)} unique results")

        # Cross-encoder reranking
        reranked = self.rerank(query, fused[:30], top_n=rerank_top_n)
        return reranked

    # --- Health Check ---

    def health_check(self) -> dict[str, Any]:
        """Quick system health check."""
        return {
            "chunk_count": self.embedder.get_chunk_count(),
            "bm25_loaded": self.embedder.bm25_loaded,
            "cross_encoder_loaded": self._cross_encoder is not None,
        }
