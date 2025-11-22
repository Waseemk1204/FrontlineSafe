# FrontlineSafe Backend Setup Guide

## Quick Start

### 1. Prerequisites

- Node.js 20+ installed
- PostgreSQL 15+ running (or use Docker)
- Redis 7+ running (or use Docker)
- npm or yarn

### 2. Installation

```bash
cd backend
npm install
```

### 3. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure:

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string  
- `JWT_SECRET` - Generate a secure random string
- `JWT_REFRESH_SECRET` - Generate another secure random string

**Optional (for full functionality):**
- `S3_*` - AWS S3 or DigitalOcean Spaces credentials
- `STRIPE_SECRET_KEY` - Stripe API key (test mode: `sk_test_...`)
- `SENDGRID_API_KEY` - For email notifications
- `SLACK_WEBHOOK_URL` - For Slack notifications

### 4. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed demo data (Acme Manufacturing, users, templates)
npm run prisma:seed
```

### 5. Start Development Server

```bash
npm run start:dev
```

The API will be available at:
- API: `http://localhost:3000/api`
- Swagger Docs: `http://localhost:3000/api/docs`
- Health Check: `http://localhost:3000/api/health`

## Using Docker

### Start all services:

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379
- Backend API on port 3000

### Run migrations in Docker:

```bash
docker-compose exec app npm run prisma:migrate
docker-compose exec app npm run prisma:seed
```

## Testing the API

### 1. Sign Up

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Company",
    "email": "admin@test.com",
    "name": "Admin User",
    "password": "SecurePass123!"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "SecurePass123!"
  }'
```

Save the `accessToken` from the response.

### 3. Create an Incident

```bash
curl -X POST http://localhost:3000/api/incidents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "companyId": "YOUR_COMPANY_ID",
    "siteId": "YOUR_SITE_ID",
    "type": "hazard",
    "severity": "medium",
    "description": "Spilled liquid on floor",
    "reporterName": "John Doe"
  }'
```

### 4. Get Presigned Upload URL

```bash
curl -X POST http://localhost:3000/api/uploads/presign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "filename": "photo.jpg",
    "contentType": "image/jpeg"
  }'
```

Use the `uploadUrl` to upload directly to S3, then include `fileUrl` in incident creation.

## Demo Data

After running `npm run prisma:seed`, you'll have:

- **Company**: Acme Manufacturing
- **Sites**: Main Production Facility, Warehouse & Distribution
- **Users**:
  - Yusuf Ahmed (admin) - yusuf@acmemanufacturing.com
  - Aisha Patel (manager) - aisha@acmemanufacturing.com
  - Raj Kumar (supervisor) - raj@acmemanufacturing.com
- **Password**: `password123` for all demo users
- **Templates**: 3 inspection templates

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running: `pg_isready`
- Check `DATABASE_URL` format: `postgresql://user:password@host:port/database?schema=public`
- Ensure database exists

### Redis Connection Issues

- Verify Redis is running: `redis-cli ping`
- Check `REDIS_URL` format: `redis://host:port`

### Prisma Issues

- Run `npm run prisma:generate` after schema changes
- Check migration status: `npx prisma migrate status`

### Port Already in Use

- Change `PORT` in `.env` file
- Or stop the process using port 3000

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT secrets (generate with: `openssl rand -base64 32`)
3. Configure production database
4. Set up production S3 bucket
5. Configure Stripe webhook endpoint
6. Run migrations: `npm run prisma:migrate:deploy`
7. Build: `npm run build`
8. Start: `npm run start:prod`

## Next Steps

- Explore Swagger docs at `/api/docs`
- Review `architecture.md` for system design
- Check `README.md` for API endpoint documentation
- See `IMPLEMENTATION_SUMMARY.md` for feature overview

