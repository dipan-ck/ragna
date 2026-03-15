#!/usr/bin/env bash
set -euo pipefail

echo "starting containers..."
docker compose up -d

echo "waiting for postgres to be ready..."
until docker exec postgres-dev pg_isready -U postgres -d ragna &>/dev/null; do sleep 1; done

echo "running migrations..."
npx prisma migrate deploy

echo "generating prisma client..."
npx prisma generate

echo "seeding..."
npx prisma db seed

echo "done"
