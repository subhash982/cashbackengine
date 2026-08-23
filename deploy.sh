#!/bin/bash
# ============================================================
# Cashback Engine — Deployment Script
# Usage:
#   ./deploy.sh          — rebuild & restart (keeps DB data)
#   ./deploy.sh --fresh  — wipe DB and start clean
# ============================================================
set -e

COMPOSE="docker compose -f docker-compose.yml -f docker-compose.prod.yml"

# Auto-create .env from example if it doesn't exist
if [ ! -f .env ]; then
  echo "==> No .env found — copying from .env.example (default passwords)"
  cp .env.example .env
fi

echo "==> Pulling latest code..."
git pull origin main

if [ "$1" == "--fresh" ]; then
  echo "==> WARNING: Wiping database volume and all data..."
  $COMPOSE down -v
else
  echo "==> Stopping services (keeping DB data)..."
  $COMPOSE down
fi

echo "==> Building images..."
$COMPOSE build --no-cache

echo "==> Starting services..."
$COMPOSE up -d

echo ""
echo "==> Waiting for Spring Boot + Flyway migrations to complete..."
echo "    (Flyway runs V1–V14 automatically on first start)"
sleep 15

echo ""
echo "==> Service status:"
$COMPOSE ps

echo ""
echo "==> Recent service logs:"
$COMPOSE logs --tail=40 cashbackengine-service

echo ""
echo "✓ Done! App running at: http://$(hostname -I | awk '{print $1}')"
