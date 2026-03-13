# Vendor API Contract

**Feature**: Vendor Marketplace Module  
**Base Path**: `/api/vendors`  
**Consumer**: Angular `VendorService`  
**Authentication**: All endpoints require Platform Administrator role

---

## 1) List Vendors

### HTTP Method

`GET`

### Path

`/api/vendors`

### Query Parameters

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| searchTerm | string | No | - | Search across vendor name, company name, and email |
| status | string | No | "All" | Filter by status: "Active", "Inactive", or "All" |
| page | number | No | 1 | Page number (1-indexed) |
| pageSize | number | No | 20 | Items per page (max 100) |
| sortBy | string | No | "vendorName" | Field to sort by |
| sortOrder | string | No | "asc" | Sort direction: "asc" or "desc" |

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | Bearer token with Platform Administrator role |
| Accept | Yes | `application/json` |

### Success Response (200)

```json
{
  "status": "success",
  "data": {
    "vendors": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "vendorName": "Premium Movers Inc",
        "companyName": "Premium Movers Incorporated",
        "contactEmail": "contact@premiummovers.com",
        "contactPhone": "+1-555-123-4567",
        "businessDescription": "Full-service residential and commercial moving company",
        "servicesOffered": "Local moving, Long-distance moving, Packing services",
        "status": "Active",
        "createdAt": "2026-01-15T10:30:00Z",
        "createdBy": "admin-001",
        "updatedAt": "2026-03-10T14:22:00Z",
        "updatedBy": "admin-002"
      },
      {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "vendorName": "Global Relocation Services",
        "companyName": "Global Relocation Services LLC",
        "contactEmail": "info@globalrelocation.com",
        "contactPhone": "+1-555-987-6543",
        "businessDescription": "International relocation and corporate moving specialist",
        "servicesOffered": "International moving, Corporate relocation, Storage solutions",
        "status": "Active",
        "createdAt": "2026-02-01T09:15:00Z",
        "createdBy": "admin-001",
        "updatedAt": "2026-02-01T09:15:00Z",
        "updatedBy": "admin-001"
      }
    ]
  },
  "meta": {
    "currentPage": 1,
    "pageSize": 20,
    "totalItems": 42,
    "totalPages": 3,
    "hasNext": true,
    "hasPrevious": false,
    "timestamp": "2026-03-13T15:45:30Z"
  }
}
```

### Error Responses

**400 Bad Request** - Invalid query parameters

```json
{
  "status": "error",
  "error": {
    "code": "VENDOR_VALIDATION_ERROR",
    "message": "Invalid query parameters",
    "details": {
      "pageSize": "Must be between 1 and 100"
    }
  },
  "meta": {
    "timestamp": "2026-03-13T15:45:30Z"
  }
}
```

**401 Unauthorized** - Missing or invalid authentication

**403 Forbidden** - User lacks Platform Administrator role

**500 Internal Server Error** - Server error

---

## 2) Get Vendor Details

### HTTP Method

`GET`

### Path

`/api/vendors/{vendorId}`

### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| vendorId | string (UUID) | Yes | Unique vendor identifier |

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | Bearer token with Platform Administrator role |
| Accept | Yes | `application/json` |

### Success Response (200)

```json
{
  "status": "success",
  "data": {
    "vendor": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "vendorName": "Premium Movers Inc",
      "companyName": "Premium Movers Incorporated",
      "contactEmail": "contact@premiummovers.com",
      "contactPhone": "+1-555-123-4567",
      "businessDescription": "Full-service residential and commercial moving company",
      "servicesOffered": "Local moving, Long-distance moving, Packing services",
      "status": "Active",
      "createdAt": "2026-01-15T10:30:00Z",
      "createdBy": "admin-001",
      "updatedAt": "2026-03-10T14:22:00Z",
      "updatedBy": "admin-002"
    },
    "statusHistory": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440010",
        "vendorId": "550e8400-e29b-41d4-a716-446655440000",
        "previousStatus": "Active",
        "newStatus": "Inactive",
        "changedAt": "2026-02-20T11:00:00Z",
        "changedBy": "admin-002",
        "reason": "Temporary suspension pending compliance review"
      },
      {
        "id": "880e8400-e29b-41d4-a716-446655440011",
        "vendorId": "550e8400-e29b-41d4-a716-446655440000",
        "previousStatus": "Inactive",
        "newStatus": "Active",
        "changedAt": "2026-03-10T14:22:00Z",
        "changedBy": "admin-002",
        "reason": "Compliance review completed successfully"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-03-13T15:45:30Z",
    "requestId": "req-12345"
  }
}
```

### Error Responses

**404 Not Found** - Vendor does not exist

```json
{
  "status": "error",
  "error": {
    "code": "VENDOR_NOT_FOUND",
    "message": "Vendor with ID '550e8400-e29b-41d4-a716-446655440000' not found"
  },
  "meta": {
    "timestamp": "2026-03-13T15:45:30Z"
  }
}
```

