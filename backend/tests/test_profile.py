import pytest
from sqlalchemy import create_engine, delete
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.models.profile import SiteProfile
from app.models.user import User

TEST_EMAIL = "profile-test-admin@example.com"
TEST_PASSWORD = "profile-test-password-123"


def _sync_engine():
    sync_url = settings.database_url.replace("postgresql+asyncpg://", "postgresql+psycopg2://")
    return create_engine(sync_url)


@pytest.fixture(autouse=True)
def _isolate():
    engine = _sync_engine()
    with Session(engine) as session:
        session.execute(delete(User).where(User.email == TEST_EMAIL))
        session.add(
            User(
                email=TEST_EMAIL,
                hashed_password=hash_password(TEST_PASSWORD),
                is_admin=True,
                is_active=True,
            )
        )
        session.commit()
    engine.dispose()

    yield

    engine = _sync_engine()
    with Session(engine) as session:
        session.execute(delete(User).where(User.email == TEST_EMAIL))
        session.execute(delete(SiteProfile))
        session.commit()
    engine.dispose()


def _admin_token(client) -> str:
    response = client.post(
        "/api/v1/auth/login", json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
    )
    return response.json()["access_token"]


def test_get_profile_is_public(client) -> None:
    response = client.get("/api/v1/profile")
    assert response.status_code == 200
    assert "github_url" in response.json()


def test_update_profile_requires_auth(client) -> None:
    response = client.put("/api/v1/profile", json={"tagline": "nope"})
    assert response.status_code == 401


def test_update_profile_as_admin(client) -> None:
    token = _admin_token(client)
    response = client.put(
        "/api/v1/profile",
        json={
            "tagline": "Building things.",
            "github_url": "https://github.com/example",
            "public_email": "hello@example.com",
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["tagline"] == "Building things."
    assert response.json()["github_url"] == "https://github.com/example"

    follow_up = client.get("/api/v1/profile")
    assert follow_up.json()["public_email"] == "hello@example.com"
