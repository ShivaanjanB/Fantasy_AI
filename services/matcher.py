"""
FantasyCoach AI â€” Player Identity Resolution
Fuzzy matching between Sportmonks and FPL player records.
"""

import logging
from difflib import SequenceMatcher
from typing import Any, Optional

from config import SM_POSITION_MAP, FPL_POSITION_MAP, COUNTRY_TO_ISO
from models.schemas import PlayerRecord
from services.sportmonks import SportmonksClient
from services.fpl import FPLClient

logger = logging.getLogger("fantasycoach.matcher")

# Matching thresholds
NAME_WEIGHT = 0.70
TEAM_WEIGHT = 0.30
MATCH_THRESHOLD = 0.65
EXACT_LASTNAME_BONUS = 0.90

# Team name normalization
TEAM_ALIASES = {
    "Manchester United": ["Man Utd", "Man United", "MUFC"],
    "Manchester City": ["Man City", "MCFC"],
    "Tottenham Hotspur": ["Tottenham", "Spurs", "THFC"],
    "Newcastle United": ["Newcastle", "NUFC"],
    "West Ham United": ["West Ham", "WHU"],
    "Wolverhampton Wanderers": ["Wolves", "Wolverhampton"],
    "Brighton and Hove Albion": ["Brighton", "Brighton & Hove Albion", "BHA"],
    "Nottingham Forest": ["Nott'm Forest", "Forest", "NFFC"],
    "Leicester City": ["Leicester", "LCFC"],
    "AFC Bournemouth": ["Bournemouth"],
    "Crystal Palace": ["Palace"],
    "Ipswich Town": ["Ipswich"],
}


def _normalize_team(name: str) -> str:
    """Normalize team name for matching."""
    name_lower = name.lower().strip()
    for canonical, aliases in TEAM_ALIASES.items():
        if name_lower == canonical.lower():
            return canonical.lower()
        for alias in aliases:
            if name_lower == alias.lower():
                return canonical.lower()
    return name_lower


def _name_similarity(name1: str, name2: str) -> float:
    """Compute name similarity with last-name exact match bonus."""
    n1 = name1.lower().strip()
    n2 = name2.lower().strip()

    # Exact match
    if n1 == n2:
        return 1.0

    # Last name exact match bonus
    parts1 = n1.split()
    parts2 = n2.split()
    if parts1 and parts2 and parts1[-1] == parts2[-1]:
        return max(EXACT_LASTNAME_BONUS, SequenceMatcher(None, n1, n2).ratio())

    return SequenceMatcher(None, n1, n2).ratio()


def _team_similarity(team1: str, team2: str) -> float:
    """Compare team names with alias normalization."""
    t1 = _normalize_team(team1)
    t2 = _normalize_team(team2)
    if t1 == t2:
        return 1.0
    return SequenceMatcher(None, t1, t2).ratio()


