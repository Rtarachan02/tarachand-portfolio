#!/usr/bin/env bash
# One-time local dev bootstrap: creates the backend venv, installs both app's
# dependencies, and copies .env.example -> .env at the root and in backend/.
set -euo pipefail
cd "$(dirname "$0")/.."

[ -f .env ] || cp .env.example .env
[ -f backend/.env ] || cp backend/.env.example backend/.env
[ -f frontend/.env ] || cp frontend/.env.example frontend/.env

python -m venv backend/.venv
backend/.venv/Scripts/python.exe -m pip install --upgrade pip 2>/dev/null || backend/.venv/bin/python -m pip install --upgrade pip
backend/.venv/Scripts/python.exe -m pip install -r backend/requirements.txt 2>/dev/null || backend/.venv/bin/python -m pip install -r backend/requirements.txt

(cd frontend && npm install)

echo "Setup complete. See README.md for how to run the backend and frontend."
