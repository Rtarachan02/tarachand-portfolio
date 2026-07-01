from pydantic import BaseModel


class GitHubRepo(BaseModel):
    name: str
    url: str
    description: str | None
    stars: int
    updated_at: str


class GitHubStats(BaseModel):
    username: str
    profile_url: str
    avatar_url: str | None
    public_repos: int
    followers: int
    recent_repos: list[GitHubRepo]
