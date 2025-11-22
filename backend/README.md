# FrontlineSafe Backend

Production-ready HSE (Health, Safety, Environment) backend API built with NestJS, TypeScript, PostgreSQL, and Redis.

## Features

- 🔐 **Authentication & Authorization**: JWT with refresh tokens, role-based access control (RBAC)
- 🏢 **Multi-tenancy**: Company-based row-level security
- 📋 **Incidents**: Create, list, and manage safety incidents with offline sync support
- ✅ **Inspections**: Checklist templates and inspection instances with auto-CAPA generation
- 📝 **CAPAs**: Corrective and Preventive Actions with escalation workflows
- 📄 **Documents**: Document vault with versioning
- 📊 **Metrics**: KPI dashboards and analytics
- 💳 **Billing**: Stripe integration for subscriptions
- 🔄 **Background Jobs**: BullMQ for async processing (notifications, escalations)
- 📤 **File Uploads**: Presigned S3 URLs for secure file uploads
- 🔒 **Security**: Rate limiting, input validation, CORS, Helmet headers

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache/Jobs**: Redis + BullMQ
- **Storage**: AWS S3 (or DigitalOcean Spaces)
- **Billing**: Stripe
- **Email**: SendGrid
- **Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- npm or yarn

## Quick Start

### 1. Clone and Install

```bash
cd backend
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update the following variables:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET` & `JWT_REFRESH_SECRET`: Generate secure random strings
- `S3_*`: AWS S3 or DigitalOcean Spaces credentials
- `STRIPE_SECRET_KEY`: Stripe API key (test mode for development)
- `SENDGRID_API_KEY`: SendGrid API key (optional for development)

### 3. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed demo data
npm run prisma:seed
```

### 4. Run Development Server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api`
Swagger documentation at `http://localhost:3000/api/docs`

## Docker Setup

### Using Docker Compose

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379
- Backend API on port 3000

### Run Migrations in Docker

```bash
docker-compose exec app npm run prisma:migrate
docker-compose exec app npm run prisma:seed
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Sign up new user and company
- `POST /api/auth/login` - Login (returns JWT + refresh token)
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/invite` - Invite users (Admin/Manager)
- `POST /api/auth/accept-invite` - Accept invite and complete signup

### Companies & Sites
- `GET /api/companies` - List companies
- `POST /api/companies` - Create company (Admin)
- `GET /api/companies/:id` - Get company details
- `POST /api/companies/:companyId/sites` - Create site
- `GET /api/companies/:companyId/sites` - List sites

### Incidents
- `POST /api/incidents` - Create incident (supports offline sync with clientTempId)
- `GET /api/incidents` - List incidents with filters
- `GET /api/incidents/:id` - Get incident details

### Inspections
- `POST /api/inspections/templates` - Create template (Admin/Manager)
- `GET /api/inspections/templates` - List templates
- `POST /api/inspections` - Create inspection instance
- `GET /api/inspections` - List inspections

### CAPAs
- `POST /api/capas` - Create CAPA
- `GET /api/capas` - List CAPAs
- `GET /api/capas/:id` - Get CAPA details
- `PATCH /api/capas/:id` - Update CAPA
- `POST /api/capas/:id/comments` - Add comment
- `POST /api/capas/:id/attachments` - Add attachment

### Uploads
- `POST /api/uploads/presign` - Generate presigned S3 URL

### Metrics
- `GET /api/metrics` - Get company KPIs and metrics

### Documents
- `POST /api/documents` - Upload document
- `GET /api/documents` - List documents
- `GET /api/documents/:id` - Get document

### Billing
- `POST /api/billing/create-customer` - Create Stripe customer
- `POST /api/billing/create-subscription` - Create subscription
- `POST /api/billing/webhooks/stripe` - Stripe webhook handler

### Sync
- `POST /api/sync` - Bulk sync offline items

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## Production Deployment

### 1. Build

```bash
npm run build
```

### 2. Run Migrations

```bash
npm run prisma:migrate:deploy
```

### 3. Start Production Server

```bash
npm run start:prod
```

### Environment Variables for Production

Ensure all production environment variables are set:
- Use strong JWT secrets
- Configure production database
- Set up production S3 bucket
- Configure Stripe webhook secret
- Set `NODE_ENV=production`
- Configure `FRONTEND_ORIGIN` for CORS

## Architecture

See [architecture.md](./architecture.md) for detailed architecture documentation.

## License

Proprietary - All rights reserved

