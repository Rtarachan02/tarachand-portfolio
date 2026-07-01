import pytest
from sqlalchemy import create_engine, delete
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.profile import SiteProfile
from app.schemas.github import GitHubRepo, GitHubStats
from app.services.github_service import extract_username


def _sync_engine():
    sync_url = settings.database_url.replace("postgresql+asyncpg://", "postgresql+psycopg2://")
    return create_engine(sync_url)


@pytest.fixture(autouse=True)
def _clean_profile():
    engine = _sync_engine()
    with Session(engine) as session:
        session.execute(delete(SiteProfile))
        session.commit()
    engine.dispose()
    yield
    engine = _sync_engine()
    with Session(engine) as session:
        session.execute(delete(SiteProfile))
        session.commit()
    engine.dispose()


@pytest.mark.parametrize(
    ("url", "expected"),
    [
        ("https://github.com/octocat", "octocat"),
        ("https://github.com/octocat/", "octocat"),
        ("github.com/octocat", "octocat"),
        ("octocat", "octocat"),
    ],
)
def test_extract_username(url: str, expected: str) -> None:
    assert extract_username(url) == expected


def test_stats_404_when_github_not_configured(client) -> None:
    response = client.get("/api/v1/github/stats")
    assert response.status_code == 404


def test_stats_returns_data_when_configured(client, monkeypatch) -> None:
    engine = _sync_engine()
    with Session(engine) as session:
        session.add(SiteProfile(id=1, github_url="https://github.com/octocat"))
        session.commit()
    engine.dispose()

    fake_stats = GitHubStats(
        username="octocat",
        profile_url="https://github.com/octocat",
        avatar_url="https://example.com/avatar.png",
        public_repos=8,
        followers=100,
        recent_repos=[
            GitHubRepo(
                name="Hello-World",
                url="https://github.com/octocat/Hello-World",
                description="My first repo",
                stars=42,
                updated_at="2026-01-01T00:00:00Z",
            )
        ],
    )

    async def fake_fetch(username: str) -> GitHubStats:
        assert username == "octocat"
        return fake_stats

    monkeypatch.setattr("app.api.v1.github.fetch_github_stats", fake_fetch)

    response = client.get("/api/v1/github/stats")
    assert response.status_code == 200
    assert response.json()["username"] == "octocat"
    assert response.json()["public_repos"] == 8
    assert response.json()["recent_repos"][0]["name"] == "Hello-World"
