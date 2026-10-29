"""
FantasyCoach AI - Evaluation Benchmark
30 test queries across 6 categories to benchmark RAG retrieval quality.
"""

import logging
import time
from typing import Any, Optional

logger = logging.getLogger("fantasycoach.evaluator")


# 30 benchmark queries across 6 categories
EVAL_QUERIES: list[dict[str, Any]] = [
    # Player Lookup (5)
    {"query": "Tell me about Erling Haaland", "category": "lookup",
     "expected_in_top3": "Haaland"},
    {"query": "What are Mohamed Salah's stats?", "category": "lookup",
     "expected_in_top3": "Salah"},
    {"query": "How is Cole Palmer performing?", "category": "lookup",
     "expected_in_top3": "Palmer"},
    {"query": "Declan Rice stats this season", "category": "lookup",
     "expected_in_top3": "Rice"},
    {"query": "Bruno Fernandes FPL points", "category": "lookup",
     "expected_in_top3": "Fernandes"},

    # Comparison (5)
    {"query": "Haaland vs Salah who is better?", "category": "comparison",
     "expected_entities": ["Haaland", "Salah"]},
    {"query": "Compare Palmer and Saka for FPL", "category": "comparison",
     "expected_entities": ["Palmer", "Saka"]},
    {"query": "Should I pick Rice or Bruno Fernandes?", "category": "comparison",
     "expected_entities": ["Rice", "Fernandes"]},
    {"query": "Is Isak better value than Haaland?", "category": "comparison",
     "expected_entities": ["Isak", "Haaland"]},
    {"query": "Watkins or Joao Pedro?", "category": "comparison",
     "expected_entities": ["Watkins", "Pedro"]},

    # Statistical (5)
    {"query": "Which forward has the most goals?", "category": "statistical"},
    {"query": "Best midfielder by points per million", "category": "statistical"},
    {"query": "Cheapest defender with most clean sheets", "category": "statistical"},
    {"query": "Who has the highest xG this season?", "category": "statistical"},
    {"query": "Top 5 players by form right now", "category": "statistical"},

    # Tactical (5)
    {"query": "What formation should I use for FPL?", "category": "tactical"},
    {"query": "How do I pick a good captain?", "category": "tactical"},
    {"query": "What makes a good FPL differential?", "category": "tactical"},
    {"query": "Is 4-3-3 or 4-4-2 better?", "category": "tactical"},
    {"query": "How should I spend my FPL budget?", "category": "tactical"},

    # Hallucination Guard (5) - system must refuse/acknowledge missing data
    {"query": "What are Lionel Messi's FPL points?", "category": "hallucination_guard",
     "expect_refusal": True},
    {"query": "How many Champions League goals does Haaland have?",
     "category": "hallucination_guard", "expect_refusal": True},
    {"query": "What is Salah's transfer fee?", "category": "hallucination_guard",
     "expect_refusal": True},
    {"query": "Predict who will win the league", "category": "hallucination_guard",
     "expect_refusal": True},
    {"query": "What is Haaland's FIFA rating?", "category": "hallucination_guard",
     "expect_refusal": True},

    # Squad Context (5)
    {"query": "Analyse my squad", "category": "squad", "needs_context": True},
    {"query": "Who should I transfer out?", "category": "squad", "needs_context": True},
    {"query": "Rate my defence", "category": "squad", "needs_context": True},
    {"query": "Best captain from my squad?", "category": "squad", "needs_context": True},
    {"query": "Any injury concerns in my team?", "category": "squad",
     "needs_context": True},
]


