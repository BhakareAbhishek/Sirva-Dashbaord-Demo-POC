# Quickstart: Platform Admin Dashboard (Angular 14)

**Branch**: `002-admin-dashboard` | **Date**: 2026-03-13  
**Audience**: Developers implementing the dashboard feature module.

---

## Prerequisites

- Node.js 18+
- npm 9+ (or equivalent package manager)
- Angular CLI 14

```bash
npm install -g @angular/cli@14
```

---

## 1) Create/Verify Angular Project Structure

Expected base structure:

```text
src/app/
├── core/
├── shared/
├── features/
│   └── dashboard/
└── models/
```

If dashboard feature module does not exist:

```bash
ng generate module features/dashboard --routing
```

---

## 2) Generate Required Dashboard Components

```bash
ng generate component features/dashboard/pages/dashboard
ng generate component features/dashboard/components/kpi-card
ng generate component features/dashboard/components/analytics-chart
ng generate component features/dashboard/components/recent-activity
```

---

## 3) Add Service and Models

Create service:

```bash
ng generate service core/services/dashboard
```

Create models:

- `src/app/models/dashboard-metrics.model.ts`
- `src/app/models/analytics-data.model.ts`
- `src/app/models/activity-log.model.ts`

Align model fields with `specs/002-admin-dashboard/data-model.md`.

---

## 4) Configure Routing

### App Routing (`app-routing.module.ts`)

- Add lazy-loaded dashboard route:
  - `path: 'dashboard'` -> `loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)`
- Add default redirect to `/dashboard` for admin landing if required.

### Dashboard Feature Routing (`dashboard-routing.module.ts`)

- Map `''` path to `DashboardComponent`.

---

## 5) Implement API Integration

In `DashboardService`:

- Call `GET /api/dashboard/summary`
- Enforce 10-second timeout
- Poll every 60 seconds
- Support manual refresh trigger
- Map response contract: `{ status, data: { kpis, analytics, activity }, meta }`
- Preserve last successful section data on refresh failure

Reference contract: `specs/002-admin-dashboard/contracts/dashboard-api.md`.

---

## 6) Implement Loading/Error Behavior

- Use section-level skeleton loaders for KPI, analytics, and activity blocks.
- Render sections independently as data arrives.
- On section failure or timeout:
  - Keep prior successful section data visible (if available)
  - Show inline error message
  - Provide retry action

---

## 7) Accessibility and UX Baseline

- Ensure keyboard navigation for all controls.
- Use semantic heading structure and ARIA labels where required.
- Maintain color contrast and readable chart legends per WCAG 2.1.

---

## 8) Validate with Tests

Run:

```bash
ng test
```

Minimum recommended test coverage for this feature:

- `DashboardService` API success/partial/error/timeout behavior
- `DashboardComponent` section-level loading and retry flow
- `KpiCardComponent`, `AnalyticsChartComponent`, `RecentActivityComponent` render states
- Route access behavior for Platform Administrator context

---

## 9) Artifact References

- Spec: `specs/002-admin-dashboard/spec.md`
- Plan: `specs/002-admin-dashboard/plan.md`
- Research: `specs/002-admin-dashboard/research.md`
- Data model: `specs/002-admin-dashboard/data-model.md`
- Contracts: `specs/002-admin-dashboard/contracts/`

Next step: run `/speckit.tasks` to create dependency-ordered implementation tasks.
