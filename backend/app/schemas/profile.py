from pydantic import BaseModel, ConfigDict


class ProfileRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    photo_url: str | None
    tagline: str | None
    github_url: str | None
    linkedin_url: str | None
    public_email: str | None
    linkedin_embed_html: str | None


class ProfileUpdate(BaseModel):
    photo_url: str | None = None
    tagline: str | None = None
    github_url: str | None = None
    linkedin_url: str | None = None
    public_email: str | None = None
    linkedin_embed_html: str | None = None
