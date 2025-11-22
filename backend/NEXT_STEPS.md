# Next Steps - Getting Started

## ✅ Completed
- ✅ All code implemented and compiled successfully
- ✅ Prisma client generated
- ✅ TypeScript compilation successful

## 🚀 Ready to Run

### Step 1: Set Up Environment

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and configure at minimum:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `JWT_REFRESH_SECRET` - Generate with: `openssl rand -base64 32`

### Step 2: Start Database Services

**Option A: Using Docker Compose (Recommended)**
```bash
docker-compose up -d postgres redis
```

**Option B: Local Services**
- Start PostgreSQL on port 5432
- Start Redis on port 6379

### Step 3: Run Database Migrations

```bash
npm run prisma:migrate
```

This will:
- Create all database tables
- Set up indexes and foreign keys
- Create the initial migration

### Step 4: Seed Demo Data

```bash
npm run prisma:seed
```

This creates:
- Acme Manufacturing company
- 2 sites (Main Production Facility, Warehouse & Distribution)
- 3 users (Yusuf/Aisha/Raj) - password: `password123`
- 3 inspection templates
- Sample incidents

### Step 5: Start Development Server

```bash
npm run start:dev
```

The API will be available at:
- **API Base**: `http://localhost:3000/api`
- **Swagger Docs**: `http://localhost:3000/api/docs`
- **Health Check**: `http://localhost:3000/api/health`

## 🧪 Quick Test

### 1. Check Health
```bash
curl http://localhost:3000/api/health
```

### 2. Sign Up (or use demo user)
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

### 3. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "yusuf@acmemanufacturing.com",
    "password": "password123"
  }'
```

Save the `accessToken` from the response.

### 4. Create Incident
```bash
curl -X POST http://localhost:3000/api/incidents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "companyId": "YOUR_COMPANY_ID",
    "siteId": "YOUR_SITE_ID",
    "type": "hazard",
    "severity": "medium",
    "description": "Test incident",
    "reporterName": "Test User"
  }'
```

## 📚 Documentation

- **Setup Guide**: See `SETUP_GUIDE.md`
- **API Examples**: See `CURL_EXAMPLES.md`
- **Architecture**: See `architecture.md`
- **Swagger UI**: Visit `http://localhost:3000/api/docs` when server is running

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `pg_isready` or check Docker container
- Check `DATABASE_URL` format: `postgresql://user:password@host:port/database?schema=public`
- Ensure database exists

### Redis Connection Issues
- Verify Redis is running: `redis-cli ping` or check Docker container
- Check `REDIS_URL` format: `redis://host:port`

### Port Already in Use
- Change `PORT` in `.env` file
- Or stop the process using port 3000

### Prisma Issues
- Run `npm run prisma:generate` if schema changes
- Check migration status: `npx prisma migrate status`

## 🎯 What's Next?

1. **Configure S3** (for file uploads) - Optional for basic testing
2. **Configure SendGrid** (for emails) - Optional for basic testing
3. **Configure Stripe** (for billing) - Use test mode keys
4. **Expand Tests** - Add more unit and integration tests
5. **Deploy** - Follow production deployment guide in README

## ✨ You're Ready!

The backend is fully functional. Start the server and begin testing the API endpoints!

