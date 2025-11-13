# FrontlineSafe Backend Architecture

## Overview

FrontlineSafe backend is a production-ready NestJS application implementing a multi-tenant HSE (Health, Safety, Environment) management system.

## Architecture Patterns

### Multi-Tenancy

- **Row-level security**: All data queries are filtered by `companyId`
- **JWT claims**: User's `companyId` is embedded in JWT token
- **Access control**: Guards enforce company-level access restrictions

### Authentication Flow

1. **Signup**: Creates company + first user (admin role)
2. **Login**: Returns JWT access token (15min) + refresh token (7 days, httpOnly cookie)
3. **Refresh**: Uses refresh token to get new access token
4. **Invite Flow**: Admin invites → creates pending invite → user accepts → completes signup

### Offline Sync

- **clientTempId**: Frontend provides temporary IDs for offline-created items
- **Idempotency**: Duplicate requests with same `clientTempId` return existing record
- **Bulk Sync**: `POST /api/sync` accepts array of items for batch processing
- **Mapping**: Returns `{ clientTempId, serverId }[]` for frontend reconciliation

### Presigned Upload Flow

1. Frontend requests presigned URL: `POST /api/uploads/presign`
2. Backend generates S3 presigned PUT URL (1 hour expiry)
3. Frontend uploads directly to S3 using presigned URL
4. Frontend includes `fileUrl` in incident/inspection/CAPA creation

### Inspection → CAPA Auto-Creation

1. Inspection created with item responses
2. Failed items (response = "no" or "failed") trigger CAPA creation
3. Transaction ensures atomicity: inspection + CAPAs created together
4. CAPAs linked to inspection via `originType` and `originId`

### Background Jobs (BullMQ)

- **Queue**: Redis-backed job queue
- **Workers**: Process notifications, escalations
- **Retries**: 3 attempts with exponential backoff
- **Job Types**:
  - `high-severity-incident`: Send Slack/email alerts
  - `capa-reminder`: Send reminder emails N days before due
  - `capa-escalation`: Send escalation emails M days after due
  - `stripe-webhook`: Process Stripe events asynchronously

### CAPA Escalation Cron

- **Schedule**: Runs hourly
- **Reminder**: Finds CAPAs due within N days, sends reminder emails
- **Escalation**: Finds overdue CAPAs (past due > M days), sends escalation emails

### Billing Integration (Stripe)

1. **Customer Creation**: `POST /api/billing/create-customer`
2. **Subscription**: `POST /api/billing/create-subscription` with payment method
3. **Webhooks**: Process `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`
4. **Async Processing**: Webhooks queued and processed via BullMQ

## Database Schema

### Key Models

- **Company**: Multi-tenant root entity
- **Site**: Physical locations within company
- **User**: Users belong to company, have roles (WORKER, SUPERVISOR, MANAGER, ADMIN)
- **Incident**: Safety incidents with photos, coordinates, severity
- **Inspection**: Inspection instances from templates
- **InspectionTemplate**: Reusable checklist templates (JSON schema)
- **Capa**: Corrective actions with status, priority, due dates
- **Document**: Document vault with versioning
- **AuditLog**: Append-only audit trail

### Indexes

- `companyId` on all tenant-scoped tables
- `companyId + createdAt` for time-series queries
- `companyId + clientTempId` for idempotency checks
- `dueDate` on CAPAs for escalation queries

## Security

### Authentication
- JWT access tokens (short-lived: 15min)
- Refresh tokens (long-lived: 7 days, httpOnly cookies)
- Password hashing with bcrypt (10 rounds)

### Authorization
- Role-based access control (RBAC)
- Guards: `JwtAuthGuard`, `RolesGuard`
- Decorators: `@CurrentUser()`, `@Roles()`, `@CompanyId()`

### Input Validation
- `class-validator` DTOs on all endpoints
- Whitelist validation (strip unknown properties)
- Type transformation

### Rate Limiting
- Redis-based rate limiting
- Per-IP and per-user limits
- Configurable TTL and max requests

### Security Headers
- Helmet.js for security headers
- CORS configured for allowed origins
- CSRF protection for cookie-based auth

## API Design

### RESTful Conventions
- Resource-based URLs
- HTTP methods: GET, POST, PATCH, DELETE
- Status codes: 200, 201, 204, 400, 401, 403, 404, 500

### Error Handling
- Global exception filter
- Structured error responses
- Validation error details

### Documentation
- Swagger/OpenAPI auto-generated
- Available at `/api/docs`
- Bearer token authentication in Swagger UI

## Deployment

### Docker
- Multi-stage build for optimized image size
- Non-root user for security
- Health checks for dependencies

### CI/CD
- GitHub Actions pipeline
- Lint → Test → Build → Docker image
- Automated testing on PRs

### Environment Variables
- `.env` for local development
- `.env.example` as template
- Production: Use secrets management (AWS Secrets Manager, etc.)

## Monitoring & Observability

### Logging
- Structured JSON logs
- Correlation IDs for request tracing
- Log levels: error, warn, log, debug, verbose

### Health Checks
- `/health` endpoint
- Checks: Database, Redis, S3 connectivity
- Returns service status

### Metrics
- `/api/metrics` endpoint
- KPIs: incidents (30d/90d), open CAPAs, inspections, near-miss ratio
- Charts: top hazard types

## Testing Strategy

### Unit Tests
- Service layer tests
- Mock dependencies
- Target: ≥80% coverage

### Integration Tests
- Database integration
- API endpoint tests
- Key flows: signup, incident creation, presign, inspection→CAPA

### E2E Tests
- Full request/response cycles
- Authentication flows
- Multi-step workflows

## Future Enhancements

- [ ] Real-time notifications (WebSockets)
- [ ] Advanced analytics and reporting
- [ ] Mobile app API optimizations
- [ ] GraphQL API option
- [ ] Multi-language support
- [ ] Advanced search (Elasticsearch)
- [ ] File processing pipeline (image optimization, PDF generation)

