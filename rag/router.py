"""
FantasyCoach AI - Query Router
Routes queries to optimal retrieval strategies based on query type.
Different queries need different retrieval parameters for best results.
"""

import logging
import re
from typing import Any, Optional

logger = logging.getLogger("fantasycoach.router")


class QueryRouter:
    """Route queries to optimal retrieval strategies."""

    @staticmethod
    def classify(query: str) -> dict[str, Any]:
        """Returns retrieval configuration based on query type.

        Returns dict with keys:
            type: str - query category
            vector_weight: float - weight for vector search in fusion
            bm25_weight: float - weight for BM25 search in fusion
            top_k: int - candidates to retrieve per search method
            rerank_top_n: int - final results after reranking
            metadata_filter: dict|None - ChromaDB where clause
            decompose: bool - whether to trigger query decomposition
            inject_squad: bool - whether to inject squad context
        """
        q = query.lower().strip()

        # Player lookup - exact name match is critical, BM25-heavy
        if any(w in q for w in ["tell me about", "stats for", "how is", "how many",
                                 "how does", "what are", "show me"]):
            return {
                "type": "player_lookup",
                "vector_weight": 0.3,
                "bm25_weight": 0.7,
                "top_k": 10,
                "rerank_top_n": 5,
                "metadata_filter": {"chunk_type": {"$eq": "player_profile"}},
                "decompose": False,
                "inject_squad": False,
            }

        # Comparison - need multiple entities, trigger decomposition
        if any(w in q for w in [" vs ", " versus ", "compare", "better than",
                                 " or ", "between"]):
            return {
                "type": "comparison",
                "vector_weight": 0.5,
                "bm25_weight": 0.5,
                "top_k": 20,
                "rerank_top_n": 10,
                "metadata_filter": None,
                "decompose": True,
                "inject_squad": False,
            }

        # Differential / hidden gems (check BEFORE statistical to catch "best differential")
        if any(w in q for w in ["differential", "hidden gem", "low ownership",
                                 "under the radar", "punt", "sleeper"]):
            return {
                "type": "differential",
                "vector_weight": 0.6,
                "bm25_weight": 0.4,
                "top_k": 20,
                "rerank_top_n": 10,
                "metadata_filter": _detect_position_filter(q),
                "decompose": False,
                "inject_squad": False,
            }

        # Injury check (check BEFORE statistical to catch "most injured")
        if any(w in q for w in ["injured", "injury", "doubtful", "suspended",
                                 "fit", "available", "ruled out"]):
            return {
                "type": "injury",
                "vector_weight": 0.4,
                "bm25_weight": 0.6,
                "top_k": 15,
                "rerank_top_n": 10,
                "metadata_filter": None,
                "decompose": False,
                "inject_squad": False,
            }

        # Statistical - "most goals", "highest xG", "cheapest"
        if any(w in q for w in ["most", "highest", "lowest", "cheapest", "top",
                                 "best", "worst", "fewest", "expensive"]):
            return {
                "type": "statistical",
                "vector_weight": 0.4,
                "bm25_weight": 0.6,
                "top_k": 25,
                "rerank_top_n": 15,
                "metadata_filter": _detect_position_filter(q),
                "decompose": False,
                "inject_squad": False,
            }

        # Tactical / formation
        if any(w in q for w in ["formation", "tactic", "system", "4-3-3", "4-4-2",
                                 "3-5-2", "3-4-3", "captain", "armband"]):
            return {
                "type": "tactical",
                "vector_weight": 0.7,
                "bm25_weight": 0.3,
                "top_k": 10,
                "rerank_top_n": 8,
                "metadata_filter": None,
                "decompose": False,
                "inject_squad": False,
            }

        # Squad analysis - needs team context injection
        if any(w in q for w in ["my squad", "my team", "analyse my", "rate my",
                                 "my defense", "my defence", "my attack",
                                 "my midfield"]):
            return {
                "type": "squad_analysis",
                "vector_weight": 0.5,
                "bm25_weight": 0.5,
                "top_k": 20,
                "rerank_top_n": 15,
                "metadata_filter": None,
                "decompose": False,
                "inject_squad": True,
            }

        # Default - balanced retrieval
        return {
            "type": "general",
            "vector_weight": 0.5,
            "bm25_weight": 0.5,
            "top_k": 20,
            "rerank_top_n": 15,
            "metadata_filter": None,
            "decompose": False,
            "inject_squad": False,
        }


def _detect_position_filter(query: str) -> Optional[dict[str, str]]:
    """Detect position mentions in query for metadata filtering."""
    q = query.lower()
    if any(w in q for w in ["goalkeeper", " gk ", "keeper"]):
        return {"position": "GK"}
    if any(w in q for w in ["defender", " def ", "centre-back", "full-back"]):
        return {"position": "DEF"}
    if any(w in q for w in ["midfielder", " mid ", "playmaker"]):
        return {"position": "MID"}
    if any(w in q for w in ["forward", " fwd ", "striker"]):
        return {"position": "FWD"}
    return None
