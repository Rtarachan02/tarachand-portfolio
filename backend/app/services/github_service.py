"""Pulls public GitHub profile stats via GitHub's unauthenticated REST API.

No LinkedIn equivalent exists for individual developers (LinkedIn's post/activity
API requires restricted Partner-tier approval), so this is the "live activity"
signal on the homepage instead. Unauthenticated GitHub API calls are limited to
60/hour per IP, so responses are cached briefly in-process.
"""

import time
from urllib.parse import urlparse

import httpx

from app.schemas.github import GitHubRepo, GitHubStats

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


async def fetch_github_stats(username: str) -> GitHubStats:
    cached = _cache.get(username)
    if cached and time.monotonic() - cached[0] < _CACHE_TTL_SECONDS:
        return cached[1]

    async with httpx.AsyncClient(
        timeout=10, headers={"Accept": "application/vnd.github+json"}
    ) as client:
        user_resp = await client.get(f"https://api.github.com/users/{username}")
        if user_resp.status_code == 404:
            raise GitHubUserNotFoundError(username)
        if user_resp.status_code != 200:
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
