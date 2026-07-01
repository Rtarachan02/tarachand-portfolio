from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import hash_password, verify_password
from app.models.user import OAuthProvider, User


class OAuthEmailNotAllowedError(Exception):
    """Raised when an OAuth login succeeds at the provider but the email isn't allowlisted."""


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    stmt = select(User).where(User.email == email.lower())
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def authenticate_user(db: AsyncSession, email: str, password: str) -> User | None:
    user = await get_user_by_email(db, email)
    if user is None or not user.is_active or user.hashed_password is None:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


async def create_admin_user(
    db: AsyncSession, email: str, password: str, full_name: str | None = None
) -> User:
    user = User(
        email=email.lower(),
        full_name=full_name,
        hashed_password=hash_password(password),
        is_admin=True,
        is_active=True,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def get_or_create_oauth_user(
    db: AsyncSession,
    email: str,
    provider: OAuthProvider,
    oauth_subject: str,
    full_name: str | None,
) -> User:
    normalized_email = email.lower()
    if normalized_email not in settings.allowed_admin_emails_list:
        raise OAuthEmailNotAllowedError(normalized_email)

    user = await get_user_by_email(db, normalized_email)
    if user is None:
        user = User(
            email=normalized_email,
            full_name=full_name,
            oauth_provider=provider,
            oauth_subject=oauth_subject,
            is_admin=True,
            is_active=True,
        )
        db.add(user)
    else:
        user.oauth_provider = provider
        user.oauth_subject = oauth_subject
        if full_name and not user.full_name:
            user.full_name = full_name

    await db.commit()
    await db.refresh(user)
    return user
