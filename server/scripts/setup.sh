#!/usr/bin/env bash
set -euo pipefail

CONTAINER_NAME="postgres-dev"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="postgres"
POSTGRES_DB="ragna"
POSTGRES_PORT="5432"

# Check if container already exists
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "Container '${CONTAINER_NAME}' already exists, starting it..."
    docker start "${CONTAINER_NAME}"
else
    echo "Creating and starting postgres container..."
    docker run -d \
        --name "${CONTAINER_NAME}" \
        -e POSTGRES_USER="${POSTGRES_USER}" \
        -e POSTGRES_PASSWORD="${POSTGRES_PASSWORD}" \
        -e POSTGRES_DB="${POSTGRES_DB}" \
        -p "${POSTGRES_PORT}:5432" \
        -v "${CONTAINER_NAME}_data:/var/lib/postgresql/data" \
        --restart unless-stopped \
        postgres:16
fi

echo "Waiting for postgres to be ready..."
until docker exec "${CONTAINER_NAME}" pg_isready -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" &>/dev/null; do
    sleep 1
done
echo "Postgres is ready"

echo "Running migrations..."
npx prisma migrate deploy

echo "Generating prisma client..."
npx prisma generate

echo "Seeding..."
npx prisma db seed

echo "Done"
