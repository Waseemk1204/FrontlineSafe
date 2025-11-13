# Database Setup Guide

## Current Status

✅ Backend code is ready  
✅ Prisma schema is complete  
✅ Environment file (.env) created  
⚠️  **Database services needed**

## Option 1: Docker (Recommended - Easiest)

### Install Docker Desktop
1. Download from: https://www.docker.com/products/docker-desktop
2. Install and start Docker Desktop
3. Wait for Docker to be running

### Start Services
Once Docker is running, execute:
```bash
docker-compose up -d postgres redis
```

This will:
- Start PostgreSQL on port 5432
- Start Redis on port 6379
- Create volumes for data persistence

### Verify Services
```bash
docker ps
```

You should see `frontlinesafe-postgres` and `frontlinesafe-redis` running.

## Option 2: Local Installation

### PostgreSQL
1. Download from: https://www.postgresql.org/download/windows/
2. Install PostgreSQL (default port 5432)
3. Create database:
   ```sql
   CREATE DATABASE frontlinesafe;
   CREATE USER frontlinesafe WITH PASSWORD 'frontlinesafe';
   GRANT ALL PRIVILEGES ON DATABASE frontlinesafe TO frontlinesafe;
   ```
4. Update `.env`:
   ```
   DATABASE_URL=postgresql://frontlinesafe:frontlinesafe@localhost:5432/frontlinesafe?schema=public
   ```

### Redis
1. Download from: https://github.com/microsoftarchive/redis/releases
   OR use WSL: `wsl --install` then `sudo apt-get install redis-server`
2. Start Redis server
3. Verify: `redis-cli ping` (should return PONG)

## Option 3: Cloud Services (For Development)

### PostgreSQL (Supabase - Free Tier)
1. Sign up at: https://supabase.com
2. Create new project
3. Get connection string from Settings > Database
4. Update `.env` `DATABASE_URL` with your Supabase connection string

### Redis (Redis Cloud - Free Tier)
1. Sign up at: https://redis.com/try-free/
2. Create free database
3. Get connection URL
4. Update `.env` `REDIS_URL` with your Redis Cloud URL

## After Database is Running

Once PostgreSQL and Redis are available, run:

```bash
# 1. Run migrations
npm run prisma:migrate

# 2. Seed demo data
npm run prisma:seed

# 3. Start the server
npm run start:dev
```

## Quick Test

After starting the server, test the health endpoint:
```bash
curl http://localhost:3000/api/health
```

Or visit in browser: http://localhost:3000/api/health

## Troubleshooting

### Connection Refused
- Verify PostgreSQL/Redis are running
- Check ports (5432 for Postgres, 6379 for Redis)
- Verify firewall isn't blocking connections

### Authentication Failed
- Check username/password in `.env`
- Verify database user has correct permissions

### Port Already in Use
- Change ports in `.env` or docker-compose.yml
- Or stop the service using the port

