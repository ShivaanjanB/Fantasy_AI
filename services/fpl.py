"""
FantasyCoach AI — FPL API Client
Async client for Fantasy Premier League public API with polite rate limiting.
"""

import asyncio
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

import httpx

from config import (
    FPL_BASE_URL, FPL_BOOTSTRAP_URL, FPL_ELEMENT_URL,
    FPL_FIXTURES_URL, FPL_LIVE_URL, FPL_POLITE_DELAY,
    FPL_DATA_DIR, FPL_POSITION_MAP,
)

logger = logging.getLogger("fantasycoach.fpl")


class FPLClient:
    """Async FPL API client with polite rate limiting and retry."""

    def __init__(self) -> None:
        self.client: Optional[httpx.AsyncClient] = None
        self._last_request: float = 0

    async def _ensure_client(self) -> httpx.AsyncClient:
        if self.client is None or self.client.is_closed:
            self.client = httpx.AsyncClient(
                timeout=httpx.Timeout(30.0, connect=10.0),
                headers={
                    "User-Agent": "FantasyCoachAI/3.0 (academic project)",
                    "Accept": "application/json",
                },
            )
        return self.client

    async def close(self) -> None:
        if self.client and not self.client.is_closed:
            await self.client.aclose()

    async def _get(self, url: str, retries: int = 0) -> dict[str, Any]:
        """GET with polite delay and 503 retry."""
        # Polite delay between requests
        import time
        elapsed = time.time() - self._last_request
        if elapsed < FPL_POLITE_DELAY:
            await asyncio.sleep(FPL_POLITE_DELAY - elapsed)

        client = await self._ensure_client()
        try:
            resp = await client.get(url)
            self._last_request = time.time()

            if resp.status_code == 503 and retries < 3:
                delay = 5.0 * (retries + 1)
                logger.warning(f"FPL 503 on {url}. Retry in {delay}s")
                await asyncio.sleep(delay)
                return await self._get(url, retries + 1)

            resp.raise_for_status()
            return resp.json()

        except httpx.TimeoutException:
            if retries < 3:
                logger.warning(f"FPL timeout on {url}. Retrying...")
                await asyncio.sleep(3.0)
                return await self._get(url, retries + 1)
            raise
        except Exception as e:
            logger.error(f"FPL API error on {url}: {e}")
            raise

    # ─── Endpoints ──────────────────────────────────────────────────────

    async def get_bootstrap(self) -> dict[str, Any]:
        """Fetch bootstrap-static (all players, teams, events)."""
        return await self._get(FPL_BOOTSTRAP_URL)

    async def get_player_history(self, element_id: int) -> dict[str, Any]:
        """Fetch detailed GW-by-GW history for a player."""
        url = FPL_ELEMENT_URL.format(id=element_id)
        return await self._get(url)

    async def get_fixtures(self) -> list[dict[str, Any]]:
        """Fetch all fixtures."""
        data = await self._get(FPL_FIXTURES_URL)
        return data if isinstance(data, list) else []

    async def get_gameweek_live(self, gw: int) -> dict[str, Any]:
        """Fetch live GW data."""
        url = FPL_LIVE_URL.format(gw=gw)
        return await self._get(url)

    # ─── Static Helpers ─────────────────────────────────────────────────

    @staticmethod
    def extract_player_data(element: dict[str, Any], teams: list[dict[str, Any]]) -> dict[str, Any]:
        """Transform FPL bootstrap element to normalized data dict."""
        team_obj = next((t for t in teams if t["id"] == element.get("team")), {})
        team_name = team_obj.get("name", "Unknown")
        team_code = team_obj.get("code", 0)

        # FPL photo URL
        code = element.get("code", 0)
        photo_url = (
            f"https://resources.premierleague.com/premierleague/photos/players/110x140/p{code}.png"
            if code else ""
        )

        return {
            "fpl_id": element.get("id"),
            "fpl_code": code,
            "full_name": f"{element.get('first_name', '')} {element.get('second_name', '')}".strip(),
            "display_name": element.get("web_name", ""),
            "position": FPL_POSITION_MAP.get(element.get("element_type", 3), "MID"),
            "team_name": team_name,
            "team_code": team_code,
            "photo_url": photo_url,
            "total_points": int(element.get("total_points", 0)),
            "goals": int(element.get("goals_scored", 0)),
            "assists": int(element.get("assists", 0)),
            "clean_sheets": int(element.get("clean_sheets", 0)),
            "minutes": int(element.get("minutes", 0)),
            "cost": float(element.get("now_cost", 0)),  # Raw integer, e.g., 142
            "form": float(element.get("form", 0)),
            "ownership_pct": float(element.get("selected_by_percent", 0)),
            "ict_index": float(element.get("ict_index", 0)),
            "xg": float(element.get("expected_goals", 0)),
            "xa": float(element.get("expected_assists", 0)),
            "xgi": float(element.get("expected_goal_involvements", 0)),
            "injury_status": element.get("status", "a"),
            "injury_news": element.get("news", None),
            "yellow_cards": int(element.get("yellow_cards", 0)),
            "red_cards": int(element.get("red_cards", 0)),
        }

    # ─── Fetch & Cache ──────────────────────────────────────────────────

    async def fetch_and_cache_bootstrap(self) -> dict[str, Any]:
        """Fetch bootstrap data and cache to disk."""
        try:
            data = await self.get_bootstrap()
            path = FPL_DATA_DIR / "bootstrap.json"
            with open(path, "w", encoding="utf-8") as f:
                json.dump(
                    {"data": data, "cached_at": datetime.utcnow().isoformat()},
                    f, indent=2,
                )
            elements = data.get("elements", [])
            logger.info(f"Cached FPL bootstrap: {len(elements)} players")
            return data
        except Exception as e:
            logger.error(f"Failed to fetch FPL bootstrap: {e}")
            # Try loading from cache
            return _load_fpl_cache("bootstrap.json")

    async def fetch_and_cache_fixtures(self) -> list[dict[str, Any]]:
        """Fetch fixtures and cache."""
        try:
            fixtures = await self.get_fixtures()
            path = FPL_DATA_DIR / "fixtures.json"
            with open(path, "w", encoding="utf-8") as f:
                json.dump(
                    {"data": fixtures, "cached_at": datetime.utcnow().isoformat()},
                    f, indent=2,
                )
            logger.info(f"Cached {len(fixtures)} FPL fixtures")
            return fixtures
        except Exception as e:
            logger.error(f"Failed to fetch FPL fixtures: {e}")
            cached = _load_fpl_cache("fixtures.json")
            return cached if isinstance(cached, list) else []


def _load_fpl_cache(filename: str) -> Any:
    """Load FPL cached data from disk."""
    path = FPL_DATA_DIR / filename
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            cached = json.load(f)
            logger.info(f"Loaded FPL cache: {filename}")
            return cached.get("data", cached)
    logger.warning(f"No FPL cache found: {filename}")
    return {}
