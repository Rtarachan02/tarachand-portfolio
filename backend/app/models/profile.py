"""Site-wide profile settings — a singleton row (id is always 1), editable via the
admin dashboard: photo, tagline, and social links shown on the public homepage.
"""

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import TimestampMixin

SINGLETON_ID = 1


class SiteProfile(TimestampMixin, Base):
    __tablename__ = "site_profile"

    id: Mapped[int] = mapped_column(primary_key=True)
    photo_url: Mapped[str | None] = mapped_column(String(500))
    tagline: Mapped[str | None] = mapped_column(String(300))
    github_url: Mapped[str | None] = mapped_column(String(500))
    linkedin_url: Mapped[str | None] = mapped_column(String(500))
    public_email: Mapped[str | None] = mapped_column(String(320))
    linkedin_embed_html: Mapped[str | None] = mapped_column(Text)
