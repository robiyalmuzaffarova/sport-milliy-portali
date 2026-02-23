# Vercel Deployment Guide - Sport Milliy Portali

## Quick Start

### Step 1: Prepare Your Project

```bash
cd frontend

# Install dependencies
npm ci

# Test build locally
npm run build

# Test locally
npm run start
```

If the build succeeds locally, you're ready for Vercel!

---

## Step 2: Connect to Vercel

### Option A: Via CLI (Recommended)

```bash
# Install Vercel CLI globally (one time)
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to frontend folder
cd frontend

# Link project
vercel link

# Deploy to production
vercel deploy --prod
```

### Option B: Via GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your GitHub repository
5. Select "frontend" as the root folder
6. Click "Deploy"

### Option C: Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Choose "Import Git Repository"
4. Select your repository
5. Set root directory to `frontend`
6. Configure environment variables (see Step 3)

---

## Step 3: Configure Environment Variables

### In Vercel Dashboard:

1. **Go to**: Your Project → Settings → Environment Variables
2. **Add these variables**:

| Variable | Required | Example Value | Where From |
|----------|----------|----------------|-----------|
| `NEXT_PUBLIC_API_URL` | ✅ Yes | `https://api.yourdomain.com/api/v1` | Your backend URL |
| `NEXT_PUBLIC_APP_URL` | ✅ Yes | `https://yourdomain.com` | Your domain or Vercel URL |

### For Development (`.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Important:
- **`NEXT_PUBLIC_*` variables are visible in browser** - only use non-sensitive data
- These must be set BEFORE deployment
- Changes require redeployment

---

## Step 4: Verify API Connection

After deployment, verify your API is accessible:

```bash
# Test API URL (replace with your actual URL)
curl https://yourdomain.com/api/v1/health
```

If this fails, your Vercel app can't reach the backend.

---

## Step 5: Fix Backend CORS Issues

If you see errors like "CORS policy: Cross-Origin Request Blocked":

**Update your backend CORS configuration:**

```python
# backend/app/core/config.py
CORS_ORIGINS = [
    "https://yourdomain.com",           # Your domain
    "https://www.yourdomain.com",       # www version
    "https://*.vercel.app",             # All Vercel preview URLs
]
```

Then restart your backend.

---

## Deployment Scenarios

### Scenario 1: Backend on Same Server, Frontend on Vercel

**Setup:**
- Backend API: `https://api.yourdomain.com` (running on your server)
- Frontend: `https://yourdomain.com` (Vercel)

**Environment Variables in Vercel:**
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Backend CORS:**
```python
CORS_ORIGINS = ["https://yourdomain.com"]
```

---

### Scenario 2: Both on Vercel (Development/Testing)

**Setup:**
- Deploy backend as serverless functions (if needed)
- Frontend on Vercel

**Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://api-staging.yourdomain.com/api/v1
NEXT_PUBLIC_APP_URL=https://sport-milliy.vercel.app
```

---

### Scenario 3: Backend Locally, Frontend on Vercel (Not Recommended for Production)

Only use for testing! Won't work in production.

**Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://ngrok-url-here/api/v1
NEXT_PUBLIC_APP_URL=https://sport-milliy.vercel.app
```

---

## Common Errors & Solutions

### Error: "Failed to fetch from API"

**Causes & Solutions:**

1. **Wrong API URL**
   - Check: `NEXT_PUBLIC_API_URL` in Vercel Settings
   - Verify: URL is accessible from browser: `curl $NEXT_PUBLIC_API_URL/health`

2. **CORS is blocked**
   - Check: Backend has your Vercel domain in `CORS_ORIGINS`
   - Fix: Update backend config and restart
   - Test: Check browser console Network tab for CORS error

3. **Backend is down**
   - Verify: `curl https://api.yourdomain.com/api/v1/health` works
   - Check: Backend service is running
   - Restart: `docker-compose restart backend`

4. **Firewall blocking**
   - Check: Your server firewall allows requests from Vercel IPs
   - Solution: Disable firewall rules for HTTPS port 443 (or whitelist Vercel IPs)

---

