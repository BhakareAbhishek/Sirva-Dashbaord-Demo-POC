# Tasks: Sirva CMS Marketplace Platform (Angular Setup)

**Input**: Design documents from `/specs/main/` and `/specs/001-sirva-cms-marketplace/spec.md`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by setup phase (project init → foundational → feature module scaffolding) to enable incremental delivery. User story implementation phases can be added in a subsequent task breakdown.

## Format: `[ID] [P?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

- **Angular SPA**: `src/app/` at repository root; `src/app/core`, `src/app/shared`, `src/app/features/*`, `src/app/models`

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize Angular 14 project, folder structure, and tooling.

- [ ] T001 Initialize Angular 14 project at repository root (e.g. `ng new` or scaffold with Angular CLI 14) with `src/`, `src/app/`, `angular.json`, `package.json`, `tsconfig.json`
- [ ] T002 Set up project folder structure per plan: create `src/app/core/`, `src/app/shared/`, `src/app/features/`, `src/app/models/`, `src/assets/`, `src/environments/`
- [ ] T003 [P] Configure ESLint and Prettier in project root (e.g. `.eslintrc.json`, `.prettierrc`, and npm scripts or Angular builder integration)

---

## Phase 2: Foundational (Core, Shared, Models, API, Layout, Routing)

**Purpose**: Core infrastructure and shared assets that all feature modules depend on. No user story work until this phase is complete.

**⚠️ CRITICAL**: Complete Phase 2 before implementing feature-specific screens or workflows.

### Core module and services

- [ ] T004 Create core module in `src/app/core/core.module.ts`, provide it once in `AppModule`, and create barrel `src/app/core/index.ts` if desired
- [ ] T005 [P] Create config service in `src/app/core/services/config.service.ts` with `apiBaseUrl` from environment
- [ ] T006 [P] Create auth service in `src/app/core/services/auth.service.ts` (token, role, login/logout contract)
- [ ] T007 Create auth guard in `src/app/core/guards/auth.guard.ts` to protect authenticated routes
- [ ] T008 Create role guard in `src/app/core/guards/role.guard.ts` for role-based route access (admin, vendor)
- [ ] T009 [P] Create auth interceptor in `src/app/core/interceptors/auth.interceptor.ts` to attach auth header to HTTP requests
- [ ] T010 [P] Create error interceptor in `src/app/core/interceptors/error.interceptor.ts` for centralized HTTP error handling

### API service layer

- [ ] T011 Create base API service in `src/app/core/services/api/api.service.ts` using `HttpClient` and `ConfigService` base URL
- [ ] T012 [P] Create vendor API service in `src/app/core/services/api/vendor-api.service.ts` extending/using base API and contracts
- [ ] T013 [P] Create widget API service in `src/app/core/services/api/widget-api.service.ts` extending/using base API and contracts
- [ ] T014 [P] Create landing-page API service in `src/app/core/services/api/landing-page-api.service.ts` extending/using base API and contracts
- [ ] T015 [P] Create rules API service in `src/app/core/services/api/rules-api.service.ts` extending/using base API and contracts
- [ ] T016 [P] Create analytics API service in `src/app/core/services/api/analytics-api.service.ts` extending/using base API and contracts
- [ ] T017 [P] Create widget-delivery API service in `src/app/core/services/api/widget-delivery-api.service.ts` for consuming-app delivery endpoint

### TypeScript data models

- [ ] T018 [P] Create Vendor and related interfaces in `src/app/models/vendor.model.ts` per data-model.md
- [ ] T019 [P] Create Widget and related interfaces in `src/app/models/widget.model.ts` per data-model.md
- [ ] T020 [P] Create LandingPage and related interfaces in `src/app/models/landing-page.model.ts` per data-model.md
- [ ] T021 [P] Create Rule, RuleTemplate, RuleCondition in `src/app/models/rule.model.ts` per data-model.md
- [ ] T022 [P] Create AnalyticsEvent and aggregates in `src/app/models/analytics.model.ts` per data-model.md
- [ ] T023 [P] Create API response envelope and widget-delivery types in `src/app/models/api-response.model.ts` per data-model.md

### Shared module and layout components

- [ ] T024 Create shared module in `src/app/shared/shared.module.ts` and export components/pipes/directives for use by feature modules
- [ ] T025 [P] Create header component in `src/app/shared/components/header/` (branding, user menu, global actions)
- [ ] T026 [P] Create sidebar component in `src/app/shared/components/sidebar/` (app navigation, role-based menu items)

### Shared UI components

- [ ] T027 [P] Create data-table component in `src/app/shared/components/data-table/` (sortable, filterable, paginated table)
- [ ] T028 [P] Create forms wrapper/controls in `src/app/shared/components/forms/` (reusable form controls, validation, submit/cancel)
- [ ] T029 [P] Create charts component (Chart.js wrapper) in `src/app/shared/components/charts/` for bar, line, pie
- [ ] T030 [P] Create cards component in `src/app/shared/components/cards/` (summary cards, KPI cards)
- [ ] T031 [P] Create modal-dialog component in `src/app/shared/components/modal-dialog/` (confirm, form modals)

### App routing configuration

- [ ] T032 Configure app routing in `src/app/app-routing.module.ts` with default route to dashboard and lazy-loaded routes for dashboard, vendors, widgets, landing-pages, rules, analytics, ai

**Checkpoint**: Foundation ready — feature module scaffolding can proceed.

