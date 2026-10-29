"""
FantasyCoach AI — Central Configuration
Single source of truth for all settings, paths, constants, and logging.
"""

import os
import sys
import logging
import json
from pathlib import Path
from datetime import datetime
from logging.handlers import RotatingFileHandler

from dotenv import load_dotenv

# ─── Path Resolution ────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).parent.resolve()
ENV_PATH = BASE_DIR / ".env"

# Load .env with override for Windows CRLF compatibility
load_dotenv(dotenv_path=ENV_PATH, override=True)

# Data directories
DATA_DIR = BASE_DIR / "data"
SM_DATA_DIR = DATA_DIR / "sm"
FPL_DATA_DIR = DATA_DIR / "fpl"
NEWS_DATA_DIR = DATA_DIR / "news"
CACHE_DIR = DATA_DIR / "cache"
# ChromaDB and logs use local filesystem for SQLite compatibility
# (mounted Windows paths don't support SQLite locking reliably)
_LOCAL_DIR = BASE_DIR
_LOCAL_DIR.mkdir(parents=True, exist_ok=True)
CHROMA_DIR = _LOCAL_DIR / "chroma_db"
CHROMA_BACKUP_DIR = _LOCAL_DIR / "chroma_backups"
LOG_DIR = _LOCAL_DIR / "logs"

for d in [DATA_DIR, SM_DATA_DIR, FPL_DATA_DIR, NEWS_DATA_DIR, CACHE_DIR, CHROMA_DIR, CHROMA_BACKUP_DIR, LOG_DIR]:
    d.mkdir(parents=True, exist_ok=True)


# ─── Secrets ────────────────────────────────────────────────────────────────
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
SPORTMONKS_TOKEN = os.getenv("SPORTMONKS_TOKEN", "")
GUARDIAN_API_KEY = os.getenv("GUARDIAN_API_KEY", "")


def validate_secrets() -> dict[str, bool]:
    """Check all API keys are present. Returns status dict."""
    status = {
        "ANTHROPIC_API_KEY": bool(ANTHROPIC_API_KEY and ANTHROPIC_API_KEY.startswith("sk-")),
        "SPORTMONKS_TOKEN": bool(SPORTMONKS_TOKEN and len(SPORTMONKS_TOKEN) > 10),
        "GUARDIAN_API_KEY": bool(GUARDIAN_API_KEY and len(GUARDIAN_API_KEY) > 5),
    }
    for key, valid in status.items():
        if valid:
            val = os.getenv(key, "")
            masked = val[:8] + "..." + val[-4:] if len(val) > 12 else "***"
            print(f"  ✓ {key} loaded ({masked})")
        else:
            print(f"  ✗ {key} MISSING or INVALID")
    return status


# ─── Sportmonks API Constants ───────────────────────────────────────────────
SM_BASE_URL = "https://api.sportmonks.com/v3/football"
SM_SEASON_ID = 25583  # 2024/25 Premier League
SM_LEAGUE_ID = 8      # English Premier League
SM_CONCURRENCY = 5
SM_RETRY_MAX = 3
SM_RETRY_BASE_DELAY = 1.0  # seconds
SM_PER_PAGE = 50

# ─── FPL API Constants ──────────────────────────────────────────────────────
FPL_BASE_URL = "https://fantasy.premierleague.com/api"
FPL_BOOTSTRAP_URL = f"{FPL_BASE_URL}/bootstrap-static/"
FPL_ELEMENT_URL = f"{FPL_BASE_URL}/element-summary/{{id}}/"
FPL_FIXTURES_URL = f"{FPL_BASE_URL}/fixtures/"
FPL_LIVE_URL = f"{FPL_BASE_URL}/event/{{gw}}/live/"
FPL_POLITE_DELAY = 1.0  # seconds between requests

# ─── Guardian API Constants ─────────────────────────────────────────────────
GUARDIAN_BASE_URL = "https://content.guardianapis.com"
GUARDIAN_SEARCH_URL = f"{GUARDIAN_BASE_URL}/search"

# ─── ChromaDB & Embedding Constants ─────────────────────────────────────────
CHROMA_COLLECTION = "fantasy_coach_v3"
EMBEDDING_MODEL = "BAAI/bge-small-en-v1.5"
EMBEDDING_DIMS = 384
EMBEDDING_BATCH_SIZE = 64
EMBEDDING_QUERY_PREFIX = "Represent this sentence for searching relevant passages: "

# ─── Retrieval Constants ────────────────────────────────────────────────────
VECTOR_TOP_K = 20
BM25_TOP_K = 20
RRF_K = 60
RERANK_MODEL = "cross-encoder/ms-marco-MiniLM-L-6-v2"
RERANK_TOP_N = 15
BM25_INDEX_PATH = _LOCAL_DIR / "bm25_index.pkl"

