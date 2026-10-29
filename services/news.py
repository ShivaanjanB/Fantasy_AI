"""
FantasyCoach AI — Guardian News Client
Fetches football/transfer news with caching.
"""

import json
import logging
import time
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

import httpx

from config import GUARDIAN_API_KEY, GUARDIAN_SEARCH_URL, NEWS_DATA_DIR, CACHE_TTL_NEWS

logger = logging.getLogger("fantasycoach.news")


class GuardianNewsClient:
    """Guardian Content API client with in-memory + disk caching."""

    def __init__(self) -> None:
        self._cache: list[dict[str, Any]] = []
        self._cache_time: float = 0
        self._cache_file = NEWS_DATA_DIR / "guardian_news_latest.json"

    async def fetch_articles(
        self,
        query: str = "premier league transfer",
        section: str = "football",
        page_size: int = 20,
    ) -> list[dict[str, Any]]:
        """Fetch articles from Guardian API with TTL caching."""
        # Check in-memory cache
        if self._cache and (time.time() - self._cache_time) < CACHE_TTL_NEWS:
            logger.debug("Serving news from memory cache")
            return self._cache

        # Try live API
        if GUARDIAN_API_KEY:
            try:
                articles = await self._fetch_live(query, section, page_size)
                if articles:
                    self._cache = articles
                    self._cache_time = time.time()
                    self._save_to_disk(articles)
                    return articles
            except Exception as e:
                logger.warning(f"Guardian API failed: {e}")

        # Fallback to disk cache
        disk_articles = self._load_from_disk()
        if disk_articles:
            self._cache = disk_articles
            self._cache_time = time.time()
            return disk_articles

        logger.warning("No news available (API failed, no cache)")
        return []

    async def _fetch_live(
        self,
        query: str,
        section: str,
        page_size: int,
    ) -> list[dict[str, Any]]:
        """Fetch from Guardian Content API."""
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(
                GUARDIAN_SEARCH_URL,
                params={
                    "api-key": GUARDIAN_API_KEY,
                    "q": query,
                    "section": section,
                    "page-size": page_size,
                    "show-fields": "thumbnail,bodyText,trailText",
                    "order-by": "newest",
                },
            )
            resp.raise_for_status()
            data = resp.json()

        results = data.get("response", {}).get("results", [])
        articles = []
        for r in results:
            fields = r.get("fields", {})
            articles.append({
                "title": r.get("webTitle", ""),
                "url": r.get("webUrl", ""),
                "section": r.get("sectionName", "Football"),
                "published": r.get("webPublicationDate", ""),
                "thumbnail": fields.get("thumbnail", ""),
                "body_preview": (fields.get("trailText", "") or "")[:300],
            })

        logger.info(f"Fetched {len(articles)} articles from Guardian")
        return articles

    def _save_to_disk(self, articles: list[dict[str, Any]]) -> None:
        """Cache articles to disk."""
        try:
            with open(self._cache_file, "w", encoding="utf-8") as f:
                json.dump(
                    {"articles": articles, "cached_at": datetime.utcnow().isoformat()},
                    f, indent=2,
                )
        except Exception as e:
            logger.warning(f"Failed to save news cache: {e}")

    def _load_from_disk(self) -> list[dict[str, Any]]:
        """Load articles from disk cache."""
        if self._cache_file.exists():
            try:
                with open(self._cache_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    logger.info("Loaded news from disk cache")
                    return data.get("articles", [])
            except Exception as e:
                logger.warning(f"Failed to load news cache: {e}")
        return []
