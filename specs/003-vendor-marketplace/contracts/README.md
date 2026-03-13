# API Contracts: Vendor Marketplace Module

**Feature**: `003-vendor-marketplace`  
**Purpose**: REST API contracts for vendor management operations consumed by Angular frontend

---

## Available Contracts

### [vendor-api.md](./vendor-api.md)

**Base Path**: `/api/vendors`  
**Consumer**: Angular `VendorService`  
**Authentication**: Platform Administrator role required

**Endpoints**:
- `GET /api/vendors` - List and search vendors with pagination
- `GET /api/vendors/{vendorId}` - Get vendor details with status history
- `POST /api/vendors` - Create new vendor
- `PATCH /api/vendors/{vendorId}` - Update vendor profile
- `PATCH /api/vendors/{vendorId}/status` - Update vendor status
- `GET /api/vendors/{vendorId}/status-history` - Get vendor status history

**Key Features**:
- Email uniqueness validation
- Real-time search and filtering
- Status management with audit trail
- Pagination support
- Comprehensive error handling

---

## Contract Guidelines

### Request/Response Format

All API contracts follow these standards:

**Success Response Structure**:
```json
{
  "status": "success",
  "data": { /* endpoint-specific payload */ },
  "meta": { /* response metadata */ }
}
```

**Error Response Structure**:
```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "field": "fieldName",  // optional
    "details": { /* additional context */ }  // optional
  },
  "meta": { /* response metadata */ }
}
```

### Common Headers

**Request Headers**:
- `Authorization: Bearer <token>` - Required for all endpoints
- `Content-Type: application/json` - Required for POST/PATCH/PUT
- `Accept: application/json` - Required for all endpoints

**Response Headers**:
- `Content-Type: application/json`
- `X-RateLimit-Limit` - Maximum requests per window
- `X-RateLimit-Remaining` - Remaining requests in current window
- `X-RateLimit-Reset` - Timestamp when limit resets

### Data Formats

- **Timestamps**: ISO 8601 with UTC timezone (`2026-03-13T15:45:30Z`)
- **UUIDs**: RFC 4122 version 4 format
- **Email**: RFC 5322 compliant, case-insensitive validation
- **Phone**: International format, flexible validation

### Authentication & Authorization

All endpoints require:
1. Valid Bearer token in Authorization header
2. Token associated with Platform Administrator role
3. Active, non-expired session

### Error Handling

Standard HTTP status codes:
- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Validation error or malformed request
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource does not exist
- `409 Conflict` - Constraint violation (e.g., duplicate email)
- `500 Internal Server Error` - Server error

### Rate Limiting

Rate limits are enforced per user:
- **Read operations** (GET): 100 requests/minute
- **Write operations** (POST/PATCH): 30 requests/minute
- **Status updates**: 20 requests/minute

### Pagination

List endpoints support pagination:
- `page`: 1-indexed page number (default: 1)
- `pageSize`: Items per page (default: 20, max: 100)
- Response includes `meta.totalItems`, `meta.totalPages`, `meta.hasNext`, `meta.hasPrevious`

### Search & Filtering

Search endpoints support:
- Case-insensitive partial matching
- Multiple field search (vendor name, company name, email)
- Status filtering
- Sorting by multiple fields
- SQL injection protection via input sanitization

---

## Integration Notes

### Frontend Service Integration

Angular services should:
- Use typed models from `src/app/models/`
- Handle all error codes with user-friendly messages
- Implement retry logic for 5xx errors
- Cache responses where appropriate
- Show loading states during API calls

### Mock Data for Development

JSON Server (`db.json`) provides mock endpoints during development:
- Matches production API structure
- Supports pagination, search, and filtering
- Includes sample vendor data
- Suitable for frontend development without backend dependency

### Testing

Contract testing should verify:
- Request/response schema compliance
- Required field validation
- Error response formatting
- Authentication/authorization enforcement
- Rate limiting behavior
- Pagination correctness

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-13 | Initial vendor API contract |

---

## Related Documentation

- [Feature Specification](../spec.md)
- [Data Model](../data-model.md)
- [Implementation Plan](../plan.md)
- [Tasks](../tasks.md)
