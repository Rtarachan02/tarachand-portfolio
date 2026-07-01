"""Admin user accounts. There is no public self-registration — see
app/services/auth_service.py and scripts/create_admin.py for how accounts are created.
"""

import enum

from sqlalchemy import Boolean, Enum, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import TimestampMixin


class OAuthProvider(str, enum.Enum):
    google = "google"
    github = "github"


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True, nullable=False)
    full_name: Mapped[str | None] = mapped_column(String(200))
    hashed_password: Mapped[str | None] = mapped_column(String(255))
    oauth_provider: Mapped[OAuthProvider | None] = mapped_column(
        Enum(OAuthProvider, name="oauth_provider")
    )
    oauth_subject: Mapped[str | None] = mapped_column(String(255))
    is_admin: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
