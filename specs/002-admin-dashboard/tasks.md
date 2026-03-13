# Tasks: Platform Admin Dashboard

**Input**: Design documents from `/specs/002-admin-dashboard/`  
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/dashboard-api.md`, `quickstart.md`

**Tests**: Unit and component tests are included because the request explicitly requires unit tests for dashboard components and service behavior.

**Organization**: Tasks are grouped by user story to allow independent implementation and validation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on incomplete tasks)
- **[Story]**: User story mapping (`[US1]`, `[US2]`, `[US3]`)
- All tasks include explicit file paths

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize Angular dashboard feature scaffolding and baseline dependencies.

- [ ] T001 Create dashboard feature module and routing module in `src/app/features/dashboard/dashboard.module.ts` and `src/app/features/dashboard/dashboard-routing.module.ts`
- [ ] T002 Create dashboard page component shell in `src/app/features/dashboard/pages/dashboard/dashboard.component.ts`, `src/app/features/dashboard/pages/dashboard/dashboard.component.html`, and `src/app/features/dashboard/pages/dashboard/dashboard.component.scss`
- [ ] T003 [P] Add Chart.js dependency and typings configuration in `package.json` and `src/app/features/dashboard/dashboard.module.ts`
- [ ] T004 [P] Create dashboard service shell in `src/app/core/services/dashboard.service.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared models, routing integration, and baseline data/state contract used by all stories.

**CRITICAL**: Complete this phase before starting user-story implementation.

- [ ] T005 Define `DashboardMetrics` interface in `src/app/models/dashboard-metrics.model.ts`
- [ ] T006 [P] Define `AnalyticsData` interface and nested chart point interfaces in `src/app/models/analytics-data.model.ts`
- [ ] T007 [P] Define `ActivityLog` interface in `src/app/models/activity-log.model.ts`
- [ ] T008 Define dashboard summary response and section-state interfaces in `src/app/models/dashboard-summary-response.model.ts`
- [ ] T009 Implement app-level lazy route for dashboard in `src/app/app-routing.module.ts`
- [ ] T010 Implement feature route mapping to `DashboardComponent` in `src/app/features/dashboard/dashboard-routing.module.ts`
- [ ] T011 Implement `DashboardService` API integration for `GET /api/dashboard/summary` with typed mapping in `src/app/core/services/dashboard.service.ts`
- [ ] T012 Implement 60-second polling, manual refresh trigger, and 10-second timeout handling in `src/app/core/services/dashboard.service.ts`
- [ ] T013 Implement shared error normalization for dashboard API failures/timeouts in `src/app/core/models/dashboard-error.model.ts` and `src/app/core/services/dashboard.service.ts`

**Checkpoint**: Routing + typed models + service contract are ready; user story work can proceed.

---

## Phase 3: User Story 1 - View Core Platform Health (Priority: P1) 🎯 MVP

**Goal**: Show core KPI metrics in the admin dashboard with loading and recoverable error behavior.

**Independent Test**: Open `/dashboard` as admin and verify KPI cards load from API, show section skeletons while loading, and show inline retry with last successful data fallback when KPI retrieval fails.

### Tests for User Story 1

- [ ] T014 [P] [US1] Add KPI rendering and loading-state component tests in `src/app/features/dashboard/components/kpi-card/kpi-card.component.spec.ts`
- [ ] T015 [P] [US1] Add dashboard container tests for KPI section orchestration in `src/app/features/dashboard/pages/dashboard/dashboard.component.spec.ts`
- [ ] T016 [P] [US1] Add `DashboardService` KPI success/error/timeout tests in `src/app/core/services/dashboard.service.spec.ts`

### Implementation for User Story 1

