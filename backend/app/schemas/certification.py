from datetime import date

from pydantic import BaseModel, ConfigDict


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
