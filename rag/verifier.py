"""
FantasyCoach AI - Response Verifier
Post-generation verification: extracts numeric claims from LLM responses
and checks them against retrieved context chunks for faithfulness scoring.
"""

import logging
import re
from typing import Any

logger = logging.getLogger("fantasycoach.verifier")


class ResponseVerifier:
    """Verify LLM responses against retrieved context."""

    @staticmethod
    def extract_numeric_claims(response: str) -> list[dict[str, Any]]:
        """Extract factual claims with numbers from the response.

        Looks for patterns like:
        - "Haaland has 17 goals"
        - "Salah with 12.5 xG"
        - "Palmer's 156 points"
        - "8 assists from Bruno"
        """
        claims: list[dict[str, Any]] = []
        seen_values: set[str] = set()

        patterns = [
            # "Player has N stat"
            (r'(\w[\w\s]{1,25}?)\s+has\s+(\d+\.?\d*)\s+'
             r'(goals?|assists?|points?|yellow cards?|red cards?|clean sheets?|'
             r'minutes?|appearances?|bonus|tackles?|shots?)',
             "player_has"),

            # "Player scored/with N stat"
            (r'(\w[\w\s]{1,25}?)\s+(?:scored|with|of|averaging)\s+(\d+\.?\d*)\s+'
             r'(goals?|assists?|xG|xA|xGI|points?|PPM|form|rating)',
             "player_with"),

            # "N stat for/by Player"
            (r'(\d+\.?\d*)\s+'
             r'(goals?|assists?|points?|xG|xA|PPM|form|clean sheets?|bonus)\s+'
             r'(?:for|by|from)\s+(\w[\w\s]{1,25})',
             "stat_for_player"),

            # "Player's N stat"
            (r"(\w[\w\s]{1,25}?)['s]+\s+(\d+\.?\d*)\s+"
             r'(goals?|assists?|xG|xA|xGI|points?|form|PPM|rating|minutes?)',
             "possessive"),

            # "costs/priced N.Nm" (cost)
            (r'(\w[\w\s]{1,25}?)\s+(?:costs?|priced at|at)\s+'
             r'(\d+\.?\d*)\s*(?:m|million)',
             "cost"),

            # Standalone "N goals/assists" near a name
            (r'(\d+\.?\d*)\s+(goals?|assists?|points?|clean sheets?)',
             "standalone_stat"),
        ]

        for pattern, ptype in patterns:
            for match in re.finditer(pattern, response, re.IGNORECASE):
                groups = match.groups()

                # Extract the numeric value depending on pattern type
                if ptype in ("player_has", "player_with", "possessive", "cost"):
                    value = groups[1]
                elif ptype == "stat_for_player":
                    value = groups[0]
                elif ptype == "standalone_stat":
                    value = groups[0]
                else:
                    value = groups[1] if len(groups) > 1 else groups[0]

                # Deduplicate by value+text
                key = f"{value}:{match.group(0)[:40]}"
                if key not in seen_values:
                    seen_values.add(key)
                    claims.append({
                        "text": match.group(0).strip(),
                        "value": value,
                        "pattern_type": ptype,
                        "status": "pending",
                    })

        logger.debug(f"Extracted {len(claims)} numeric claims from response")
        return claims

    @staticmethod
    def verify_claims(
        claims: list[dict[str, Any]],
        context_chunks: list[str],
    ) -> dict[str, Any]:
        """Check each claim against the retrieved context.

        Returns verification report with faithfulness score.
        """
        if not claims:
            return {
                "total_claims": 0,
                "verified": 0,
                "ungrounded": 0,
                "faithfulness_score": 1.0,
                "claims": [],
            }

        # Build a single searchable context string
        context_text = " ".join(context_chunks).lower()

        verified = 0
        ungrounded = 0

        for claim in claims:
            value = str(claim["value"])

            # Check if the exact number appears in context
            # Also try common formats: "17" might appear as "17.0" or vice versa
            found = False
            if value in context_text:
                found = True
            elif "." in value:
                # Try integer version: "12.0" -> "12"
                int_val = value.split(".")[0]
                if int_val in context_text:
                    found = True
            else:
                # Try float version: "12" -> "12.0"
                float_val = f"{value}.0"
                if float_val in context_text:
                    found = True

            if found:
                claim["status"] = "verified"
                verified += 1
            else:
                claim["status"] = "ungrounded"
                ungrounded += 1

        total = len(claims)
        faithfulness = verified / max(total, 1)

        result = {
            "total_claims": total,
            "verified": verified,
            "ungrounded": ungrounded,
            "faithfulness_score": round(faithfulness, 2),
            "claims": claims,
        }

        logger.info(
            f"Verification: {verified}/{total} claims grounded "
            f"(faithfulness={faithfulness:.0%})"
        )
        return result
