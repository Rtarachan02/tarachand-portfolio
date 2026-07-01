from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_client_ip, get_current_admin_user
from app.core.limiter import limiter
from app.core.security import hash_ip
from app.db.session import get_db
from app.models.user import User
from app.schemas.visitor import AnalyticsSummary, PageviewCreate
from app.services import visitor_service

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.post("/pageview", status_code=204)
@limiter.limit("60/minute")
async def track_pageview(
    request: Request,
    payload: PageviewCreate,
    db: AsyncSession = Depends(get_db),
) -> None:
    ip_hash = hash_ip(get_client_ip(request))
    user_agent = request.headers.get("user-agent")
    await visitor_service.record_pageview(db, payload, ip_hash, user_agent)


@router.get("/summary", response_model=AnalyticsSummary)
async def analytics_summary(
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
) -> AnalyticsSummary:
    summary = await visitor_service.get_analytics_summary(db)
    return AnalyticsSummary.model_validate(summary)
