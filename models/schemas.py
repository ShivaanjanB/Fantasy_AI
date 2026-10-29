"""
FantasyCoach AI — Pydantic v2 Data Models
All request/response schemas and data validation.
"""

from datetime import datetime
from typing import Optional, Literal, Any
from pydantic import BaseModel, Field, field_validator, computed_field


# ─── Player Record (Canonical) ──────────────────────────────────────────────
class PlayerRecord(BaseModel):
    """Primary player schema. Sportmonks ID is the primary key."""

    # Identity
    sm_id: int = Field(..., description="Sportmonks player ID — PRIMARY KEY")
    fpl_id: Optional[int] = Field(None, description="FPL element ID")
    full_name: str = Field(..., min_length=1)
    display_name: str = Field("")
    position: Literal["GK", "DEF", "MID", "FWD"] = "MID"
    team_name: str = Field("Unknown")
    team_id: int = Field(0)
    nationality: str = Field("Unknown")

    # Image URLs (pre-resolved at ingest)
    photo_url: str = ""
    badge_url: str = ""
    flag_url: str = ""

    # FPL Stats
    total_points: int = 0
    goals: int = 0
    assists: int = 0
    clean_sheets: int = 0
    minutes: int = 0
    cost: float = 0.0
    form: float = 0.0
    ownership_pct: float = 0.0
    ict_index: float = 0.0

    # Advanced metrics
    xg: float = 0.0
    xa: float = 0.0
    xgi: float = 0.0

    # Sportmonks detailed stats
    shots_on_target: int = 0
    shot_accuracy: float = 0.0
    aerial_duels_won: int = 0
    tackles: int = 0
    yellow_cards: int = 0
    red_cards: int = 0
    average_rating: float = 0.0
    appearances: int = 0
    saves: int = 0

    # Injury & availability
    injury_status: str = "available"
    injury_news: Optional[str] = None

    # Metadata
    last_updated: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

    @field_validator("display_name", mode="before")
    @classmethod
    def set_display_name(cls, v: str, info) -> str:
        if v:
            return v
        full = info.data.get("full_name", "")
        return full.split()[-1] if full else "Unknown"

    @field_validator("cost", mode="before")
    @classmethod
    def normalize_cost(cls, v: Any) -> float:
        """FPL costs come as integers (e.g., 142 = £14.2m). Normalize."""
        v = float(v) if v else 0.0
        if v > 50:
            return round(v / 10, 1)
        return round(v, 1)

    @field_validator("injury_status", mode="before")
    @classmethod
    def normalize_injury(cls, v: Any) -> str:
        if not v or v in ("None", "null", "a", ""):
            return "available"
        v = str(v).lower().strip()
        status_map = {
            "a": "available", "available": "available",
            "d": "doubtful", "doubtful": "doubtful",
            "i": "injured", "injured": "injured",
            "s": "suspended", "suspended": "suspended",
            "u": "unavailable", "unavailable": "unavailable",
        }
        return status_map.get(v, v)

    @computed_field
    @property
    def ppm(self) -> float:
        """Points per million — key value metric."""
        if self.cost > 0:
            return round(self.total_points / self.cost, 1)
        return 0.0

    @computed_field
    @property
    def xg_diff(self) -> float:
        """Goals minus xG — over/underperformance indicator."""
        return round(self.goals - self.xg, 1)

    @computed_field
    @property
    def is_differential(self) -> bool:
        """Low ownership = differential pick."""
        return self.ownership_pct < 5.0

    @computed_field
    @property
    def is_template(self) -> bool:
        """High ownership = template pick."""
        return self.ownership_pct > 50.0


# ─── Chunk Record ───────────────────────────────────────────────────────────
class ChunkRecord(BaseModel):
    """A single chunk ready for embedding and storage."""

    chunk_id: str = Field(..., min_length=3)
    text: str = Field(..., min_length=50, max_length=20000)
    metadata: dict[str, Any] = Field(default_factory=dict)
    chunk_type: Literal[
        "player_profile", "standing", "h2h", "tactical",
        "fixture", "injury_report"
    ] = "player_profile"

    @field_validator("chunk_id")
    @classmethod
    def validate_chunk_id(cls, v: str) -> str:
        valid_prefixes = ("smid_", "standing_", "h2h_", "tactical_", "fixture_", "injury_")
        if not any(v.startswith(p) for p in valid_prefixes):
            raise ValueError(
                f"chunk_id '{v}' must start with one of: {valid_prefixes}"
            )
        return v


# ─── Chunk Manifest ─────────────────────────────────────────────────────────
class ChunkManifest(BaseModel):
    """Versioned manifest produced after each chunking run."""

    version: str = "3.0.0"
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    total_chunks: int = 0
    by_type: dict[str, int] = Field(default_factory=dict)
    data_sources: dict[str, str] = Field(default_factory=dict)
    embedding_model: str = "BAAI/bge-small-en-v1.5"
    bm25_rebuilt: bool = False


# ─── Chat Schemas ───────────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    """Incoming chat request."""
    query: str = Field(..., min_length=1, max_length=2000)
    top_n: int = Field(5, ge=1, le=20)
    team_context: list[str] = Field(default_factory=list)


class ChatSourceRef(BaseModel):
    """Citation reference in chat response."""
    chunk_id: str
    player_name: Optional[str] = None
    chunk_type: str = "player_profile"
    score: float = 0.0


# ─── Health Response ────────────────────────────────────────────────────────
class HealthResponse(BaseModel):
    """System health check."""
    status: str = "ok"
    chunk_count: int = 0
    last_refresh: Optional[str] = None
    bm25_loaded: bool = False
    retriever_ready: bool = False
    llm_ready: bool = False
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


# ─── Standing Record ───────────────────────────────────────────────────────
class StandingRecord(BaseModel):
    """League table row."""
    position: int
    team_name: str
    team_id: int = 0
    played: int = 0
    won: int = 0
    drawn: int = 0
    lost: int = 0
    goals_for: int = 0
    goals_against: int = 0
    goal_difference: int = 0
    points: int = 0
    form: str = ""
    badge_url: str = ""


# ─── News Article ───────────────────────────────────────────────────────────
class NewsArticle(BaseModel):
    """Guardian API article."""
    title: str
    url: str
    section: str = "football"
    published: str = ""
    thumbnail: str = ""
    body_preview: str = ""


# ─── Injury Record ──────────────────────────────────────────────────────────
class InjuryRecord(BaseModel):
    """Player injury/availability record."""
    player_name: str
    sm_id: int = 0
    team_name: str = ""
    position: str = ""
    status: str = "available"
    reason: Optional[str] = None
    expected_return: Optional[str] = None
