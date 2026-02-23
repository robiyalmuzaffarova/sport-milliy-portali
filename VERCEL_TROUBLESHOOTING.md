# Vercel Deployment Troubleshooting - Quick Guide

## Issue: "Deployment not found" or "404 Not Found"

### ✅ Solution Checklist

#### 1. Verify Project Exists
```bash
# List all Vercel projects
vercel projects

# Should show your project in the list
```

#### 2. Check Project Link
```bash
# Verify you're linked to correct project
vercel project list

# If not linked, link it:
vercel unlink
vercel link
```

#### 3. Confirm Deployment Succeeded
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Deployments" tab
4. Check if latest deployment shows ✅ "Ready"

#### 4. Access Deployment URL
- Vercel provides multiple URLs:
  - **Production:** `https://yourdomain.com` or `https://project.vercel.app`
  - **Preview:** `https://project-preview-hash.vercel.app`

#### 5. Check Deployment was Built
```bash
# View build logs
vercel logs

# Should show "Build successful" and "Deployment complete"
```

---

## Issue: "Unable to Fetch API" - Frontend can't connect to backend

### ✅ Solutions

#### Step 1: Verify API URL is Set
```bash
# List environment variables
vercel env pull

# Should show NEXT_PUBLIC_API_URL=https://your.api.com
```

#### Step 2: Test Backend is Accessible
```bash
# Test directly from your machine
curl https://your-backend-url.com/api/v1/health

# Should return 200 and {"status": "healthy"}
```

If this fails, your backend URL is wrong or not accessible online.

#### Step 3: Fix CORS on Backend
Your backend must allow requests from your Vercel domain:

```python
# backend/app/core/config.py

CORS_ORIGINS = [
    "https://yourdomain.com",           # Your custom domain
    "https://www.yourdomain.com",       
    "https://*.vercel.app",             # All Vercel URLs
    "https://sport-milliy.vercel.app",  # Your exact Vercel app
]
```

Then **restart your backend**:
```bash
docker-compose restart backend
```

#### Step 4: Check Browser Console
1. Open your Vercel URL in browser
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Look for a message like:
   ```
   CORS error: Access to fetch at 'https://api.yourdomain.com' 
   from origin 'https://yourdomain.com' 
   has been blocked by CORS policy
   ```

If you see this, fix backend CORS (Step 3).

#### Step 5: Check Network Tab
1. In DevTools, go to **Network** tab
2. Refresh the page
3. Look for failed API requests (red X)
4. Click on the request
5. Check "Response" tab for error details

---

## Issue: "Build Failed"

### ✅ Solutions

#### 1. Check Build Logs
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your project → Deployments → (failed deployment)
3. Scroll down to see error details

#### 2. Build Locally First
```bash
cd frontend
npm ci
npm run build
```

If this fails locally, it will fail in Vercel. Fix the error, then deploy.

#### 3. Common Build Errors

| Error | Fix |
|-------|-----|
| `MODULE_NOT_FOUND` | Run `npm ci` locally, ensure all dependencies in package.json |
| `TYPESCRIPT_ERROR` | Fix TypeScript errors or set `ignoreBuildErrors: true` in next.config.mjs |
| `OUT_OF_MEMORY` | Optimize bundle, remove unused dependencies |
| `CANNOT_FIND_ENV` | Add environment variables in Vercel Settings, not files |

---

## Issue: "Blank Page" or "White Screen"

### ✅ Solutions

#### 1. Check Browser Console
- Press F12 → Console tab
- Look for error messages
- Common: API not found, CORS blocked, missing environment variables

#### 2. Check Vercel Function Logs
```bash
vercel logs
```

Look for errors during page render.

#### 3. Verify Environment Variables
```bash
vercel env pull
echo $NEXT_PUBLIC_API_URL
```

Should show your backend URL, not empty.

#### 4. Check Network Requests
- DevTools → Network tab
- Refresh page
- Look for red X (failed requests)
- Click to see error response

---

## Issue: "Insufficient permissions" or "Cannot find project"

### ✅ Solutions

#### 1. Login to Correct Account
```bash
vercel logout
vercel login

# Choose to login with GitHub/GitLab/Email
```

#### 2. Verify Project Access
1. Go to [vercel.com](https://vercel.com)
2. Check you can see the project in dashboard
3. If not, ask project owner to invite you

#### 3. Reset Authentication
```bash
# Remove saved credentials
vercel unlink

# Re-link project
vercel link
```

---

## Quick Fixes - Copy & Paste

### Fix #1: Rebuild and Redeploy
```bash
cd frontend
npm ci
npm run build
npm run start  # Test locally first

# Then deploy
vercel deploy --prod
```

### Fix #2: Update Environment Variables
```bash
# Pull current env vars
vercel env pull

# Edit the .env file with correct values
# Then push back
vercel env

# Redeploy (changes take effect on new deploy)
vercel deploy --prod
```

### Fix #3: Clear Cache and Rebuild
```bash
# Rebuild without cache
vercel deploy --prod --force

# Or use CLI
vercel rebuild
```

### Fix #4: Rollback to Previous Version
```bash
vercel rollback
```

---

## Debugging Checklist

- [ ] Project exists in Vercel dashboard
- [ ] Latest deployment shows "Ready" status
- [ ] `NEXT_PUBLIC_API_URL` is set in environment variables
- [ ] Backend API is accessible: `curl $NEXT_PUBLIC_API_URL/health`
- [ ] Backend CORS includes your Vercel domain
- [ ] Local build works: `npm run build && npm run start`
- [ ] No errors in browser console (F12)
- [ ] Network tab shows successful API responses (not 404/500)

---

## View Detailed Logs

```bash
# Vercel build and deployment logs
vercel logs

# Latest deployment logs
vercel logs --tail

# Follow logs in real-time
vercel logs --follow

# Get specific deployment logs
vercel logs [deployment-url]
```

---

## Test Deployment Quickly

```bash
# After deployment, test with curl
VERCEL_URL=$(vercel url)
curl $VERCEL_URL

# Should return HTML of your site

# Test API connection from your app
curl "$VERCEL_URL/api/v1/health"
# or wherever your API endpoint is proxied
```

---

## Still Having Issues?

1. **Check all logs:**
   - Vercel dashboard build logs
   - Browser console (F12)
   - Network tab errors
   - `vercel logs` command

2. **Verify environment:**
   - Backend is running and accessible online
   - CORS properly configured
   - Environment variables set in Vercel

3. **Contact Vercel Support:**
   - https://vercel.com/support
   - Include deployment URL and error details

---

## Reference

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Build Logs:** Project → Deployments → [Click deployment] → Logs
- **Environment Variables:** Project → Settings → Environment Variables
- **Vercel CLI Reference:** `vercel --help`

---

**Last Updated:** February 24, 2026
