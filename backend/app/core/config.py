"""Application settings, loaded from environment variables / .env file."""

from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # --- General ---
    environment: str = "development"
    project_name: str = "Tarachand Rana Portfolio"
    api_v1_prefix: str = "/api/v1"

    # --- Database ---
    database_url: str = "postgresql+asyncpg://portfolio:change-me@localhost:5432/portfolio"

    @field_validator("database_url")
    @classmethod
    def _use_asyncpg_dialect(cls, value: str) -> str:
        # Managed Postgres providers (Render, Heroku, etc.) hand out plain
        # postgres:// or postgresql:// URLs, but create_async_engine requires the
        # asyncpg dialect to be spelled out explicitly.
        if value.startswith("postgres://"):
            return "postgresql+asyncpg://" + value[len("postgres://") :]
        if value.startswith("postgresql://"):
            return "postgresql+asyncpg://" + value[len("postgresql://") :]
        return value

    # --- Redis ---
    redis_url: str = "redis://localhost:6379/0"

    # --- Security / JWT ---
    secret_key: str = "change-me-to-a-long-random-string"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    # --- OAuth ---
    google_client_id: str = ""
    google_client_secret: str = ""
    github_client_id: str = ""
    github_client_secret: str = ""
    oauth_redirect_base_url: str = "http://localhost:5173"

    # --- Admin access control ---
    # Comma-separated allowlist: only these emails may ever hold an admin session,
    # whether via password login or OAuth. There is no public self-registration.
    allowed_admin_emails: str = ""
    refresh_token_cookie_name: str = "portfolio_refresh_token"

    # One-time production admin bootstrap (see POST /auth/bootstrap-admin). Blank by
    # default, which disables the endpoint outright — only set this temporarily.
    bootstrap_secret: str = ""

    # --- CORS ---
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    # --- Mail ---
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    contact_notify_email: str = ""

    # --- GitHub API ---
    github_username: str = ""
    github_api_token: str = ""

    # --- Rate limiting ---
    rate_limit_per_minute: int = 60

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def allowed_admin_emails_list(self) -> list[str]:
        return [e.strip().lower() for e in self.allowed_admin_emails.split(",") if e.strip()]

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
