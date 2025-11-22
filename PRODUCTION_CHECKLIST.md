# Production Deployment Checklist

## ✅ Completed

- [x] Frontend PWA with offline capabilities
- [x] Billing page (Stripe integration ready)
- [x] Reports page with download functionality
- [x] Incidents, Inspections, CAPA management
- [x] Responsive mobile-first UI
- [x] Backend API streamlined (PostgreSQL only, Redis disabled)
- [x] Vercel configuration added (`vercel.json`)
- [x] Environment variables documented (`DEPLOYMENT.md`)

## 🚀 Deployment Steps

### 1. Push to GitHub

Since I cannot authenticate to your GitHub account, please run:

```bash
cd /Users/waseem/Desktop/FrontlineSafe-main
git remote set-url origin https://github.com/Waseemk1204/FrontlineSafe.git
git push -u origin main --force
```

**Note:** Use `--force` only if you're sure this is the correct state to deploy.

### 2. Configure Environment Variables in Vercel

Go to your Vercel project settings and add these variables:

#### Required
- `VITE_API_URL` = `https://your-app.vercel.app/api` (or your backend URL)
- `DATABASE_URL` = `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`
- `JWT_SECRET` = (generate a random secret)
- `JWT_REFRESH_SECRET` = (generate another random secret)
- `FRONTEND_ORIGIN` = `https://your-app.vercel.app`
- `NODE_ENV` = `production`

#### Optional (for full features)
- `STRIPE_SECRET_KEY` = Your Stripe secret key (for billing)
- `SENDGRID_API_KEY` = Your SendGrid API key (for emails)

### 3. Deploy to Vercel

**Option A: GitHub Integration**
- Vercel will auto-deploy on push to `main`

**Option B: Manual Deploy**
```bash
npx vercel --prod
```

## 📋 Environment Variables Summary

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | ✅ | Supabase PostgreSQL connection |
| `JWT_SECRET` | ✅ | Access token signing |
| `JWT_REFRESH_SECRET` | ✅ | Refresh token signing |
| `VITE_API_URL` | ✅ | Backend API endpoint |
| `FRONTEND_ORIGIN` | ✅ | CORS configuration |
| `NODE_ENV` | ✅ | Environment mode |
| `STRIPE_SECRET_KEY` | ⚠️ | Subscription/billing (demo mode without) |
| `SENDGRID_API_KEY` | ⚠️ | Email notifications (disabled without) |

## ⚠️ Known Issues

1. **Authentication not working locally**: The backend login endpoint returned {{CURL_RESULT}} - needs investigation
2. **Redis disabled**: Background jobs (notifications, billing webhooks) are currently disabled
3. **Git push authentication**: Manual push required with your GitHub credentials

## 🔍 Next Steps

1. **Fix authentication** if curl test failed
2. **Push code to GitHub** manually
3. **Run migrations** on Supabase: `cd backend && npm run prisma:migrate:deploy`
4. **Test deployed app** end-to-end on Vercel

## 📞 Support

For issues, check:
- Backend logs: `cd backend && npm run start:dev`
- Frontend console: Browser DevTools
- API documentation: `http://localhost:3000/api/docs`
