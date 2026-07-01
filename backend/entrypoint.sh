#!/bin/sh
# Free-tier Render web services don't support preDeployCommand, so migrations
# run here at container startup instead. `alembic upgrade head` is a no-op if
# already current, so this is safe on every restart (including free-tier
# spin-down/spin-up cycles).
set -e

alembic upgrade head
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
