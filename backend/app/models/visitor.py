"""Raw page-view events, aggregated later for the visitor analytics dashboard.

IP addresses are one-way hashed (never stored raw) to keep this privacy-respecting
while still allowing rough unique-visitor counts.
"""

from datetime import datetime

from sqlalchemy import DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Visitor(Base):
    __tablename__ = "visitors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    ip_hash: Mapped[str | None] = mapped_column(String(64), index=True)
    user_agent: Mapped[str | None] = mapped_column(String(500))
    referrer: Mapped[str | None] = mapped_column(String(500))
    path: Mapped[str] = mapped_column(String(500), nullable=False)
    country: Mapped[str | None] = mapped_column(String(2))
    visited_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False, index=True
    )
