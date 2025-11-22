# Deploying to Render.com

## Quick Setup Guide

### 1. Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended)

### 2. Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `Waseemk1204/FrontlineSafe`
3. Select the repository

### 3. Configure Service Settings

**Basic Settings:**
- **Name**: `frontlinesafe-backend` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend` ⚠️ **IMPORTANT**

**Build & Deploy:**
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run prisma:generate && npm run build`
- **Start Command**: `npm run start:prod` ⚠️ **THIS IS WHAT YOU NEED**

**Environment:**
- **Environment**: `Node`

### 4. Environment Variables

Click "Environment" tab and add:

**Required:**
```
DATABASE_URL=postgresql://postgres:WD1xtCGH8kZkYtoD*@db.dgedwlhfupndyxeymkqf.supabase.co:5432/postgres
REDIS_URL=redis://default:USCoebJHEQ6dd9WQgldeY4Fw8lufKfmJ@redis-14360.c301.ap-south-1-1.ec2.cloud.redislabs.com:14360
JWT_SECRET=<generate-secure-32-char-secret>
JWT_REFRESH_SECRET=<generate-secure-32-char-secret>
NODE_ENV=production
PORT=3000
```

**Optional (for full functionality):**
```
FRONTEND_ORIGIN=https://your-frontend-domain.com
API_PREFIX=api
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

**Generate Secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 5. Deploy

1. Click "Create Web Service"
2. Render will:
   - Clone your repository
   - Install dependencies
   - Run build command
   - Start the server with start command

### 6. Monitor Deployment

Watch the **Build Logs** and **Deploy Logs** tabs:
- ✅ Build should show: `npm install`, `prisma generate`, `nest build`
- ✅ Deploy should show: `[Nest] Starting Nest application...`
- ✅ Success: `Application is running on: http://0.0.0.0:3000`

### 7. Get Your API URL

Render will provide a URL like:
- `https://frontlinesafe-backend.onrender.com`

Your API endpoints:
- Health: `https://frontlinesafe-backend.onrender.com/api/health`
- Swagger: `https://frontlinesafe-backend.onrender.com/api/docs`
- API Base: `https://frontlinesafe-backend.onrender.com/api`

## Important Settings Summary

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Build Command** | `npm install && npm run prisma:generate && npm run build` |
| **Start Command** | `npm run start:prod` ⭐ |
| **Environment** | `Node` |

## Troubleshooting

### Build Fails
- Check Root Directory is set to `backend`
- Verify build command includes `prisma:generate`
- Check build logs for specific errors

### Server Won't Start
- Verify `start:prod` command exists in package.json
- Check PORT environment variable (Render sets this automatically)
- Review deploy logs for runtime errors

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check Supabase allows connections from Render's IPs
- Ensure password is URL-encoded if it contains special characters

### Redis Connection Issues
- Verify REDIS_URL format
- Check Redis Cloud allows connections from Render

## Using render.yaml (Alternative)

If you prefer, you can use the `render.yaml` file:

1. In Render dashboard, go to "Blueprints"
2. Click "New Blueprint"
3. Connect your GitHub repo
4. Render will automatically detect `render.yaml` in the `backend` folder

The `render.yaml` file already has the correct start command configured!

---

**Your Start Command**: `npm run start:prod` ✅

