# Vercel Deployment Configuration - Complete Setup

## ✅ What's Been Created for You

### Configuration Files
1. **`frontend/vercel.json`** - Vercel deployment config with environment variables and headers
2. **`frontend/next.config.mjs`** - Updated with Vercel requirements, image optimization, and security headers
3. **`frontend/.env.local.example`** - Example for local development
4. **`frontend/.env.vercel.example`** - Example for Vercel production

### Documentation Files
1. **`VERCEL_QUICK_START.md`** ⭐ **START HERE** - 5-minute deployment guide
2. **`VERCEL_DEPLOYMENT.md`** - Complete step-by-step guide with all scenarios
3. **`VERCEL_TROUBLESHOOTING.md`** - Common errors and solutions

### Deployment Scripts
1. **`scripts/deploy-vercel.bat`** - For Windows users
2. **`scripts/deploy-vercel.sh`** - For Mac/Linux users

---

## 🚀 Quick Start (Choose Your Path)

### Path 1: Use Automated Script (Easiest for Windows)
```bash
cd sport-milliy-portali
.\scripts\deploy-vercel.bat
```

### Path 2: Use Automated Script (Mac/Linux)
```bash
cd sport-milliy-portali
chmod +x scripts/deploy-vercel.sh
bash scripts/deploy-vercel.sh
```

### Path 3: Manual Deployment
```bash
cd frontend
npm install -g vercel  # One time only
vercel login
vercel link
vercel deploy --prod
```

---

## ⚙️ Before You Deploy

### 1. Test Locally First
```bash
cd frontend
npm ci
npm run build
npm run start
# Visit http://localhost:3000
```

### 2. Verify Backend is Online
```bash
# Replace with your actual backend URL
curl https://your-backend-url.com/api/v1/health
```

### 3. Update Backend CORS
```python
# backend/app/core/config.py
CORS_ORIGINS = [
    "https://yourdomain.vercel.app",  # Add your Vercel URL
]
```

### 4. Set Environment Variables in Vercel Dashboard
- Go to https://vercel.com/dashboard
- Select your project
- Settings → Environment Variables
- Add:
  - `NEXT_PUBLIC_API_URL` = Your backend API URL
  - `NEXT_PUBLIC_APP_URL` = Your frontend URL

---

## 📊 What Each File Does

### `frontend/vercel.json`
- Configures Vercel deployment settings
- Defines build and dev commands
- Sets environment variables schema
- Adds security headers
- Configures URL rewrites

### Updated `frontend/next.config.mjs`
- Enables remote pattern matching for images
- Adds security headers (X-Frame-Options, etc.)
- Configures image optimization
- Sets environment variables

### Deployment Scripts
- `deploy-vercel.bat` - Interactive Windows deployment
- `deploy-vercel.sh` - Interactive Mac/Linux deployment
- Handle prerequisites checking
- Build verification
- Multi-option deployment choices

---

## 🔗 File Dependencies

```
vercel.json
├── Relies on: NEXT_PUBLIC_API_URL (environment variable)
└── Relies on: NEXT_PUBLIC_APP_URL (environment variable)

next.config.mjs
├── Reads: process.env.NEXT_PUBLIC_API_URL
├── Reads: process.env.NEXT_PUBLIC_APP_URL
└── Exports configuration for Vercel

scripts/deploy-vercel.bat or .sh
├── Calls: npm ci (install dependencies)
├── Calls: npm run build (build the app)
└── Calls: vercel deploy --prod (deploy to Vercel)
```

---

## 📋 Deployment Workflow

```
1. Local Development
   └─> npm run dev (works locally with http://localhost:8000)

2. Test Build
   └─> npm run build (test production build locally)

3. Prepare Vercel
   └─> vercel login
   └─> vercel link

4. Configure Variables
   └─> Vercel Dashboard > Environment Variables
   └─> Set NEXT_PUBLIC_API_URL and NEXT_PUBLIC_APP_URL

5. Deploy
   └─> npm run build
   └─> vercel deploy --prod

6. Verify
   └─> Check https://yourdomain.vercel.app
   └─> Check DevTools Console for errors
   └─> Check Network tab for API calls
```

---

## ⚠️ Critical Points

