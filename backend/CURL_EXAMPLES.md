# FrontlineSafe API - cURL Examples

## Authentication

### Sign Up
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Acme Corp",
    "email": "admin@acme.com",
    "name": "Admin User",
    "password": "SecurePass123!"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@acme.com",
    "password": "SecurePass123!"
  }' \
  -c cookies.txt
```

Save the `accessToken` from response. Refresh token is set as httpOnly cookie.

### Refresh Token
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{}'
```

## Companies & Sites

### Create Site
```bash
curl -X POST http://localhost:3000/api/companies/COMPANY_ID/sites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{
    "name": "Main Facility",
    "address": "123 Industrial Blvd",
    "coordsLat": 40.7128,
    "coordsLng": -74.0060
  }'
```

### List Sites
```bash
curl -X GET http://localhost:3000/api/companies/COMPANY_ID/sites \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## Incidents

### Create Incident (with offline sync support)
```bash
curl -X POST http://localhost:3000/api/incidents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{
    "clientTempId": "temp-123",
    "companyId": "COMPANY_ID",
    "siteId": "SITE_ID",
    "type": "hazard",
    "severity": "high",
    "description": "Spilled liquid on floor near production line",
    "coords": {
      "lat": 40.7128,
      "lng": -74.0060
    },
    "photos": ["https://example.com/photo1.jpg"]
  }'
```

### List Incidents (with filters)
```bash
curl -X GET "http://localhost:3000/api/incidents?status=new&from=2024-01-01&page=1&limit=20" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### Get Incident
```bash
curl -X GET http://localhost:3000/api/incidents/INCIDENT_ID \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## Uploads

### Get Presigned URL
```bash
curl -X POST http://localhost:3000/api/uploads/presign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{
    "filename": "incident-photo.jpg",
    "contentType": "image/jpeg"
  }'
```

### Upload to S3 (using presigned URL)
```bash
# Use the uploadUrl from previous response
curl -X PUT "PRESIGNED_UPLOAD_URL" \
  -H "Content-Type: image/jpeg" \
  --data-binary @photo.jpg
```

Then use the `fileUrl` from presign response in incident creation.

## Inspections

### Create Template
```bash
curl -X POST http://localhost:3000/api/inspections/templates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{
    "name": "Daily Safety Check",
    "description": "Standard daily inspection",
    "schema": {
      "items": [
        {
          "id": "1",
          "question": "Are exits clear?",
          "type": "yes_no",
          "required": true
        }
      ]
    }
  }'
```

### Create Inspection
```bash
curl -X POST http://localhost:3000/api/inspections \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{
    "companyId": "COMPANY_ID",
    "siteId": "SITE_ID",
    "templateId": "TEMPLATE_ID",
    "inspectorId": "USER_ID",
    "responses": [
      {
        "itemId": "1",
        "response": "no",
        "comment": "Exit blocked by equipment",
        "photoUrls": ["https://example.com/photo.jpg"]
      }
    ]
  }'
```

Failed items (response="no") automatically create CAPAs.

## CAPAs

### Create CAPA
```bash
curl -X POST http://localhost:3000/api/capas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{
    "title": "Fix blocked exit",
    "description": "Remove equipment blocking emergency exit",
    "ownerId": "USER_ID",
    "dueDate": "2024-12-31T00:00:00Z",
    "priority": "high",
    "originType": "inspection",
    "originId": "INSPECTION_ID"
  }'
```

### Update CAPA Status
```bash
curl -X PATCH http://localhost:3000/api/capas/CAPA_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{
    "status": "In_Progress",
    "comment": "Work in progress"
  }'
```

### Add Comment
```bash
curl -X POST http://localhost:3000/api/capas/CAPA_ID/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{
    "content": "Equipment has been moved"
  }'
```

## Documents

### Upload Document
```bash
curl -X POST http://localhost:3000/api/documents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{
    "title": "Safety Manual",
    "fileUrl": "https://example.com/manual.pdf",
    "fileName": "safety-manual.pdf",
    "fileSize": 1024000,
    "mimeType": "application/pdf",
    "tags": ["safety", "manual"],
    "description": "Company safety manual"
  }'
```

Uploading the same title increments version automatically.

## Metrics

### Get Company Metrics
```bash
curl -X GET "http://localhost:3000/api/metrics?from=2024-01-01&to=2024-12-31" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## Exports

### Export Incident Report
```bash
curl -X GET http://localhost:3000/api/export/report/INCIDENT_ID \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## Sync (Offline)

### Bulk Sync
```bash
curl -X POST http://localhost:3000/api/sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{
    "items": [
      {
        "type": "incident",
        "clientTempId": "temp-123",
        "data": {
          "companyId": "COMPANY_ID",
          "siteId": "SITE_ID",
          "type": "hazard",
          "severity": "medium",
          "description": "Offline incident"
        }
      }
    ]
  }'
```

Returns mapping: `{ clientTempId: "temp-123", serverId: "actual-uuid" }`

## Billing

### Create Stripe Customer
```bash
curl -X POST http://localhost:3000/api/billing/create-customer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{
    "email": "billing@acme.com"
  }'
```

### Create Subscription
```bash
curl -X POST http://localhost:3000/api/billing/create-subscription \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{
    "planId": "price_xxx",
    "paymentMethodId": "pm_xxx"
  }'
```

## Users

### Invite Users
```bash
curl -X POST http://localhost:3000/api/auth/invite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{
    "emails": ["user1@acme.com", "user2@acme.com"],
    "role": "WORKER"
  }'
```

### List Users
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## Health Check

```bash
curl -X GET http://localhost:3000/api/health
```

