"""
FantasyCoach AI â€” FastAPI Backend Server
12 endpoints: health, players, teams, standings, injuries, news, chat/stream,
              fixtures, refresh, eval/run, eval/compare, eval/single.
"""

import asyncio
import json
import logging
import time
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from config import (
    CORS_ORIGINS, SM_DATA_DIR, FPL_DATA_DIR,
    CACHE_DIR, setup_logging,
)
from models.schemas import (
    ChatRequest, HealthResponse, PlayerRecord,
)
from pydantic import BaseModel

logger = setup_logging()

# â”€â”€â”€ FastAPI App â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app = FastAPI(
    title="FantasyCoach AI",
    version="3.0.0",
    description="RAG-powered Fantasy Premier League assistant",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# â”€â”€â”€ Global State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
_players: list[dict[str, Any]] = []
_standings: list[dict[str, Any]] = []
_injuries: list[dict[str, Any]] = []
_teams: list[dict[str, Any]] = []
_retriever = None
_orchestrator = None
_news_client = None
_last_refresh: Optional[str] = None


# â”€â”€â”€ Data Loading â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
def _load_cached_data() -> None:
    """Load cached data from disk on startup."""
    global _players, _standings, _injuries, _teams, _last_refresh

    # Player records â€” prefer player_records_latest.json (Sportmonks-matched)
    records_path = CACHE_DIR / "player_records_latest.json"
    if not records_path.exists():
        records_path = CACHE_DIR / "player_records.json"
    if records_path.exists():
        try:
            with open(records_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            _players = data if isinstance(data, list) else data.get("data", [])
            logger.info(f"Loaded {len(_players)} cached player records")
        except Exception as e:
            logger.warning(f"Failed to load player cache: {e}")

    # Standings
    standings_path = SM_DATA_DIR / "standings.json"
    if standings_path.exists():
        try:
            with open(standings_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            raw = data.get("data", data) if isinstance(data, dict) else data
            _standings = _parse_standings(raw)
            logger.info(f"Loaded {len(_standings)} cached standings")
        except Exception as e:
            logger.warning(f"Failed to load standings cache: {e}")

    # Teams
    teams_path = SM_DATA_DIR / "teams.json"
    if teams_path.exists():
        try:
            with open(teams_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            raw = data.get("data", data) if isinstance(data, dict) else data
            _teams = [
                {"id": t.get("id", 0), "name": t.get("name", ""), "badge_url": t.get("image_path", "")}
                for t in raw if isinstance(t, dict)
            ]
            logger.info(f"Loaded {len(_teams)} cached teams")
        except Exception as e:
            logger.warning(f"Failed to load teams cache: {e}")

    # Injuries from player data
    _injuries = [
        {
            "player_name": p.get("full_name", p.get("display_name", "")),
            "sm_id": p.get("sm_id", 0),
            "team_name": p.get("team_name", ""),
            "position": p.get("position", ""),
            "status": {"i": "Injured", "d": "Doubtful", "s": "Suspended", "u": "Unavailable"}.get(p.get("injury_status", "a"), p.get("injury_status", "Unknown")),
            "reason": p.get("injury_news"),
        }
        for p in _players
        if p.get("injury_status", "a") not in ("a", "available", "", None)
    ]
    logger.info(f"Extracted {len(_injuries)} injury records")


def _parse_standings(raw_data: Any) -> list[dict[str, Any]]:
    """Parse Sportmonks standings into clean format, handling details array."""
    def extract_detail(details, developer_name):
        for d in (details or []):
            if isinstance(d, dict) and d.get("type", {}).get("developer_name") == developer_name:
                return d.get("value", 0)
        return 0

    standings = []
    if isinstance(raw_data, list):
        for item in raw_data:
            if not isinstance(item, dict):
                continue
            participant = item.get("participant", {})
            details = item.get("details", [])
            # Extract stats from details array (Sportmonks v3 format)
            if details:
                played = extract_detail(details, "OVERALL_MATCHES")
                won    = extract_detail(details, "OVERALL_WINS")
                drawn  = extract_detail(details, "OVERALL_DRAWS")
                lost   = extract_detail(details, "OVERALL_LOST")
                gf     = extract_detail(details, "OVERALL_SCORED")
                ga     = extract_detail(details, "OVERALL_CONCEDED")
                gd     = extract_detail(details, "OVERALL_GOAL_DIFFERENCE")
            else:
                played = item.get("games_played", item.get("played", 0))
                won    = item.get("won", 0)
                drawn  = item.get("draw", item.get("drawn", 0))
                lost   = item.get("lost", 0)
                gf     = item.get("goals_scored", item.get("goals_for", 0))
                ga     = item.get("goals_against", 0)
                gd     = item.get("goal_difference", 0)
            standings.append({
                "position":        item.get("position", 0),
                "team_name":       participant.get("name", item.get("team_name", "")),
                "team_id":         participant.get("id", item.get("team_id", 0)),
                "badge_url":       participant.get("image_path", ""),
                "played":          played,
                "won":             won,
                "drawn":           drawn,
                "lost":            lost,
                "goals_for":       gf,
                "goals_against":   ga,
                "goal_difference": gd,
                "points":          item.get("points", 0),
                "form":            item.get("recent_form", ""),
            })
    return sorted(standings, key=lambda x: x.get("position", 99))


def _init_rag() -> None:
    """Initialize RAG pipeline (retriever + orchestrator)."""
    global _retriever, _orchestrator

    try:
        from rag.embedder import Embedder
        from rag.retriever import RetrieverPipeline
        from rag.llm import LLMOrchestrator

        embedder = Embedder()
        chunk_count = embedder.get_chunk_count()

        if chunk_count > 0:
            embedder.load_bm25_index()
            _retriever = RetrieverPipeline(embedder)
            _orchestrator = LLMOrchestrator(_retriever)
            logger.info(f"RAG pipeline initialized: {chunk_count} chunks, BM25={embedder.bm25_loaded}")
        else:
            logger.warning("ChromaDB empty â€” RAG not available. Run scripts/refresh.py first.")
    except Exception as e:
        logger.error(f"Failed to initialize RAG: {e}")


# â”€â”€â”€ Startup â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
@app.on_event("startup")
async def startup():
    global _news_client
    logger.info("Starting FantasyCoach AI backend...")

    # Load cached data
    _load_cached_data()

    # Initialize news client
    from services.news import GuardianNewsClient
    _news_client = GuardianNewsClient()

    # Initialize RAG pipeline
    _init_rag()

    logger.info(
        f"Backend ready: {len(_players)} players, {len(_standings)} standings, "
        f"RAG={'ready' if _orchestrator else 'not ready'}"
    )


# â”€â”€â”€ Endpoints â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

@app.get("/api/health")
async def health() -> dict[str, Any]:
    """System health check."""
    rag_health = _retriever.health_check() if _retriever else {}
    return {
        "status": "ok",
        "chunk_count": rag_health.get("chunk_count", 0),
        "bm25_loaded": rag_health.get("bm25_loaded", False),
        "retriever_ready": _retriever is not None,
        "llm_ready": _orchestrator is not None,
        "player_count": len(_players),
        "last_refresh": _last_refresh,
        "timestamp": datetime.utcnow().isoformat(),
    }


@app.get("/api/players")
async def get_players(
    position: Optional[str] = Query(None),
    sort_by: str = Query("total_points"),
    search: Optional[str] = Query(None),
    limit: int = Query(300, ge=1, le=1000),
) -> list[dict[str, Any]]:
    """Paginated player list with filtering and sorting."""
    filtered = _players.copy()

    # Position filter
    if position:
        filtered = [p for p in filtered if p.get("position") == position.upper()]

    # Search filter
    if search:
        search_lower = search.lower()
        filtered = [
            p for p in filtered
            if search_lower in p.get("full_name", "").lower()
            or search_lower in p.get("display_name", "").lower()
            or search_lower in p.get("team_name", "").lower()
        ]

    # Sort
    reverse = True
    if sort_by in ("cost", "total_points", "goals", "assists", "form", "xg", "ownership_pct"):
        filtered.sort(key=lambda p: float(p.get(sort_by, 0) or 0), reverse=reverse)
    elif sort_by == "name":
        filtered.sort(key=lambda p: p.get("display_name", ""))

    return filtered[:limit]


@app.get("/api/players/{sm_id}")
async def get_player(sm_id: int) -> dict[str, Any]:
    """Single player detail by Sportmonks ID."""
    for p in _players:
        if p.get("sm_id") == sm_id:
            return p
    raise HTTPException(status_code=404, detail=f"Player sm_id={sm_id} not found")


@app.get("/api/teams")
async def get_teams() -> list[dict[str, Any]]:
    """All PL teams."""
    return _teams


@app.get("/api/standings")
async def get_standings() -> dict[str, Any]:
    """League standings."""
    return {"standings": _standings, "pl_standings": _standings}


@app.get("/api/injuries")
async def get_injuries() -> dict[str, Any]:
    """Current injury/availability list."""
    return {"injuries": _injuries}


@app.get("/api/news")
async def get_news() -> dict[str, Any]:
    """Guardian football articles."""
    if _news_client:
        articles = await _news_client.fetch_articles()
        return {"articles": articles}
    return {"articles": []}


@app.get("/api/fixtures")
async def get_fixtures() -> dict[str, Any]:
    """PL fixtures from Sportmonks data, falling back to FPL bootstrap."""
    try:
        # Try Sportmonks fixtures first
        sm_path = SM_DATA_DIR / "fixtures.json"
        if sm_path.exists():
            with open(sm_path, "r", encoding="utf-8") as f:
                sm = json.load(f)
            raw = sm.get("data", [])
            fixtures_list = []
            for fx in raw:
                parts = fx.get("participants", [])
                home = next((p["name"] for p in parts if p.get("meta", {}).get("location") == "home"), "?")
                away = next((p["name"] for p in parts if p.get("meta", {}).get("location") == "away"), "?")
                finished = bool(fx.get("result_info"))
                fixtures_list.append({
                    "id": fx.get("id"),
                    "gw": fx.get("round_id", 0),
                    "home": home,
                    "away": away,
                    "kickoff": fx.get("starting_at", ""),
                    "finished": finished,
                    "result": fx.get("result_info", ""),
                })
            fixtures_list.sort(key=lambda x: (x.get("kickoff", ""), x.get("gw", 0)))
            return {"fixtures": fixtures_list}

        # Fallback: try FPL bootstrap
        fpl_path = CACHE_DIR / "fpl_bootstrap_latest.json"
        if fpl_path.exists():
            with open(fpl_path, "r", encoding="utf-8") as f:
                fpl = json.load(f)
            teams = {t["id"]: t["name"] for t in fpl.get("teams", [])}
            fixtures = fpl.get("fixtures", fpl.get("next_event_fixtures", []))
            upcoming = [
                {
                    "id": fx.get("id"),
                    "gw": fx.get("event"),
                    "home": teams.get(fx.get("team_h"), "?"),
                    "away": teams.get(fx.get("team_a"), "?"),
                    "kickoff": fx.get("kickoff_time", ""),
                    "finished": fx.get("finished", False),
                }
                for fx in fixtures
                if fx.get("event")
            ]
            upcoming.sort(key=lambda x: (x.get("gw", 0), x.get("kickoff", "")))
            return {"fixtures": upcoming[:60]}

        return {"fixtures": []}
    except Exception as e:
        logger.error(f"Fixtures error: {e}")
        return {"fixtures": []}


@app.post("/api/chat/stream")
async def chat_stream(request: ChatRequest):
    """RAG chat with SSE streaming."""
    if not _orchestrator:
        async def error_stream():
            yield "data: " + json.dumps({
                "type": "error",
                "content": "RAG pipeline not initialized. Run scripts/refresh.py to populate the knowledge base."
            }) + "\n\n"
            yield "data: " + json.dumps({"type": "done", "content": None}) + "\n\n"

        return StreamingResponse(
            error_stream(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
                "Access-Control-Allow-Origin": "*",
            },
        )

    async def event_stream():
        try:
            async for event in _orchestrator.generate_stream(
                query=request.query,
                top_n=request.top_n,
                team_context=request.team_context,
            ):
                yield f"data: {json.dumps(event)}\n\n"
        except Exception as e:
            logger.error(f"Chat stream error: {e}")
            yield f"data: {json.dumps({'type': 'error', 'content': str(e)})}\n\n"
            yield f"data: {json.dumps({'type': 'done', 'content': None})}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
            "Access-Control-Allow-Origin": "*",
        },
    )


@app.post("/api/refresh")
async def trigger_refresh() -> dict[str, Any]:
    """Trigger a full data refresh (runs in background)."""
    try:
        from scripts.refresh import run_full_refresh
        asyncio.create_task(_background_refresh())
        return {"status": "refresh_started", "timestamp": datetime.utcnow().isoformat()}
    except Exception as e:
        return {"status": "error", "message": str(e)}


async def _background_refresh():
    """Run refresh in background and reload data."""
    global _last_refresh
    try:
        from scripts.refresh import run_full_refresh
        await run_full_refresh()
        _load_cached_data()
        _init_rag()
        _last_refresh = datetime.utcnow().isoformat()
        logger.info("Background refresh complete")
    except Exception as e:
        logger.error(f"Background refresh failed: {e}")


# â”€â”€â”€ Eval Endpoints â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

class EvalCompareRequest(BaseModel):
    query: str


class EvalSingleRequest(BaseModel):
    query: str
    top_n: int = 5


@app.post("/api/eval/run")
async def run_eval() -> dict[str, Any]:
    """Run the full 30-query evaluation benchmark (retrieval only, no LLM)."""
    if not _retriever:
        raise HTTPException(status_code=503, detail="Retriever not initialized")

    try:
        from rag.evaluator import EvalBenchmark
        benchmark = EvalBenchmark(_retriever)
        results = benchmark.run_full_benchmark()
        return results
    except Exception as e:
        logger.error(f"Eval benchmark error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/eval/single")
async def eval_single(request: EvalSingleRequest) -> dict[str, Any]:
    """Run a single query through retrieval and return full diagnostics."""
    if not _retriever:
        raise HTTPException(status_code=503, detail="Retriever not initialized")

    try:
        from rag.evaluator import EvalBenchmark
        benchmark = EvalBenchmark(_retriever)
        return benchmark.run_single_query(request.query, top_n=request.top_n)
    except Exception as e:
        logger.error(f"Eval single query error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/eval/compare")
async def eval_compare(request: EvalCompareRequest) -> dict[str, Any]:
    """Run same query through RAG and baseline LLM, return both responses."""
    if not _orchestrator:
        raise HTTPException(status_code=503, detail="LLM orchestrator not initialized")

    try:
        # RAG response (with retrieval context)
        rag_result = _orchestrator.generate_sync(request.query, top_n=5)

        # Baseline LLM response (no retrieval context)
        baseline_result = _orchestrator.generate_baseline(request.query)

        return {
            "query": request.query,
            "rag": {
                "response": rag_result["text"],
                "sources": rag_result["sources"],
                "verification": rag_result["verification"],
                "chunks_used": rag_result["chunks_used"],
                "usage": rag_result["usage"],
            },
            "baseline": {
                "response": baseline_result["text"],
                "sources": [],
                "verification": baseline_result["verification"],
                "chunks_used": 0,
                "usage": baseline_result["usage"],
            },
        }
    except Exception as e:
        logger.error(f"Eval compare error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# â”€â”€â”€ Entry Point â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
if __name__ == "__main__":
    import uvicorn
    logger.info("Starting FantasyCoach AI on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")




