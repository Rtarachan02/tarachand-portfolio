import pytest
from sqlalchemy import create_engine, delete
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.limiter import limiter
from app.core.security import hash_password
from app.models.user import User

TEST_EMAIL = "change-password-test@example.com"
ORIGINAL_PASSWORD = "original-password-123"
NEW_PASSWORD = "brand-new-password-456"


def _sync_engine():
    sync_url = settings.database_url.replace("postgresql+asyncpg://", "postgresql+psycopg2://")
    return create_engine(sync_url)


@pytest.fixture(autouse=True)
def _isolate():
    limiter.reset()
    engine = _sync_engine()
    with Session(engine) as session:
        session.execute(delete(User).where(User.email == TEST_EMAIL))
        session.add(
            User(
                email=TEST_EMAIL,
                hashed_password=hash_password(ORIGINAL_PASSWORD),
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
        session.commit()
    engine.dispose()
    limiter.reset()


def _login(client, password: str):
    return client.post("/api/v1/auth/login", json={"email": TEST_EMAIL, "password": password})


def test_change_password_requires_auth(client) -> None:
    response = client.patch(
        "/api/v1/auth/me/password",
        json={"current_password": ORIGINAL_PASSWORD, "new_password": NEW_PASSWORD},
    )
    assert response.status_code == 401


def test_wrong_current_password_rejected(client) -> None:
    token = _login(client, ORIGINAL_PASSWORD).json()["access_token"]
    response = client.patch(
        "/api/v1/auth/me/password",
        json={"current_password": "not-the-right-password", "new_password": NEW_PASSWORD},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 401


def test_change_password_end_to_end(client) -> None:
    token = _login(client, ORIGINAL_PASSWORD).json()["access_token"]
    response = client.patch(
        "/api/v1/auth/me/password",
        json={"current_password": ORIGINAL_PASSWORD, "new_password": NEW_PASSWORD},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 204

    assert _login(client, ORIGINAL_PASSWORD).status_code == 401
    assert _login(client, NEW_PASSWORD).status_code == 200
