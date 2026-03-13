# Vendors API (`/v1/vendors`)

**Purpose**: Vendor lifecycle — onboarding, profile, activation, suspension, reactivation (FR-003).

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /v1/vendors | List vendors (admin); optional filters: status, governanceTier |
| GET | /v1/vendors/:id | Get vendor by id |
| POST | /v1/vendors | Register (onboarding request); admin approves to activate |
| PATCH | /v1/vendors/:id | Update profile (vendor self or admin) |
| POST | /v1/vendors/:id/activate | Admin: activate vendor |
| POST | /v1/vendors/:id/suspend | Admin: suspend vendor |
| POST | /v1/vendors/:id/reactivate | Admin: reactivate after suspend |

## Request/Response (examples)

**GET /v1/vendors**

- Query: `?page=1&pageSize=20&status=active`
- Response: `{ data: Vendor[], pagination: { page, pageSize, totalCount, totalPages }, meta?: {...} }`

**POST /v1/vendors** (registration)

- Body: `{ name, email, contactName, companyName?, profile? }`
- Response: `201` with `Vendor` (status e.g. onboarding)

**PATCH /v1/vendors/:id**

- Body: partial `Vendor` (e.g. name, profile)
- Response: `200` with updated `Vendor`

## Errors

- `400` — Validation failure
- `401` — Unauthorized
- `403` — Forbidden (e.g. vendor editing another vendor)
- `404` — Vendor not found
