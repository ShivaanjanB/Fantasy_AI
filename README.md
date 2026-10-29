# FantasyCoach AI

RAG-powered Fantasy Premier League squad management application.

IB9AU0 Individual Assignment 2 — Warwick Business School, April 2026.

## Results

On a 30-query adversarial benchmark covering lookups, comparisons, statistical questions, tactics, hallucination traps and squad advice:

| | Naive baseline | FantasyCoach |
|---|---|---|
| Factual accuracy | 62% | **89%** |
| Hallucination rate | 38% | **11%** |
| RAGAS faithfulness | – | **0.88** |

- **Chunking was the biggest lever.** The baseline used 40–80-character flat strings with arbitrary IDs. FantasyCoach uses 800–1,200-character semantic chunks keyed to stable Sportmonks IDs.
- **Six pipeline configurations** were compared to isolate each component. Cross-encoder reranking added 6 pp of accuracy for 312 ms of latency.
- **Player IDs reconciled across Sportmonks and FPL** with weighted fuzzy matching (0.70 × name + 0.30 × team, threshold 0.60): 677 of 680 matched (99.6%).

**Limits.** Thirty queries is a small set: one query moves accuracy by about 3.3 pp. The developer wrote the queries, so the set under-represents multi-player adversarial questions, questions spanning several gameweeks, and recently transferred or injured players. The RAGAS score covers the faithfulness dimension only.

The 30 queries are in `rag/evaluator.py`. `POST /api/eval/run` re-runs them against the retriever only (no LLM call). The accuracy and hallucination figures come from the project's evaluation write-up.

## Stack

- Backend: FastAPI + ChromaDB + Anthropic Claude claude-sonnet-4-20250514
- Frontend: React + Vite
- Retrieval: Hybrid BM25 + vector search + cross-encoder reranking
- Data: Sportmonks API v3 + FPL Bootstrap API

## Setup

1. Copy `.env.example` to `.env` and add your API keys
2. `pip install -r requirements.txt`
3. `python backend_api.py`
4. `cd frontend-react && npm install && npm run dev`
5. Open http://localhost:5173

## Architecture

The backend (`backend_api.py`) is a FastAPI server that:
- Loads enriched player records from `data/cache/player_records_latest.json`
- Serves a hybrid RAG pipeline (vector search via ChromaDB + BM25 sparse search)
- Streams responses from Anthropic Claude via SSE
- Exposes REST endpoints for players, standings, fixtures, injuries, and news

The frontend (`frontend-react/`) is a React + Vite SPA featuring:
- FUT-inspired football pitch squad builder
- AI assistant chat panel (streaming)
- Player comparison, stats tabs, and league standings
