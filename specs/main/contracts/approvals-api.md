# Approvals / Submissions API

**Purpose**: Approval queue and workflow actions (FR-010, FR-011, FR-012).

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /v1/submissions | List submissions; filters: vendorId, status (pending, approved, rejected), from, to |
| GET | /v1/submissions/:id | Get submission detail |
| POST | /v1/submissions/:id/approve | Admin: approve (optional comment) |
| POST | /v1/submissions/:id/reject | Admin: reject (comment required) |

## Request/Response (examples)

**GET /v1/submissions**

- Query: `?status=pending&vendorId=...&page=1&pageSize=20`
- Response: `{ data: PublicationSubmission[], pagination, meta? }`

**POST /v1/submissions/:id/approve**

- Body: `{ comment?: string }`
- Response: `200` with updated submission and linked widget/landing status

**POST /v1/submissions/:id/reject**

- Body: `{ comment: string }` (required)
- Response: `200` with updated submission; widget/landing return to draft with rejection reason

## Errors

- `400` — Missing comment on reject
- `403` — Not admin
- `404` — Submission not found
- `409` — Already approved/rejected or conflict
