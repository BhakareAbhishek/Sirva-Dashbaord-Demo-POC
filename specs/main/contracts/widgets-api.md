# Widgets API (`/v1/widgets`)

**Purpose**: Widget CRUD, version history, publication readiness (FR-005, FR-007).

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /v1/widgets | List widgets; filters: vendorId, status, type |
| GET | /v1/widgets/:id | Get widget by id |
| POST | /v1/widgets | Create widget (draft) |
| PATCH | /v1/widgets/:id | Update widget (draft only unless workflow allows) |
| POST | /v1/widgets/:id/submit | Submit for approval |
| POST | /v1/widgets/:id/duplicate | Duplicate widget (new draft) |
| DELETE | /v1/widgets/:id | Archive or soft-delete (per policy) |
| GET | /v1/widgets/:id/history | Version history |

## Request/Response (examples)

**GET /v1/widgets**

- Query: `?vendorId=...&status=published&page=1&pageSize=20`
- Response: `{ data: Widget[], pagination, meta? }`

**POST /v1/widgets**

- Body: `{ vendorId, type, title, content, ruleIds?, landingPageId? }`
- Response: `201` with `Widget` (status: draft)

**PATCH /v1/widgets/:id**

- Body: partial `Widget` (content, ruleIds, etc.)
- Response: `200` with updated `Widget`

## State rules

- Only draft can be edited (full PATCH). Submitted/approved/published require workflow actions (approve/reject/publish) via submissions or admin APIs.

## Errors

- `400` — Validation (e.g. invalid type, missing required fields)
- `403` — Vendor does not own widget or not allowed to edit
- `404` — Widget not found
- `409` — Conflict (e.g. submit when already submitted)
