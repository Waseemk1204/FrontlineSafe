# Deployment Checklist

## ✅ Pre-Deployment

- [x] Code compiles (`npm run build`)
- [x] Dependencies installed
- [x] Prisma schema migrated
- [x] Environment variables documented

## 🚀 Railway Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Create Railway Project
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. **Important**: Set "Root Directory" to `backend`

### 3. Configure Environment Variables

In Railway dashboard → Your Service → Variables:

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
FRONTEND_ORIGIN=https://your-frontend.com
API_PREFIX=api
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

**Generate Secrets:**
```bash
# Run these in your terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Deploy Settings

Railway should auto-detect:
- **Build Command**: `npm install && npm run prisma:generate && npm run build`
- **Start Command**: `npm run start:prod`

If not, set manually in Settings → Deploy.

### 5. Monitor Deployment

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Watch **Build Logs** for:
   - ✅ `npm install` success
   - ✅ `prisma generate` success
   - ✅ `nest build` success
4. Watch **Deploy Logs** for:
   - ✅ `[Nest] Starting Nest application...`
   - ✅ `Application is running on: http://0.0.0.0:3000`
   - ❌ Any error messages

### 6. Test Your Deployment

Once deployed, Railway gives you a URL like:
`https://your-app-name.up.railway.app`

Test endpoints:
- Health: `https://your-app-name.up.railway.app/api/health`
- Swagger: `https://your-app-name.up.railway.app/api/docs`

## 🔍 What to Look For in Logs

### Build Logs Should Show:
```
✓ Installing dependencies
✓ Running prisma generate
✓ Building NestJS application
✓ Build successful
```

### Deploy Logs Should Show:
```
[Nest] Starting Nest application...
[Nest] InstanceLoader AppModule dependencies initialized
[Nest] Application is running on: http://0.0.0.0:3000
```

### Common Errors to Watch For:

1. **Module not found**: Missing dependency
2. **Cannot connect to database**: Check DATABASE_URL
3. **Cannot connect to Redis**: Check REDIS_URL
4. **Port already in use**: Railway handles this automatically
5. **Prisma client not generated**: Build command issue

## 📊 After Successful Deployment

1. ✅ Test health endpoint
2. ✅ Test Swagger docs
3. ✅ Test login endpoint
4. ✅ Share the logs with me if there are any issues!

## 🆘 If Deployment Fails

1. **Copy the full error from logs**
2. **Check which step failed** (build vs deploy)
3. **Share the error message** and I'll help fix it
4. **Common fixes**:
   - Missing env vars → Add them
   - Build error → Check TypeScript compilation
   - Runtime error → Check module imports

---

**The deployment logs will show us exactly what's wrong!** 🎯

