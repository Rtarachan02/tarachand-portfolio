# Deploying to Render

This repo includes a [Render Blueprint](https://render.com/docs/blueprint-spec) (`render.yaml` at the repo root) that provisions:

- **portfolio-postgres** — a managed PostgreSQL database (free plan; Render deletes free databases after ~30 days, so upgrade the plan before that matters for real use)
- **portfolio-backend** — the FastAPI app, built from `backend/Dockerfile`, with `alembic upgrade head` running automatically before every deploy (`preDeployCommand`)
- **portfolio-frontend** — the React app, built as a static site (`npm run build`, serving `frontend/dist`), with an SPA rewrite so client-side routes work on refresh

Redis is **not** provisioned — nothing in the codebase uses it yet (rate limiting runs in-memory), and Render no longer offers a free Redis tier. Add a `type: redis` service to `render.yaml` if a real caching need comes up later.

## One-time setup

1. Push this repo to GitHub (already done if you're reading this from the deployed repo).
2. In the Render dashboard: **New → Blueprint**, connect the GitHub repo, and Render will detect `render.yaml` and show the three resources above.
3. Before clicking **Apply**, Render will prompt for the env vars marked `sync: false` in `render.yaml`. You can also set/change these after creation under each service's **Environment** tab:

   | Service | Var | Value |
   |---|---|---|
   | portfolio-backend | `CORS_ORIGINS` | Leave blank for now — see step 5 |
   | portfolio-backend | `OAUTH_REDIRECT_BASE_URL` | Leave blank for now — see step 5 |
   | portfolio-backend | `ALLOWED_ADMIN_EMAILS` | Your email(s), comma-separated |
   | portfolio-backend | `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | From a Google Cloud OAuth client (optional — leave blank to skip Google login) |
   | portfolio-backend | `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | From a GitHub OAuth App (optional — leave blank to skip GitHub login) |
   | portfolio-frontend | `VITE_API_URL` | Leave blank for now — see step 5 |

4. Click **Apply**. Render provisions the database, then builds and deploys both services. First build takes a few minutes (Docker image build for the backend, npm build for the frontend).
5. Once both services are live, Render shows you their assigned URLs (e.g. `https://portfolio-backend.onrender.com`, `https://portfolio-frontend.onrender.com`). Go back and fill in the vars you skipped:
   - Backend `CORS_ORIGINS` = the frontend URL
   - Backend `OAUTH_REDIRECT_BASE_URL` = the frontend URL
   - Frontend `VITE_API_URL` = `<backend URL>/api/v1`

   Each change triggers a redeploy of that service.

## OAuth apps (optional)

Only needed if you want Google/GitHub sign-in for `/admin`. Password login works without this.

- **Google**: [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → OAuth client ID → Web application → Authorized redirect URI: `<backend URL>/api/v1/auth/oauth/google/callback`
- **GitHub**: [GitHub Developer Settings](https://github.com/settings/developers) → New OAuth App → Authorization callback URL: `<backend URL>/api/v1/auth/oauth/github/callback`

Paste the resulting client ID/secret pairs into the backend's env vars and redeploy.

## Creating your admin account in production

There's no public registration endpoint by design (see [../README.md](../README.md#admin-access)). To create your production admin login, run the bootstrap script from your own machine against the production database:

```bash
cd backend
DATABASE_URL="<internal or external connection string from the Render Postgres dashboard, rewritten to postgresql+asyncpg://>" \
  python scripts/create_admin.py
```

The script prompts for email/password interactively (hidden input) — the password never leaves your terminal. Alternatively, if your Render plan includes shell access to the backend service, run `python scripts/create_admin.py` directly from the **Shell** tab in the Render dashboard, which avoids exposing the database's external connection string at all.

## Seeding placeholder content (optional)

`backend/scripts/seed.py` inserts the same placeholder projects/skills/etc. used in local dev. Run it the same way as `create_admin.py` (env var pointing at the prod database, or via Render's Shell) if you want a populated site before writing real content.

## Redeploying

Render auto-deploys on every push to the connected branch (`main`). Alembic migrations run automatically via `preDeployCommand` before each new version goes live.
