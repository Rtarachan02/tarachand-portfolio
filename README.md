# Tarachand Rana — Full-Stack Portfolio

A production-grade portfolio platform showcasing Embedded Systems, Backend Engineering, and AI/ML work, built with a FastAPI + PostgreSQL backend and a React 19 + TypeScript frontend.

> **Status: Phases 1–6 — Architecture, Backend Core, Database, Frontend Core, Authentication, and Interactive UI.** The repo skeleton, real PostgreSQL schema, a working public API, a React frontend wired to live data, a full JWT + Google/GitHub OAuth admin auth system, and a premium interactive frontend (Three.js embedded-systems visualization, scroll animations, real markdown rendering) are all in place and tested locally. Production deployment and broader test coverage are being built out in subsequent phases. See [docs/](docs/) as it grows for architecture and API details.

## Monorepo layout

```
portfolio/
├── backend/        FastAPI application (Python 3.13+, SQLAlchemy 2.x, Alembic)
├── frontend/        React 19 + Vite + TypeScript + Tailwind CSS
├── database/        SQL init/seed scripts (Alembic is the source of truth for schema)
├── deployment/       docker-compose.yml, render.yaml, nginx config
├── docs/             Architecture, API, and deployment documentation
├── scripts/          Local dev helper scripts
└── .env.example      Documents every environment variable used by the stack
```

## Quick start (Docker, recommended)

```bash
cp .env.example .env        # edit values as needed
docker compose -f deployment/docker-compose.yml up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000 (docs at `/docs`)
- Health check: http://localhost:8000/health

## Quick start (without Docker, using a local PostgreSQL install)

**Backend**
```bash
# one-time: create a role + database matching backend/.env.example
psql -U postgres -c "CREATE ROLE portfolio WITH LOGIN PASSWORD 'change-me';"
psql -U postgres -c "CREATE DATABASE portfolio OWNER portfolio;"

cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
python scripts/seed.py         # optional: inserts placeholder projects/skills/etc.
python scripts/create_admin.py # creates your admin login (interactive, password hidden)
uvicorn app.main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

## Admin access

There is **no public registration endpoint** — admin accounts are created one of two ways:

1. **Password login**: run `python scripts/create_admin.py` from `backend/` (prompts for email/password interactively, or set `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars for non-interactive use in a deploy hook).
2. **OAuth (Google/GitHub)**: set `ALLOWED_ADMIN_EMAILS` in `.env` to a comma-separated allowlist. Only those emails can ever be granted an admin session via OAuth — anyone else who signs in gets redirected back with an error.

Visit `/admin/login` on the frontend to sign in; the dashboard at `/admin` lets you manage projects, review contact messages, and view visitor analytics.

## Tech stack

| Layer | Technologies |
|---|---|
| Backend | FastAPI, SQLAlchemy 2.x (async), Alembic, PostgreSQL, Pydantic v2, JWT + OAuth, Redis, Uvicorn/Gunicorn |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, GSAP, Three.js / React Three Fiber, Zustand, React Query |
| Infra | Docker, Docker Compose, Nginx, Render |

## Roadmap

1. ✅ Architecture & scaffolding
2. ✅ Backend core (config, logging, rate limiting, error handling)
3. ✅ Database schema & migrations (9 tables, seeded, real CRUD API)
4. ✅ Frontend core (routing, theme, layout, live data wiring, contact form)
5. ✅ Authentication (JWT + Google/GitHub OAuth, admin dashboard: projects CMS, contact inbox, analytics)
6. ✅ Interactive UI (Three.js DMA ring-buffer visualization, scroll-reveal animations, animated hero, real markdown + syntax-highlighted blog rendering, route-based code splitting)
7. ⬜ Deployment (Docker, Render) — compose file written, not yet deployed
8. ⬜ Testing (broader backend + frontend coverage)
9. ⬜ Documentation
10. ⬜ Production release (SEO, performance, security pass)

## License

Personal portfolio — all rights reserved.
