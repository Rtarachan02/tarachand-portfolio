from app.core.config import Settings


def test_plain_postgres_scheme_gets_asyncpg_dialect() -> None:
    s = Settings(database_url="postgres://user:pass@host:5432/db")
    assert s.database_url == "postgresql+asyncpg://user:pass@host:5432/db"


def test_postgresql_scheme_gets_asyncpg_dialect() -> None:
    s = Settings(database_url="postgresql://user:pass@host:5432/db")
    assert s.database_url == "postgresql+asyncpg://user:pass@host:5432/db"


def test_already_asyncpg_scheme_is_untouched() -> None:
    url = "postgresql+asyncpg://user:pass@host:5432/db"
    s = Settings(database_url=url)
    assert s.database_url == url
