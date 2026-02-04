#!/usr/bin/env bash
set -euo pipefail

start_port=3000
end_port=3010

is_port_free() {
  local port="$1"
  if command -v lsof >/dev/null 2>&1; then
    ! lsof -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1
    return
  fi
  if command -v ss >/dev/null 2>&1; then
    ! ss -lnt | awk '{print $4}' | grep -qE "[.:]${port}$"
    return
  fi
  if command -v nc >/dev/null 2>&1; then
    ! nc -z 127.0.0.1 "$port" >/dev/null 2>&1
    return
  fi
  return 1
}

selected_port=""
for port in $(seq "$start_port" "$end_port"); do
  if is_port_free "$port"; then
    selected_port="$port"
    break
  fi
done

if [[ -z "$selected_port" ]]; then
  echo "No free port found between ${start_port}-${end_port}." >&2
  exit 1
fi

export OPEN_RESUME_PORT="$selected_port"
echo "Using port ${OPEN_RESUME_PORT} for local production container."
OPEN_RESUME_PORT="$selected_port" docker compose -f docker-compose.local.yml up -d --build
