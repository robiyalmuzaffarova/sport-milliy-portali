@echo off
REM Vercel Deployment Script for Windows - Sport Milliy Portali
REM This script helps with Vercel deployment from Windows

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║   Sport Milliy Portali - Vercel Deployment Helper    ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Change to frontend directory
cd frontend

echo Step 1: Checking Prerequisites
echo ================================

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Node.js not installed
    echo   Install from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js found: 
node --version

REM Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ✗ npm not installed
    pause
    exit /b 1
)
echo ✓ npm found:
npm --version

echo.
echo Step 2: Installing/Updating Vercel CLI
echo ================================

vercel --version >nul 2>&1
if errorlevel 1 (
    echo Installing Vercel CLI globally...
    npm install -g vercel
) else (
    echo ✓ Vercel CLI already installed
)

echo.
echo Step 3: Project Setup
echo ================================

echo Installing dependencies...
call npm ci

echo.
echo Building Next.js application (this may take a moment)...
call npm run build

if errorlevel 1 (
    echo ✗ Build failed!
    echo Please fix the errors above before deploying to Vercel
    pause
    exit /b 1
)
echo ✓ Build successful!

echo.
echo Step 4: Vercel Deployment
echo ================================
echo.

echo Choose deployment type:
echo   1) Production (--prod)
echo   2) Preview
echo   3) Link and Deploy
echo.

set /p choice="Enter choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo ⚠️  IMPORTANT Before Production Deployment:
    echo   1. Ensure NEXT_PUBLIC_API_URL is set in Vercel Settings
    echo   2. Backend CORS must include your Vercel domain
    echo   3. Your backend API must be accessible online
    echo.
    
    set /p confirm="Continue with production deployment? (y/n): "
    if /i "%confirm%"=="y" (
        call vercel deploy --prod
    )
) else if "%choice%"=="2" (
    echo Deploying preview...
    call vercel deploy
) else if "%choice%"=="3" (
    echo Linking Vercel project...
    call vercel link
    echo.
    echo Now deploying to production...
    call vercel deploy --prod
) else (
    echo ✗ Invalid choice
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║              Deployment Complete!                     ║
echo ╚════════════════════════════════════════════════════════╝
echo.

echo Next steps:
echo   1. Visit your Vercel deployment URL to verify
echo   2. Check browser console for errors (F12)
echo   3. Verify API calls work in Network tab
echo.

echo Useful commands:
echo   - View logs:        vercel logs
echo   - Check project:    vercel projects
echo   - Environment vars: vercel env pull
echo   - Rollback:         vercel rollback
echo.

cd ..
pause
