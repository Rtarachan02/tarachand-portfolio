from pydantic import BaseModel


class ResumeInfo(BaseModel):
    available: bool
