# Data Model: Vendor Marketplace Module

**Branch**: `003-vendor-marketplace` | **Date**: 2026-03-13  
**Source**: `specs/003-vendor-marketplace/spec.md` + clarified API contract and Angular module requirements.

---

## 1. Vendor

**Purpose**: Represents a service provider in the Sirva marketplace ecosystem with business identity, contact information, and operational status.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string (UUID) | Yes | Unique vendor identifier (system-generated) |
| vendorName | string | Yes | Display name for the vendor |
| companyName | string | Yes | Legal company name |
| contactEmail | string | Yes | Primary contact email (must be unique) |
| contactPhone | string | No | Contact phone number (international format) |
| businessDescription | string | No | Description of vendor business and capabilities |
| servicesOffered | string | No | Services provided by the vendor |
| status | VendorStatus | Yes | Vendor account status (Active or Inactive) |
| createdAt | string (ISO 8601) | Yes | Timestamp when vendor was onboarded |
| createdBy | string | Yes | Administrator ID who onboarded the vendor |
| updatedAt | string (ISO 8601) | Yes | Timestamp of last profile update |
| updatedBy | string | Yes | Administrator ID who last updated the vendor |

**Validation rules**:
- `vendorName`: Required, max 200 characters, min 2 characters
- `companyName`: Required, max 200 characters, min 2 characters
- `contactEmail`: Required, valid RFC 5322 email format, must be unique across all vendors
- `contactPhone`: Optional, accepts international phone formats including +, -, (), spaces, max 20 characters
- `businessDescription`: Optional, max 1000 characters
- `servicesOffered`: Optional, max 500 characters
- `status`: Must be either "Active" or "Inactive"
- All text fields must be sanitized to prevent XSS

**Business rules**:
- Contact email uniqueness is enforced at database/API level
- Vendors created via onboarding default to "Active" status
- Vendors cannot be permanently deleted, only set to "Inactive" status
- Status changes must be logged in VendorStatusHistory

---

## 2. VendorStatus

**Purpose**: Enumeration representing vendor account operational status.

| Value | Description |
|-------|-------------|
| Active | Vendor has platform access and can create promotional widgets |
| Inactive | Vendor is deactivated and cannot access widget creation features |

**Validation rules**:
- Only "Active" and "Inactive" values are permitted
- Status transitions are bidirectional (Active ↔ Inactive)

---

## 3. VendorStatusHistory

**Purpose**: Audit trail tracking vendor status changes over time.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string (UUID) | Yes | Unique history record identifier |
| vendorId | string (UUID) | Yes | Reference to vendor |
| previousStatus | VendorStatus | Yes | Status before change |
| newStatus | VendorStatus | Yes | Status after change |
| changedAt | string (ISO 8601) | Yes | Timestamp of status change |
| changedBy | string | Yes | Administrator ID who performed the change |
| reason | string | No | Optional reason for status change |

**Validation rules**:
- `vendorId` must reference a valid vendor
- `previousStatus` must differ from `newStatus`
- `reason`: Optional, max 500 characters

---

## 4. VendorListResponse

**Purpose**: API response payload for vendor listing with pagination support.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| status | string | Yes | Response status ("success" or "error") |
| data | VendorListData | Yes | Vendor list data payload |
| meta | PaginationMeta | Yes | Pagination metadata |

### Nested: VendorListData

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| vendors | Vendor[] | Yes | Array of vendor records |

### Nested: PaginationMeta

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| currentPage | number | Yes | Current page number (1-indexed) |
| pageSize | number | Yes | Number of items per page |
| totalItems | number | Yes | Total vendor count across all pages |
| totalPages | number | Yes | Total number of pages |
| hasNext | boolean | Yes | Whether next page exists |
| hasPrevious | boolean | Yes | Whether previous page exists |

---

## 5. VendorDetailResponse

**Purpose**: API response payload for single vendor detail retrieval.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| status | string | Yes | Response status ("success" or "error") |
| data | VendorDetailData | Yes | Vendor detail data payload |
| meta | ResponseMeta | Yes | Response metadata |

### Nested: VendorDetailData

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| vendor | Vendor | Yes | Complete vendor record |
| statusHistory | VendorStatusHistory[] | No | Recent status change history |