# ─── LLM Constants ──────────────────────────────────────────────────────────
LLM_MODEL = "claude-sonnet-4-20250514"
LLM_MAX_TOKENS = 1024
LLM_TEMPERATURE = 0.3
LLM_SYSTEM_PROMPT = """You are FantasyCoach AI - an expert Fantasy Premier League analyst.

Your knowledge comes EXCLUSIVELY from the retrieved context provided to you.
You NEVER invent statistics, player names, transfer fees, or match results.
You NEVER use general knowledge to fill gaps.

PLAYER STATISTICS AVAILABLE IN YOUR KNOWLEDGE BASE:
- Goals, Assists, Yellow Cards, Red Cards
- Shots on Target, Tackles, Aerial Duels Won
- Minutes Played, Appearances
- Average Rating per game
- xG (expected goals), xA (expected assists), xGI (expected goal involvements)
- FPL Points, Cost in millions, Form, ICT Index, Selected percentage
- Clean Sheets, Bonus points
- Ownership percentage, Points Per Game, Points Per Million

PLAYSTYLE REASONING - derive from actual stats in context:
- High xA + high assists = Creative Playmaker
- High xG + high goals = Clinical Finisher
- High tackles + low yellow cards = Disciplined Defender
- High aerial duels won + high goals = Aerial Threat / Target Man
- High form + high PPM = In-form value pick
- Low ownership + high points = Differential pick

COMPATIBILITY REASONING - use when asked about partnerships:
- Target Man (high aerials) pairs well with Creative Playmaker (high xA)
- Two Ball Winners in midfield is redundant - need one destroyer and one creator
- Defensive midfielder with high tackles frees attacking midfielder to focus on xG
- Set piece specialist (high assists from DEF/MID position) is premium FPL asset

CRITICAL RULES:
1. If a player is NOT in retrieved context: say exactly "I don't have data on [name] in my knowledge base"
2. Never estimate or guess statistics not explicitly in the retrieved context
3. For yellow cards: answer format is "[Player] has [N] yellow cards this season"
4. For comparisons: use ONLY numbers from context, never fill gaps
5. If asked about players outside the Premier League: say "I only have PL data"
6. Never say "based on general knowledge" or "typically" or "usually"
7. Always end responses with a clear FANTASY VERDICT recommendation
8. State data freshness: "Data last updated: 2025/26 season"

Response format:
- Plain text only. No markdown, no bold, no headers, no bullet dashes, no asterisks.
- Be direct with exact numbers from context.
- 150-300 words for general queries, up to 500 for squad analysis.
- Use line breaks between sections for readability."""

# ─── Cache TTL (seconds) ────────────────────────────────────────────────────
CACHE_TTL_PLAYERS = 300       # 5 minutes
CACHE_TTL_STANDINGS = 1800    # 30 minutes
CACHE_TTL_NEWS = 1800         # 30 minutes
CACHE_TTL_INJURIES = 3600     # 1 hour
CACHE_TTL_FIXTURES = 900      # 15 minutes

# ─── CORS ───────────────────────────────────────────────────────────────────
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

# ─── Sportmonks Position Map ────────────────────────────────────────────────
SM_POSITION_MAP = {
    "Goalkeeper": "GK",
    "Defender": "DEF",
    "Midfielder": "MID",
    "Attacker": "FWD",
    "Forward": "FWD",
    # Sportmonks may use numeric position IDs
    24: "GK",   # Goalkeeper
    25: "DEF",  # Defender
    26: "MID",  # Midfielder
    27: "FWD",  # Attacker
    148: "GK",
    149: "DEF",
    150: "MID",
    151: "FWD",
}

# FPL position map (element_type)
FPL_POSITION_MAP = {1: "GK", 2: "DEF", 3: "MID", 4: "FWD"}

