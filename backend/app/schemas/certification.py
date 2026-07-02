from datetime import date

from pydantic import BaseModel, ConfigDict, Field


class CertificationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    issuer: str
    issue_date: date
    expiry_date: date | None
    credential_id: str | None
    credential_url: str | None
    image_url: str | None


class CertificationCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    issuer: str = Field(min_length=1, max_length=200)
    issue_date: date
    expiry_date: date | None = None
    credential_id: str | None = None
    credential_url: str | None = None
    image_url: str | None = None
    sort_order: int = 0


class CertificationUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    issuer: str | None = Field(default=None, min_length=1, max_length=200)
    issue_date: date | None = None
    expiry_date: date | None = None
    credential_id: str | None = None
    credential_url: str | None = None
    image_url: str | None = None
    sort_order: int | None = None
