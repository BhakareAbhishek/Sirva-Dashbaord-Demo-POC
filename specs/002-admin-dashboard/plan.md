# Implementation Plan: Platform Admin Dashboard

**Branch**: `002-admin-dashboard` | **Date**: 2026-03-13 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/002-admin-dashboard/spec.md`

## Summary

Implement the Dashboard module as an Angular 14 feature module using modular architecture (`core`, `shared`, `features`). The module includes `DashboardComponent`, `KpiCardComponent`, `AnalyticsChartComponent`, and `RecentActivityComponent`, integrates with a typed `DashboardService`, consumes `/api/dashboard/summary`, and enforces clarified behaviors for 60-second refresh, section-level loading, timeout handling (10 seconds), inline retry, and last-successful-data fallback.

## Technical Context

**Language/Version**: TypeScript (Angular 14 baseline)  
**Primary Dependencies**: Angular 14, Angular Router, RxJS, HttpClient, Chart.js  
**Storage**: N/A (frontend module consuming backend APIs)  
**Testing**: Jasmine + Karma (unit/component); Angular HttpClient testing utilities for service contracts  
**Target Platform**: Modern desktop browsers for Platform Administrator portal  
**Project Type**: Angular web application (feature module)  
**Performance Goals**: Initial dashboard meaningful content visible within 3 seconds for >=95% of requests; section timeout detected at 10 seconds  
**Constraints**: WCAG 2.1 compliance; typed models for all API payloads; section-level loading/error/empty states; no cross-feature tight coupling  
**Scale/Scope**: One new dashboard feature module with 4 core components, 1 service layer, and typed API contract for KPI/analytics/activity

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Gate

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-First Development | PASS | `spec.md` and `clarify` completed before plan; implementation not started. |
| II. Angular-First Frontend | PASS | Angular 14 explicitly selected; typed models and loading/error states planned. |
| III. Modularity & Future Expansion | PASS | Dashboard isolated as feature module with explicit contracts and reusable components. |
| IV. Collaboration & Documentation | PASS | Plan links to spec and will generate research/data-model/contracts/quickstart artifacts. |
| V. Quality & Non-Functional Discipline | PASS | Test approach, accessibility, performance, and failure handling captured as measurable constraints. |

### Post-Phase 1 Re-Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-First Development | PASS | Design artifacts generated from approved spec and clarifications. |
| II. Angular-First Frontend | PASS | Module, routing, service, and model design all Angular 14 aligned. |
| III. Modularity & Future Expansion | PASS | Contracts and data model separate domain concerns; reusable UI components identified. |
| IV. Collaboration & Documentation | PASS | Artifacts support traceable handoff into `/speckit.tasks`. |
| V. Quality & Non-Functional Discipline | PASS | Timeout, retry, stale-data fallback, accessibility, and test strategy all documented. |

## Project Structure

### Documentation (this feature)

```text
specs/002-admin-dashboard/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── README.md
│   └── dashboard-api.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
└── app/
    ├── app-routing.module.ts
    ├── core/
    │   ├── services/
    │   │   └── dashboard.service.ts
    │   └── models/
    │       ├── api-response.model.ts
    │       └── dashboard-error.model.ts
    ├── shared/
    │   └── components/
    │       ├── sidebar/
    │       └── header-toolbar/
    ├── features/
    │   └── dashboard/
    │       ├── dashboard.module.ts
    │       ├── dashboard-routing.module.ts
    │       ├── pages/
    │       │   └── dashboard/
    │       │       └── dashboard.component.ts
    │       └── components/
    │           ├── kpi-card/
    │           │   └── kpi-card.component.ts
    │           ├── analytics-chart/
    │           │   └── analytics-chart.component.ts
    │           └── recent-activity/
    │               └── recent-activity.component.ts
    └── models/
        ├── dashboard-metrics.model.ts
        ├── analytics-data.model.ts
        └── activity-log.model.ts
```

**Structure Decision**: Implement dashboard as a dedicated lazy-loadable feature module under `features/dashboard`, with API integration isolated in `core/services/dashboard.service.ts` and typed contracts in `app/models`. Shared shell components (sidebar/header) remain reusable under `shared/components`.

## Routing and Integration Design

- Root app routing adds lazy route: `path: 'dashboard'` mapped to `DashboardModule`.
- Optional default redirect: empty path to `/dashboard` for Platform Administrator landing.
- `DashboardRoutingModule` defines feature child route to `DashboardComponent`.
- `DashboardService` encapsulates calls to `/api/dashboard/summary`, polling every 60 seconds, manual refresh trigger, timeout handling, and standardized error mapping.
- UI rendering strategy:
  - Show section skeletons (`kpi`, `analytics`, `activity`) independently.
  - Render each section once its data is available.
  - On section refresh failure: preserve last successful data + inline error + retry action.
  - Mark requests over 10 seconds as timeout and show section-level error state.

## Reusable UI Components

| Component | Responsibility | Reuse Notes |
|-----------|----------------|-------------|
| `DashboardComponent` | Orchestrates layout, data refresh cycle, and section states | Feature container page only |
| `KpiCardComponent` | Displays individual KPI value, label, and loading/error state | Reusable for other metric cards |
| `AnalyticsChartComponent` | Renders Chart.js charts for impressions/clicks, trends, geography | Config-driven chart wrapper |
| `RecentActivityComponent` | Displays chronological activity list with empty/error states | Reusable for audit/event feeds |

## Complexity Tracking

*No constitution violations requiring justification.*
