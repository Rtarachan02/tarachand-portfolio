"""FastAPI application factory and entrypoint."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from starlette.middleware.sessions import SessionMiddleware

from app.api.v1 import api_router as api_v1_router
from app.core.config import settings
from app.core.limiter import limiter
from app.core.logging import configure_logging, get_logger

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging()
    logger.info("app_startup", environment=settings.environment)
    yield
    logger.info("app_shutdown")


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.project_name,
        description="Backend API for the Tarachand Rana portfolio platform.",
        version="0.1.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    # Required by Authlib to store OAuth state/nonce across the redirect round-trip.
    app.add_middleware(SessionMiddleware, secret_key=settings.secret_key, same_site="lax")

    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # Root-level health check for infra/orchestrator healthchecks (Docker, Render).
    @app.get("/health")
    async def root_health() -> dict[str, str]:
        return {"status": "ok"}

    app.include_router(api_v1_router, prefix=settings.api_v1_prefix)

    return app


app = create_app()
