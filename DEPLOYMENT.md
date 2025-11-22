# Deployment Guide

## Environment Variables

To deploy this application, you need to set up the following environment variables in your Vercel project settings.

### Backend (Supabase & App Config)
These variables are required for the backend to function.

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Supabase PostgreSQL Connection String | `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres` |
| `JWT_SECRET` | Secret for signing Access Tokens | `your-super-secret-jwt-key` |
| `JWT_REFRESH_SECRET` | Secret for signing Refresh Tokens | `your-super-secret-refresh-key` |
| `FRONTEND_ORIGIN` | URL of the deployed frontend | `https://your-app.vercel.app` |
| `NODE_ENV` | Environment mode | `production` |

### Frontend
These variables are built into the frontend.

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | URL of the backend API | `https://your-app.vercel.app/api` (if hosting together) or `https://your-backend.railway.app/api` |

## Vercel Deployment Steps

1.  **Push to GitHub**: Ensure your code is pushed to the repository.
2.  **Import Project**: Go to Vercel Dashboard > Add New > Project > Import `FrontlineSafe`.
3.  **Configure Project**:
    - **Framework Preset**: Vite
    - **Root Directory**: `./`
    - **Environment Variables**: Add the variables listed above.
4.  **Deploy**: Click Deploy.

### Backend on Vercel (Serverless)
To deploy the NestJS backend as Vercel Serverless Functions, you may need to add a `vercel.json` configuration or use a dedicated backend host (like Railway or Render) if the serverless limits (execution time, payload size) are too restrictive for your use case.

For this repository, the `vercel.json` is configured to handle Single Page Application (SPA) routing for the frontend.
