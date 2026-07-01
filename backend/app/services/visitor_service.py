from sqlalchemy.ext.asyncio import AsyncSession

from app.models.visitor import Visitor
from app.schemas.visitor import PageviewCreate


async def record_pageview(
    db: AsyncSession, data: PageviewCreate, ip_hash: str | None, user_agent: str | None
) -> Visitor:
    visitor = Visitor(
        path=data.path,
        referrer=data.referrer,
        ip_hash=ip_hash,
        user_agent=user_agent,
    )
    db.add(visitor)
    await db.commit()
    await db.refresh(visitor)
    return visitor
