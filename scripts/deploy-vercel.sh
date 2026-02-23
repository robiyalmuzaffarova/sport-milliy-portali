#!/bin/bash
# Vercel Deployment Script for Sport Milliy Portali Frontend
# This script helps automate the Vercel deployment process

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Sport Milliy Portali - Vercel Deployment Helper    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Navigate to frontend
cd frontend

# Function to check command exists
command_exists() {
    command -v "$1" &> /dev/null
}

# Check prerequisites
echo -e "${BLUE}Step 1: Checking Prerequisites${NC}"
echo "================================"

if ! command_exists node; then
    echo -e "${RED}✗ Node.js not installed${NC}"
    echo "  Install from: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

if ! command_exists npm; then
    echo -e "${RED}✗ npm not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm found: $(npm --version)${NC}"

echo ""
echo -e "${BLUE}Step 2: Installing/Updating Vercel CLI${NC}"
echo "================================"
if ! command_exists vercel; then
    echo "Installing Vercel CLI globally..."
    npm install -g vercel
else
    echo -e "${GREEN}✓ Vercel CLI already installed${NC}"
fi

echo ""
echo -e "${BLUE}Step 3: Project Setup${NC}"
echo "================================"

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build locally
echo ""
echo "Building Next.js application (this may take a moment)..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Build failed!${NC}"
    echo "Please fix the errors above before deploying to Vercel"
    exit 1
fi
echo -e "${GREEN}✓ Build successful!${NC}"

echo ""
echo -e "${BLUE}Step 4: Vercel Deployment${NC}"
echo "================================"

echo ""
echo "Choose deployment type:"
echo "  1) Production (--prod)"
echo "  2) Preview"
echo "  3) Link & Deploy"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo -e "${YELLOW}⚠️  IMPORTANT Before Production Deployment:${NC}"
        echo "  1. Ensure NEXT_PUBLIC_API_URL is set in Vercel Settings"
        echo "  2. Backend CORS must include your Vercel domain"
        echo "  3. Your backend API must be accessible online"
        echo ""
        read -p "Continue with production deployment? (y/n): " confirm
        if [[ $confirm == [yY] ]]; then
            vercel deploy --prod
        fi
        ;;
    2)
        echo "Deploying preview..."
        vercel deploy
        ;;
    3)
        echo "Linking Vercel project..."
        vercel link
        echo ""
        echo "Now deploying to production..."
        vercel deploy --prod
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              Deployment Complete!                     ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

echo "Next steps:"
echo "  1. Visit your Vercel deployment URL to verify"
echo "  2. Check browser console for errors (F12)"
echo "  3. Verify API calls work in Network tab"
echo ""
echo "Useful commands:"
echo "  • View logs:        vercel logs"
echo "  • Check project:    vercel projects"
echo "  • Environment vars: vercel env pull"
echo "  • Rollback:         vercel rollback"
echo ""

cd ..
