#!/usr/bin/env bash
set -euo pipefail

cd /opt/src/CVForge
git pull --ff-only
docker compose up -d --build
docker image prune -f >/dev/null 2>&1 || true
