"""
FantasyCoach AI — Data Refresh Pipeline
Orchestrated 7-step pipeline: fetch SM + FPL → match → validate → chunk → embed → BM25.
"""

import asyncio
import json
import logging
import sys
import time
from datetime import datetime
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from config import (
    SM_DATA_DIR, FPL_DATA_DIR, CACHE_DIR,
    SPORTMONKS_TOKEN, setup_logging,
)

logger = setup_logging()


async def run_full_refresh() -> dict[str, any]:
    """Execute the full 7-step data refresh pipeline."""
    start = time.time()
    summary = {
        "steps_completed": 0,
        "sm_players": 0,
        "fpl_players": 0,
        "matched": 0,
        "records": 0,
        "chunks": 0,
        "embedded": 0,
        "bm25_built": False,
        "errors": [],
    }

    print("\n" + "=" * 60)
    print("  FANTASYCOACH AI — DATA REFRESH PIPELINE")
    print("=" * 60)

    # ─── STEP 1: Fetch Sportmonks ───────────────────────────────────────
    print("\n[1/7] Fetching Sportmonks data...")
    sm_players = []
    sm_standings_raw = []
    try:
        from services.sportmonks import SportmonksClient
        sm_client = SportmonksClient()
        sm_result = await sm_client.fetch_and_cache_all()
        sm_players = _load_json(SM_DATA_DIR / "players.json")
        sm_standings_raw = _load_json(SM_DATA_DIR / "standings.json")
        summary["sm_players"] = len(sm_players)
        print(f"  ✓ Sportmonks: {len(sm_players)} players, {len(sm_standings_raw)} standings items")
        await sm_client.close()
    except Exception as e:
        logger.error(f"SM fetch failed: {e}")
        summary["errors"].append(f"SM: {e}")
        # Try cache fallback
        sm_players = _load_json(SM_DATA_DIR / "players.json")
        sm_standings_raw = _load_json(SM_DATA_DIR / "standings.json")
        if sm_players:
            print(f"  ⚠ Using cached SM data: {len(sm_players)} players")
        else:
            print("  ✗ No SM data available (API failed, no cache)")

    summary["steps_completed"] = 1

    # ─── STEP 2: Fetch FPL ──────────────────────────────────────────────
    print("\n[2/7] Fetching FPL data...")
    fpl_players = []
    try:
        from services.fpl import FPLClient
        fpl_client = FPLClient()
        bootstrap = await fpl_client.fetch_and_cache_bootstrap()
        elements = bootstrap.get("elements", [])
        teams = bootstrap.get("teams", [])
        fpl_players = [FPLClient.extract_player_data(e, teams) for e in elements]
        summary["fpl_players"] = len(fpl_players)
        print(f"  ✓ FPL: {len(fpl_players)} players")
        await fpl_client.close()
    except Exception as e:
        logger.error(f"FPL fetch failed: {e}")
        summary["errors"].append(f"FPL: {e}")
        # Try cache fallback
        cached = _load_json(FPL_DATA_DIR / "bootstrap.json")
        if cached:
            elements = cached.get("elements", [])
            teams = cached.get("teams", [])
            from services.fpl import FPLClient
            fpl_players = [FPLClient.extract_player_data(e, teams) for e in elements]
            print(f"  ⚠ Using cached FPL data: {len(fpl_players)} players")
        else:
            print("  ✗ No FPL data available")

    summary["steps_completed"] = 2

    # ─── STEP 3: Match SM ↔ FPL ─────────────────────────────────────────
    print("\n[3/7] Matching SM ↔ FPL players...")
    records = []
    try:
        from services.matcher import PlayerMatcher
        matcher = PlayerMatcher()
        records = matcher.build_all_records(sm_players, fpl_players)
        summary["matched"] = matcher.matched
        summary["records"] = len(records)
        print(
            f"  ✓ Matched: {matcher.matched} "
            f"({matcher.high_confidence} high, {matcher.medium_confidence} med), "
            f"Unmatched: {matcher.unmatched}"
        )
    except Exception as e:
        logger.error(f"Matching failed: {e}")
        summary["errors"].append(f"Match: {e}")
        print(f"  ✗ Matching failed: {e}")

    summary["steps_completed"] = 3

    # ─── STEP 4: Save validated records ──────────────────────────────────
    print("\n[4/7] Saving validated records...")
    if records:
        records_data = [r.model_dump() for r in records]
        records_path = CACHE_DIR / "player_records.json"
        with open(records_path, "w", encoding="utf-8") as f:
            json.dump(records_data, f, indent=2, default=str)
        print(f"  ✓ Saved {len(records_data)} records to {records_path}")
    else:
        print("  ⚠ No records to save")

    summary["steps_completed"] = 4

    # ─── STEP 5: Build chunks ────────────────────────────────────────────
    print("\n[5/7] Building chunks...")
    chunks = []
    try:
        from rag.chunker import ChunkBuilder
        builder = ChunkBuilder()

        # Parse standings for chunking
        standings_for_chunks = _parse_standings_for_chunks(sm_standings_raw)

        chunks = builder.build_all_chunks(records, standings_for_chunks)
        manifest = builder.generate_manifest()
        summary["chunks"] = len(chunks)

        # Save manifest
        manifest_path = CACHE_DIR / f"chunks_manifest_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"
        with open(manifest_path, "w", encoding="utf-8") as f:
            json.dump(manifest.model_dump(), f, indent=2)

        print(f"  ✓ Built {len(chunks)} chunks:")
        for ct, count in manifest.by_type.items():
            print(f"    - {ct}: {count}")
    except Exception as e:
        logger.error(f"Chunking failed: {e}")
        summary["errors"].append(f"Chunk: {e}")
        print(f"  ✗ Chunking failed: {e}")

    summary["steps_completed"] = 5

    # ─── STEP 6: Embed & store in ChromaDB ──────────────────────────────
    print("\n[6/7] Embedding chunks into ChromaDB...")
    if chunks:
        try:
            from rag.embedder import Embedder
            embedder = Embedder()
            count = embedder.full_rebuild(chunks)
            summary["embedded"] = count
            print(f"  ✓ Embedded {count} chunks in ChromaDB")
        except Exception as e:
            logger.error(f"Embedding failed: {e}")
            summary["errors"].append(f"Embed: {e}")
            print(f"  ✗ Embedding failed: {e}")
    else:
        print("  ⚠ No chunks to embed")

    summary["steps_completed"] = 6

    # ─── STEP 7: Build BM25 index ───────────────────────────────────────
    print("\n[7/7] Building BM25 index...")
    if chunks:
        try:
            from rag.embedder import Embedder
            embedder = Embedder()
            embedder.build_bm25_index(chunks)
            summary["bm25_built"] = True
            print(f"  ✓ BM25 index built with {len(chunks)} documents")
        except Exception as e:
            logger.error(f"BM25 build failed: {e}")
            summary["errors"].append(f"BM25: {e}")
            print(f"  ✗ BM25 build failed: {e}")
    else:
        print("  ⚠ No chunks for BM25")

    summary["steps_completed"] = 7

    # ─── Summary ────────────────────────────────────────────────────────
    elapsed = time.time() - start
    print("\n" + "=" * 60)
    print(f"  PIPELINE COMPLETE in {elapsed:.1f}s")
    print(f"  SM Players: {summary['sm_players']} | FPL Players: {summary['fpl_players']}")
    print(f"  Matched: {summary['matched']} | Records: {summary['records']}")
    print(f"  Chunks: {summary['chunks']} | Embedded: {summary['embedded']}")
    print(f"  BM25: {'✓' if summary['bm25_built'] else '✗'}")
    if summary["errors"]:
        print(f"  Errors: {len(summary['errors'])}")
        for err in summary["errors"]:
            print(f"    - {err}")
    print("=" * 60 + "\n")

    return summary


