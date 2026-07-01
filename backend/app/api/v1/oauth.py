from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.oauth import oauth
from app.core.security import create_refresh_token, set_refresh_token_cookie
from app.db.session import get_db
from app.models.user import OAuthProvider
from app.services.auth_service import OAuthEmailNotAllowedError, get_or_create_oauth_user

router = APIRouter(prefix="/auth/oauth", tags=["auth"])

SUPPORTED_PROVIDERS = {"google", "github"}


@router.get("/{provider}/login")
async def oauth_login(provider: str, request: Request):
    if provider not in SUPPORTED_PROVIDERS:
        raise HTTPException(status_code=404, detail="Unknown OAuth provider")
    client = oauth.create_client(provider)
    redirect_uri = request.url_for("oauth_callback", provider=provider)
    return await client.authorize_redirect(request, str(redirect_uri))


async def _extract_google_identity(client, token: dict) -> tuple[str | None, str, str | None]:
    userinfo = token.get("userinfo")
    if userinfo is None:
        userinfo = await client.parse_id_token(token)
    return userinfo.get("email"), userinfo.get("sub", ""), userinfo.get("name")


async def _extract_github_identity(client, token: dict) -> tuple[str | None, str, str | None]:
    profile_resp = await client.get("user", token=token)
    profile = profile_resp.json()

    email = profile.get("email")
    if not email:
        emails_resp = await client.get("user/emails", token=token)
        emails = emails_resp.json()
        primary = next((e["email"] for e in emails if e.get("primary")), None)
        email = primary or (emails[0]["email"] if emails else None)

    return email, str(profile.get("id", "")), profile.get("name") or profile.get("login")


@router.get("/{provider}/callback", name="oauth_callback")
async def oauth_callback(provider: str, request: Request, db: AsyncSession = Depends(get_db)):
    if provider not in SUPPORTED_PROVIDERS:
        raise HTTPException(status_code=404, detail="Unknown OAuth provider")

    client = oauth.create_client(provider)
    token = await client.authorize_access_token(request)

    if provider == "google":
        email, subject, full_name = await _extract_google_identity(client, token)
    else:
        email, subject, full_name = await _extract_github_identity(client, token)

    if not email:
        raise HTTPException(
            status_code=400, detail="OAuth provider did not return an email address"
        )

    try:
        user = await get_or_create_oauth_user(
            db, email, OAuthProvider(provider), subject, full_name
        )
    except OAuthEmailNotAllowedError:
        return RedirectResponse(f"{settings.oauth_redirect_base_url}/admin/login?error=not_allowed")

    response = RedirectResponse(f"{settings.oauth_redirect_base_url}/admin/oauth-callback")
    set_refresh_token_cookie(response, create_refresh_token(str(user.id)))
    return response
