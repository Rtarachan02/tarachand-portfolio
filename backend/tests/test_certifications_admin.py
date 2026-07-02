import pytest
from sqlalchemy import create_engine, delete
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.models.certification import Certification
from app.models.user import User

TEST_EMAIL = "certifications-admin-test@example.com"
TEST_PASSWORD = "certifications-admin-password-123"


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
        session.execute(delete(Certification).where(Certification.name == "Test Cert"))
        session.commit()
    engine.dispose()


def _admin_token(client) -> str:
    response = client.post(
        "/api/v1/auth/login", json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
    )
    return response.json()["access_token"]


def test_create_update_delete_certification(client) -> None:
    token = _admin_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    create_resp = client.post(
        "/api/v1/certifications",
        headers=headers,
        json={"name": "Test Cert", "issuer": "Test Issuer", "issue_date": "2024-01-01"},
    )
    assert create_resp.status_code == 201
    cert_id = create_resp.json()["id"]

    update_resp = client.put(
        f"/api/v1/certifications/{cert_id}",
        headers=headers,
        json={"issuer": "Updated Issuer"},
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["issuer"] == "Updated Issuer"

    delete_resp = client.delete(f"/api/v1/certifications/{cert_id}", headers=headers)
    assert delete_resp.status_code == 204


def test_create_certification_requires_auth(client) -> None:
    response = client.post(
        "/api/v1/certifications",
        json={"name": "Test Cert", "issuer": "Test Issuer", "issue_date": "2024-01-01"},
    )
    assert response.status_code == 401