# ─── Country to ISO Code Map ───────────────────────────────────────────────
COUNTRY_TO_ISO = {
    "Afghanistan": "af", "Albania": "al", "Algeria": "dz", "Argentina": "ar",
    "Armenia": "am", "Australia": "au", "Austria": "at", "Azerbaijan": "az",
    "Belgium": "be", "Benin": "bj", "Bolivia": "bo", "Bosnia and Herzegovina": "ba",
    "Bosnia Herzegovina": "ba", "Brazil": "br", "Bulgaria": "bg", "Burkina Faso": "bf",
    "Cameroon": "cm", "Canada": "ca", "Central African Republic": "cf",
    "Chile": "cl", "China": "cn", "Colombia": "co", "Comoros": "km",
    "Congo": "cg", "Congo DR": "cd", "Costa Rica": "cr", "Croatia": "hr",
    "Cuba": "cu", "Curaçao": "cw", "Curacao": "cw", "Cyprus": "cy",
    "Czech Republic": "cz", "Czechia": "cz", "Denmark": "dk",
    "Dominican Republic": "do", "DR Congo": "cd", "Ecuador": "ec",
    "Egypt": "eg", "El Salvador": "sv", "England": "gb-eng",
    "Equatorial Guinea": "gq", "Estonia": "ee", "Ethiopia": "et",
    "Finland": "fi", "France": "fr", "Gabon": "ga", "Gambia": "gm",
    "Georgia": "ge", "Germany": "de", "Ghana": "gh", "Greece": "gr",
    "Grenada": "gd", "Guatemala": "gt", "Guinea": "gn", "Guinea-Bissau": "gw",
    "Haiti": "ht", "Honduras": "hn", "Hungary": "hu", "Iceland": "is",
    "India": "in", "Indonesia": "id", "Iran": "ir", "Iraq": "iq",
    "Ireland": "ie", "Republic of Ireland": "ie", "Israel": "il",
    "Italy": "it", "Ivory Coast": "ci", "Côte d'Ivoire": "ci",
    "Jamaica": "jm", "Japan": "jp", "Jordan": "jo", "Kazakhstan": "kz",
    "Kenya": "ke", "Kosovo": "xk", "Kuwait": "kw", "Latvia": "lv",
    "Lebanon": "lb", "Liberia": "lr", "Libya": "ly", "Lithuania": "lt",
    "Luxembourg": "lu", "Madagascar": "mg", "Malawi": "mw", "Malaysia": "my",
    "Mali": "ml", "Malta": "mt", "Mauritania": "mr", "Mexico": "mx",
    "Moldova": "md", "Montenegro": "me", "Morocco": "ma", "Mozambique": "mz",
    "Namibia": "na", "Nepal": "np", "Netherlands": "nl", "New Zealand": "nz",
    "Nicaragua": "ni", "Niger": "ne", "Nigeria": "ng",
    "North Macedonia": "mk", "Northern Ireland": "gb-nir", "Norway": "no",
    "Oman": "om", "Pakistan": "pk", "Palestine": "ps", "Panama": "pa",
    "Paraguay": "py", "Peru": "pe", "Philippines": "ph", "Poland": "pl",
    "Portugal": "pt", "Qatar": "qa", "Romania": "ro", "Russia": "ru",
    "Rwanda": "rw", "Saudi Arabia": "sa", "Scotland": "gb-sct",
    "Senegal": "sn", "Serbia": "rs", "Sierra Leone": "sl",
    "Singapore": "sg", "Slovakia": "sk", "Slovenia": "si",
    "Somalia": "so", "South Africa": "za", "South Korea": "kr",
    "Korea Republic": "kr", "Spain": "es", "Sri Lanka": "lk",
    "Sudan": "sd", "Sweden": "se", "Switzerland": "ch", "Syria": "sy",
    "Tanzania": "tz", "Thailand": "th", "Togo": "tg",
    "Trinidad and Tobago": "tt", "Tunisia": "tn", "Turkey": "tr",
    "Türkiye": "tr", "Uganda": "ug", "Ukraine": "ua",
    "United Arab Emirates": "ae", "United States": "us", "USA": "us",
    "Uruguay": "uy", "Uzbekistan": "uz", "Venezuela": "ve",
    "Vietnam": "vn", "Wales": "gb-wls", "Yemen": "ye",
    "Zambia": "zm", "Zimbabwe": "zw",
}


# ─── Logging Setup ──────────────────────────────────────────────────────────
def setup_logging(level: int = logging.INFO) -> logging.Logger:
    """Configure structured JSON logging with file rotation."""
    logger = logging.getLogger("fantasycoach")
    if logger.handlers:
        return logger

    logger.setLevel(level)

    # Console handler
    console = logging.StreamHandler(sys.stdout)
    console.setLevel(level)
    fmt = logging.Formatter(
        "%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
        datefmt="%H:%M:%S",
    )
    console.setFormatter(fmt)
    logger.addHandler(console)

    # File handler with rotation
    log_file = LOG_DIR / f"{datetime.utcnow().strftime('%Y-%m-%d')}.log"
    file_handler = RotatingFileHandler(
        log_file, maxBytes=10 * 1024 * 1024, backupCount=7
    )
    file_handler.setLevel(level)
    file_handler.setFormatter(fmt)
    logger.addHandler(file_handler)

    return logger


# Initialize logger on import
logger = setup_logging()