### Nested: ResponseMeta

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| timestamp | string (ISO 8601) | Yes | Response generation timestamp |
| requestId | string | No | Unique request tracking ID |

---

## 6. VendorCreateRequest

**Purpose**: Request payload for creating a new vendor.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| vendorName | string | Yes | Display name for the vendor |
| companyName | string | Yes | Legal company name |
| contactEmail | string | Yes | Primary contact email |
| contactPhone | string | No | Contact phone number |
| businessDescription | string | No | Description of vendor business |
| servicesOffered | string | No | Services provided by the vendor |

**Validation**: Same rules as Vendor entity for corresponding fields

---

## 7. VendorUpdateRequest

**Purpose**: Request payload for updating an existing vendor profile.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| vendorName | string | No | Display name for the vendor |
| companyName | string | No | Legal company name |
| contactEmail | string | No | Primary contact email |
| contactPhone | string | No | Contact phone number |
| businessDescription | string | No | Description of vendor business |
| servicesOffered | string | No | Services provided by the vendor |

**Validation**: 
- At least one field must be provided
- Provided fields follow same validation rules as Vendor entity
- Email uniqueness validation if contactEmail is updated

---

## 8. VendorStatusUpdateRequest

**Purpose**: Request payload for changing vendor status.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| status | VendorStatus | Yes | New vendor status |
| reason | string | No | Reason for status change |

**Validation**:
- `status` must be valid VendorStatus enum value
- `reason`: Optional, max 500 characters

---

## 9. VendorSearchRequest

**Purpose**: Request payload for searching and filtering vendors.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| searchTerm | string | No | Search text (vendor name, company, email) |
| status | VendorStatus \| "All" | No | Filter by status |
| page | number | No | Page number (default: 1) |
| pageSize | number | No | Items per page (default: 20, max: 100) |
| sortBy | string | No | Sort field (default: "vendorName") |
| sortOrder | "asc" \| "desc" | No | Sort direction (default: "asc") |

**Validation rules**:
- `searchTerm`: Optional, max 200 characters, sanitized for SQL injection
- `status`: Must be "Active", "Inactive", or "All"
- `page`: Minimum 1
- `pageSize`: Between 1 and 100
- `sortBy`: Must be valid vendor field name
- `sortOrder`: Must be "asc" or "desc"

---

## 10. VendorError

**Purpose**: Standard error response for vendor operations.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| status | string | Yes | Always "error" |
| error | ErrorDetail | Yes | Error details |
| meta | ResponseMeta | Yes | Response metadata |

### Nested: ErrorDetail

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| code | string | Yes | Machine-readable error code |
| message | string | Yes | Human-readable error message |
| field | string | No | Field name if validation error |
| details | object | No | Additional error context |

**Common error codes**:
- `VENDOR_EMAIL_DUPLICATE`: Contact email already exists
- `VENDOR_NOT_FOUND`: Vendor ID does not exist
- `VENDOR_VALIDATION_ERROR`: Field validation failed
- `VENDOR_UNAUTHORIZED`: User lacks permission
- `VENDOR_SERVER_ERROR`: Internal server error

---

## Relationships

```
Vendor (1) ──< (many) VendorStatusHistory
  └─ One vendor can have multiple status history entries
```

---

## Angular TypeScript Models

### Example: vendor.model.ts

```typescript
export enum VendorStatus {
  Active = 'Active',
  Inactive = 'Inactive'
}

export interface Vendor {
  id: string;
  vendorName: string;
  companyName: string;
  contactEmail: string;
  contactPhone?: string;
  businessDescription?: string;
  servicesOffered?: string;
  status: VendorStatus;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface VendorStatusHistory {
  id: string;
  vendorId: string;
  previousStatus: VendorStatus;
  newStatus: VendorStatus;
  changedAt: string;
  changedBy: string;
  reason?: string;
}
```

---

## Notes

- All timestamps use ISO 8601 format with timezone (e.g., `2026-03-13T14:30:00Z`)
- UUIDs follow RFC 4122 version 4 format
- Text fields are stored as UTF-8 and support international characters
- Phone number validation is lenient to support international formats
- Email uniqueness is case-insensitive
- All API responses include `meta.timestamp` for cache invalidation
- Status history is append-only for audit integrity