**401 Unauthorized** - Missing or invalid authentication

**403 Forbidden** - User lacks Platform Administrator role

**500 Internal Server Error** - Server error

---

## 3) Create Vendor

### HTTP Method

`POST`

### Path

`/api/vendors`

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | Bearer token with Platform Administrator role |
| Content-Type | Yes | `application/json` |
| Accept | Yes | `application/json` |

### Request Body

```json
{
  "vendorName": "Premium Movers Inc",
  "companyName": "Premium Movers Incorporated",
  "contactEmail": "contact@premiummovers.com",
  "contactPhone": "+1-555-123-4567",
  "businessDescription": "Full-service residential and commercial moving company",
  "servicesOffered": "Local moving, Long-distance moving, Packing services"
}
```

**Required fields**: `vendorName`, `companyName`, `contactEmail`  
**Optional fields**: `contactPhone`, `businessDescription`, `servicesOffered`

### Success Response (201 Created)

```json
{
  "status": "success",
  "data": {
    "vendor": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "vendorName": "Premium Movers Inc",
      "companyName": "Premium Movers Incorporated",
      "contactEmail": "contact@premiummovers.com",
      "contactPhone": "+1-555-123-4567",
      "businessDescription": "Full-service residential and commercial moving company",
      "servicesOffered": "Local moving, Long-distance moving, Packing services",
      "status": "Active",
      "createdAt": "2026-03-13T15:45:30Z",
      "createdBy": "admin-001",
      "updatedAt": "2026-03-13T15:45:30Z",
      "updatedBy": "admin-001"
    }
  },
  "meta": {
    "timestamp": "2026-03-13T15:45:30Z",
    "requestId": "req-12346"
  }
}
```

### Error Responses

**400 Bad Request** - Validation error

```json
{
  "status": "error",
  "error": {
    "code": "VENDOR_VALIDATION_ERROR",
    "message": "Vendor validation failed",
    "field": "contactEmail",
    "details": {
      "contactEmail": "Invalid email format"
    }
  },
  "meta": {
    "timestamp": "2026-03-13T15:45:30Z"
  }
}
```

**409 Conflict** - Duplicate email

```json
{
  "status": "error",
  "error": {
    "code": "VENDOR_EMAIL_DUPLICATE",
    "message": "This email address is already registered to another vendor",
    "field": "contactEmail"
  },
  "meta": {
    "timestamp": "2026-03-13T15:45:30Z"
  }
}
```

**401 Unauthorized** - Missing or invalid authentication

**403 Forbidden** - User lacks Platform Administrator role

**500 Internal Server Error** - Server error

---

## 4) Update Vendor

### HTTP Method

`PATCH`

### Path

`/api/vendors/{vendorId}`

### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| vendorId | string (UUID) | Yes | Unique vendor identifier |

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | Bearer token with Platform Administrator role |
| Content-Type | Yes | `application/json` |
| Accept | Yes | `application/json` |

### Request Body

```json
{
  "vendorName": "Premium Movers International",
  "contactPhone": "+1-555-123-9999",
  "businessDescription": "Full-service residential, commercial, and international moving company"
}
```

**Note**: Only include fields to be updated. At least one field must be provided.

### Success Response (200)

```json
{
  "status": "success",
  "data": {
    "vendor": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "vendorName": "Premium Movers International",
      "companyName": "Premium Movers Incorporated",
      "contactEmail": "contact@premiummovers.com",
      "contactPhone": "+1-555-123-9999",
      "businessDescription": "Full-service residential, commercial, and international moving company",
      "servicesOffered": "Local moving, Long-distance moving, Packing services",
      "status": "Active",
      "createdAt": "2026-01-15T10:30:00Z",
      "createdBy": "admin-001",
      "updatedAt": "2026-03-13T16:00:00Z",
      "updatedBy": "admin-002"
    }
  },
  "meta": {
    "timestamp": "2026-03-13T16:00:00Z",
    "requestId": "req-12347"
  }
}
```

### Error Responses

**400 Bad Request** - Validation error or no fields provided

**404 Not Found** - Vendor does not exist

**409 Conflict** - Email already exists (if email was updated)

**401 Unauthorized** - Missing or invalid authentication

**403 Forbidden** - User lacks Platform Administrator role

**500 Internal Server Error** - Server error

---

## 5) Update Vendor Status

### HTTP Method

`PATCH`

### Path

`/api/vendors/{vendorId}/status`

### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| vendorId | string (UUID) | Yes | Unique vendor identifier |

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | Bearer token with Platform Administrator role |
| Content-Type | Yes | `application/json` |
| Accept | Yes | `application/json` |

### Request Body

```json
{
  "status": "Inactive",
  "reason": "Temporary suspension pending compliance review"
}
```

