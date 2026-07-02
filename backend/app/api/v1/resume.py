from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.schemas.resume import ResumeInfo

router = APIRouter(prefix="/resume", tags=["resume"])

# backend/app/api/v1/resume.py -> parents[3] is the backend/ root.
RESUME_PATH = Path(__file__).resolve().parents[3] / "resources" / "resume" / "resume.pdf"


@router.get("/info", response_model=ResumeInfo)
async def resume_info() -> ResumeInfo:
    return ResumeInfo(available=RESUME_PATH.is_file())


@router.get("/download")
async def download_resume() -> FileResponse:
    if not RESUME_PATH.is_file():
        raise HTTPException(status_code=404, detail="Resume not available yet")
    return FileResponse(
        RESUME_PATH,
        media_type="application/pdf",
        filename="Tarachand_Rana_Resume.pdf",
    )
