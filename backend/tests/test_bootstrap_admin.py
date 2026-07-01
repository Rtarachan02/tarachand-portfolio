import pytest
from sqlalchemy import create_engine, delete
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.limiter import limiter
from app.models.user import User

TEST_EMAIL = "bootstrap-test@example.com"


def _delete_test_user() -> None:
    # Plain sync engine here (not the app's async one) so cleanup doesn't need
    # its own event loop — avoids clashing with TestClient's loop.
    sync_url = settings.database_url.replace("postgresql+asyncpg://", "postgresql+psycopg2://")
    engine = create_engine(sync_url)
    with Session(engine) as session:
        session.execute(delete(User).where(User.email == TEST_EMAIL))
        session.commit()
    engine.dispose()


@pytest.fixture(autouse=True)
def _isolate():
    limiter.reset()
    yield
    settings.bootstrap_secret = ""
    _delete_test_user()
    limiter.reset()


def test_disabled_by_default_returns_404(client) -> None:
    response = client.post(
        "/api/v1/auth/bootstrap-admin",
        json={"email": TEST_EMAIL, "password": "irrelevant123"},
    )
    assert response.status_code == 404


def test_wrong_secret_returns_403(client) -> None:
    settings.bootstrap_secret = "correct-secret"
    response = client.post(
        "/api/v1/auth/bootstrap-admin",
        json={"email": TEST_EMAIL, "password": "irrelevant123"},
        headers={"x-bootstrap-secret": "wrong-secret"},
    )
    assert response.status_code == 403


def test_correct_secret_creates_admin_once(client) -> None:
    settings.bootstrap_secret = "correct-secret"
    response = client.post(
        "/api/v1/auth/bootstrap-admin",
        json={"email": TEST_EMAIL, "password": "irrelevant123"},
        headers={"x-bootstrap-secret": "correct-secret"},
    )
    assert response.status_code == 201
    assert response.json()["email"] == TEST_EMAIL
    assert response.json()["is_admin"] is True

    second = client.post(
        "/api/v1/auth/bootstrap-admin",
        json={"email": "someone-else@example.com", "password": "irrelevant123"},
        headers={"x-bootstrap-secret": "correct-secret"},
    )
    assert second.status_code == 409
