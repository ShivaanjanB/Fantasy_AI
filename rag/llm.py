"""
FantasyCoach AI - LLM Orchestration (L6)
Claude Sonnet integration with SSE streaming, grounded responses,
and post-generation claim verification.
"""

import json
import logging
import time
from typing import Any, AsyncGenerator, Optional

from config import (
    ANTHROPIC_API_KEY, LLM_MODEL, LLM_MAX_TOKENS,
    LLM_TEMPERATURE, LLM_SYSTEM_PROMPT,
)
from rag.retriever import RetrieverPipeline, RetrievalResult
from rag.verifier import ResponseVerifier
from models.schemas import ChatSourceRef

logger = logging.getLogger("fantasycoach.llm")


class LLMOrchestrator:
    """Orchestrates retrieval -> context assembly -> LLM generation -> verification."""

    def __init__(self, retriever: RetrieverPipeline) -> None:
        self.retriever = retriever
        self._client = None

    def _get_client(self):
        """Lazy-load Anthropic client."""
        if self._client is None:
            import anthropic
            if not ANTHROPIC_API_KEY:
                raise EnvironmentError("ANTHROPIC_API_KEY not set")
            self._client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
            logger.info(f"Anthropic client initialized (model: {LLM_MODEL})")
        return self._client

    # --- Context Assembly ---

    @staticmethod
    def assemble_context(results: list[RetrievalResult]) -> str:
        """Format retrieval results into LLM context with source labels."""
        if not results:
            return "No relevant data found in knowledge base."

        sections = []
        for i, r in enumerate(results, 1):
            player_name = r.metadata.get("player_name", r.metadata.get("team", ""))
            chunk_type = r.metadata.get("chunk_type", "unknown")
            label = (
                f"[Source {i}: {player_name} ({chunk_type})]"
                if player_name
                else f"[Source {i}: {chunk_type}]"
            )
            sections.append(f"{label}\n{r.text}")

        return "\n\n---\n\n".join(sections)

    @staticmethod
    def build_source_refs(results: list[RetrievalResult]) -> list[ChatSourceRef]:
        """Extract citation metadata from retrieval results."""
        refs = []
        for r in results:
            refs.append(ChatSourceRef(
                chunk_id=r.chunk_id,
                player_name=r.metadata.get("player_name"),
                chunk_type=r.metadata.get("chunk_type", "unknown"),
                score=r.rerank_score,
            ))
        return refs

    # --- Streaming Generation ---


    def _resolve_player_name(self, query: str) -> tuple[str, str]:
        """
        Attempt to resolve abbreviated or ambiguous player names in the query.
        Returns (resolved_query, clarification_message).
        clarification_message is empty string if no clarification needed.
        """
        import re

        # Detect abbreviated name patterns: "M.Salah", "M. Salah", "E.Haaland"
        abbrev_pattern = re.compile(r"\b([A-Z])\.?\s+([A-Z][a-z]+)\b")
        match = abbrev_pattern.search(query)

        if not match:
            return query, ""

        initial = match.group(1)
        surname = match.group(2).lower()

        # Search ChromaDB for players matching this surname
        col = self.retriever.embedder._get_collection()
        all_data = col.get(include=["metadatas"])

        matches = []
        for meta in all_data["metadatas"]:
            if meta.get("chunk_type") != "player_profile":
                continue
            player_name = meta.get("player_name", "")
            # Check surname match and initial match
            parts = player_name.replace(".", "").split()
            if len(parts) >= 2:
                stored_initial = parts[0][0].upper() if parts[0] else ""
                stored_surname = parts[-1].lower()
                if stored_surname == surname and stored_initial == initial:
                    matches.append(player_name)

        if len(matches) == 1:
            # Unambiguous — expand and return
            full_abbrev = matches[0]
            resolved = query.replace(match.group(0), full_abbrev)
            return resolved, ""
        elif len(matches) > 1:
            # Ambiguous — ask for clarification
            options = "\n".join(f"- {m}" for m in matches[:5])
            clarification = (
                f"I found multiple players matching \"{match.group(0)}\":\n\n"
                f"{options}\n\n"
                f"Could you clarify which player you mean?"
            )
            return query, clarification
        else:
            # No match found — ask for clarification
            clarification = (
                f"I couldn't find a player matching \"{match.group(0)}\" in my knowledge base. "
                f"Could you provide the full name? For example: \"Tell me about Mohamed Salah\"."
            )
            return query, clarification

    def _is_wrong_player(self, query: str, top_result: "RetrievalResult") -> bool:
        """Check if the top retrieved result clearly does not match the query player."""
        import re
        # Extract any full name from query (2+ capitalised words)
        name_pattern = re.compile(r"\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b")
        name_matches = name_pattern.findall(query)
        if not name_matches:
            return False

        player_name = top_result.metadata.get("player_name", "").lower()
        chunk_text_first_line = top_result.text.split("\n")[0].lower()

        for name in name_matches:
            name_lower = name.lower()
            parts = name_lower.split()
            # Check if any part of the query name appears in chunk
            if any(p in chunk_text_first_line for p in parts if len(p) > 3):
                return False

        return True

    def _ask_clarification(self, query: str, candidates: list) -> str:
        """Generate clarification message when retrieved players don't match query."""
        import re
        name_pattern = re.compile(r"\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b")
        name_matches = name_pattern.findall(query)
        searched_name = name_matches[0] if name_matches else "that player"

        candidate_names = [
            r.metadata.get("player_name", "Unknown")
            for r in candidates
            if r.metadata.get("chunk_type") == "player_profile"
        ]

        if candidate_names:
            options = ", ".join(candidate_names[:3])
            return (
                f"I couldn't find \"{searched_name}\" in my knowledge base. "
                f"The closest players I have data for are: {options}. "
                f"Could you check the spelling or provide the full name?"
            )
        return (
            f"I couldn't find \"{searched_name}\" in my knowledge base. "
            f"Please try using the player's full name."
        )

    async def generate_stream(
        self,
        query: str,
        top_n: int = 5,
        team_context: Optional[list[str]] = None,
    ) -> AsyncGenerator[dict[str, Any], None]:
        """Full RAG pipeline with SSE streaming response and verification."""
        start = time.time()

        # Name resolution: check if query contains ambiguous/abbreviated player name
        resolved_query, clarification = self._resolve_player_name(query)
        if clarification:
            yield {"type": "text", "content": clarification}
            yield {"type": "done", "content": None}
            return

        # Retrieve
        results = self.retriever.retrieve(resolved_query, top_n=top_n, team_context=team_context)

        # Check if top result actually matches the player asked about
        if results and self._is_wrong_player(resolved_query, results[0]):
            clarification = self._ask_clarification(resolved_query, results[:5])
            if clarification:
                yield {"type": "text", "content": clarification}
                yield {"type": "done", "content": None}
                return

        # Assemble context
        context = self.assemble_context(results)
        source_refs = self.build_source_refs(results)

        # Build user message
        user_message = f"""RETRIEVED CONTEXT (from ChromaDB knowledge base):
{context}

USER QUESTION:
{query}

IMPORTANT: Respond based ONLY on the retrieved context above. Every statistic you quote must come from one of the [Source N] sections. If data is missing, say so — do NOT guess or fill in from general knowledge."""

        # Stream from Claude
        client = self._get_client()
        full_text = ""

        try:
            with client.messages.stream(
                model=LLM_MODEL,
                max_tokens=LLM_MAX_TOKENS,
                temperature=LLM_TEMPERATURE,
                system=LLM_SYSTEM_PROMPT,
                messages=[{"role": "user", "content": user_message}],
            ) as stream:
                for text in stream.text_stream:
                    full_text += text
                    yield {"type": "text", "content": text}

            # Send sources
            yield {
                "type": "sources",
                "content": [ref.model_dump() for ref in source_refs],
            }

            # Post-generation verification
            if full_text:
                chunk_texts = [r.text for r in results]
                claims = ResponseVerifier.extract_numeric_claims(full_text)
                verification = ResponseVerifier.verify_claims(claims, chunk_texts)
                yield {"type": "verification", "content": verification}

            latency = (time.time() - start) * 1000
            logger.info(
                f"LLM stream complete in {latency:.0f}ms — "
                f"{len(results)} chunks used"
            )

            yield {"type": "done", "content": None}

        except Exception as e:
            logger.error(f"LLM generation error: {e}")
            yield {
                "type": "error",
                "content": f"I'm having trouble generating a response. Error: {str(e)}",
            }
            yield {"type": "done", "content": None}

    # --- Sync Generation (for testing / eval compare) ---

    def generate_sync(
        self,
        query: str,
        top_n: int = 5,
        team_context: Optional[list[str]] = None,
    ) -> dict[str, Any]:
        """Non-streaming generation with verification for testing."""
        resolved_query, clarification = self._resolve_player_name(query)
        if clarification:
            return {"text": clarification, "sources": [], "verification": {}, "chunks_used": 0, "usage": {}}

        results = self.retriever.retrieve(resolved_query, top_n=top_n, team_context=team_context)

        if results and self._is_wrong_player(resolved_query, results[0]):
            clarification = self._ask_clarification(resolved_query, results[:5])
            if clarification:
                return {"text": clarification, "sources": [], "verification": {}, "chunks_used": 0, "usage": {}}

        context = self.assemble_context(results)
        source_refs = self.build_source_refs(results)

        user_message = f"""RETRIEVED CONTEXT (from ChromaDB knowledge base):
{context}

USER QUESTION:
{query}

IMPORTANT: Respond based ONLY on the retrieved context above. Every statistic you quote must come from one of the [Source N] sections. If data is missing, say so — do NOT guess."""

        client = self._get_client()
        response = client.messages.create(
            model=LLM_MODEL,
            max_tokens=LLM_MAX_TOKENS,
            temperature=LLM_TEMPERATURE,
            system=LLM_SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_message}],
        )

        response_text = response.content[0].text

        # Run verification
        chunk_texts = [r.text for r in results]
        claims = ResponseVerifier.extract_numeric_claims(response_text)
        verification = ResponseVerifier.verify_claims(claims, chunk_texts)

        return {
            "text": response_text,
            "sources": [ref.model_dump() for ref in source_refs],
            "verification": verification,
            "chunks_used": len(results),
            "usage": {
                "input_tokens": response.usage.input_tokens,
                "output_tokens": response.usage.output_tokens,
            },
        }

    # --- Baseline Generation (no RAG) ---

    def generate_baseline(self, query: str) -> dict[str, Any]:
        """Generate response WITHOUT retrieval context for comparison.

        This is the 'standalone LLM' baseline for academic evaluation.
        """
        client = self._get_client()

        baseline_system = (
            "You are an FPL (Fantasy Premier League) expert. "
            "Answer the user's question about FPL based on your general knowledge. "
            "Be specific with player names and statistics where possible."
        )

        response = client.messages.create(
            model=LLM_MODEL,
            max_tokens=LLM_MAX_TOKENS,
            temperature=LLM_TEMPERATURE,
            system=baseline_system,
            messages=[{"role": "user", "content": query}],
        )

        return {
            "text": response.content[0].text,
            "sources": [],
            "verification": {"total_claims": 0, "verified": 0,
                             "ungrounded": 0, "faithfulness_score": 0.0,
                             "claims": []},
            "chunks_used": 0,
            "usage": {
                "input_tokens": response.usage.input_tokens,
                "output_tokens": response.usage.output_tokens,
            },
        }