class PlayerMatcher:
    """Match Sportmonks players to FPL players using fuzzy name + team matching."""

    def __init__(self) -> None:
        self.matched: int = 0
        self.unmatched: int = 0
        self.high_confidence: int = 0
        self.medium_confidence: int = 0

    def match_all(
        self,
        sm_players: list[dict[str, Any]],
        fpl_players: list[dict[str, Any]],
    ) -> list[tuple[dict[str, Any], Optional[dict[str, Any]], float]]:
        """Match SM players to FPL players. Returns list of (sm, fpl, score) tuples."""
        matches: list[tuple[dict[str, Any], Optional[dict[str, Any]], float]] = []
        used_fpl_ids: set[int] = set()

        for sm in sm_players:
            sm_name = sm.get("display_name", sm.get("common_name", sm.get("name", "")))
            sm_team = ""
            team_obj = sm.get("team", {})
            if isinstance(team_obj, dict):
                sm_team = team_obj.get("name", "")
            elif isinstance(team_obj, str):
                sm_team = team_obj

            best_fpl: Optional[dict[str, Any]] = None
            best_score: float = 0.0

            for fpl in fpl_players:
                if fpl.get("fpl_id") in used_fpl_ids:
                    continue

                fpl_name = fpl.get("display_name", fpl.get("full_name", ""))
                fpl_team = fpl.get("team_name", "")

                name_sim = _name_similarity(sm_name, fpl_name)
                team_sim = _team_similarity(sm_team, fpl_team)
                score = (NAME_WEIGHT * name_sim) + (TEAM_WEIGHT * team_sim)

                if score > best_score:
                    best_score = score
                    best_fpl = fpl

            if best_fpl and best_score >= MATCH_THRESHOLD:
                used_fpl_ids.add(best_fpl["fpl_id"])
                matches.append((sm, best_fpl, best_score))
                self.matched += 1
                if best_score >= 0.85:
                    self.high_confidence += 1
                else:
                    self.medium_confidence += 1
            else:
                matches.append((sm, None, best_score))
                self.unmatched += 1
                logger.debug(
                    f"Unmatched SM player: {sm_name} ({sm_team}) â€” best score: {best_score:.2f}"
                )

        logger.info(
            f"Matching complete: {self.matched} matched "
            f"({self.high_confidence} high, {self.medium_confidence} medium), "
            f"{self.unmatched} unmatched"
        )
        return matches

    @staticmethod
    def build_player_record(
        sm_data: dict[str, Any],
        fpl_data: Optional[dict[str, Any]] = None,
    ) -> PlayerRecord:
        """Merge SM + FPL data into a canonical PlayerRecord."""
        # Extract from SM
        sm_id = sm_data.get("id", 0)
        full_name = sm_data.get("display_name", sm_data.get("common_name", sm_data.get("name", "Unknown")))
        display_name = sm_data.get("common_name", full_name.split()[-1] if full_name else "")

        position = SportmonksClient.extract_position(sm_data)
        images = SportmonksClient.extract_image_urls(sm_data)
        sm_stats = SportmonksClient.extract_stats(sm_data)

        team_obj = sm_data.get("team", {})
        team_name = team_obj.get("name", "Unknown") if isinstance(team_obj, dict) else str(team_obj)
        team_id = team_obj.get("id", 0) if isinstance(team_obj, dict) else 0

        nat_obj = sm_data.get("nationality", {})
        nationality = nat_obj.get("name", "Unknown") if isinstance(nat_obj, dict) else "Unknown"

        record_data: dict[str, Any] = {
            "sm_id": sm_id,
            "full_name": full_name,
            "display_name": display_name,
            "position": position,
            "team_name": team_name,
            "team_id": team_id,
            "nationality": nationality,
            "photo_url": images["photo_url"],
            "badge_url": images["badge_url"],
            "flag_url": images["flag_url"],
            "goals": sm_stats.get("goals", 0),
            "assists": sm_stats.get("assists", 0),
            "minutes": sm_stats.get("minutes", 0),
            "appearances": sm_stats.get("appearances", 0),
            "clean_sheets": sm_stats.get("clean_sheets", 0),
            "yellow_cards": sm_stats.get("yellow_cards", 0),
            "red_cards": sm_stats.get("red_cards", 0),
            "shots_on_target": sm_stats.get("shots_on_target", 0),
            "aerial_duels_won": sm_stats.get("aerial_duels_won", 0),
            "tackles": sm_stats.get("tackles", 0),
            "saves": sm_stats.get("saves", 0),
            "average_rating": sm_stats.get("average_rating", 0.0),
        }

        # Enrich with FPL data if matched
        if fpl_data:
            record_data["fpl_id"] = fpl_data.get("fpl_id")
            record_data["total_points"] = fpl_data.get("total_points", 0)
            record_data["cost"] = fpl_data.get("cost", 0)
            record_data["form"] = fpl_data.get("form", 0.0)
            record_data["ownership_pct"] = fpl_data.get("ownership_pct", 0.0)
            record_data["ict_index"] = fpl_data.get("ict_index", 0.0)
            record_data["xg"] = fpl_data.get("xg", 0.0)
            record_data["xa"] = fpl_data.get("xa", 0.0)
            record_data["xgi"] = fpl_data.get("xgi", 0.0)
            record_data["injury_status"] = fpl_data.get("injury_status", "available")
            record_data["injury_news"] = fpl_data.get("injury_news")
            # Use FPL photo if SM photo missing
            if not record_data["photo_url"]:
                record_data["photo_url"] = fpl_data.get("photo_url", "")

        return PlayerRecord(**record_data)

    def build_all_records(
        self,
        sm_players: list[dict[str, Any]],
        fpl_players: list[dict[str, Any]],
    ) -> list[PlayerRecord]:
        """Full pipeline: match â†’ build â†’ validate â†’ return."""
        records: list[PlayerRecord] = []

        if sm_players:
            # Normal path: match SM â†” FPL
            matches = self.match_all(sm_players, fpl_players)
            for sm, fpl, score in matches:
                try:
                    record = self.build_player_record(sm, fpl)
                    records.append(record)
                except Exception as e:
                    name = sm.get("display_name", sm.get("name", "?"))
                    logger.warning(f"Failed to build record for {name}: {e}")
        elif fpl_players:
            # Fallback: build records from FPL data only
            logger.info(f"No SM players â€” building {len(fpl_players)} records from FPL only")
            for fpl in fpl_players:
                try:
                    record = self.build_fpl_only_record(fpl)
                    records.append(record)
                except Exception as e:
                    name = fpl.get("display_name", fpl.get("full_name", "?"))
                    logger.warning(f"Failed to build FPL record for {name}: {e}")

        logger.info(f"Built {len(records)} validated PlayerRecords")
        return records

    @staticmethod
    def build_fpl_only_record(fpl_data: dict[str, Any]) -> PlayerRecord:
        """Build PlayerRecord from FPL data alone (no SM match)."""
        # Generate a synthetic SM ID from FPL ID
        fpl_id = fpl_data.get("fpl_id", 0)
        sm_id = 900000 + fpl_id  # Synthetic SM ID range

        return PlayerRecord(
            sm_id=sm_id,
            fpl_id=fpl_id,
            full_name=fpl_data.get("full_name", "Unknown"),
            display_name=fpl_data.get("display_name", ""),
            position=fpl_data.get("position", "MID"),
            team_name=fpl_data.get("team_name", "Unknown"),
            team_id=fpl_data.get("team_code", 0),
            nationality="Unknown",
            photo_url=fpl_data.get("photo_url", ""),
            badge_url="https://resources.premierleague.com/premierleague/badges/100/t" + str(fpl_data.get("team_code", 0)) + ".png",
            flag_url="",
            total_points=fpl_data.get("total_points", 0),
            goals=fpl_data.get("goals", 0),
            assists=fpl_data.get("assists", 0),
            clean_sheets=fpl_data.get("clean_sheets", 0),
            minutes=fpl_data.get("minutes", 0),
            cost=fpl_data.get("cost", 0),
            form=fpl_data.get("form", 0.0),
            ownership_pct=fpl_data.get("ownership_pct", 0.0),
            ict_index=fpl_data.get("ict_index", 0.0),
            xg=fpl_data.get("xg", 0.0),
            xa=fpl_data.get("xa", 0.0),
            xgi=fpl_data.get("xgi", 0.0),
            yellow_cards=fpl_data.get("yellow_cards", 0),
            red_cards=fpl_data.get("red_cards", 0),
            injury_status=fpl_data.get("injury_status", "available"),
            injury_news=fpl_data.get("injury_news"),
        )