### Error: "Build failed"

**Check Vercel deployment logs:**
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the failed deployment
3. View build logs for error message

**Common build errors:**

| Error | Solution |
|-------|----------|
| `Module not found` | Run `npm ci` locally, check package.json |
| `TypeScript errors` | Fix errors or set `ignoreBuildErrors: true` in next.config.mjs |
| `Out of memory` | Optimize bundle size, check console.log statements |
| `Cannot find .env` | Environment variables set in Vercel, not files |

---

### Error: "Page shows blank or 404"

**Solutions:**

1. Check Vercel logs for errors
2. Check browser console (F12)
3. Verify API calls are working in Network tab
4. Clear browser cache (Ctrl+Shift+Del)

---

### Error: "Images not showing"

**Fix in `next.config.mjs`:**

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**',
    },
  ],
}
```

---

## Monitoring & Debugging

### View Deployment Logs
```bash
# Local machine
vercel logs

# Or in Vercel Dashboard
Dashboard → Project → Deployments → [Click deployment] → Logs
```

### Check Recent Deployments
```bash
vercel list
```

### View Environment Variables
```bash
vercel env pull
```

### Rollback to Previous Deployment
```bash
vercel rollback
```

---

## Optimization Tips

### 1. Reduce Bundle Size
```bash
npm run build
# Check output for large modules
```

### 2. Enable Caching
- Vercel caches static assets automatically
- API responses should use `Cache-Control` headers

### 3. Monitor Performance
- Vercel Dashboard → Analytics
- Check page load times
- Use Lighthouse (Chrome DevTools)

### 4. Setup Error Monitoring
- Integrate Sentry or similar
- Get alerts for production errors

---

## Continuous Deployment (Auto-Deploy)

### Push to Deploy

With GitHub integration enabled:
- Any push to `main` branch → Auto-deploys
- Pull requests → Preview deployments

**Control with Vercel Settings:**
1. Project → Settings → Git
2. Choose which branches auto-deploy

---

## Troubleshooting Deployment URL

If seeing "Deployment not found" error:

```bash
# Check current project
vercel list

# If wrong project, link correct one
vercel unlink
vercel link

# Deploy fresh
vercel deploy --prod

# Get deployment URL
vercel url
```

---

## Pre-Deployment Checklist

- [ ] Local build succeeds: `npm run build`
- [ ] Local start works: `npm run start`
- [ ] No TypeScript errors
- [ ] API URL is correct
- [ ] Backend CORS configured
- [ ] Environment variables set in Vercel
- [ ] Repository pushed to GitHub
- [ ] Vercel project linked: `vercel link`

---

## Post-Deployment Verification

```bash
# 1. Check webpage loads
curl https://yourdomain.com

# 2. Check API is reachable
curl https://yourdomain.com/api/v1/health

# 3. Check in browser
# - Open https://yourdomain.com
# - Press F12 (DevTools)
# - Check Network tab for API calls
# - Check Console for errors
```

---

## Getting Help

1. **Check Vercel Logs:**
   ```bash
   vercel logs
   ```

2. **Check Browser Console:**
   - Press F12 in browser
   - Click Console tab
   - Look for error messages

3. **Verify API Connection:**
   - Open Network tab in DevTools
   - Make an API call
   - Check request/response

4. **Vercel Status:**
   - https://www.vercelstatus.com/

5. **Vercel Documentation:**
   - https://vercel.com/docs/framework-guides/nextjs

---

## Quick Reference Commands

```bash
# Navigate to frontend
cd frontend

# Install CLI
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Deploy
vercel deploy --prod

# View logs
vercel logs

# Check environment
vercel env pull

# Rollback
vercel rollback

# Unlink project
vercel unlink
```

---

## File Locations

- **Config:** `frontend/vercel.json`
- **Next Config:** `frontend/next.config.mjs`
- **Package Scripts:** `frontend/package.json`
- **Environment Variables (Development):** `frontend/.env.local`
- **API Client:** `frontend/lib/api/client.ts`

---

**Last Updated:** February 24, 2026  
**Status:** Ready for Vercel Deployment
