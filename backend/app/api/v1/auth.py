from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
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