- [ ] T017 [P] [US1] Create reusable KPI card component in `src/app/features/dashboard/components/kpi-card/kpi-card.component.ts`, `src/app/features/dashboard/components/kpi-card/kpi-card.component.html`, and `src/app/features/dashboard/components/kpi-card/kpi-card.component.scss`
- [ ] T018 [US1] Wire KPI card component declarations/exports in `src/app/features/dashboard/dashboard.module.ts`
- [ ] T019 [US1] Implement dashboard page KPI section data binding in `src/app/features/dashboard/pages/dashboard/dashboard.component.ts` and `src/app/features/dashboard/pages/dashboard/dashboard.component.html`
- [ ] T020 [US1] Implement section-level KPI loading skeleton and inline error/retry UX in `src/app/features/dashboard/pages/dashboard/dashboard.component.html` and `src/app/features/dashboard/pages/dashboard/dashboard.component.scss`
- [ ] T021 [US1] Enforce Angular best practices for KPI components (OnPush change detection, typed inputs, pure view model mapping) in `src/app/features/dashboard/components/kpi-card/kpi-card.component.ts` and `src/app/features/dashboard/pages/dashboard/dashboard.component.ts`

**Checkpoint**: US1 is independently functional and testable as MVP.

---

## Phase 4: User Story 2 - Analyze Engagement Trends (Priority: P2)

**Goal**: Render Chart.js analytics for impressions/clicks, performance trends, and geographic distribution.

**Independent Test**: Open dashboard analytics section and verify all three chart groups render valid data; on analytics failure, dashboard keeps other sections usable and shows analytics inline retry state.

### Tests for User Story 2

- [ ] T022 [P] [US2] Add analytics chart component rendering tests in `src/app/features/dashboard/components/analytics-chart/analytics-chart.component.spec.ts`
- [ ] T023 [P] [US2] Add dashboard analytics section integration tests in `src/app/features/dashboard/pages/dashboard/dashboard.component.spec.ts`
- [ ] T024 [P] [US2] Add `DashboardService` partial-response analytics tests in `src/app/core/services/dashboard.service.spec.ts`

### Implementation for User Story 2

- [ ] T025 [P] [US2] Create reusable analytics chart component in `src/app/features/dashboard/components/analytics-chart/analytics-chart.component.ts`, `src/app/features/dashboard/components/analytics-chart/analytics-chart.component.html`, and `src/app/features/dashboard/components/analytics-chart/analytics-chart.component.scss`
- [ ] T026 [US2] Configure Chart.js datasets/options mapping in `src/app/features/dashboard/components/analytics-chart/analytics-chart.component.ts`
- [ ] T027 [US2] Integrate analytics section into dashboard container in `src/app/features/dashboard/pages/dashboard/dashboard.component.ts` and `src/app/features/dashboard/pages/dashboard/dashboard.component.html`
- [ ] T028 [US2] Implement analytics section loading/empty/error fallback behavior in `src/app/features/dashboard/pages/dashboard/dashboard.component.html` and `src/app/features/dashboard/pages/dashboard/dashboard.component.scss`
- [ ] T029 [US2] Enforce Angular best practices for analytics component (OnPush, immutable inputs, lightweight template logic) in `src/app/features/dashboard/components/analytics-chart/analytics-chart.component.ts`

**Checkpoint**: US2 is independently functional and testable without breaking US1.

---

## Phase 5: User Story 3 - Monitor Recent Platform Events (Priority: P3)

**Goal**: Display recent activity list for vendor onboarding and widget approval events with proper empty/error states.

**Independent Test**: Open dashboard activity section and verify latest activity appears in descending timestamp order; verify empty state and retry behavior on failures.

### Tests for User Story 3

- [ ] T030 [P] [US3] Add recent activity component tests for list/empty/error states in `src/app/features/dashboard/components/recent-activity/recent-activity.component.spec.ts`
- [ ] T031 [P] [US3] Add dashboard activity section integration tests in `src/app/features/dashboard/pages/dashboard/dashboard.component.spec.ts`
- [ ] T032 [P] [US3] Add `DashboardService` activity mapping and sorting tests in `src/app/core/services/dashboard.service.spec.ts`

### Implementation for User Story 3

