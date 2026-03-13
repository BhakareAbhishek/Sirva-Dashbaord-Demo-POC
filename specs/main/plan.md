# Implementation Plan: Sirva CMS Marketplace Platform

**Branch**: `main` | **Date**: 2026-03-13 | **Spec**: [spec.md](../001-sirva-cms-marketplace/spec.md)  
**Input**: Feature specification from `/specs/001-sirva-cms-marketplace/spec.md`

## Summary

Implement the Sirva CMS Marketplace Platform as an Angular 14 single-page application with a modular architecture. The platform provides governed vendor content publishing, rule-based widget delivery, platform governance, and AI-guided content optimization. The frontend is the primary deliverable for this POC; backend APIs are consumed via versioned REST. Architecture emphasizes feature modules (dashboard, vendors, widgets, landing pages, rules engine, analytics, AI), shared/core modules, typed data models, reusable UI components, and a clear API communication layer to support modular scalability.

## Technical Context

**Language/Version**: TypeScript 4.6+ (Angular 14)  
**Primary Dependencies**: Angular 14, Angular Router, RxJS, Chart.js (ng2-charts or equivalent), Angular Material or custom design system  
**Storage**: N/A (frontend only; backend APIs assumed for persistence)  
**Testing**: Jasmine/Karma (Angular default), optional Cypress/Playwright for e2e  
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge); desktop-first responsive  
**Project Type**: web-application (Angular SPA)  
**Performance Goals**: Initial load &lt; 3s; widget delivery views &lt; 2s; dashboard KPIs visible within 3 clicks  
**Constraints**: WCAG 2.1 AA; typed models for all data; loading/empty/error states on all user-facing views  
**Scale/Scope**: Multiple feature modules; 50+ screens/components; support for additional vendors and campaigns without degrading UX  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|--------|
| **I. Spec-First** | PASS | Plan follows spec from `specs/001-sirva-cms-marketplace/spec.md`; no implementation before spec/plan/tasks/checklist approved. |
| **II. Angular-First** | PASS | Angular 14; typed models; feature modules; loading/error/empty states defined. |
| **III. Modularity** | PASS | Feature modules (dashboard, vendors, widgets, landing pages, rules engine, analytics, AI); shared/core; contracts documented. |
| **IV. Collaboration** | PASS | PR/review and traceability to spec/plan/tasks assumed. |
| **V. Quality & QA** | PASS | Testable requirements; checklists; QA gates before merge. |
| **Platform modules** | PASS | Dashboard, Vendor Marketplace, Widget Library, Landing Pages, Rules Engine, Analytics, AI (advisory) all present. |
| **AI advisory only** | PASS | AI module advisory only; no auto-publish. |

## Project Structure

### Documentation (this feature)

```text
specs/main/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1 (API contracts)
└── tasks.md             # Phase 2 (/speckit.tasks)
```

### Source Code (Angular 14 – repository root)

```text
src/
├── app/
│   ├── app.component.ts
│   ├── app.module.ts
│   ├── app-routing.module.ts
│   │
│   ├── core/                           # Singleton services, guards, interceptors
│   │   ├── services/
│   │   │   ├── api/
│   │   │   │   ├── api.service.ts              # Base HTTP / base URL
│   │   │   │   ├── vendor-api.service.ts
│   │   │   │   ├── widget-api.service.ts
│   │   │   │   ├── landing-page-api.service.ts
│   │   │   │   ├── rules-api.service.ts
│   │   │   │   ├── analytics-api.service.ts
│   │   │   │   └── widget-delivery-api.service.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── config.service.ts
│   │   │   └── ...
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── role.guard.ts
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts
│   │   │   └── error.interceptor.ts
│   │   └── core.module.ts
│   │
│   ├── shared/                         # Shared module (components, pipes, directives)
│   │   ├── shared.module.ts
│   │   ├── components/
│   │   │   ├── sidebar/
│   │   │   ├── header/
│   │   │   ├── data-table/
│   │   │   ├── forms/                  # Reusable form controls / wrappers
│   │   │   ├── charts/                 # Chart.js wrappers
│   │   │   ├── cards/
│   │   │   └── modal-dialog/
│   │   ├── design-system/              # Design system components
│   │   ├── pipes/
│   │   └── directives/
│   │
│   ├── features/
│   │   ├── dashboard/
│   │   │   ├── dashboard.module.ts
│   │   │   ├── dashboard-routing.module.ts
│   │   │   ├── components/
│   │   │   └── pages/
│   │   ├── vendors/
│   │   │   ├── vendors.module.ts
│   │   │   ├── vendors-routing.module.ts
│   │   │   ├── components/
│   │   │   └── pages/
│   │   ├── widgets/
│   │   │   ├── widgets.module.ts
│   │   │   ├── widgets-routing.module.ts
│   │   │   ├── components/
│   │   │   └── pages/
│   │   ├── landing-pages/
│   │   │   ├── landing-pages.module.ts
│   │   │   ├── landing-pages-routing.module.ts
│   │   │   ├── components/
│   │   │   └── pages/
│   │   ├── rules-engine/
│   │   │   ├── rules-engine.module.ts
│   │   │   ├── rules-engine-routing.module.ts
│   │   │   ├── components/
│   │   │   └── pages/
│   │   ├── analytics/
│   │   │   ├── analytics.module.ts
│   │   │   ├── analytics-routing.module.ts
│   │   │   ├── components/
│   │   │   └── pages/
│   │   └── ai/
│   │       ├── ai.module.ts
│   │       ├── ai-routing.module.ts
│   │       ├── components/
│   │       └── pages/
│   │
│   └── models/                         # TypeScript interfaces (shared)
│       ├── vendor.model.ts
│       ├── widget.model.ts
│       ├── landing-page.model.ts
│       ├── rule.model.ts
│       ├── analytics.model.ts
│       ├── api-response.model.ts
│       └── ...
│
├── assets/
├── environments/
└── index.html
```

