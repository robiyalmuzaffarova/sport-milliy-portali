#!/bin/bash
# Quick Deployment Script for Sport Milliy Portali
# This script automates the deployment process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$PROJECT_DIR/.env.production"

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Sport Milliy Portali - Deployment Script          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Helper functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

prompt_yes_no() {
    read -p "$1 (y/n) " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]]
}

# Check prerequisites
echo -e "${BLUE}Step 1: Checking Prerequisites${NC}"
echo "================================"

if ! command -v docker &> /dev/null; then
    log_error "Docker is not installed"
    exit 1
fi
log_info "Docker found: $(docker --version)"

if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose is not installed"
    exit 1
fi
log_info "Docker Compose found: $(docker-compose --version)"

if [ ! -f "$ENV_FILE" ]; then
    log_error ".env.production file not found"
    echo "Please copy .env.production.example to .env.production and fill in the values"
    exit 1
fi
log_info ".env.production found"

echo ""
echo -e "${BLUE}Step 2: Pre-deployment Checks${NC}"
echo "================================"

# Check if .env.production has been customized
if grep -q "change-me-in-production" "$ENV_FILE"; then
    log_warn "⚠️  .env.production still has placeholder values!"
    echo ""
    echo "Please update the following in $ENV_FILE:"
    grep "change-me" "$ENV_FILE" | sed 's/^/  - /'
    echo ""
    if ! prompt_yes_no "Continue anyway?"; then
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}Step 3: Creating Required Directories${NC}"
echo "================================"

mkdir -p "$PROJECT_DIR/docker/nginx/ssl"
log_info "Created nginx ssl directory"

mkdir -p "$PROJECT_DIR/backend/uploads"
chmod 755 "$PROJECT_DIR/backend/uploads"
log_info "Created backend uploads directory"

echo ""
echo -e "${BLUE}Step 4: Database and Services Setup${NC}"
echo "================================"

log_info "Starting Docker containers..."
docker-compose -f "$PROJECT_DIR/docker-compose.production.yml" up -d

log_info "Waiting for services to be healthy..."
sleep 10

# Check service health
if docker-compose -f "$PROJECT_DIR/docker-compose.production.yml" ps | grep -q "healthy"; then
    log_info "Services are healthy"
else
    log_warn "Some services may not be fully healthy yet"
fi

echo ""
echo -e "${BLUE}Step 5: Running Database Migrations${NC}"
echo "================================"

log_info "Running Alembic migrations..."
docker-compose -f "$PROJECT_DIR/docker-compose.production.yml" exec -T backend \
    alembic upgrade head

if [ $? -eq 0 ]; then
    log_info "Database migrations completed successfully"
else
    log_error "Database migrations failed"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 6: Health Checks${NC}"
echo "================================"

# Test backend health
log_info "Testing backend..."
if docker-compose -f "$PROJECT_DIR/docker-compose.production.yml" exec -T backend \
    curl -f http://localhost:8000/health > /dev/null 2>&1; then
    log_info "Backend health check passed"
else
    log_warn "Backend health check may have issues"
fi

echo ""
echo -e "${BLUE}Step 7: Post-Deployment Information${NC}"
echo "================================"

echo ""
echo -e "${GREEN}✓ Deployment Complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Generate SSL certificates:"
echo "     sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com"
echo ""
echo "  2. Copy certificates to nginx:"
echo "     sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem docker/nginx/ssl/cert.pem"
echo "     sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem docker/nginx/ssl/key.pem"
echo ""
echo "  3. Update nginx configuration:"
echo "     Edit docker/nginx/nginx.conf and replace 'yourdomain.com'"
echo ""
echo "  4. Restart nginx:"
echo "     docker-compose -f docker-compose.production.yml restart nginx"
echo ""
echo "  5. Create admin user:"
echo "     docker-compose -f docker-compose.production.yml exec backend python create_superuser.py"
echo ""
echo "Useful commands:"
echo "  View logs:      docker-compose -f docker-compose.production.yml logs -f [service]"
echo "  Stop services:  docker-compose -f docker-compose.production.yml down"
echo "  Restart:        docker-compose -f docker-compose.production.yml restart"
echo ""
echo "Project URL: https://yourdomain.com"
echo "API URL: https://yourdomain.com/api/v1"
echo ""
