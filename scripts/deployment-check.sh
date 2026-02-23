#!/bin/bash
# Deployment Readiness Script
# Run this script to verify your project is ready for production deployment

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "================================"
echo "Deployment Readiness Check"
echo "================================"
echo ""

# Counter for checks
PASSED=0
FAILED=0
WARNINGS=0

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗${NC} $1 missing"
        FAILED=$((FAILED + 1))
    fi
}

check_command() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗${NC} $1 is not installed"
        FAILED=$((FAILED + 1))
    fi
}

check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $1 contains '$2'"
        PASSED=$((PASSED + 1))
    else
        echo -e "${YELLOW}!${NC} $1 may need review for '$2'"
        WARNINGS=$((WARNINGS + 1))
    fi
}

echo "1. Checking required files..."
check_file ".env.production"
check_file "docker-compose.production.yml"
check_file "backend/Dockerfile"
check_file "frontend/Dockerfile"
check_file "docker/nginx/nginx.conf"
check_file "backend/requirements.txt"
check_file "frontend/next.config.mjs"
check_file "backend/.dockerignore"
check_file "frontend/.dockerignore"
echo ""

echo "2. Checking required tools..."
check_command "docker"
check_command "docker-compose"
check_command "git"
echo ""

echo "3. Checking configuration files..."
check_content "backend/.env" "DATABASE_URL"
check_content "frontend/.env.local" "NEXT_PUBLIC_API_URL"
check_content "docker/nginx/nginx.conf" "ssl_certificate"
echo ""

echo "4. Checking dependencies..."
if [ -f "backend/requirements.txt" ]; then
    if grep -q "gunicorn" backend/requirements.txt; then
        echo -e "${GREEN}✓${NC} gunicorn is in requirements.txt"
        PASSED=$((PASSED + 1))
    else
        echo -e "${YELLOW}!${NC} gunicorn not found in requirements.txt"
        WARNINGS=$((WARNINGS + 1))
    fi
fi
echo ""

echo "5. Security checks..."
if grep -q "DEBUG: False" .env.production 2>/dev/null || grep -q "DEBUG=False" .env.production 2>/dev/null; then
    echo -e "${GREEN}✓${NC} DEBUG mode is disabled"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}!${NC} Verify DEBUG is disabled in production"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -f "backend/Dockerfile" ] && grep -q "gunicorn" backend/Dockerfile; then
    echo -e "${GREEN}✓${NC} Production server configured (gunicorn)"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}!${NC} Check if production server is properly configured"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -f "frontend/Dockerfile" ] && grep -q "npm run build" frontend/Dockerfile; then
    echo -e "${GREEN}✓${NC} Frontend build step configured"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}!${NC} Check if frontend build is configured"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

echo "6. Pre-deployment tasks checklist..."
echo "   [ ] Update DOMAIN_NAME in .env.production"
echo "   [ ] Update SECRET_KEY in .env.production (use: openssl rand -hex 32)"
echo "   [ ] Update database credentials in .env.production"
echo "   [ ] Update SMTP settings for email notifications"
echo "   [ ] Update payment gateway credentials (Click, Payme)"
echo "   [ ] Generate SSL certificates for nginx"
echo "   [ ] Configure DNS to point to your server"
echo "   [ ] Set up database backups"
echo "   [ ] Configure monitoring and logging"
echo ""

echo "================================"
echo "Summary"
echo "================================"
echo -e "${GREEN}Passed:${NC} $PASSED"
echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
echo -e "${RED}Failed:${NC} $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ Your project appears ready for deployment!${NC}"
    exit 0
else
    echo -e "${RED}✗ Please fix the errors above before deploying.${NC}"
    exit 1
fi
