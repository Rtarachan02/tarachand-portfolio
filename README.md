# Tarachand Rana — Full-Stack Portfolio

A production-grade portfolio platform showcasing Embedded Systems, Backend Engineering, and AI/ML work, built with a FastAPI + PostgreSQL backend and a React 19 + TypeScript frontend.

> **Status: Phases 1–4 — Architecture, Backend Core, Database, and Frontend Core.** The repo skeleton, real PostgreSQL schema (projects, skills, experience, certifications, blog, testimonials, contact messages, visitor analytics), a working public API, and a React frontend wired to live data are all in place and tested locally. Auth (JWT/OAuth), the full interactive/3D UI, and production deployment are being built out in subsequent phases. See [docs/](docs/) as it grows for architecture and API details.

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
python scripts/seed.py    # optional: inserts placeholder projects/skills/etc.
uvicorn app.main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

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
5. ⬜ Authentication (JWT + Google/GitHub OAuth, admin-only routes)
6. ⬜ Interactive UI (3D visualizations, scroll animations, markdown blog rendering)
7. ⬜ Deployment (Docker, Render) — compose file written, not yet deployed
8. ⬜ Testing (broader backend + frontend coverage)
9. ⬜ Documentation
10. ⬜ Production release (SEO, performance, security pass)

## License

Personal portfolio — all rights reserved.
