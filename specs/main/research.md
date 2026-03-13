# Research: Sirva CMS Marketplace Platform

**Branch**: `main` | **Date**: 2026-03-13  
**Purpose**: Resolve technical unknowns and document technology choices for the implementation plan.

---

## 1. Frontend Framework and Version

**Decision**: Angular 14 with TypeScript 4.6+.

**Rationale**: Constitution and user input mandate Angular 14. TypeScript 4.6 is the version shipped with Angular 14 and provides strong typing for models and services.

**Alternatives considered**: Angular 15+ (not required for POC; upgrade path exists); React/Vue (rejected per constitution).

---

## 2. Project Structure: Core vs Shared vs Features

**Decision**: Three-tier structure — `core` (singleton services, auth, config, interceptors, guards), `shared` (reusable UI, design system, pipes/directives), `features/*` (domain modules: dashboard, vendors, widgets, landing pages, rules engine, analytics, AI).

**Rationale**: Aligns with Angular style guide and constitution modularity. Core is imported once in `AppModule`; shared is imported by feature modules; features are lazy-loaded to support scalability.

**Alternatives considered**: Flat structure (rejected for scalability); Nx libs (optional future step; not required for initial POC).

---

## 3. Chart Library for Analytics

**Decision**: Chart.js, exposed to Angular via a thin wrapper (e.g. ng2-charts or custom directive) in `shared/components/charts`.

**Rationale**: Spec clarification states "Chart.js" as the standard for analytics dashboards (FR-024). Single charting library keeps UX and bundle consistent.

**Alternatives considered**: Highcharts, D3 (more flexible but heavier); rejected to match spec.

---

## 4. API Style and Versioning

**Decision**: Versioned REST; base paths `/v1/vendors`, `/v1/widgets`, `/v1/landing-pages`, `/v1/rules`, `/v1/analytics`; widget delivery endpoint as defined in spec with context parameters and standard response envelope.

**Rationale**: Spec clarification: "Versioned REST endpoints" (FR-025, FR-026). Envelope format for widget delivery (request metadata, widgets list, pagination, errors) per FR-029, FR-030.

**Alternatives considered**: GraphQL (not in scope); unversioned REST (rejected for API stability).

---

## 5. Widget Delivery Model

**Decision**: Pull-based runtime API; consuming applications send user/context parameters; backend returns only approved, rule-qualified widgets in a standard envelope; empty result returned as success with empty `widgets` array (no transport-level failure).

**Rationale**: Spec clarification: "Pull model via runtime API calls with user/context parameters" and explicit empty-result behavior (FR-013, FR-030).

**Alternatives considered**: Push or server-sent events (out of scope for POC).

---

## 6. Rules Engine Evaluation (Backend Contract)

**Decision**: Priority-based evaluation with deterministic tie-breakers; API contract includes rule template application and decision-trace capability (matched rules, priority, outcome) for audit (FR-027, FR-028). Frontend consumes rule CRUD and template APIs; evaluation runs server-side.

**Rationale**: Spec clarification: "Priority-based evaluation with conflict resolution tie-breakers." Frontend focuses on rule/template authoring and configuration; execution is backend responsibility.

**Alternatives considered**: Client-side rule evaluation (rejected for security and consistency).

---

## 7. Reusable UI Component Set

**Decision**: Implement shared components for Sidebar, Header, Data tables, Forms, Charts, Cards, Modal dialogs under `shared/components/` and design system under `shared/design-system/`, with loading, empty, and error states (FR-031).

**Rationale**: User request and FR-018 (consistent enterprise dashboard UX). Typed inputs/outputs and accessibility (WCAG 2.1) applied to all.

**Alternatives considered**: Third-party UI library only (e.g. Material); hybrid approach chosen to allow design-system alignment and reuse.

---

## 8. Authentication and RBAC

**Decision**: Auth service and guards in `core`; role-based access for Platform Admin, Vendor, and Sirva Apps; HTTP interceptor adds auth token; role guard restricts routes by role (FR-001).

**Rationale**: Constitution and spec require RBAC and approval workflows. Specific IdP (e.g. OAuth2/OIDC) left to backend/env configuration; frontend assumes token and role claims.

**Alternatives considered**: No client-side guards (rejected for UX and security).

---

## 9. State Management

**Decision**: No global store mandated for POC. Feature-level state via components and services; shared state (e.g. current user) in `core` auth/config services; API responses as single source of truth.

**Rationale**: Reduces complexity; Angular services + RxJS sufficient for current scale. NgRx or similar can be introduced later if needed.

**Alternatives considered**: NgRx (deferred); signals (Angular 16+; not in scope for Angular 14).

---

## 10. Testing Strategy

**Decision**: Jasmine/Karma for unit tests; services and guards tested with mocked HTTP and auth; critical paths covered per constitution. E2E (Cypress/Playwright) optional and recorded as tasks.

**Rationale**: Angular 14 default; constitution requires test coverage and QA checklist. Unit tests for services and key components; E2E for main user journeys when resources allow.

**Alternatives considered**: Jest (possible migration); E2E mandatory (deferred to tasks/checklist).

---

All NEEDS CLARIFICATION items from the plan are resolved by the above decisions and the existing spec/clarifications.
