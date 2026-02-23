# Vercel Deployment Quick Start - Sport Milliy Portali

## 🚀 Deploy in 5 Minutes

### For Windows Users:
```bash
cd sport-milliy-portali
scripts\deploy-vercel.bat
```

### For Mac/Linux Users:
```bash
cd sport-milliy-portali
chmod +x scripts/deploy-vercel.sh
bash scripts/deploy-vercel.sh
```

---

## ⚙️ What You Need Before Deployment

### 1. Backend API Running Online
Your backend must be accessible from the internet:
```bash
# Test this works
curl https://your-backend-url.com/api/v1/health

# Should return: {"status": "healthy"}
```

### 2. Vercel Account
- Create free account: https://vercel.com

### 3. Your Domain/URL
Where your backend API is hosted. Example:
- `https://api.yourdomain.com`
- `https://your-server.com:8000`

---

## 📋 Step-by-Step Deployment

### Step 1: Prepare Your Environment

```bash
# Navigate to your project
cd sport-milliy-portali

# Copy environment example
cd frontend
cp .env.local.example .env.local

# For development testing, edit .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
# NEXT_PUBLIC_APP_URL=http://localhost:3000

# Test build locally
npm ci
npm run build
npm run start

# Visit http://localhost:3000 in browser
# If it works, proceed to next step
```

### Step 2: Setup Backend CORS

Update your backend to allow Vercel:

```python
# backend/app/core/config.py

CORS_ORIGINS = [
    "https://yourdomain.com",           # Your domain
    "https://www.yourdomain.com",       
    "https://*.vercel.app",             # All Vercel URLs
]
```

Then restart backend:
```bash
docker-compose restart backend
```

### Step 3: Deploy to Vercel

```bash
# Navigate to frontend folder
cd frontend

# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Deploy to production
vercel deploy --prod
```

### Step 4: Configure Environment Variables

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings → Environment Variables**
4. Add these variables:

| Key | Value | Example |
|-----|-------|---------|
| `NEXT_PUBLIC_API_URL` | Your backend API URL | `https://api.yourdomain.com/api/v1` |
| `NEXT_PUBLIC_APP_URL` | Your frontend URL | `https://yourdomain.com` |

### Step 5: Redeploy with Environment Variables

```bash
# Go back to frontend folder
cd frontend

# Redeploy to apply environment variables
vercel deploy --prod
```

### Step 6: Test Your Deployment

1. Visit your Vercel URL: `https://yourdomain.vercel.app`
2. Open browser **DevTools** (F12)
3. Go to **Network** tab
4. Try using the app (login, load data, etc.)
5. Check that API calls are **successful** (not red, status 200)
6. Check **Console** tab for any error messages

---

## 🔍 Troubleshooting

### ❌ "Deployment not found"
```bash
# Verify you're linked to the right project
vercel projects

# Re-link if needed
vercel unlink
vercel link
```

### ❌ "API calls failing" or "Cannot load data"
1. Check browser console (F12 → Console tab)
2. Look for CORS error
3. Update backend CORS (see Step 2 above)
4. Redeploy backend

### ❌ "Build failed"
```bash
# Build locally first to see the error
npm run build

# Fix any errors, then deploy
vercel deploy --prod
```

### ❌ "White blank page"
- Check browser console for errors
- Check environment variables are set: `vercel env pull`
- Check backend is accessible: `curl $NEXT_PUBLIC_API_URL/health`

---

## 📁 Files Created for Deployment

| File | Purpose |
|------|---------|
| `vercel.json` | Vercel configuration |
| `next.config.mjs` | Updated Next.js config |
| `.env.local.example` | Example environment file |
| `.env.vercel.example` | Example for Vercel variables |
| `VERCEL_DEPLOYMENT.md` | Detailed deployment guide |
| `VERCEL_TROUBLESHOOTING.md` | Troubleshooting guide |
| `scripts/deploy-vercel.sh` | Auto deployment script (Mac/Linux) |
| `scripts/deploy-vercel.bat` | Auto deployment script (Windows) |

---

## 🎯 Deployment Checklist

Before you deploy, verify:

- [ ] Backend is running and accessible online
- [ ] Backend CORS includes Vercel domain
- [ ] `npm run build` succeeds locally
- [ ] `npm run start` works locally
- [ ] You have a Vercel account
- [ ] API URL is correct in environment
- [ ] No environment variables in `.env.local` (use Vercel dashboard)

---

## 💡 Common Issues & Quick Fixes

### Issue: API calls returning CORS error

**Fix:**
```python
# In backend/app/core/config.py, add your Vercel domain:
CORS_ORIGINS = [
    "https://yourdomain.vercel.app",  # Add this line
]

# Then restart backend:
# docker-compose restart backend
```

### Issue: API returning 404 or 500

**Fix:**
1. Check your API URL in Vercel dashboard
2. Test manually: `curl https://your-api-url.com/api/v1/health`
3. If it fails, your backend URL is wrong or backend is down

### Issue: Can't login or load data

**Fix:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login
4. Look for failed API requests
5. Click on them to see the error
6. Fix based on the error message

---

## 📞 Need Help?

1. **Check logs:** `vercel logs`
2. **Check console:** Press F12 in browser, go to Console tab
3. **Check Network:** F12 → Network tab, refresh page
4. **Vercel support:** https://vercel.com/support
5. **Deployment guide:** Read `VERCEL_DEPLOYMENT.md`
6. **Troubleshooting:** Read `VERCEL_TROUBLESHOOTING.md`

---

## 🚀 Useful Commands

```bash
# Check deployment status
vercel projects

# View real-time logs
vercel logs

# Pull environment variables
vercel env pull

# Rollback to previous version
vercel rollback

# Re-link to a project
vercel link

# Logout
vercel logout

# Deploy again
vercel deploy --prod
```

---

## ✅ What's Next After Deployment?

1. ✅ Verify site loads: `https://yourdomain.vercel.app`
2. ✅ Test API calls work
3. ✅ Setup custom domain (optional)
4. ✅ Setup automatic deployments from GitHub
5. ✅ Monitor in Vercel dashboard

---

## 🎓 Learn More

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Guide:** https://nextjs.org/docs
- **Deployment Troubleshooting:** `VERCEL_TROUBLESHOOTING.md`
- **Full Deployment Guide:** `VERCEL_DEPLOYMENT.md`

---

**Last Updated:** February 24, 2026  
**Status:** Ready for Vercel Deployment ✅
