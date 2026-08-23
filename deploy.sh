#!/bin/bash
# ============================================================
# Cashback Engine — VPS Deployment Script
# Usage: ./deploy.sh [--fresh]
#   --fresh  : wipe DB volume and start from scratch (WARNING: data loss)
# ============================================================
set -e

COMPOSE="docker compose -f docker-compose.yml -f docker-compose.prod.yml"

echo "==> Pulling latest code..."
git pull origin main

if [ "$1" == "--fresh" ]; then
  echo "==> WARNING: Wiping database volume..."
  $COMPOSE down -v
else
  echo "==> Stopping services (keeping data)..."
  $COMPOSE down
fi

echo "==> Building and starting services..."
$COMPOSE up -d --build

echo "==> Waiting for health checks..."
sleep 10

echo "==> Service status:"
$COMPOSE ps

echo "==> Service logs (last 30 lines):"
$COMPOSE logs --tail=30 cashbackengine-service

echo ""
echo "✓ Deployment complete!"
echo "  App: http://$(hostname -I | awk '{print $1}')"
