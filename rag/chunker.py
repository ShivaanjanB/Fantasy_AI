"""
FantasyCoach AI — Chunking Pipeline (L2)
Transforms validated player records into semantically rich, retrieval-optimized chunks.
"""

import logging
from datetime import datetime
from typing import Any

from models.schemas import PlayerRecord, ChunkRecord, ChunkManifest
from config import EMBEDDING_MODEL

logger = logging.getLogger("fantasycoach.chunker")


class ChunkBuilder:
    """Build structured chunks from validated data for embedding."""

    def __init__(self) -> None:
        self._chunk_ids: set[str] = set()
        self._chunks: list[ChunkRecord] = []

    def _add_chunk(self, chunk: ChunkRecord) -> bool:
        """Add chunk with deduplication check."""
        if chunk.chunk_id in self._chunk_ids:
            logger.warning(f"Duplicate chunk_id skipped: {chunk.chunk_id}")
            return False
        self._chunk_ids.add(chunk.chunk_id)
        self._chunks.append(chunk)
        return True

    def build_player_chunk(self, player: PlayerRecord) -> ChunkRecord:
        """Build a structured player profile chunk."""
        # Build rich text
        lines = [
            f"PLAYER PROFILE: {player.full_name}",
            f"Position: {player.position} | Team: {player.team_name} | Nationality: {player.nationality}",
            "",
            f"SEASON 2024/25 STATISTICS:",
        ]

        # FPL stats
        if player.total_points > 0:
            ppm = f"{player.ppm}" if player.cost > 0 else "N/A"
            lines.append(
                f"- FPL Points: {player.total_points} | Cost: £{player.cost}m | "
                f"Points Per Million: {ppm}"
            )
        lines.append(
            f"- Goals: {player.goals} | Assists: {player.assists} | "
            f"Minutes: {player.minutes:,}"
        )

        if player.xg > 0 or player.xa > 0:
            xg_diff = player.xg_diff
            perf = "overperforming" if xg_diff > 0 else "underperforming"
            lines.append(
                f"- Expected Goals (xG): {player.xg} | Expected Assists (xA): {player.xa}"
            )
            lines.append(f"- Goals - xG: {xg_diff:+.1f} ({perf})")

        if player.form > 0:
            lines.append(
                f"- Form (last 5 GW): {player.form} | ICT Index: {player.ict_index}"
            )

        if player.ownership_pct > 0:
            own_label = "TEMPLATE" if player.is_template else ("DIFFERENTIAL" if player.is_differential else "")
            own_str = f"{player.ownership_pct}%"
            if own_label:
                own_str += f" [{own_label}]"
            lines.append(f"- Ownership: {own_str}")

        # Injury status
        lines.append("")
        lines.append(f"INJURY STATUS: {player.injury_status.title()}")
        if player.injury_news:
            lines.append(f"INJURY NEWS: {player.injury_news}")

        # SM detailed stats
        if player.appearances > 0:
            lines.append("")
            lines.append("DETAILED STATISTICS:")
            if player.shots_on_target > 0:
                acc = f"{player.shot_accuracy:.0f}%" if player.shot_accuracy > 0 else "N/A"
                lines.append(f"- Shots on Target: {player.shots_on_target} | Accuracy: {acc}")
            if player.aerial_duels_won > 0:
                lines.append(f"- Aerial Duels Won: {player.aerial_duels_won}")
            if player.tackles > 0:
                lines.append(f"- Tackles: {player.tackles}")
            if player.saves > 0:
                lines.append(f"- Saves: {player.saves}")
            if player.clean_sheets > 0:
                lines.append(f"- Clean Sheets: {player.clean_sheets}")
            lines.append(f"- Yellow Cards: {player.yellow_cards} | Red Cards: {player.red_cards}")
            if player.average_rating > 0:
                lines.append(f"- Average Rating: {player.average_rating:.2f}")
            lines.append(f"- Appearances: {player.appearances}")

        # Generated insight
        insight = self._generate_player_insight(player)
        if insight:
            lines.append("")
            lines.append(f"KEY INSIGHT: {insight}")

        text = "\n".join(lines)
        chunk_id = f"smid_{player.sm_id}"

        metadata = {
            "player_name": player.full_name,
            "display_name": player.display_name,
            "sm_id": player.sm_id,
            "fpl_id": player.fpl_id or 0,
            "team": player.team_name,
            "team_id": player.team_id,
            "position": player.position,
            "nationality": player.nationality,
            "chunk_type": "player_profile",
            "data_source": "sportmonks+fpl" if player.fpl_id else "sportmonks",
            "last_updated": player.last_updated,
            "season": "2024/25",
            "total_points": player.total_points,
            "cost": player.cost,
        }

        return ChunkRecord(
            chunk_id=chunk_id,
            text=text,
            metadata=metadata,
            chunk_type="player_profile",
        )

    def build_standing_chunk(
        self, standing: dict[str, Any]
    ) -> ChunkRecord:
        """Build a league standing chunk."""
        team = standing.get("team_name", standing.get("participant", {}).get("name", "Unknown"))
        pos = standing.get("position", 0)
        pts = standing.get("points", 0)
        played = standing.get("played", standing.get("games_played", 0))
        won = standing.get("won", 0)
        drawn = standing.get("drawn", standing.get("draw", 0))
        lost = standing.get("lost", 0)
        gf = standing.get("goals_for", standing.get("goals_scored", 0))
        ga = standing.get("goals_against", 0)
        gd = standing.get("goal_difference", gf - ga)
        form = standing.get("form", standing.get("recent_form", ""))

        text = (
            f"PREMIER LEAGUE STANDING: {team}\n"
            f"Position: {pos} | Points: {pts}\n"
            f"Played: {played} | Won: {won} | Drawn: {drawn} | Lost: {lost}\n"
            f"Goals For: {gf} | Goals Against: {ga} | Goal Difference: {gd:+d}\n"
        )
        if form:
            text += f"Recent Form: {form}\n"

        # Add zone context
        if pos <= 4:
            text += "Zone: Champions League qualification"
        elif pos == 5:
            text += "Zone: Europa League qualification"
        elif pos >= 18:
            text += "Zone: RELEGATION"

        chunk_id = f"standing_{team.lower().replace(' ', '_')}"
        return ChunkRecord(
            chunk_id=chunk_id,
            text=text,
            metadata={
                "team": team,
                "position": pos,
                "points": pts,
                "chunk_type": "standing",
            },
            chunk_type="standing",
        )

    def build_tactical_chunks(self) -> list[ChunkRecord]:
        """Build static tactical guide chunks."""
        guides = [
            {
                "id": "tactical_433",
                "text": (
                    "TACTICAL GUIDE: 4-3-3 Formation\n\n"
                    "Structure: 4 defenders, 3 midfielders, 3 forwards.\n"
                    "Strengths: Width in attack, strong pressing structure, balanced.\n"
                    "Weaknesses: Central midfield can be overrun against 3-man midfields.\n"
                    "FPL Impact: Premium wingers score heavily. Full-backs with attacking returns "
                    "are essential. The central midfielder is often the weakest FPL asset.\n"
                    "Best for: Teams with elite wingers (Salah, Saka) and attacking full-backs.\n"
                    "Teams using: Liverpool (4-3-3 with inverted wingers), Arsenal (3-2-4-1 variant)."
                ),
            },
            {
                "id": "tactical_442",
                "text": (
                    "TACTICAL GUIDE: 4-4-2 Formation\n\n"
                    "Structure: 4 defenders, 4 midfielders (2 wide), 2 strikers.\n"
                    "Strengths: Compact shape, partnership up front, wide midfield coverage.\n"
                    "Weaknesses: Can be outnumbered in central midfield, wide players must track back.\n"
                    "FPL Impact: Strike partnerships thrive. Wide midfielders with goal involvements "
                    "are valuable. Clean sheet potential with compact defensive block.\n"
                    "Best for: Teams with two quality strikers and hard-working wide midfielders.\n"
                    "Teams using: Everton, traditional English sides."
                ),
            },
            {
                "id": "tactical_4231",
                "text": (
                    "TACTICAL GUIDE: 4-2-3-1 Formation\n\n"
                    "Structure: 4 defenders, 2 DMs, 3 AMs (1 central, 2 wide), 1 striker.\n"
                    "Strengths: Defensive solidity with double pivot, creative freedom for #10.\n"
                    "Weaknesses: Striker can be isolated, relies on #10 productivity.\n"
                    "FPL Impact: The #10 is the key FPL asset. Lone strikers need high xG. "
                    "Wing-backs less involved than in 3-at-the-back.\n"
                    "Best for: Teams wanting balance between defence and attack.\n"
                    "Teams using: Many PL teams as default setup."
                ),
            },
            {
                "id": "tactical_352",
                "text": (
                    "TACTICAL GUIDE: 3-5-2 Formation\n\n"
                    "Structure: 3 CBs, 2 wing-backs, 3 central midfielders, 2 strikers.\n"
                    "Strengths: Overload in midfield, wing-backs provide width, two strikers.\n"
                    "Weaknesses: Exposed on the flanks if wing-backs pushed high.\n"
                    "FPL Impact: Wing-backs are ELITE assets (attacking returns + clean sheets). "
                    "Strike partnerships score well. Central CBs less likely to score.\n"
                    "Best for: Teams with elite wing-backs and a strong midfield trio.\n"
                    "Teams using: Historically Chelsea, Italian-influenced managers."
                ),
            },
            {
                "id": "tactical_captaincy",
                "text": (
                    "TACTICAL GUIDE: FPL Captaincy Selection\n\n"
                    "The captain choice doubles a player's points — the single highest-impact decision.\n\n"
                    "FACTORS (in priority order):\n"
                    "1. FIXTURE: Home advantage is significant. Target teams in bottom 6.\n"
                    "2. FORM: Recent form (last 5 GWs) matters more than season average.\n"
                    "3. xG/xA: Expected goals and assists predict future returns better than actuals.\n"
                    "4. OWNERSHIP: Captaining a template player (>50% owned) reduces rank risk. "
                    "Differential captain (<10% owned) is high-risk, high-reward.\n"
                    "5. MINUTES: Must be nailed starter (>85 minutes average).\n\n"
                    "GOLDEN RULE: When in doubt, captain the player with the best fixture + highest xG."
                ),
            },
            {
                "id": "tactical_differentials",
                "text": (
                    "TACTICAL GUIDE: Finding FPL Differentials\n\n"
                    "A differential is a player owned by <5% of managers who can deliver elite returns.\n\n"
                    "HOW TO IDENTIFY:\n"
                    "1. HIGH xG/xA, LOW OWNERSHIP: The market hasn't caught on yet.\n"
                    "2. FIXTURE SWING: Team entering a run of easy fixtures.\n"
                    "3. POSITION CHANGE: Player moved to a more attacking role.\n"
                    "4. RETURNING FROM INJURY: Proven performer at reduced price.\n"
                    "5. NEW SIGNING: Just arrived and priced low.\n\n"
                    "RISK: Differentials carry rank volatility. Use 1-2 per squad maximum.\n"
                    "PPM (Points Per Million) is the key metric for differential value."
                ),
            },
        ]

        chunks = []
        for g in guides:
            chunk = ChunkRecord(
                chunk_id=g["id"],
                text=g["text"],
                metadata={"chunk_type": "tactical", "guide": g["id"].replace("tactical_", "")},
                chunk_type="tactical",
            )
            chunks.append(chunk)
        return chunks

    def build_injury_report_chunk(self, players: list[PlayerRecord]) -> ChunkRecord:
        """Build consolidated injury report from all players."""
        injured = [p for p in players if p.injury_status != "available"]
        # Limit to top 100 most relevant injuries to prevent oversized chunks
        injured = sorted(injured, key=lambda x: x.total_points, reverse=True)[:100]

        lines = [
            f"INJURY & AVAILABILITY REPORT — {datetime.utcnow().strftime('%Y-%m-%d')}",
            f"Total players flagged: {len(injured)}",
            "",
        ]
        for p in injured:
            status_icon = {"injured": "🔴", "doubtful": "🟡", "suspended": "🟠"}.get(
                p.injury_status, "⚪"
            )
            line = (
                f"{status_icon} {p.full_name} ({p.team_name}, {p.position}) — "
                f"{p.injury_status.upper()}"
            )
            if p.injury_news:
                # Truncate long injury news
                news = p.injury_news[:100]
                line += f" — {news}"
            lines.append(line)

        text = "\n".join(lines)
        # Ensure minimum length
        if len(text) < 50:
            text += "\n\nNo significant injuries reported across Premier League squads."

        # Hard truncate to 19000 chars to be safe
        if len(text) > 19000:
            text = text[:19000] + "\n\n[Report truncated — showing top FPL-relevant injuries]"

        return ChunkRecord(
            chunk_id=f"injury_{datetime.utcnow().strftime('%Y%m%d')}",
            text=text,
            metadata={
                "chunk_type": "injury_report",
                "count": len(injured),
                "date": datetime.utcnow().isoformat(),
            },
            chunk_type="injury_report",
        )

    def build_all_chunks(
        self,
        players: list[PlayerRecord],
        standings: list[dict[str, Any]] | None = None,
    ) -> list[ChunkRecord]:
        """Build all chunks from validated data."""
        self._chunk_ids.clear()
        self._chunks.clear()

        # Player profile chunks
        player_count = 0
        for p in players:
            try:
                chunk = self.build_player_chunk(p)
                if self._add_chunk(chunk):
                    player_count += 1
            except Exception as e:
                logger.warning(f"Failed to chunk player {p.full_name}: {e}")

        # Standing chunks
        standing_count = 0
        if standings:
            for s in standings:
                try:
                    chunk = self.build_standing_chunk(s)
                    if self._add_chunk(chunk):
                        standing_count += 1
                except Exception as e:
                    logger.warning(f"Failed to chunk standing: {e}")

        # Tactical chunks
        tactical_chunks = self.build_tactical_chunks()
        tactical_count = 0
        for tc in tactical_chunks:
            if self._add_chunk(tc):
                tactical_count += 1

        # Injury report
        injury_count = 0
        try:
            injury_chunk = self.build_injury_report_chunk(players)
            injury_count = 1 if self._add_chunk(injury_chunk) else 0
        except Exception as e:
            logger.warning(f"Failed to build injury report: {e}")

        total = len(self._chunks)
        logger.info(
            f"Chunking complete: {total} total "
            f"({player_count} players, {standing_count} standings, "
            f"{tactical_count} tactical, {injury_count} injury)"
        )

        return self._chunks

    def generate_manifest(self) -> ChunkManifest:
        """Generate versioned manifest for the current chunking run."""
        by_type: dict[str, int] = {}
        for c in self._chunks:
            by_type[c.chunk_type] = by_type.get(c.chunk_type, 0) + 1

        return ChunkManifest(
            total_chunks=len(self._chunks),
            by_type=by_type,
            data_sources={
                "pipeline_run": datetime.utcnow().isoformat(),
            },
        )

    @staticmethod
    def _generate_player_insight(player: PlayerRecord) -> str:
        """Auto-generate contextual insight for a player."""
        insights: list[str] = []

        # Value assessment
        if player.ppm > 0:
            if player.ppm >= 15:
                insights.append(f"Elite value at {player.ppm} PPM.")
            elif player.ppm >= 10:
                insights.append(f"Good value at {player.ppm} PPM.")
            elif player.ppm < 5 and player.cost > 8:
                insights.append(f"Poor value at {player.ppm} PPM for £{player.cost}m price tag.")

        # xG analysis
        if player.xg > 0:
            if player.xg_diff > 2:
                insights.append(f"Significantly overperforming xG ({player.xg_diff:+.1f}).")
            elif player.xg_diff < -2:
                insights.append(f"Underperforming xG ({player.xg_diff:+.1f}) — due a correction?")

        # Ownership
        if player.is_template:
            insights.append(f"Template pick at {player.ownership_pct}% ownership.")
        elif player.is_differential:
            insights.append(f"Differential pick at just {player.ownership_pct}% ownership.")

        # Form
        if player.form >= 8:
            insights.append("Blazing hot form.")
        elif player.form <= 2 and player.total_points > 50:
            insights.append("In a poor run of form despite decent season total.")

        # Position-specific
        if player.position == "GK" and player.clean_sheets > 10:
            insights.append("Elite clean sheet record this season.")
        elif player.position == "DEF" and player.goals > 3:
            insights.append("Goal threat from defence — set piece specialist?")
        elif player.position == "FWD" and player.assists > 5:
            insights.append("Creative forward with strong assist numbers.")

        return " ".join(insights) if insights else ""
