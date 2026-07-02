import pytest
from sqlalchemy import create_engine, delete
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.models.blog import BlogPost
from app.models.user import User

TEST_EMAIL = "blog-admin-test@example.com"
TEST_PASSWORD = "blog-admin-password-123"
TEST_SLUG = "test-blog-admin-post"


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
        session.execute(delete(BlogPost).where(BlogPost.slug == TEST_SLUG))
        session.commit()
    engine.dispose()


def _admin_token(client) -> str:
    response = client.post(
        "/api/v1/auth/login", json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
    )
    return response.json()["access_token"]


def test_create_draft_has_no_published_at(client) -> None:
    token = _admin_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    response = client.post(
        "/api/v1/blog",
        headers=headers,
        json={
            "slug": TEST_SLUG,
            "title": "Test Post",
            "excerpt": "A test post",
            "content_markdown": "word " * 250,
            "published": False,
        },
    )
    assert response.status_code == 201
    body = response.json()
    assert body["published"] is False
    assert body["published_at"] is None
    assert body["reading_time_minutes"] == 2  # 250 words / 200 wpm, rounded up

    # Drafts don't show up in the public list.
    public_list = client.get("/api/v1/blog")
    assert not any(p["slug"] == TEST_SLUG for p in public_list.json()["items"])


def test_publish_sets_published_at(client) -> None:
    token = _admin_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    create_resp = client.post(
        "/api/v1/blog",
        headers=headers,
        json={
            "slug": TEST_SLUG,
            "title": "Test Post",
            "excerpt": "A test post",
            "content_markdown": "hello world",
            "published": False,
        },
    )
    post_id = create_resp.json()["id"]

    update_resp = client.put(
        f"/api/v1/blog/{post_id}", headers=headers, json={"published": True}
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["published"] is True
    assert update_resp.json()["published_at"] is not None

    public_list = client.get("/api/v1/blog")
    assert any(p["slug"] == TEST_SLUG for p in public_list.json()["items"])


def test_delete_post_requires_auth(client) -> None:
    response = client.delete("/api/v1/blog/999999")
    assert response.status_code == 401