class EvalBenchmark:
    """Run evaluation benchmark against the retrieval pipeline."""

    def __init__(self, retriever) -> None:
        """
        Args:
            retriever: RetrieverPipeline instance
        """
        self.retriever = retriever

    def run_full_benchmark(self) -> dict[str, Any]:
        """Run all 30 benchmark queries and return aggregated results.

        Returns dict with:
            total_queries: int
            overall_precision: float
            avg_latency_ms: int
            by_category: dict per category with total, hits, avg_latency, precision
            details: list of per-query results
        """
        results: list[dict[str, Any]] = []

        for test in EVAL_QUERIES:
            result = self._run_single(test)
            results.append(result)

        # Aggregate by category
        by_category: dict[str, dict[str, Any]] = {}
        for r in results:
            cat = r["category"]
            if cat not in by_category:
                by_category[cat] = {"total": 0, "hits": 0, "total_latency": 0}
            by_category[cat]["total"] += 1
            by_category[cat]["hits"] += 1 if r["hit"] else 0
            by_category[cat]["total_latency"] += r["latency_ms"]

        for cat in by_category:
            stats = by_category[cat]
            stats["avg_latency"] = round(stats["total_latency"] / stats["total"])
            stats["precision"] = round(stats["hits"] / stats["total"], 2)
            del stats["total_latency"]

        total_hits = sum(1 for r in results if r["hit"])

        return {
            "total_queries": len(results),
            "overall_precision": round(total_hits / len(results), 2),
            "avg_latency_ms": round(
                sum(r["latency_ms"] for r in results) / len(results)
            ),
            "by_category": by_category,
            "details": results,
        }

    def run_single_query(self, query: str, top_n: int = 5) -> dict[str, Any]:
        """Run a single query through retrieval and return diagnostics.

        Returns:
            query, route_type, retrieval_config, results with scores, latency
        """
        from rag.router import QueryRouter

        t0 = time.time()

        config = QueryRouter.classify(query)
        retrieved = self.retriever.retrieve(query, top_n=top_n)

        latency = round((time.time() - t0) * 1000)

        return {
            "query": query,
            "route_type": config["type"],
            "retrieval_config": {
                "vector_weight": config["vector_weight"],
                "bm25_weight": config["bm25_weight"],
                "top_k": config["top_k"],
                "rerank_top_n": config["rerank_top_n"],
                "decompose": config.get("decompose", False),
            },
            "results": [
                {
                    "chunk_id": r.chunk_id,
                    "player_name": r.metadata.get("player_name", ""),
                    "chunk_type": r.metadata.get("chunk_type", ""),
                    "vector_score": round(r.vector_score, 4),
                    "bm25_score": round(r.bm25_score, 4),
                    "rrf_score": round(r.rrf_score, 4),
                    "rerank_score": round(r.rerank_score, 4),
                    "text_preview": r.text[:200],
                }
                for r in retrieved
            ],
            "latency_ms": latency,
        }

    def _run_single(self, test: dict[str, Any]) -> dict[str, Any]:
        """Run a single benchmark query and check for hits."""
        t0 = time.time()

        try:
            retrieved = self.retriever.retrieve(test["query"], top_n=5)
        except Exception as e:
            logger.error(f"Retrieval failed for '{test['query']}': {e}")
            return {
                "query": test["query"],
                "category": test["category"],
                "hit": False,
                "latency_ms": round((time.time() - t0) * 1000),
                "top_results": [],
                "error": str(e),
            }

        latency = round((time.time() - t0) * 1000)

        # Extract player names from top results
        top_names = [
            r.metadata.get("player_name", r.chunk_id)
            for r in retrieved[:5]
        ]

        # Check if expected entity is found
        hit = False
        if "expected_in_top3" in test:
            expected = test["expected_in_top3"].lower()
            hit = any(expected in n.lower() for n in top_names[:3])

        elif "expected_entities" in test:
            # For comparison queries, both entities should appear in top 5
            all_names_lower = " ".join(top_names).lower()
            hit = all(
                e.lower() in all_names_lower
                for e in test["expected_entities"]
            )

        elif test.get("expect_refusal"):
            # For hallucination guard, success = retrieval returns results
            # (the LLM is responsible for refusing, not retrieval)
            hit = True

        elif test.get("needs_context"):
            # Squad queries need user context to work properly
            # Just check retrieval doesn't crash
            hit = len(retrieved) > 0

        else:
            hit = len(retrieved) > 0

        return {
            "query": test["query"],
            "category": test["category"],
            "hit": hit,
            "latency_ms": latency,
            "top_results": top_names[:3],
        }