def _load_json(path: Path) -> list:
    """Load JSON data from disk cache."""
    if path.exists():
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
            if isinstance(data, dict):
                return data.get("data", [])
            return data
        except Exception as e:
            logger.warning(f"Failed to load {path}: {e}")
    return []


def _parse_standings_for_chunks(raw_data: list) -> list[dict]:
    """Parse Sportmonks standings into format suitable for chunking."""
    standings = []
    if not isinstance(raw_data, list):
        return standings

    for item in raw_data:
        if not isinstance(item, dict):
            continue
        # Sportmonks may nest standings in different structures
        details = item.get("details", item.get("standings", [item]))
        if isinstance(details, list):
            for d in details:
                if isinstance(d, dict):
                    participant = d.get("participant", {})
                    standings.append({
                        "team_name": participant.get("name", d.get("team_name", "")),
                        "position": d.get("position", 0),
                        "points": d.get("points", 0),
                        "played": d.get("games_played", d.get("played", 0)),
                        "won": d.get("won", 0),
                        "drawn": d.get("draw", d.get("drawn", 0)),
                        "lost": d.get("lost", 0),
                        "goals_for": d.get("goals_scored", d.get("goals_for", 0)),
                        "goals_against": d.get("goals_against", 0),
                        "goal_difference": d.get("goal_difference", 0),
                        "form": d.get("recent_form", ""),
                    })
        else:
            standings.append(item)

    return standings


# ─── CLI Entry Point ────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("\nFantasyCoach AI — Data Refresh Pipeline")
    print(f"Sportmonks Token: {'✓ Set' if SPORTMONKS_TOKEN else '✗ Missing'}")
    print()

    asyncio.run(run_full_refresh())
