# Research: Platform Admin Dashboard

**Branch**: `002-admin-dashboard` | **Date**: 2026-03-13  
**Purpose**: Resolve technical decisions for dashboard module implementation before task breakdown.

---

## 1. Angular Module Architecture

**Decision**: Implement the dashboard as a standalone feature module with `dashboard.module.ts` and `dashboard-routing.module.ts`, integrated into app routing via lazy loading.

**Rationale**: This aligns with constitution principles for modularity, Angular-first implementation, and clean feature boundaries for future expansion.

**Alternatives considered**: Declaring dashboard directly in `AppModule` (rejected for scalability and boundary separation).

---

## 2. Analytics Charting Library

**Decision**: Use `Chart.js` as the dashboard analytics charting standard.

**Rationale**: Spec clarification finalized Chart.js to provide a single consistent charting approach across impressions/clicks, trends, and geographic distribution.

**Alternatives considered**: `ngx-charts` and other chart libraries (rejected due to clarified requirement and consistency concerns).

---

## 3. API Integration Pattern

**Decision**: Use one aggregated endpoint: `/api/dashboard/summary` consumed by `DashboardService`.

**Rationale**: A single response contract reduces client orchestration complexity and minimizes inconsistent cross-section states.

**Alternatives considered**: Split endpoints for KPI/analytics/activity (rejected because they increase synchronization complexity and partial-state risk).

---

## 4. Dashboard API Response Contract

**Decision**: Use standardized envelope: `{ status, data: { kpis, analytics, activity }, meta }`.

**Rationale**: Explicit envelope improves contract evolution, error handling, and telemetry (timestamp/freshness metadata) without breaking consumers.

**Alternatives considered**: Flat payload or JSON:API-like structure (rejected for either lower flexibility or unnecessary complexity for this module scope).

---

## 5. Refresh and State Management Policy

**Decision**: Auto-refresh every 60 seconds, plus manual refresh trigger; preserve last successful section data during failed refresh attempts.

**Rationale**: Balances operational freshness with backend load while maintaining continuity during transient failures.

**Alternatives considered**: 30-second polling (higher load), 5-minute polling (staler admin visibility), manual-only refresh (lower responsiveness).

---

## 6. Loading, Timeout, and Failure UX

**Decision**: Section-level skeleton loading; render each section independently as data arrives; timeout threshold at 10 seconds; show inline section errors with retry action.

**Rationale**: Prevents whole-page blocking and preserves usability when only one section fails.

**Alternatives considered**: Full-page blocking loader and full-page failure mode (rejected for poor resilience and UX).

---

## 7. Model Definitions

**Decision**: Define and use three typed models in `src/app/models`: `DashboardMetrics`, `AnalyticsData`, and `ActivityLog`, plus a typed summary response wrapper.

**Rationale**: Strong typing is mandated by constitution and improves service-component contract reliability in Angular.

**Alternatives considered**: Unstructured `any` payload handling (rejected due to maintainability and testing risk).

---

## 8. Testing Strategy for Dashboard Module

**Decision**: Unit and component tests with Jasmine/Karma; service API contract tests using Angular HttpClient testing utilities; route-level guard/access tests for admin visibility.

**Rationale**: Meets constitution quality gate while keeping implementation aligned with Angular 14 default tooling.

**Alternatives considered**: E2E-only validation (rejected because it weakens component/service isolation and fast feedback loops).

---

All technical unknowns for this dashboard feature are resolved by the above decisions and existing specification clarifications.
