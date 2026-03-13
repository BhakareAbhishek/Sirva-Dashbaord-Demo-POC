# Data Model: Platform Admin Dashboard

**Branch**: `002-admin-dashboard` | **Date**: 2026-03-13  
**Source**: `specs/002-admin-dashboard/spec.md` + clarified API contract and Angular module requirements.

---

## 1. DashboardMetrics

**Purpose**: Represents KPI totals for the dashboard summary cards.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| totalVendorsOnboarded | number | Yes | Total vendors onboarded to platform |
| activeWidgets | number | Yes | Count of currently active widgets |
| pendingWidgetApprovals | number | Yes | Count of widgets awaiting approval |
| leadsCaptured | number | Yes | Total leads captured |
| asOf | string (ISO 8601) | Yes | Snapshot timestamp for KPI totals |

**Validation rules**:
- All numeric fields must be integers >= 0.
- `asOf` must be a valid ISO 8601 datetime string.

---

## 2. AnalyticsData

**Purpose**: Represents chart datasets for engagement analysis.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| impressionsVsClicks | TimeSeriesPoint[] | Yes | Comparative impressions/clicks series |
| widgetPerformanceTrends | WidgetTrend[] | Yes | Trend series grouped by widget or category |
| geographicEngagementDistribution | GeoEngagementPoint[] | Yes | Engagement split by geography |
| asOf | string (ISO 8601) | Yes | Snapshot timestamp for analytics |

### Nested types

**TimeSeriesPoint**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| timestamp | string (ISO 8601) | Yes | Time bucket |
| impressions | number | Yes | Impressions at timestamp |
| clicks | number | Yes | Clicks at timestamp |

**WidgetTrend**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| widgetId | string | Yes | Widget identifier |
| widgetName | string | Yes | Display name |
| trendPoints | TrendPoint[] | Yes | Trend values over time |

**TrendPoint**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| timestamp | string (ISO 8601) | Yes | Time bucket |
| value | number | Yes | Engagement value for trend |

**GeoEngagementPoint**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| regionCode | string | Yes | Region/country code |
| regionName | string | Yes | Display geography name |
| engagementCount | number | Yes | Engagement total for region |

**Validation rules**:
- Numeric values must be >= 0.
- Arrays may be empty but must be present.

---

## 3. ActivityLog

**Purpose**: Represents recent dashboard activity entries.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique activity event ID |
| eventType | string | Yes | Event category (e.g., `vendor_onboarded`, `widget_approved`) |
| message | string | Yes | Human-readable activity message |
| actorName | string | No | User/system actor responsible for event |
| occurredAt | string (ISO 8601) | Yes | Event timestamp |
| referenceId | string | No | Optional related entity ID |

**Validation rules**:
- `id`, `eventType`, `message`, and `occurredAt` are required.
- Recent activity is sorted descending by `occurredAt`.

---

## 4. DashboardSummaryResponse

**Purpose**: Standardized API envelope consumed by `DashboardService`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| status | string | Yes | Request status (`success`, `partial`, `error`) |
| data.kpis | DashboardMetrics | Yes (on success/partial) | KPI summary payload |
| data.analytics | AnalyticsData | Yes (on success/partial) | Analytics payload |
| data.activity | ActivityLog[] | Yes (on success/partial) | Recent activity list |
| meta.timestamp | string (ISO 8601) | Yes | Response generation time |
| meta.refreshIntervalSeconds | number | Yes | Expected refresh interval (60) |
| meta.requestId | string | No | Trace identifier |
| meta.partialSections | string[] | No | Failed/missing sections in partial responses |
| error.code | string | No | Error code when status is `error` |
| error.message | string | No | User-safe error description |

**Validation rules**:
- `status` must be one of `success`, `partial`, `error`.
- Timeout threshold for client handling is 10 seconds per request.

---

## 5. DashboardViewState (Client-side)

**Purpose**: Client-side state model controlling section rendering behavior.

| Field | Type | Description |
|-------|------|-------------|
| kpiState | `loading` \| `ready` \| `error` | KPI section state |
| analyticsState | `loading` \| `ready` \| `error` | Analytics section state |
| activityState | `loading` \| `ready` \| `error` | Activity section state |
| lastUpdatedAt | string (ISO 8601) \| null | Last successful refresh timestamp |
| isManualRefreshInProgress | boolean | Manual refresh indicator |

**Behavior constraints**:
- Section states update independently.
- On refresh failure, preserve previous successful section data and set that section to `error` with retry available.
- Requests exceeding 10 seconds transition relevant section(s) to timeout error.
