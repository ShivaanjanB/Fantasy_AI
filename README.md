# FantasyCoach AI

RAG-powered Fantasy Premier League squad management application.

IB9AU0 Individual Assignment 2 — Warwick Business School, April 2026.

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
