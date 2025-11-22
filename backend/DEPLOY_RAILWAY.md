# Deploying to Railway

## Quick Deploy Steps

### 1. Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub (recommended)

### 2. Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Select your `FrontlineSafe` repository
4. Select the `backend` directory as the root

### 3. Add Environment Variables

In Railway dashboard, go to your service → Variables tab, and add:

```
DATABASE_URL=postgresql://postgres:WD1xtCGH8kZkYtoD*@db.dgedwlhfupndyxeymkqf.supabase.co:5432/postgres
REDIS_URL=redis://default:USCoebJHEQ6dd9WQgldeY4Fw8lufKfmJ@redis-14360.c301.ap-south-1-1.ec2.cloud.redislabs.com:14360
JWT_SECRET=your-production-jwt-secret-min-32-chars
JWT_REFRESH_SECRET=your-production-refresh-secret-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=production
PORT=3000
FRONTEND_ORIGIN=https://your-frontend-domain.com
API_PREFIX=api
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

**Important**: Generate secure secrets:
```bash
# Generate JWT secrets (run these commands)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Railway Will Automatically:
- Detect it's a Node.js project
- Run `npm install`
- Run `npm run build` (from railway.json)
- Run `npm run start:prod` to start the server

### 5. Check Logs

Once deployed:
1. Go to your service in Railway
2. Click on "Deployments" tab
3. Click on the latest deployment
4. View "Build Logs" to see compilation
5. View "Deploy Logs" to see runtime errors

### 6. Get Your API URL

Railway will provide a public URL like:
- `https://your-app-name.up.railway.app`

Your API will be at:
- `https://your-app-name.up.railway.app/api`
- `https://your-app-name.up.railway.app/api/health`
- `https://your-app-name.up.railway.app/api/docs`

## What This Will Show Us

✅ **Build Logs**: See if TypeScript compilation succeeds
✅ **Runtime Logs**: See exact error messages when server starts
✅ **Dependency Issues**: See if any modules fail to load
✅ **Connection Issues**: See database/Redis connection errors

## Alternative: Render.com

If Railway doesn't work, we can also try Render.com:
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Set root directory to `backend`
5. Build command: `npm install && npm run build`
6. Start command: `npm run start:prod`

## Next Steps After Deploy

Once deployed, we'll be able to:
1. See the exact error in the logs
2. Fix it quickly
3. Redeploy to test
4. Get a working production API!

