#!/usr/bin/env bash
set -euo pipefail

cd /opt/src/open-resume
git pull --ff-only

cd /opt/stacks/apps/open-resume

if [[ -z "${OPEN_RESUME_PORT:-}" ]]; then
  start_port=3000
  end_port=3010
  selected_port=""

  if command -v lsof >/dev/null 2>&1; then
    for port in $(seq "$start_port" "$end_port"); do
      if ! lsof -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
        selected_port="$port"
        break
      fi
    done
  else
    selected_port="$start_port"
  fi

  if [[ -z "$selected_port" ]]; then
    echo "No free port found between ${start_port}-${end_port}." >&2
    exit 1
  fi

  export OPEN_RESUME_PORT="$selected_port"
fi

OPEN_RESUME_PORT="${OPEN_RESUME_PORT}" docker compose up -d --build

docker image prune -f >/dev/null 2>&1 || true
