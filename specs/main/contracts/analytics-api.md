# Analytics API (`/v1/analytics`)

**Purpose**: Engagement and performance retrieval — impressions, clicks, leads, conversions (FR-014, FR-015).

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /v1/analytics/events | Raw or aggregated events; query params: vendorId, widgetId, campaignId, type, from, to, segment, channel |
| GET | /v1/analytics/summary | KPI summary (counts by type, vendor, widget, time range) |
| GET | /v1/analytics/campaigns | Campaign-level metrics |
| GET | /v1/analytics/vendors | Vendor-level metrics |
| GET | /v1/analytics/export | Export-ready report (e.g. CSV) — optional |

## Request/Response (examples)

**GET /v1/analytics/summary**

- Query: `?vendorId=...&from=2026-01-01T00:00:00Z&to=2026-03-13T23:59:59Z&groupBy=widget`
- Response: `{ data: { impressions, clicks, leads, conversions, byWidget?: [...], byVendor?: [...] }, meta? }`

**GET /v1/analytics/events**

- Query: `?page=1&pageSize=50&type=click&from=...&to=...`
- Response: `{ data: AnalyticsEvent[], pagination, meta? }`

## Filters

- **from / to**: ISO 8601 datetime range
- **vendorId / widgetId / campaignId**: scope to entity
- **type**: impression | click | lead | conversion
- **segment / channel**: optional dimensions

## Errors

- `400` — Invalid date range or filters
- `403` — Vendor can only see own data; admin sees all
