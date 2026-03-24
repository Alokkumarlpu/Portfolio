# CORS & Production Deployment Fix Guide

## Problem Summary
- Frontend (Vercel) cannot communicate with backend (Render)
- CORS errors: "No 'Access-Control-Allow-Origin' header"
- 500 Internal Server Errors on API routes

## Solution Overview
Updated CORS configuration and environment variables for production.

---

## Part 1: Render (Backend) Setup

### Step 1: Update Environment Variables in Render

1. Go to https://dashboard.render.com
2. Click your **Portfolio Backend** service
3. Go to **Environment** tab
4. Update/Add these variables:

```
MONGO_URI=mongodb+srv://alok_db:kwGSgzutsLVsLgqK@cluster0.9nogei1.mongodb.net/?appName=Cluster0
JWT_SECRET=acfb83cbc248dbf1ce4258af7b8581089b4b3ad26af4f7bc95d205a4962b9f5f
PORT=5000
EMAIL_USER=test.work5681@gmail.com
EMAIL_PASS=klwfizoedmtzlpyf
CLIENT_URL=https://portfolio-alok-kr.vercel.app
CORS_ORIGINS=https://portfolio-alok-kr.vercel.app,http://localhost:5173,http://127.0.0.1:5173
CLOUDINARY_CLOUD_NAME=dbiwmqvpo
CLOUDINARY_API_KEY=785593557264721
CLOUDINARY_API_SECRET=4551juE5bCPG_IhgQ_6P3qBcESQ
NODE_ENV=production
```

### Step 2: Redeploy Backend
- Click "Manual Deploy" or wait for automatic redeploy from GitHub
- Watch the logs for startup messages

### Step 3: Verify Backend is Working
- Test: `curl https://portfolio-backend-0l58.onrender.com/api/health`
- Should return: `{"status":"ok","message":"Server is running"...}`

---

## Part 2: Vercel (Frontend) Setup

### Step 1: Update Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Click your **Portfolio** project
3. Go to **Settings** → **Environment Variables**
4. Update/Add these variables:

**For Production:**
```
VITE_API_URL=https://portfolio-backend-0l58.onrender.com/api
```

**For Preview & Development:**
```
VITE_API_URL=https://portfolio-backend-0l58.onrender.com/api
```

### Step 2: Redeploy Frontend
- Push a commit to main: `git add . && git commit -m "trigger redeploy"`
- Or click "Redeploy" in Vercel dashboard
- Wait for build to complete

### Step 3: Verify Environment Variables
1. Visit https://portfolio-alok-kr.vercel.app
2. Open DevTools → Console
3. Look for logs:
   ```
   🔧 API Configuration:
      VITE_API_URL: https://portfolio-backend-0l58.onrender.com/api
      Normalized Base: https://portfolio-backend-0l58.onrender.com/api
   ```

---

## Part 3: Test the Integration

### Test 1: Check CORS Headers
```bash
curl -H "Origin: https://portfolio-alok-kr.vercel.app" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  https://portfolio-backend-0l58.onrender.com/api/profile
```

Should return headers like:
```
Access-Control-Allow-Origin: https://portfolio-alok-kr.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
```

### Test 2: Check API Connectivity
In browser console at https://portfolio-alok-kr.vercel.app, run:
```javascript
fetch('https://portfolio-backend-0l58.onrender.com/api/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend OK:', d))
  .catch(e => console.error('❌ Backend Error:', e))
```

### Test 3: Try Loading Profile Data
In browser console, run:
```javascript
fetch('https://portfolio-backend-0l58.onrender.com/api/profile', {
  headers: { 'Content-Type': 'application/json' }
})
  .then(r => r.json())
  .then(d => console.log('✅ Profile:', d))
  .catch(e => console.error('❌ Error:', e))
```

### Test 4: Try Login
```javascript
fetch('https://portfolio-backend-0l58.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'password123' })
})
  .then(r => r.json())
  .then(d => console.log('✅ Login:', d))
  .catch(e => console.error('❌ Error:', e))
```

---

## What Was Fixed

1. ✅ **CORS Configuration**
   - Added fallback CORS headers middleware
   - Normalized origin URLs (removed trailing slashes)
   - Explicit allow origin list configuration

2. ✅ **Environment Variables**
   - Added `CORS_ORIGINS` to backend
   - Fixed `CLIENT_URL` (removed trailing slash)
   - Fixed `VITE_API_URL` backend URL
   - Created `.env.production` for frontend reference

3. ✅ **Double CORS Coverage**
   - Express CORS middleware
   - Manual CORS header fallback
   - Both handle preflight OPTIONS requests

---

## Troubleshooting

### Still Getting CORS Errors?
1. ✅ Check Render environment variables are set
2. ✅ Check Vercel environment variables are set
3. ✅ Wait 5 minutes for services to fully deploy
4. ✅ Hard refresh browser (Ctrl+Shift+R)
5. ✅ Check Render logs for startup errors: `tail -f ~/*.log`

### 500 Errors from Backend?
1. Check Render logs for MongoDB connection errors
2. Verify `MONGO_URI` is correct
3. Check MongoDB Atlas network access allows Render IP

### Cloudinary Not Working?
1. Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in Render
2. Test with curl: `curl https://portfolio-backend-0l58.onrender.com/api/health`

### Login Not Working?
1. Check JWT token in localStorage
2. Verify admin user exists in MongoDB
3. Check auth middleware in logs

---

## Local Development

For local testing:
```bash
# Terminal 1: Backend
cd server
npm install
node server.js

# Terminal 2: Frontend
cd client
npm install
npm run dev
```

Visit http://localhost:5173

Backend will use CORS_ORIGINS with localhost entries automatically.