---

## Phase 3: Feature module — Dashboard

**Purpose**: Dashboard feature shell and routing (FR-002, platform-level KPIs).

- [ ] T033 Create dashboard feature module and routing in `src/app/features/dashboard/` (dashboard.module.ts, dashboard-routing.module.ts)
- [ ] T034 Create dashboard placeholder page component in `src/app/features/dashboard/pages/` and wire to route `/dashboard` (or `/`)

---

## Phase 4: Feature module — Vendors

**Purpose**: Vendors feature shell and routing (FR-003, vendor onboarding and lifecycle).

- [ ] T035 Create vendors feature module and routing in `src/app/features/vendors/` (vendors.module.ts, vendors-routing.module.ts) with routes: list, new, :id, :id/edit
- [ ] T036 Create vendors list placeholder page in `src/app/features/vendors/pages/` and wire to `/vendors`

---

## Phase 5: Feature module — Widgets

**Purpose**: Widgets feature shell and routing (FR-005, widget library).

- [ ] T037 Create widgets feature module and routing in `src/app/features/widgets/` (widgets.module.ts, widgets-routing.module.ts) with routes: list, new, :id, :id/edit
- [ ] T038 Create widgets library placeholder page in `src/app/features/widgets/pages/` and wire to `/widgets`

---

## Phase 6: Feature module — Landing pages

**Purpose**: Landing pages feature shell and routing (FR-006).

- [ ] T039 Create landing-pages feature module and routing in `src/app/features/landing-pages/` (landing-pages.module.ts, landing-pages-routing.module.ts) with routes: list, new, :id, :id/edit
- [ ] T040 Create landing-pages list placeholder page in `src/app/features/landing-pages/pages/` and wire to `/landing-pages`

---

## Phase 7: Feature module — Rules engine

**Purpose**: Rules engine feature shell and routing (FR-008, FR-009).

- [ ] T041 Create rules-engine feature module and routing in `src/app/features/rules-engine/` (rules-engine.module.ts, rules-engine-routing.module.ts) with routes: list, templates/:id, :id
- [ ] T042 Create rules placeholder page in `src/app/features/rules-engine/pages/` and wire to `/rules`

---

## Phase 8: Feature module — Analytics

**Purpose**: Analytics feature shell and routing (FR-014, FR-015).

- [ ] T043 Create analytics feature module and routing in `src/app/features/analytics/` (analytics.module.ts, analytics-routing.module.ts) with routes: overview, campaigns, vendors
- [ ] T044 Create analytics placeholder page in `src/app/features/analytics/pages/` and wire to `/analytics`

---

## Phase 9: Feature module — AI

**Purpose**: AI feature shell and routing (FR-016, FR-017, advisory only).

- [ ] T045 Create ai feature module and routing in `src/app/features/ai/` (ai.module.ts, ai-routing.module.ts)
- [ ] T046 Create ai placeholder page in `src/app/features/ai/pages/` and wire to `/ai`

---

## Phase 10: Polish & cross-cutting

**Purpose**: Design system placeholder and quickstart validation.

- [ ] T047 [P] Add design-system placeholder folder and README in `src/app/shared/design-system/` describing usage of shared components
- [ ] T048 Run quickstart validation: ensure `ng serve` starts app and default route loads dashboard; verify all lazy-loaded feature routes resolve

---

## Dependencies & execution order

### Phase dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all feature module work.
- **Phases 3–9 (Feature modules)**: Depend on Phase 2. Feature modules can be implemented in parallel (different folders) or in order T033→T046.
- **Phase 10 (Polish)**: Depends on Phases 1–9.

### Parallel opportunities

- **Phase 1**: T003 [P] (ESLint/Prettier) can run in parallel with T002 after T001.
- **Phase 2**: All tasks marked [P] (T005–T006, T009–T010, T012–T017, T018–T023, T025–T031) can run in parallel after their prerequisites (e.g. T004 for core, T024 for shared, T011 for API services).
- **Phases 3–9**: Each feature module (T033–T034, T035–T036, …) can be done in parallel by different developers once Phase 2 is complete.

### Suggested MVP scope (setup only)

1. Complete Phase 1 (T001–T003).
2. Complete Phase 2 (T004–T032).
3. Complete at least Phase 3 (Dashboard) so that `ng serve` shows a navigable app with dashboard and sidebar/header.
4. Add remaining feature modules (Phases 4–9) as needed.
5. Run Phase 10 (T047–T048) before handoff or demo.

---

## Implementation strategy

### Incremental delivery

1. **Phase 1** → Project builds and folder structure exists.
2. **Phase 2** → Core, shared, models, API layer, layout, and routing in place; app runs and can lazy-load feature modules.
3. **Phases 3–9** → Each feature module is a small, independent increment (module + routing + placeholder page).
4. **Phase 10** → Quickstart and design-system docs validated.

### Parallel team strategy

- After Phase 2: Developer A — Dashboard + Analytics; Developer B — Vendors + Widgets; Developer C — Landing pages + Rules + AI. Merge when each feature module is merged.

---

## Notes

- All paths assume Angular at repo root with `src/app/` as in `specs/main/plan.md`.
- User story implementation (US1–US4) — full screens, forms, and workflows — is out of scope for this setup tasks file; add separate tasks/phases when implementing spec user stories.
- [P] = different files, no dependency on other incomplete tasks; safe to run in parallel.