- [ ] T033 [P] [US3] Create reusable recent activity component in `src/app/features/dashboard/components/recent-activity/recent-activity.component.ts`, `src/app/features/dashboard/components/recent-activity/recent-activity.component.html`, and `src/app/features/dashboard/components/recent-activity/recent-activity.component.scss`
- [ ] T034 [US3] Integrate recent activity section into dashboard container in `src/app/features/dashboard/pages/dashboard/dashboard.component.ts` and `src/app/features/dashboard/pages/dashboard/dashboard.component.html`
- [ ] T035 [US3] Implement activity empty state, inline error/retry, and stale-data fallback in `src/app/features/dashboard/pages/dashboard/dashboard.component.html` and `src/app/features/dashboard/pages/dashboard/dashboard.component.scss`
- [ ] T036 [US3] Enforce Angular best practices for activity component (OnPush, trackBy, typed inputs) in `src/app/features/dashboard/components/recent-activity/recent-activity.component.ts`

**Checkpoint**: US3 is independently functional and testable with US1 and US2 preserved.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality hardening, accessibility, and consistency checks across all stories.

- [ ] T037 [P] Run full dashboard unit test suite and fix failures in `src/app/features/dashboard/**/*.spec.ts` and `src/app/core/services/dashboard.service.spec.ts`
- [ ] T038 Validate WCAG-focused accessibility for dashboard sections and controls in `src/app/features/dashboard/pages/dashboard/dashboard.component.html` and component templates under `src/app/features/dashboard/components/`
- [ ] T039 [P] Refine dashboard styles for consistent admin layout (sidebar/header/KPI/charts/activity) in `src/app/features/dashboard/pages/dashboard/dashboard.component.scss`
- [ ] T040 Validate quickstart execution steps and update implementation notes in `specs/002-admin-dashboard/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies; start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2; defines MVP.
- **Phase 4 (US2)**: Depends on Phase 2 and integrates with dashboard container from US1.
- **Phase 5 (US3)**: Depends on Phase 2 and integrates with dashboard container from US1.
- **Phase 6 (Polish)**: Depends on completion of selected user stories.

### User Story Dependencies

- **US1 (P1)**: Independent after foundational phase.
- **US2 (P2)**: Independent for analytics behavior; shares dashboard container.
- **US3 (P3)**: Independent for activity behavior; shares dashboard container.

### Within Each User Story

- Write tests first, verify failures, then implement.
- Build component contracts before container wiring.
- Complete loading/error/empty behavior before story sign-off.

### Parallel Opportunities

- Setup tasks marked `[P]` can run together (`T003`, `T004`).
- Foundational model tasks marked `[P]` can run together (`T006`, `T007`).
- Test tasks in each story marked `[P]` can run together.
- Story-specific reusable component creation tasks marked `[P]` can run in parallel by separate developers.

---

## Parallel Example: User Story 1

```bash
# Parallel test-first tasks:
Task: "T014 [US1] KPI rendering/loading tests in src/app/features/dashboard/components/kpi-card/kpi-card.component.spec.ts"
Task: "T015 [US1] Dashboard KPI section tests in src/app/features/dashboard/pages/dashboard/dashboard.component.spec.ts"
Task: "T016 [US1] DashboardService KPI tests in src/app/core/services/dashboard.service.spec.ts"

# Parallel implementation tasks after tests:
Task: "T017 [US1] Create KPI card component files under src/app/features/dashboard/components/kpi-card/"
Task: "T019 [US1] Implement KPI section binding in src/app/features/dashboard/pages/dashboard/dashboard.component.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independent test criteria and route behavior.
4. Demo KPI-focused dashboard MVP.

### Incremental Delivery

1. Add US1 (KPI health) and validate.
2. Add US2 (analytics charts) and validate.
3. Add US3 (recent activity) and validate.
4. Finish Phase 6 polish and accessibility checks.

### Parallel Team Strategy

1. One developer completes foundational service/routing.
2. One developer builds KPI and container (US1).
3. Another developer builds analytics chart (US2) in parallel after foundation.
4. Another developer builds recent activity component (US3) in parallel after foundation.
5. Team merges with shared dashboard container tests before polish.

---

## Notes

- All tasks follow strict checklist format: checkbox + task ID + optional `[P]` + required `[USx]` for story tasks + file paths.
- Keep `DashboardService` as single source of API integration logic.
- Preserve section-level resilience behaviors from clarified spec (timeout, retry, stale-data fallback).
