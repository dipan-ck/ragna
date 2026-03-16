#!/bin/sh
set -e

echo "Starting API server..."
node dist/server.js &

echo "Starting worker..."
node dist/workers/embedding.worker.js &

wait
