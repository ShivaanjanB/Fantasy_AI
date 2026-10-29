"""
FantasyCoach AI — Embedding & Vector Store (L3 + L4)
BAAI/bge-small-en-v1.5 embeddings + ChromaDB persistent store + BM25 index.
"""

import json
import logging
import pickle
import shutil
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

import numpy as np

from config import (
    CHROMA_DIR, CHROMA_BACKUP_DIR, CHROMA_COLLECTION,
    EMBEDDING_MODEL, EMBEDDING_DIMS, EMBEDDING_BATCH_SIZE,
    EMBEDDING_QUERY_PREFIX, BM25_INDEX_PATH,
)
from models.schemas import ChunkRecord

logger = logging.getLogger("fantasycoach.embedder")


class _HashEmbeddingFunction:
    """Simple hash-based embedding function as fallback when model download is unavailable.
    On the user's machine, BAAI/bge-small-en-v1.5 will be used instead.
    This provides basic functionality for testing.
    Implements chromadb.api.types.EmbeddingFunction protocol."""

    def __init__(self, dim: int = 384):
        self.dim = dim

    def __call__(self, input: list[str]) -> list[list[float]]:
        embeddings = []
        for text in input:
            # Create a deterministic hash-based embedding
            words = text.lower().split()
            vec = np.zeros(self.dim, dtype=np.float32)
            for i, word in enumerate(words):
                h = hash(word) % self.dim
                vec[h] += 1.0 / (1 + i * 0.01)
            # Normalize
            norm = np.linalg.norm(vec)
            if norm > 0:
                vec = vec / norm
            embeddings.append(vec.tolist())
        return embeddings

    def name(self) -> str:
        return "hash_embedding_fallback"

    def embed_documents(self, documents: list[str]) -> list[list[float]]:
        return self.__call__(documents)

    def embed_query(self, query: str) -> list[float]:
        return self.__call__([query])[0]


