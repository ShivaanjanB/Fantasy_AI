"""
FantasyCoach AI - Query Decomposer
Breaks complex multi-entity queries into sub-queries for independent retrieval.
Primarily handles comparison queries like "Haaland vs Salah".
"""

import logging
import re
from typing import Any

logger = logging.getLogger("fantasycoach.decomposer")


class QueryDecomposer:
    """Decompose complex queries into retrievable sub-queries."""

    @staticmethod
    def decompose(query: str, query_type: str) -> list[str]:
        """Break a complex query into sub-queries.

        Returns list of sub-queries. For simple queries, returns [original_query].
        Only decomposes comparison-type queries.
        """
        if query_type != "comparison":
            return [query]

        q = query.lower()

        # Try to extract player names from comparison patterns
        patterns = [
            r'compare\s+(.+?)\s+(?:and|vs|versus|with)\s+(.+?)(?:\s+(?:for|in|considering)|$|\.|\?)',
            r'(.+?)\s+(?:vs|versus)\s+(.+?)(?:\s+(?:for|in|considering|who)|$|\.|\?)',
            r'(?:should i (?:pick|get|choose|buy))\s+(.+?)\s+(?:or)\s+(.+?)(?:\s|$|\.|\?)',
            r'(?:is)\s+(.+?)\s+(?:better than|or)\s+(.+?)(?:\s|$|\.|\?)',
            r'(.+?)\s+(?:or)\s+(.+?)(?:\s+(?:for|in)|$|\.|\?)',
        ]

        for pattern in patterns:
            match = re.search(pattern, q)
            if match:
                player_a = match.group(1).strip().title()
                player_b = match.group(2).strip().title()

                # Clean up common words that aren't player names
                for word in ["Should I", "Is", "Who", "Which", "Get", "Pick"]:
                    player_a = player_a.replace(word, "").strip()
                    player_b = player_b.replace(word, "").strip()

                if player_a and player_b:
                    sub_queries = [
                        f"{player_a} stats goals assists xG form points",
                        f"{player_b} stats goals assists xG form points",
                        query,  # Also search the full original query
                    ]
                    logger.info(
                        f"Decomposed comparison: '{player_a}' vs '{player_b}' "
                        f"-> {len(sub_queries)} sub-queries"
                    )
                    return sub_queries

        # Could not decompose, return original
        logger.debug(f"Could not decompose query: {query}")
        return [query]

    @staticmethod
    def merge_results(all_results: list[list], original_query: str) -> list:
        """Merge results from multiple sub-queries, deduplicate by chunk_id.

        Args:
            all_results: List of result lists from each sub-query
            original_query: The original undecomposed query (for logging)

        Returns:
            Deduplicated merged results list
        """
        seen: set[str] = set()
        merged = []

        for results in all_results:
            for r in results:
                if r.chunk_id not in seen:
                    seen.add(r.chunk_id)
                    merged.append(r)

        logger.info(
            f"Merged {sum(len(r) for r in all_results)} results "
            f"-> {len(merged)} unique chunks"
        )
        return merged