**Structure Decision**: Single Angular application with `core` (singleton services, auth, config), `shared` (reusable UI and design system), and `features/*` for domain modules. All API and auth logic lives under `core/services`. Data models are global under `app/models` for use by features and services. This supports lazy-loaded feature modules and clear boundaries for scalability.

---

## Routing Architecture

- **App root** (`app-routing.module.ts`): Default route to dashboard; lazy-loaded feature routes.
- **Dashboard**: `/` or `/dashboard` — KPIs, drill-downs.
- **Vendors**: `/vendors` (list), `/vendors/new`, `/vendors/:id`, `/vendors/:id/edit`.
- **Widgets**: `/widgets` (library), `/widgets/new`, `/widgets/:id`, `/widgets/:id/edit`.
- **Landing pages**: `/landing-pages` (list), `/landing-pages/new`, `/landing-pages/:id`, `/landing-pages/:id/edit`.
- **Rules engine**: `/rules` (templates + rule list), `/rules/templates/:id`, `/rules/:id`.
- **Analytics**: `/analytics` (overview), `/analytics/campaigns`, `/analytics/vendors`, etc.
- **AI**: `/ai` (guidance/recommendations).

Each feature module defines its own `*-routing.module.ts` and exports a single route path (e.g. `vendors`) for the root router to load children.

---

## API Communication Layer

- **Base**: `core/services/api/api.service.ts` — HttpClient, base URL from `config.service`, optional auth header via interceptor.
- **Feature-specific services**: Each domain (vendors, widgets, landing pages, rules, analytics, widget-delivery) has a service in `core/services/api/` that uses the base service and returns Observables of typed models.
- **Contracts**: Versioned REST; base paths `/v1/vendors`, `/v1/widgets`, `/v1/landing-pages`, `/v1/rules`, `/v1/analytics`, and widget delivery as per spec (request context, response envelope with `widgets`, pagination, errors). See `contracts/` for request/response shapes.
- **Error handling**: Centralized in `error.interceptor.ts`; services map HTTP errors to a common error model; UI shows loading/empty/error states.

---

## Data Models (TypeScript Interfaces)

- **Vendor**: id, name, status, profile, governance tier, timestamps.
- **Widget**: id, vendorId, type, content, targeting rules, status, version, timestamps.
- **Landing Page**: id, vendorId, title, content sections, linked widget IDs, status, timestamps.
- **Rule / Rule Template**: id, name, conditions, priority, template ref, timestamps.
- **Analytics**: event types (impression, click, lead, conversion), filters (vendor, widget, time range, segment).
- **API responses**: Generic envelope (metadata, data, pagination, errors) and widget-delivery envelope (request metadata, widgets array, pagination, errors).

All defined in `app/models/*.model.ts` and used by services and components.

---

## Reusable UI Components

| Component       | Location              | Purpose |
|----------------|-----------------------|--------|
| Sidebar        | `shared/components/sidebar` | App navigation, role-based menu items. |
| Header         | `shared/components/header`  | Branding, user menu, global actions. |
| Data tables    | `shared/components/data-table` | Sortable, filterable, paginated tables. |
| Forms          | `shared/components/forms`   | Form controls, validation, submit/cancel. |
| Charts         | `shared/components/charts`  | Chart.js wrappers (bar, line, pie) for analytics. |
| Cards          | `shared/components/cards`   | Summary cards, widget cards, KPI cards. |
| Modal dialogs  | `shared/components/modal-dialog` | Confirm, form modals, consistent styling. |

Design system components live under `shared/design-system/` and are used by the above. All components support loading, empty, and error states where applicable.

---

## Modular Scalability

- **Lazy loading**: All feature modules loaded via `loadChildren` to keep initial bundle small.
- **Encapsulation**: Features depend on `core` and `shared`; features do not import each other directly; cross-cutting data via services or route params.
- **Contracts**: Public API shapes in `contracts/` and `app/models` allow backend/frontend to evolve with clear compatibility rules.
- **New features**: New domain = new folder under `features/`, new routing segment, new API service in `core/services/api` if needed.

## Complexity Tracking

*No constitution violations requiring justification.*
