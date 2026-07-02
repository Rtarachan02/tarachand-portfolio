import pytest
from sqlalchemy import create_engine, delete
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.models.skill import Skill
from app.models.user import User

TEST_EMAIL = "skills-admin-test@example.com"
TEST_PASSWORD = "skills-admin-password-123"


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
        session.execute(delete(Skill).where(Skill.name == "Test Skill"))
        session.commit()
    engine.dispose()


def _admin_token(client) -> str:
    response = client.post(
        "/api/v1/auth/login", json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
    )
    return response.json()["access_token"]


def test_create_update_delete_skill(client) -> None:
    token = _admin_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    create_resp = client.post(
        "/api/v1/skills",
        headers=headers,
        json={"name": "Test Skill", "category": "backend", "proficiency": 4},
    )
    assert create_resp.status_code == 201
    skill_id = create_resp.json()["id"]

    update_resp = client.put(
        f"/api/v1/skills/{skill_id}", headers=headers, json={"proficiency": 5}
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["proficiency"] == 5

    delete_resp = client.delete(f"/api/v1/skills/{skill_id}", headers=headers)
    assert delete_resp.status_code == 204


def test_create_skill_requires_auth(client) -> None:
    response = client.post(
        "/api/v1/skills", json={"name": "Test Skill", "category": "backend"}
    )
    assert response.status_code == 401
