"""Pulls public GitHub profile stats via GitHub's REST API.

No LinkedIn equivalent exists for individual developers (LinkedIn's post/activity
API requires restricted Partner-tier approval), so this is the "live activity"
signal on the homepage instead. Unauthenticated GitHub API calls are limited to
60/hour *per IP* — on a shared host like Render that's shared with every other
app on the same infrastructure, so GITHUB_API_TOKEN (a token with no scopes is
enough for public data) raises that to 5000/hour, per-token instead of per-IP.
Responses are cached briefly in-process either way.
"""

import time
from urllib.parse import urlparse

import httpx

from app.core.config import settings
from app.core.logging import get_logger
from app.schemas.github import GitHubRepo, GitHubStats

logger = get_logger(__name__)

_CACHE_TTL_SECONDS = 600
_cache: dict[str, tuple[float, GitHubStats]] = {}


class GitHubUserNotFoundError(Exception):
    pass


class GitHubApiUnavailableError(Exception):
    pass


def extract_username(github_url: str) -> str:
    value = github_url.strip()
    if "/" not in value:
        return value.lstrip("@")

    normalized = value if "://" in value else f"https://{value}"
    path = urlparse(normalized).path.strip("/")
    return path.split("/")[0] if path else value.lstrip("@")


def _request_headers() -> dict[str, str]:
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "tarachand-portfolio",
    }
    if settings.github_api_token:
        headers["Authorization"] = f"Bearer {settings.github_api_token}"
    return headers


async def fetch_github_stats(username: str) -> GitHubStats:
    cached = _cache.get(username)
    if cached and time.monotonic() - cached[0] < _CACHE_TTL_SECONDS:
        return cached[1]

    async with httpx.AsyncClient(timeout=10, headers=_request_headers()) as client:
        user_resp = await client.get(f"https://api.github.com/users/{username}")
        if user_resp.status_code == 404:
            raise GitHubUserNotFoundError(username)
        if user_resp.status_code != 200:
            logger.warning(
                "github_api_error",
                status_code=user_resp.status_code,
                body=user_resp.text[:300],
                authenticated=bool(settings.github_api_token),
            )
            raise GitHubApiUnavailableError(f"GitHub API returned {user_resp.status_code}")
        user = user_resp.json()

        repos_resp = await client.get(
            f"https://api.github.com/users/{username}/repos",
            params={"sort": "pushed", "direction": "desc", "per_page": 5},
        )
        repos = repos_resp.json() if repos_resp.status_code == 200 else []

    stats = GitHubStats(
        username=user["login"],
        profile_url=user["html_url"],
        avatar_url=user.get("avatar_url"),
        public_repos=user.get("public_repos", 0),
        followers=user.get("followers", 0),
        recent_repos=[
            GitHubRepo(
                name=repo["name"],
                url=repo["html_url"],
                description=repo.get("description"),
                stars=repo.get("stargazers_count", 0),
                updated_at=repo["pushed_at"],
            )
            for repo in repos
        ],
    )
    _cache[username] = (time.monotonic(), stats)
    return stats
