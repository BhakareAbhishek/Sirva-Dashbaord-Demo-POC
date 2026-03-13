# Widget Delivery API (Consuming Applications)

**Purpose**: Runtime pull-based delivery of eligible widgets for a given user/context (FR-013, FR-023, FR-029, FR-030).

## Endpoint

| Method | Path | Description |
|--------|------|-------------|
| POST | /v1/delivery/widgets | Request eligible widgets for context |

## Request

**Body**

```json
{
  "context": {
    "userId": "string (optional)",
    "segment": "string (optional)",
    "channel": "web | mobile",
    "locale": "string (e.g. en-US)",
    "requestTime": "ISO 8601 (optional, default now)"
  },
  "options": {
    "limit": "number (default 20, max 50)",
    "offset": "number (optional)"
  }
}
```

- **context**: Used by rules engine for priority-based evaluation. All attributes optional but recommended for correct targeting.

## Response (Standard Envelope)

**Success with widgets**

```json
{
  "requestMetadata": {
    "requestId": "string",
    "timestamp": "ISO 8601",
    "context": { ... }
  },
  "deliveryStatus": "success",
  "widgets": [
    {
      "id": "string",
      "type": "string",
      "title": "string",
      "content": { ... },
      "landingUrl": "string",
      "trackingParams": { ... }
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "totalCount": 5
  }
}
```

**Success with no eligible content** (FR-030)

- `deliveryStatus`: `"no_content"`
- `widgets`: `[]`
- HTTP status: `200` (not 4xx/5xx)

**Partial or error**

- `deliveryStatus`: `"partial"` or include `errors` array with code, message, details.
- Transport-level errors (e.g. 401, 500) use appropriate HTTP status; body may still use same envelope with `errors`.

## Auth

- Consuming Sirva applications authenticate via API key or token; backend validates and scopes results per tenant/application if applicable.

## Decision trace (optional)

- For audit (FR-028), response may include a non-standard field `decisionTrace` with matched rules, priority, and outcome per widget (e.g. in admin/debug mode only).
