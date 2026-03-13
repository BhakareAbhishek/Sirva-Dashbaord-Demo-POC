# Quickstart: Sirva CMS Marketplace Platform (Angular 14)

**Branch**: `main` | **Date**: 2026-03-13  
**Audience**: Developers setting up the Angular frontend for the first time.

---

## Prerequisites

- Node.js 18+ and npm 10+ (or yarn/pnpm)
- Angular CLI 14: `npm install -g @angular/cli@14`

---

## 1. Clone and Install

```bash
git clone <repo-url>
cd Sirva-Dashbaord-Demo-POC
npm install
```

---

## 2. Configuration

- Copy or create `src/environments/environment.ts` (and `environment.prod.ts`) with:
  - `apiBaseUrl`: base URL for REST API (e.g. `https://api.example.com/v1`)
  - Any feature flags or auth endpoints if used

---

## 3. Run Locally

```bash
ng serve
```

Open `http://localhost:4200`. Default route goes to dashboard (or login if auth guard is enabled).

---

## 4. Project Layout (Summary)

| Path | Purpose |
|------|--------|
| `src/app/core` | API services, auth, config, guards, interceptors |
| `src/app/shared` | Sidebar, header, data-table, forms, charts, cards, modals |
| `src/app/features/*` | Dashboard, vendors, widgets, landing-pages, rules-engine, analytics, ai |
| `src/app/models` | TypeScript interfaces for Vendor, Widget, Rule, etc. |

---

## 5. Key Commands

| Command | Description |
|---------|-------------|
| `ng serve` | Dev server |
| `ng build` | Production build |
| `ng test` | Unit tests (Jasmine/Karma) |
| `ng e2e` | E2E (if configured) |
| `ng generate module features/<name> --routing` | New feature module |

---

## 6. API Base URL

All API calls go through `core/services/api/api.service.ts` using `config.service` base URL. Ensure backend is running and CORS is configured for the dev origin (e.g. `http://localhost:4200`).

---

## 7. Spec and Plan References

- Feature spec: `specs/001-sirva-cms-marketplace/spec.md`
- Implementation plan: `specs/main/plan.md`
- Data model: `specs/main/data-model.md`
- API contracts: `specs/main/contracts/`
- Research: `specs/main/research.md`

---

## 8. Next Steps

1. Run `/speckit.tasks` to generate `tasks.md`.
2. Run `/speckit.analyze` and `/speckit.checklist` before implementation.
3. Implement in order: core + shared shell → feature modules (dashboard, vendors, widgets, etc.) per tasks.
