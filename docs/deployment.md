# Deploying to Render

This repo includes a [Render Blueprint](https://render.com/docs/blueprint-spec) (`render.yaml` at the repo root) that provisions:

- **portfolio-postgres** — a managed PostgreSQL database (free plan; Render deletes free databases after ~30 days, so upgrade the plan before that matters for real use)
- **portfolio-backend** — the FastAPI app, built from `backend/Dockerfile`. Migrations run automatically on every container start via `alembic upgrade head` in `backend/entrypoint.sh` (free-tier Render services don't support `preDeployCommand`, so this runs at startup instead — it's a safe no-op once the DB is already current)
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

## GitHub stats token (recommended)

The homepage's GitHub stats card calls GitHub's public REST API. Unauthenticated calls are limited to 60/hour **per IP** — on a shared host like Render, that IP is shared with every other app on the same infrastructure, so this limit gets hit in practice (you'll see the stats card silently disappear, or a `502` on `/api/v1/github/stats` in the network tab).

Fix: [github.com/settings/tokens](https://github.com/settings/tokens) → Generate new token (classic) → no scopes needed (public data only) → set `GITHUB_API_TOKEN` on the backend to the generated token. This raises the limit to 5000/hour, tracked per-token instead of per-IP.

## Creating your admin account in production

There's no public registration endpoint by design (see [../README.md](../README.md#admin-access)). Free-tier Render services don't include Shell access, and hand-rolling an external Postgres connection from your own machine means dealing with SSL — so instead, use the one-time bootstrap endpoint:

1. In the Render dashboard, set the backend's `BOOTSTRAP_SECRET` env var to a long random value (e.g. generate one with `openssl rand -hex 32`). Save — this redeploys the backend.
2. Call the endpoint once, over HTTPS, from your own terminal:

   ```bash
   curl -X POST https://<backend URL>/api/v1/auth/bootstrap-admin \
     -H "Content-Type: application/json" \
     -H "x-bootstrap-secret: <the value you just set>" \
     -d '{"email": "you@example.com", "password": "choose-a-strong-password"}'
   ```

   This only works once — it refuses to run if any admin account already exists (`409 Conflict`), and it's disabled entirely (`404`) whenever `BOOTSTRAP_SECRET` is blank. Your password travels over HTTPS the same way it does for the regular login endpoint.
3. Delete the `BOOTSTRAP_SECRET` env var afterward (not required for safety — the endpoint self-disables once an admin exists — but there's no reason to leave it set).
4. Log in at `<frontend URL>/admin/login` with the email/password you just created.

If your Render plan does include Shell access (Starter tier and up), you can use `python scripts/create_admin.py` from the **Shell** tab instead, which skips the HTTP round-trip entirely.

## Seeding placeholder content (optional)

`backend/scripts/seed.py` inserts the same placeholder projects/skills/etc. used in local dev. It needs direct database access, so run it from Render's Shell tab if available; on free tier, the simplest path is running it locally against the external Postgres connection string from the Render dashboard (rewritten to `postgresql+asyncpg://`, with `?ssl=require` appended).

## Redeploying

Render auto-deploys on every push to the connected branch (`main`). Alembic migrations run automatically at container startup (see above) before each new version starts serving traffic.