### DO ✅
- Keep `NEXT_PUBLIC_*` variables as non-sensitive data only
- Test locally before deploying
- Verify backend is accessible from browser
- Update backend CORS for your Vercel domain
- Monitor logs after deployment

### DON'T ❌
- Store API keys in `NEXT_PUBLIC_*` variables
- Commit `.env.production` or `.env.local` to git
- Assume local build = working Vercel deployment
- Forget to restart backend after CORS changes
- Deploy without testing locally first

---

## 🆘 If Something Goes Wrong

### Issue: "Failed to deploy"
```bash
# Check what went wrong
vercel logs

# Test locally first
npm run build
npm run start
```

### Issue: "All requests to API fail (404/CORS)"
1. Check `NEXT_PUBLIC_API_URL` in Vercel Settings
2. Test URL manually: `curl $NEXT_PUBLIC_API_URL/health`
3. Update backend CORS
4. Restart backend
5. Redeploy frontend

### Issue: "Blank page / White screen"
1. Open DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Click on error for details

### Last Resort: Rollback
```bash
vercel rollback
```

---

## 📚 Documentation Structure

```
VERCEL_QUICK_START.md
├─ For: First-time deployers
├─ Time: 5-10 minutes
└─ Contains: Step-by-step quick guide

VERCEL_DEPLOYMENT.md
├─ For: Detailed reference
├─ Time: Reference book
└─ Contains: All scenarios & best practices

VERCEL_TROUBLESHOOTING.md
├─ For: When something breaks
├─ Time: Diagnosis & fixes
└─ Contains: Common issues & solutions

VERCEL_DEPLOYMENT_COMPLETE.md (this file)
├─ For: Understanding the setup
├─ Time: Overview
└─ Contains: What was created & how to use
```

---

## 🎯 Next Steps

1. **First Time?** → Read `VERCEL_QUICK_START.md`
2. **Need Details?** → Read `VERCEL_DEPLOYMENT.md`
3. **Something Broken?** → Read `VERCEL_TROUBLESHOOTING.md`
4. **Ready to Deploy?** → Run deployment script or follow manual steps
5. **Need to Debug?** → Check browser console and Vercel logs

---

## 🚀 One-Command Deployment (Windows)

```bash
.\scripts\deploy-vercel.bat
```

This script will:
1. ✅ Check prerequisites
2. ✅ Install dependencies
3. ✅ Build your app
4. ✅ Guide you through deployment options
5. ✅ Deploy to Vercel

---

## 💾 Backup Important Files Before Deploying

```bash
# Backup environment files
cp frontend/.env.local frontend/.env.local.backup

# Backup database (IMPORTANT!)
docker-compose exec postgres pg_dump -U sportuser sportdb > backup_before_deployment.sql
```

---

## ✨ What You Get After Deployment

✅ **Live Frontend** on Vercel (https://yourdomain.vercel.app)  
✅ **Automatic HTTPS** with SSL certificate  
✅ **Global CDN** for fast content delivery  
✅ **Auto-scale** infrastructure  
✅ **Analytics** dashboard  
✅ **Environment variable** management  
✅ **Preview deployments** for pull requests  
✅ **Rollback** capability  

---

## 📞 Support & Resources

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Documentation:** https://vercel.com/docs
- **Next.js Documentation:** https://nextjs.org/docs
- **Quick Start Guide:** `VERCEL_QUICK_START.md`
- **Troubleshooting:** `VERCEL_TROUBLESHOOTING.md`

---

## ✅ Deployment Readiness Checklist

Before deploying, ensure:

- [ ] Backend is running online
- [ ] Backend CORS updated with Vercel domain
- [ ] Local build works: `npm run build` and `npm run start`
- [ ] Vercel account created
- [ ] Project linked: `vercel link`
- [ ] Environment variables set in Vercel dashboard
- [ ] No sensitive data in `NEXT_PUBLIC_*` variables
- [ ] Database backed up
- [ ] You have your backend URL ready

---

**Status:** ✅ **READY FOR DEPLOYMENT**

**Last Updated:** February 24, 2026

**Questions?** Check `VERCEL_QUICK_START.md` or `VERCEL_TROUBLESHOOTING.md`