class Embedder:
    """Manages embeddings, ChromaDB vector store, and BM25 sparse index."""

    def __init__(self) -> None:
        self._model = None
        self._chroma_client = None
        self._collection = None
        self._bm25 = None
        self._bm25_corpus_ids: list[str] = []
        self._bm25_corpus_texts: list[str] = []

    # ─── Lazy Loading ───────────────────────────────────────────────────

    def _get_model(self):
        """Lazy-load the SentenceTransformer model."""
        if self._model is None:
            try:
                from sentence_transformers import SentenceTransformer
                logger.info(f"Loading embedding model: {EMBEDDING_MODEL}")
                self._model = SentenceTransformer(EMBEDDING_MODEL)
                self._use_default_ef = False
                logger.info(f"Embedding model loaded (dims={EMBEDDING_DIMS})")
            except Exception as e:
                logger.warning(
                    f"Failed to load SentenceTransformer model: {e}. "
                    f"Using ChromaDB default embedding function."
                )
                self._model = "default"
                self._use_default_ef = True
        return self._model

    def _get_collection(self):
        """Lazy-load ChromaDB collection."""
        if self._collection is None:
            import chromadb
            from chromadb.utils.embedding_functions import DefaultEmbeddingFunction

            self._chroma_client = chromadb.PersistentClient(path=str(CHROMA_DIR))

            # Use custom hash-based embedding if default can't download model
            ef = None
            if getattr(self, '_use_default_ef', False):
                ef = _HashEmbeddingFunction()

            kwargs = {
                "name": CHROMA_COLLECTION,
                "metadata": {
                    "hnsw:space": "cosine",
                    "hnsw:M": 16,
                    "hnsw:construction_ef": 200,
                    "hnsw:search_ef": 100,
                },
            }
            if ef:
                kwargs["embedding_function"] = ef

            self._collection = self._chroma_client.get_or_create_collection(**kwargs)
            logger.info(
                f"ChromaDB collection '{CHROMA_COLLECTION}' loaded — "
                f"{self._collection.count()} chunks"
            )
        return self._collection

    # ─── Embedding ──────────────────────────────────────────────────────

    def embed_texts(self, texts: list[str], is_query: bool = False) -> list[list[float]] | None:
        """Embed texts using BGE model. Returns None if using default ChromaDB embeddings."""
        model = self._get_model()

        if getattr(self, '_use_default_ef', False):
            # Let ChromaDB handle embeddings with its default function
            return None

        if is_query:
            texts = [f"{EMBEDDING_QUERY_PREFIX}{t}" for t in texts]

        # Batch processing
        all_embeddings = []
        for i in range(0, len(texts), EMBEDDING_BATCH_SIZE):
            batch = texts[i:i + EMBEDDING_BATCH_SIZE]
            embeddings = model.encode(batch, normalize_embeddings=True, show_progress_bar=False)
            all_embeddings.extend(embeddings.tolist())

        return all_embeddings

    # ─── ChromaDB Operations ────────────────────────────────────────────

    def get_chunk_count(self) -> int:
        """Get current chunk count in ChromaDB."""
        collection = self._get_collection()
        return collection.count()

    def backup(self) -> str:
        """Create a timestamped backup of ChromaDB."""
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        backup_path = CHROMA_BACKUP_DIR / f"backup_{timestamp}"
        if CHROMA_DIR.exists():
            shutil.copytree(CHROMA_DIR, backup_path, dirs_exist_ok=True)
            logger.info(f"ChromaDB backed up to {backup_path}")
            return str(backup_path)
        logger.warning("No ChromaDB directory to backup")
        return ""

    def clear_collection(self) -> None:
        """Delete and recreate the collection."""
        import chromadb
        if self._chroma_client is None:
            self._chroma_client = chromadb.PersistentClient(path=str(CHROMA_DIR))

        try:
            self._chroma_client.delete_collection(CHROMA_COLLECTION)
            logger.info(f"Deleted collection '{CHROMA_COLLECTION}'")
        except Exception:
            pass

        kwargs = {
            "name": CHROMA_COLLECTION,
            "metadata": {
                "hnsw:space": "cosine",
                "hnsw:M": 16,
                "hnsw:construction_ef": 200,
                "hnsw:search_ef": 100,
            },
        }
        if getattr(self, '_use_default_ef', False):
            kwargs["embedding_function"] = _HashEmbeddingFunction()

        self._collection = self._chroma_client.get_or_create_collection(**kwargs)
        logger.info(f"Recreated collection '{CHROMA_COLLECTION}'")

    def upsert_chunks(self, chunks: list[ChunkRecord]) -> int:
        """Upsert chunks into ChromaDB with embeddings."""
        if not chunks:
            return 0

        collection = self._get_collection()
        texts = [c.text for c in chunks]
        ids = [c.chunk_id for c in chunks]
        metadatas = [c.metadata for c in chunks]

        # Clean metadata (ChromaDB only supports str, int, float, bool)
        clean_metadatas = []
        for m in metadatas:
            clean = {}
            for k, v in m.items():
                if isinstance(v, (str, int, float, bool)):
                    clean[k] = v
                elif v is None:
                    clean[k] = ""
                else:
                    clean[k] = str(v)
            clean_metadatas.append(clean)

        # Embed (None means use ChromaDB default embedding function)
        logger.info(f"Embedding {len(texts)} chunks...")
        embeddings = self.embed_texts(texts)

        # Upsert in batches
        batch_size = 100
        for i in range(0, len(ids), batch_size):
            batch_ids = ids[i:i + batch_size]
            batch_docs = texts[i:i + batch_size]
            batch_meta = clean_metadatas[i:i + batch_size]

            upsert_kwargs = {
                "ids": batch_ids,
                "documents": batch_docs,
                "metadatas": batch_meta,
            }
            if embeddings is not None:
                upsert_kwargs["embeddings"] = embeddings[i:i + batch_size]

            collection.upsert(**upsert_kwargs)

        count = collection.count()
        logger.info(f"Upserted {len(ids)} chunks. Collection count: {count}")
        return count

    def full_rebuild(self, chunks: list[ChunkRecord]) -> int:
        """Backup -> clear -> embed -> upsert -> verify."""
        logger.info("Starting full ChromaDB rebuild...")

        # Backup
        self.backup()

        # Pre-initialize model to determine embedding strategy
        self._get_model()

        # Clear and recreate
        self.clear_collection()

        # Upsert all chunks
        count = self.upsert_chunks(chunks)

        # Verify
        expected = len(chunks)
        if count != expected:
            logger.warning(f"Count mismatch: expected {expected}, got {count}")
        else:
            logger.info(f"Full rebuild complete: {count} chunks verified")

        return count

    def query(
        self,
        query_text: str,
        n_results: int = 20,
        where: Optional[dict[str, Any]] = None,
    ) -> dict[str, Any]:
        """Vector similarity search with optional metadata filter."""
        collection = self._get_collection()
        count = collection.count()
        if count == 0:
            return {"ids": [], "documents": [], "metadatas": [], "distances": []}

        n_results = min(n_results, count)
        embeddings = self.embed_texts([query_text], is_query=True)

        kwargs: dict[str, Any] = {
            "n_results": n_results,
            "include": ["documents", "metadatas", "distances"],
        }
        if embeddings is not None:
            kwargs["query_embeddings"] = [embeddings[0]]
        else:
            kwargs["query_texts"] = [query_text]

        if where:
            kwargs["where"] = where

        try:
            results = collection.query(**kwargs)
            return {
                "ids": results["ids"][0] if results["ids"] else [],
                "documents": results["documents"][0] if results["documents"] else [],
                "metadatas": results["metadatas"][0] if results["metadatas"] else [],
                "distances": results["distances"][0] if results["distances"] else [],
            }
        except Exception as e:
            logger.error(f"ChromaDB query error: {e}")
            return {"ids": [], "documents": [], "metadatas": [], "distances": []}

    # ─── BM25 Index ─────────────────────────────────────────────────────

    def build_bm25_index(self, chunks: list[ChunkRecord]) -> None:
        """Build and serialize BM25 index from chunks."""
        from rank_bm25 import BM25Okapi

        corpus_ids = [c.chunk_id for c in chunks]
        corpus_texts = [c.text for c in chunks]
        corpus_metas = [c.metadata if c.metadata else {} for c in chunks]
        tokenized = [text.lower().split() for text in corpus_texts]

        bm25 = BM25Okapi(tokenized)

        # Serialize
        with open(BM25_INDEX_PATH, "wb") as f:
            pickle.dump({
                "bm25": bm25,
                "corpus_ids": corpus_ids,
                "corpus_texts": corpus_texts,
                "corpus_metas": corpus_metas,
            }, f)

        self._bm25 = bm25
        self._bm25_corpus_ids = corpus_ids
        self._bm25_corpus_texts = corpus_texts
        self._bm25_corpus_metas = corpus_metas

        logger.info(f"BM25 index built: {len(corpus_ids)} documents -> {BM25_INDEX_PATH}")

    def load_bm25_index(self) -> bool:
        """Load BM25 index from disk."""
        if not BM25_INDEX_PATH.exists():
            logger.warning(f"BM25 index not found at {BM25_INDEX_PATH}")
            return False

        try:
            with open(BM25_INDEX_PATH, "rb") as f:
                data = pickle.load(f)

            self._bm25 = data["bm25"]
            self._bm25_corpus_ids = data["corpus_ids"]
            self._bm25_corpus_texts = data["corpus_texts"]
            self._bm25_corpus_metas = data.get("corpus_metas", [{} for _ in data["corpus_ids"]])

            logger.info(f"BM25 index loaded: {len(self._bm25_corpus_ids)} documents")
            return True
        except Exception as e:
            logger.error(f"Failed to load BM25 index: {e}")
            return False

    def bm25_search(self, query: str, top_k: int = 20) -> list[tuple[str, float, str, dict]]:
        """BM25 keyword search. Returns [(chunk_id, score, text, metadata), ...]."""
        if self._bm25 is None:
            if not self.load_bm25_index():
                return []

        tokenized_query = query.lower().split()
        scores = self._bm25.get_scores(tokenized_query)

        # Get top-k indices
        top_indices = np.argsort(scores)[::-1][:top_k]

        results = []
        for idx in top_indices:
            if scores[idx] > 0:
                meta = self._bm25_corpus_metas[idx] if hasattr(self, "_bm25_corpus_metas") else {}
                results.append((
                    self._bm25_corpus_ids[idx],
                    float(scores[idx]),
                    self._bm25_corpus_texts[idx],
                    meta,
                ))

        return results

    @property
    def bm25_loaded(self) -> bool:
        return self._bm25 is not None