**Required fields**: `status`  
**Optional fields**: `reason`

### Success Response (200)

```json
{
  "status": "success",
  "data": {
    "vendor": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "vendorName": "Premium Movers Inc",
      "companyName": "Premium Movers Incorporated",
      "contactEmail": "contact@premiummovers.com",
      "contactPhone": "+1-555-123-4567",
      "businessDescription": "Full-service residential and commercial moving company",
      "servicesOffered": "Local moving, Long-distance moving, Packing services",
      "status": "Inactive",
      "createdAt": "2026-01-15T10:30:00Z",
      "createdBy": "admin-001",
      "updatedAt": "2026-03-13T16:05:00Z",
      "updatedBy": "admin-002"
    },
    "statusChange": {
      "id": "990e8400-e29b-41d4-a716-446655440012",
      "vendorId": "550e8400-e29b-41d4-a716-446655440000",
      "previousStatus": "Active",
      "newStatus": "Inactive",
      "changedAt": "2026-03-13T16:05:00Z",
      "changedBy": "admin-002",
      "reason": "Temporary suspension pending compliance review"
    }
  },
  "meta": {
    "timestamp": "2026-03-13T16:05:00Z",
    "requestId": "req-12348"
  }
}
```

### Error Responses

**400 Bad Request** - Invalid status value or same as current status

```json
{
  "status": "error",
  "error": {
    "code": "VENDOR_VALIDATION_ERROR",
    "message": "Status is already Inactive",
    "field": "status"
  },
  "meta": {
    "timestamp": "2026-03-13T16:05:00Z"
  }
}
```

**404 Not Found** - Vendor does not exist

**401 Unauthorized** - Missing or invalid authentication

**403 Forbidden** - User lacks Platform Administrator role

**500 Internal Server Error** - Server error

---

## 6) Get Vendor Status History

### HTTP Method

`GET`

### Path

`/api/vendors/{vendorId}/status-history`

### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| vendorId | string (UUID) | Yes | Unique vendor identifier |

### Query Parameters

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| limit | number | No | 10 | Maximum number of history entries to return |

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | Bearer token with Platform Administrator role |
| Accept | Yes | `application/json` |

### Success Response (200)

```json
{
  "status": "success",
  "data": {
    "history": [
      {
        "id": "990e8400-e29b-41d4-a716-446655440012",
        "vendorId": "550e8400-e29b-41d4-a716-446655440000",
        "previousStatus": "Active",
        "newStatus": "Inactive",
        "changedAt": "2026-03-13T16:05:00Z",
        "changedBy": "admin-002",
        "reason": "Temporary suspension pending compliance review"
      },
      {
        "id": "880e8400-e29b-41d4-a716-446655440011",
        "vendorId": "550e8400-e29b-41d4-a716-446655440000",
        "previousStatus": "Inactive",
        "newStatus": "Active",
        "changedAt": "2026-03-10T14:22:00Z",
        "changedBy": "admin-002",
        "reason": "Compliance review completed successfully"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-03-13T16:10:00Z",
    "totalEntries": 2
  }
}
```

### Error Responses

**404 Not Found** - Vendor does not exist

**401 Unauthorized** - Missing or invalid authentication

**403 Forbidden** - User lacks Platform Administrator role

**500 Internal Server Error** - Server error

---

## Error Handling Summary

### Standard Error Response Format

All error responses follow this structure:

```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "field": "fieldName",  // optional, for validation errors
    "details": {}  // optional, additional context
  },
  "meta": {
    "timestamp": "2026-03-13T16:15:00Z",
    "requestId": "req-12349"  // optional
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VENDOR_EMAIL_DUPLICATE | 409 | Contact email already exists |
| VENDOR_NOT_FOUND | 404 | Vendor ID does not exist |
| VENDOR_VALIDATION_ERROR | 400 | Field validation failed |
| VENDOR_UNAUTHORIZED | 401 | Missing or invalid authentication |
| VENDOR_FORBIDDEN | 403 | User lacks Platform Administrator role |
| VENDOR_SERVER_ERROR | 500 | Internal server error |
| VENDOR_INVALID_STATUS | 400 | Invalid status value |
| VENDOR_STATUS_UNCHANGED | 400 | Status is already the target status |

---

## Rate Limiting

- Search/list endpoints: 100 requests per minute per user
- Create/update endpoints: 30 requests per minute per user
- Status update endpoint: 20 requests per minute per user

Rate limit headers included in all responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Timestamp when limit resets

---

## Notes

- All timestamps use ISO 8601 format with UTC timezone
- All UUIDs follow RFC 4122 version 4 format
- Email validation is case-insensitive
- Search is case-insensitive and uses partial matching
- Pagination uses 1-based indexing
- Vendor records cannot be permanently deleted via API
- Status history is immutable once created
- All endpoints require HTTPS in production
