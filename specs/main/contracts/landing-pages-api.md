# Landing Pages API (`/v1/landing-pages`)

**Purpose**: Landing page CRUD and linkage to widgets (FR-006).

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /v1/landing-pages | List; filters: vendorId, status |
| GET | /v1/landing-pages/:id | Get by id |
| POST | /v1/landing-pages | Create |
| PATCH | /v1/landing-pages/:id | Update (draft only) |
| DELETE | /v1/landing-pages/:id | Archive or soft-delete |
| GET | /v1/landing-pages/:id/widgets | Widgets linking to this page |

## Request/Response (examples)

**POST /v1/landing-pages**

- Body: `{ vendorId, title, slug, content, linkedWidgetIds? }`
- Response: `201` with `LandingPage`

**PATCH /v1/landing-pages/:id**

- Body: partial `LandingPage`
- Response: `200` with updated `LandingPage`

## Validation

- Slug unique per vendor. If a widget references this landing page, alignment rules apply (e.g. same submission, or page must be published when widget is published).

## Errors

- `400` — Validation (duplicate slug, invalid content)
- `403` — Not owner
- `404` — Not found
