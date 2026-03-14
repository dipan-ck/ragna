#!/usr/bin/env bash
set -euo pipefail

DB_NAME="${POSTGRES_DB:-ragna}"
DB_USER="${POSTGRES_USER:-postgres}"
DB_PASSWORD="${POSTGRES_PASSWORD:-postgres}"
DB_PORT="${POSTGRES_PORT:-5432}"
CONTAINER_NAME="${CONTAINER_NAME:-postgres-dev}"
POSTGRES_VERSION="${POSTGRES_VERSION:-16}"

command -v docker &>/dev/null || { echo "Error: Docker not found."; exit 1; }

if docker inspect "$CONTAINER_NAME" &>/dev/null; then
  STATUS=$(docker inspect -f '{{.State.Status}}' "$CONTAINER_NAME")
  [ "$STATUS" != "running" ] && docker start "$CONTAINER_NAME" &>/dev/null
else
  docker pull "postgres:${POSTGRES_VERSION}" -q
  docker run -d \
    --name "$CONTAINER_NAME" \
    -e POSTGRES_DB="$DB_NAME" \
    -e POSTGRES_USER="$DB_USER" \
    -e POSTGRES_PASSWORD="$DB_PASSWORD" \
    -p "${DB_PORT}:5432" \
    --restart unless-stopped \
    "postgres:${POSTGRES_VERSION}" &>/dev/null
fi

until docker exec "$CONTAINER_NAME" pg_isready -U "$DB_USER" -d "$DB_NAME" &>/dev/null; do sleep 1; done

echo "postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}"
