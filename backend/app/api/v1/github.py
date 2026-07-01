from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.github import GitHubStats
from app.services import profile_service
from app.services.github_service import (
    GitHubApiUnavailableError,
    GitHubUserNotFoundError,
    extract_username,
    fetch_github_stats,
)

router = APIRouter(prefix="/github", tags=["github"])


@router.get("/stats", response_model=GitHubStats)
async def github_stats(db: AsyncSession = Depends(get_db)) -> GitHubStats:
    profile = await profile_service.get_profile(db)
    if not profile.github_url:
        raise HTTPException(status_code=404, detail="GitHub profile not configured")

    username = extract_username(profile.github_url)
    try:
        return await fetch_github_stats(username)
    except GitHubUserNotFoundError as exc:
        raise HTTPException(status_code=404, detail="GitHub user not found") from exc
    except GitHubApiUnavailableError as exc:
        raise HTTPException(status_code=502, detail="GitHub API is currently unavailable") from exc
