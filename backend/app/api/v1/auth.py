import hmac

from fastapi import APIRouter, Depends, Header, HTTPException, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.limiter import limiter
from app.core.security import (
    REFRESH_COOKIE_PATH,
    InvalidTokenError,
    create_access_token,
    create_refresh_token,
    decode_token,
    set_refresh_token_cookie,
)
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import AccessTokenResponse, LoginRequest, UserRead
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=AccessTokenResponse)
@limiter.limit("5/minute")
async def login(
    request: Request,
    response: Response,
    payload: LoginRequest,
    db: AsyncSession = Depends(get_db),
) -> AccessTokenResponse:
    user = await auth_service.authenticate_user(db, payload.email, payload.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password"
        )

    set_refresh_token_cookie(response, create_refresh_token(str(user.id)))
    return AccessTokenResponse(access_token=create_access_token(str(user.id)))


@router.post("/refresh", response_model=AccessTokenResponse)
async def refresh(request: Request, db: AsyncSession = Depends(get_db)) -> AccessTokenResponse:
    refresh_token = request.cookies.get(settings.refresh_token_cookie_name)
    if refresh_token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No refresh token")

    try:
        user_id = decode_token(refresh_token, expected_type="refresh")
    except InvalidTokenError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc

    user = await db.get(User, int(user_id))
    if user is None or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return AccessTokenResponse(access_token=create_access_token(str(user.id)))


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(response: Response) -> None:
    response.delete_cookie(settings.refresh_token_cookie_name, path=REFRESH_COOKIE_PATH)


@router.get("/me", response_model=UserRead)
async def me(user: User = Depends(get_current_user)) -> UserRead:
    return UserRead.model_validate(user)


@router.post("/bootstrap-admin", response_model=UserRead, status_code=status.HTTP_201_CREATED)
@limiter.limit("3/minute")
async def bootstrap_admin(
    request: Request,
    payload: LoginRequest,
    db: AsyncSession = Depends(get_db),
    x_bootstrap_secret: str = Header(default=""),
) -> UserRead:
    """Create the very first admin account in a fresh deployment.

    Disabled unless BOOTSTRAP_SECRET is set, and refuses to run once any user
    already exists — so it can't be used to add a second account or take over
    an existing one, even if the secret is left configured indefinitely.
    """
    if not settings.bootstrap_secret:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    if not hmac.compare_digest(x_bootstrap_secret, settings.bootstrap_secret):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid secret")

    if await auth_service.count_users(db) > 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="An admin account already exists"
        )

    user = await auth_service.create_admin_user(db, payload.email, payload.password)
    return UserRead.model_validate(user)
