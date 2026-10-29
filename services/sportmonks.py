"""
FantasyCoach AI â€” Sportmonks v3 API Client
Async client with rate limiting, pagination, retry, and disk caching.
"""

import asyncio
import json
import logging
import time
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

import httpx

from config import (
    SPORTMONKS_TOKEN, SM_BASE_URL, SM_SEASON_ID, SM_LEAGUE_ID,
    SM_CONCURRENCY, SM_RETRY_MAX, SM_RETRY_BASE_DELAY, SM_PER_PAGE,
    SM_DATA_DIR, SM_POSITION_MAP, COUNTRY_TO_ISO,
)

logger = logging.getLogger("fantasycoach.sportmonks")


class SportmonksClient:
    """Async Sportmonks v3 Football API client."""

    def __init__(self) -> None:
        if not SPORTMONKS_TOKEN:
            raise EnvironmentError("SPORTMONKS_TOKEN not set â€” check .env")
        self.token = SPORTMONKS_TOKEN
        self.client: Optional[httpx.AsyncClient] = None
        self._semaphore = asyncio.Semaphore(SM_CONCURRENCY)
        self._request_count = 0

    async def _ensure_client(self) -> httpx.AsyncClient:
        if self.client is None or self.client.is_closed:
            self.client = httpx.AsyncClient(
                timeout=httpx.Timeout(30.0, connect=10.0),
                headers={"Accept": "application/json"},
            )
        return self.client

    async def close(self) -> None:
        if self.client and not self.client.is_closed:
            await self.client.aclose()

    async def _get(
        self,
        endpoint: str,
        params: Optional[dict[str, Any]] = None,
        retries: int = 0,
    ) -> dict[str, Any]:
        """Core GET with rate limiting, retry, and backoff."""
        async with self._semaphore:
            client = await self._ensure_client()
            url = f"{SM_BASE_URL}/{endpoint}"
            params = params or {}
            params["api_token"] = self.token

            try:
                resp = await client.get(url, params=params)
                self._request_count += 1

                if resp.status_code == 429:
                    retry_after = int(resp.headers.get("Retry-After", 5))
                    delay = min(retry_after, 60)
                    logger.warning(f"Rate limited on {endpoint}. Waiting {delay}s")
                    await asyncio.sleep(delay)
                    return await self._get(endpoint, params, retries)

                if resp.status_code >= 500 and retries < SM_RETRY_MAX:
                    delay = SM_RETRY_BASE_DELAY * (2 ** retries)
                    logger.warning(
                        f"Server error {resp.status_code} on {endpoint}. "
                        f"Retry {retries + 1}/{SM_RETRY_MAX} in {delay}s"
                    )
                    await asyncio.sleep(delay)
                    return await self._get(endpoint, params, retries + 1)

                resp.raise_for_status()
                return resp.json()

            except httpx.TimeoutException:
                if retries < SM_RETRY_MAX:
                    delay = SM_RETRY_BASE_DELAY * (2 ** retries)
                    logger.warning(f"Timeout on {endpoint}. Retry in {delay}s")
                    await asyncio.sleep(delay)
                    return await self._get(endpoint, params, retries + 1)
                raise
            except httpx.HTTPStatusError as e:
                logger.error(f"HTTP error {e.response.status_code} on {endpoint}: {e}")
                raise
            except Exception as e:
                logger.error(f"Unexpected error on {endpoint}: {e}")
                raise

    async def _get_paginated(
        self,
        endpoint: str,
        params: Optional[dict[str, Any]] = None,
        max_pages: int = 100,
    ) -> list[dict[str, Any]]:
        """Paginate through all results."""
        all_data: list[dict[str, Any]] = []
        params = params or {}
        params["per_page"] = SM_PER_PAGE
        page = 1

        while page <= max_pages:
            params["page"] = page
            data = await self._get(endpoint, params)
            items = data.get("data", [])
            if not items:
                break
            all_data.extend(items)
            pagination = data.get("pagination", {})
            has_more = pagination.get("has_more", False)
            if not has_more:
                break
            page += 1
            await asyncio.sleep(0.3)

        logger.info(f"Paginated {endpoint}: {len(all_data)} items in {page} pages")
        return all_data

    # â”€â”€â”€ Endpoints â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    async def get_all_players(self) -> list[dict[str, Any]]:
        """Fetch all players in the PL season with stats, team, position, nationality."""
        return await self._get_paginated(
            "players",
            params={
                "include": "statistics.details;team;position;nationality",
                "filters": f"playerStatisticSeasons:{SM_SEASON_ID}",
            },
        )

    async def get_standings(self) -> list[dict[str, Any]]:
        """Fetch current PL standings."""
        data = await self._get(
            f"standings/seasons/{SM_SEASON_ID}",
            params={"include": "participant;details.type"},
        )
        return data.get("data", [])

    async def get_fixtures(self) -> list[dict[str, Any]]:
        """Fetch upcoming PL fixtures using schedule endpoint."""
        from datetime import datetime, timezone
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        data = await self._get(
            f"fixtures",
            params={
                "filters": f"fixtureSeasons:{SM_SEASON_ID}",
                "include": "participants",
                "per_page": 100,
                "order": "starting_at",
            },
        )
        all_fx = data.get("data", [])
        # Filter to only upcoming/recent fixtures
        upcoming = [fx for fx in all_fx if fx.get("starting_at", "") >= today]
        return upcoming if upcoming else all_fx[-20:]

    async def get_teams(self) -> list[dict[str, Any]]:
        """Fetch all PL teams for this season."""
        data = await self._get(
            f"teams/seasons/{SM_SEASON_ID}",
            params={"include": "country"},
        )
        return data.get("data", [])

    async def get_injuries(self) -> list[dict[str, Any]]:
        """Fetch sidelined (injured/suspended) players."""
        return await self._get_paginated(
            "sidelined/seasons",
            params={
                "filters": f"sidelinedSeasons:{SM_SEASON_ID}",
                "include": "player;team",
            },
        )

    async def get_livescores(self) -> list[dict[str, Any]]:
        """Fetch live match scores."""
        data = await self._get(
            "livescores",
            params={"include": "participants;scores"},
        )
        return data.get("data", [])

    async def get_h2h(self, team1_id: int, team2_id: int) -> list[dict[str, Any]]:
        """Fetch head-to-head records."""
        data = await self._get(
            f"fixtures/head-to-head/{team1_id}/{team2_id}",
            params={"per_page": 10},
        )
        return data.get("data", [])

    # â”€â”€â”€ Static Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    @staticmethod
    def extract_position(player_data: dict[str, Any]) -> str:
        """Extract normalized position from Sportmonks player data."""
        # Try nested position object
        pos_obj = player_data.get("position", {})
        if isinstance(pos_obj, dict):
            pos_name = pos_obj.get("name", "")
            if pos_name in SM_POSITION_MAP:
                return SM_POSITION_MAP[pos_name]
        # Try position_id
        pos_id = player_data.get("position_id")
        if pos_id in SM_POSITION_MAP:
            return SM_POSITION_MAP[pos_id]
        # Try detailed_position_id
        detail_pos = player_data.get("detailed_position_id")
        if detail_pos in SM_POSITION_MAP:
            return SM_POSITION_MAP[detail_pos]
        return "MID"  # safe default

    @staticmethod
    def extract_image_urls(player_data: dict[str, Any]) -> dict[str, str]:
        """Extract photo, badge, and flag URLs from Sportmonks data."""
        result = {"photo_url": "", "badge_url": "", "flag_url": ""}

        # Player photo
        result["photo_url"] = player_data.get("image_path", "")

        # Team badge
        team = player_data.get("team", {})
        if isinstance(team, dict):
            result["badge_url"] = team.get("image_path", "")

        # Nationality flag
        nat = player_data.get("nationality", {})
        if isinstance(nat, dict):
            flag_path = nat.get("image_path", "")
            if flag_path:
                result["flag_url"] = flag_path
            else:
                # Fallback to flagcdn
                nat_name = nat.get("name", "")
                iso = COUNTRY_TO_ISO.get(nat_name, "")
                if iso:
                    result["flag_url"] = f"https://flagcdn.com/w40/{iso}.png"

        return result

    @staticmethod
    def extract_stats(player_data: dict[str, Any]) -> dict[str, Any]:
        """Extract detailed stats from Sportmonks statistics include."""
        stats: dict[str, Any] = {
            "goals": 0, "assists": 0, "yellow_cards": 0, "red_cards": 0,
            "minutes": 0, "appearances": 0, "clean_sheets": 0,
            "shots_on_target": 0, "aerial_duels_won": 0, "tackles": 0,
            "saves": 0, "average_rating": 0.0, "xg": 0.0, "xa": 0.0,
        }

        statistics = player_data.get("statistics", [])
        if not isinstance(statistics, list):
            return stats

        # Sportmonks type_id â†’ stat field mapping
        type_map = {
            52: "goals", 79: "assists", 84: "yellow_cards",
            83: "red_cards", 119: "minutes", 43: "appearances",
            59: "clean_sheets", 64: "shots_on_target",
            80: "aerial_duels_won", 78: "tackles", 57: "saves",
            118: "average_rating",
        }

        for stat_group in statistics:
            details = stat_group.get("details", [])
            if not isinstance(details, list):
                continue
            for detail in details:
                type_id = detail.get("type_id")
                value = detail.get("value", {})
                if isinstance(value, dict):
                    val = value.get("total", value.get("home", 0))
                else:
                    val = value

                if type_id in type_map:
                    field = type_map[type_id]
                    try:
                        stats[field] = float(val) if "." in str(val) else int(val or 0)
                    except (ValueError, TypeError):
                        pass

        return stats

    # â”€â”€â”€ Fetch & Cache â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    async def fetch_and_cache_all(self) -> dict[str, Any]:
        """Fetch all data and cache to disk. Returns summary."""
        summary = {"players": 0, "standings": 0, "teams": 0, "injuries": 0, "fixtures": 0}

        try:
            players = await self.get_all_players()
            summary["players"] = len(players)
            _save_json(SM_DATA_DIR / "players.json", players)
            logger.info(f"Cached {len(players)} players from Sportmonks")
        except Exception as e:
            logger.error(f"Failed to fetch SM players: {e}")

        try:
            standings = await self.get_standings()
            summary["standings"] = len(standings)
            _save_json(SM_DATA_DIR / "standings.json", standings)
        except Exception as e:
            logger.error(f"Failed to fetch SM standings: {e}")

        try:
            teams = await self.get_teams()
            summary["teams"] = len(teams)
            _save_json(SM_DATA_DIR / "teams.json", teams)
        except Exception as e:
            logger.error(f"Failed to fetch SM teams: {e}")

        try:
            injuries = await self.get_injuries()
            summary["injuries"] = len(injuries)
            _save_json(SM_DATA_DIR / "injuries.json", injuries)
        except Exception as e:
            logger.error(f"Failed to fetch SM injuries: {e}")

        try:
            fixtures = await self.get_fixtures()
            summary["fixtures"] = len(fixtures)
            _save_json(SM_DATA_DIR / "fixtures.json", fixtures)
        except Exception as e:
            logger.error(f"Failed to fetch SM fixtures: {e}")

        return summary


def _save_json(path: Path, data: Any) -> None:
    """Save data to JSON file with timestamp."""
    with open(path, "w", encoding="utf-8") as f:
        json.dump({"data": data, "cached_at": datetime.utcnow().isoformat()}, f, indent=2)


def _load_json(path: Path) -> Any:
    """Load cached JSON data."""
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            cached = json.load(f)
            return cached.get("data", cached)
    return None


