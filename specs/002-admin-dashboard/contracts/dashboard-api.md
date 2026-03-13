# Dashboard API Contract

**Feature**: Platform Admin Dashboard  
**Endpoint**: `GET /api/dashboard/summary`  
**Consumer**: Angular `DashboardService`  
**Refresh Policy**: Automatic every 60 seconds + manual refresh

---

## 1) Request

### HTTP Method

`GET`

### Path

`/api/dashboard/summary`

### Query Parameters (optional)

| Name | Type | Required | Description |
|------|------|----------|-------------|
| include | string | No | Comma-separated sections (`kpis,analytics,activity`) for partial fetch optimization |
| timezone | string | No | Client timezone for time-series bucketing |

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | Bearer token with Platform Administrator role |
| Accept | Yes | `application/json` |

---

## 2) Success Response (200)

```json
{
  "status": "success",
  "data": {
    "kpis": {
      "totalVendorsOnboarded": 120,
      "activeWidgets": 47,
      "pendingWidgetApprovals": 8,
      "leadsCaptured": 2140,
      "asOf": "2026-03-13T11:20:00Z"
    },
    "analytics": {
      "impressionsVsClicks": [
        { "timestamp": "2026-03-13T10:00:00Z", "impressions": 1200, "clicks": 96 }
      ],
      "widgetPerformanceTrends": [
        {
          "widgetId": "w-101",
          "widgetName": "Spring Promo",
          "trendPoints": [
            { "timestamp": "2026-03-13T10:00:00Z", "value": 320 }
          ]
        }
      ],
      "geographicEngagementDistribution": [
        { "regionCode": "IN-MH", "regionName": "Maharashtra", "engagementCount": 430 }
      ],
      "asOf": "2026-03-13T11:20:00Z"
    },
    "activity": [
      {
        "id": "act-001",
        "eventType": "vendor_onboarded",
        "message": "Vendor ABC onboarded",
        "actorName": "Admin User",
        "occurredAt": "2026-03-13T11:15:00Z",
        "referenceId": "vendor-778"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-03-13T11:20:02Z",
    "refreshIntervalSeconds": 60,
    "requestId": "req-5f51d4"
  }
}
```

---

## 3) Partial Response (200)

Used when one section is temporarily unavailable.

```json
{
  "status": "partial",
  "data": {
    "kpis": { "...": "..." },
    "analytics": null,
    "activity": [ { "...": "..." } ]
  },
  "meta": {
    "timestamp": "2026-03-13T11:20:02Z",
    "refreshIntervalSeconds": 60,
    "partialSections": ["analytics"],
    "requestId": "req-5f51d4"
  }
}
```

Client behavior:
- Render available sections.
- Keep last successful data for failed sections.
- Show inline section error + retry action for failed sections.

---

## 4) Error Response (4xx/5xx)

```json
{
  "status": "error",
  "data": null,
  "meta": {
    "timestamp": "2026-03-13T11:20:02Z",
    "requestId": "req-5f51d4"
  },
  "error": {
    "code": "DASHBOARD_FETCH_FAILED",
    "message": "Unable to load dashboard data. Please try again."
  }
}
```

---

## 5) Timeout Handling Contract

- Client-side request timeout threshold: **10 seconds**.
- If threshold is exceeded, UI marks affected section(s) as failed, keeps previous valid values (if present), and exposes retry.
- Timeout is treated as a recoverable error; dashboard page remains interactive.

---

## 6) Status Code Summary

| Status Code | Meaning | Client Action |
|-------------|---------|---------------|
| 200 | Success or partial success payload | Render available data; handle partial sections as degraded state |
| 401 | Unauthorized | Route to auth flow or show access error |
| 403 | Forbidden (role mismatch) | Show role-based access denial |
| 408/504 | Request timeout/gateway timeout | Show section timeout state + retry |
| 5xx | Server error | Show user-friendly inline error + retry |
