#!/usr/bin/env bash
set -euo pipefail

cd /opt/src/cvforge
git pull --ff-only

cd /opt/stacks/apps/cvforge
docker compose up -d --build

docker image prune -f >/dev/null 2>&1 || true
