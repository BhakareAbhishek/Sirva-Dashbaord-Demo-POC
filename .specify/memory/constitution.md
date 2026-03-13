<!--
Sync Impact Report
- Version change: 1.0.0 → 1.1.0
- Modified principles: None (existing principles unchanged)
- Added sections:
  - Principle VI: Repository Governance & Version Control (new)
- Removed sections: None
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md — Branch line already uses feature-branch convention; no semantic change required.
  - ✅ .specify/templates/spec-template.md — Traceability and spec-sync rules reinforced by new Principle VI; no structural update required.
  - ✅ .specify/templates/tasks-template.md — Commit-per-task guidance aligns with new commit message standard; no structural update required.
  - ✅ .specify/templates/constitution-template.md — Source template; no update required (this file is the live document).
  - ✅ .cursor/commands/speckit.constitution.md — Already aligned; no update required.
  - ✅ .cursor/commands/speckit.specify.md — Spec-sync rule in Principle VI reinforces existing guidance.
  - ✅ .cursor/commands/speckit.plan.md — Branch naming convention in Principle VI is consistent with plan branch field.
  - ✅ .cursor/commands/speckit.tasks.md — Commit message standard in Principle VI supplements existing task-to-commit guidance.
  - ✅ .cursor/commands/speckit.implement.md — PR requirements in Principle VI add PR-level gates consistent with implementation workflow.
  - ✅ .cursor/commands/speckit.analyze.md — Treats constitution as non-negotiable; new principle automatically covered.
  - ✅ .cursor/commands/speckit.checklist.md — Checklist gate already aligned; no update required.
  - ✅ .cursor/commands/speckit.clarify.md — No impact from new principle.
- Follow-up TODOs: None (all fields resolved)
-->

# Sirva CMS Marketplace Platform POC Constitution

## Core Principles

### I. Spec-First Development (NON-NEGOTIABLE)

- All work MUST follow the Spec Kit Spec-First workflow in this exact order:
  `constitution → specification → clarification → plan → tasks → checklist → implementation`.
- No implementation work (code, schema, or infrastructure changes) MAY begin until:
  - `spec.md` is complete and approved.
  - `plan.md` is complete and approved.
  - `tasks.md` is complete and approved.
  - At least one governance checklist (from `/speckit.checklist`) is created and approved.
- Every feature MUST have a traceable artifact chain:
  - Feature request → `spec.md` user stories and requirements.
  - `spec.md` → `plan.md` architecture and data decisions.
  - `plan.md` → `tasks.md` dependency-ordered tasks.
  - `tasks.md` → implementation commits and test evidence.
- `/speckit.analyze` MUST run after `tasks.md` generation and BEFORE `/speckit.implement` for every
  feature, and any CRITICAL issues MUST be resolved or explicitly deferred with owner and rationale.

**Rationale**: Spec-First governance ensures the hackathon POC remains coherent, reviewable, and
demonstrably traceable from idea to implementation, even with multiple contributors working in parallel.

### II. Angular-First Frontend with Clear Boundaries

- Angular 14 is the default and preferred framework for all UI implementation in this POC.
- Frontend code MUST:
  - Use typed models and interfaces for all data flowing between components and services.
  - Encapsulate feature logic into reusable, testable Angular modules and components.
  - Implement clear loading, error, and empty states for every user-facing page or widget.
- Any deviation from Angular 14 (e.g., use of raw HTML/JS or a different framework) MUST be:
  - Justified in `plan.md` with trade-offs.
  - Approved via code review on a dedicated PR.

**Rationale**: Standardizing on Angular 14 keeps the POC consistent, maintainable, and easier for
new team members to understand and extend.

### III. Modularity, Maintainability, and Future Expansion

- The system MUST be decomposed into well-defined, modular domains (e.g., Dashboard, Vendor
  Marketplace, Widget Library, Rules Engine, Publishing Workflow, Analytics).
- Each module MUST:
  - Have clearly documented responsibilities in `spec.md` and `plan.md`.
  - Expose well-defined contracts (interfaces, APIs, or shared models) documented under `contracts/`
    where applicable.
  - Avoid tight coupling to other modules; cross-module dependencies MUST be explicit in `plan.md`.
- Refactoring to improve readability, reuse, or separation of concerns is encouraged and SHOULD be
  captured as tasks in `tasks.md` with clear module ownership.

**Rationale**: A modular architecture is essential for evolving the Sirva CMS Marketplace Platform
beyond the POC without rewriting core flows.

### IV. Collaboration, Reviews, and Documentation Ownership

- All pull requests targeting the main branch MUST:
  - Be raised from a feature or fix branch.
  - Receive at least one peer review before merge (self-approval is not allowed).
  - Demonstrate traceability back to a feature spec and tasks (reference feature number or path in
    description).
- Every team member MUST:
  - Contribute at least one constitution/spec/plan/tasks/documentation update.
  - Contribute implementation and/or test commits aligned to tasks in `tasks.md`.
- Major decisions (architecture choices, data model changes, workflow design, governance exceptions)
  MUST be:
  - Documented in `plan.md`, `research.md`, or a clearly linked decision log.
  - Referenced in PR descriptions for discoverability.

**Rationale**: Shared ownership, reviews, and decision logging improve quality, knowledge transfer,
and credibility of the POC during judging and future handover.

### V. Quality, Traceability, and Non-Functional Discipline

- Requirements quality:
  - Specifications MUST use measurable, testable language; vague terms (e.g., "fast", "secure",
    "user-friendly") MUST be refined in `/speckit.clarify` before planning.
  - `/speckit.checklist` MUST be used to create "unit tests for English" before implementation;
    incomplete critical checklist items MUST be addressed or explicitly deferred with owner and reason.
- Implementation quality:
  - Tests (unit, integration, or end-to-end as appropriate) SHOULD be defined for critical flows
    and recorded as tasks.
  - Logging and basic observability SHOULD be included for key operations where it aids debugging
    during the POC.
- Traceability:
  - Each task in `tasks.md` MUST map to at least one user story or requirement.
  - Each implementation commit SHOULD reference the relevant task ID(s) and feature.

**Rationale**: Explicit traceability and quality discipline ensure the POC demonstrates
enterprise-grade practices even with hackathon time constraints.

### VI. Repository Governance & Version Control (NON-NEGOTIABLE)

- **Branch strategy**: The repository MUST use a feature-branch development strategy.
  - The `main` branch MUST remain stable and deployable at all times.
  - All development MUST occur in dedicated feature branches; direct commits to `main` are
    prohibited without a reviewed and approved pull request.
- **Branch naming convention**: Feature branches MUST follow this pattern:

  | Branch | Purpose |
  |--------|---------|
  | `feature/dashboard` | Dashboard KPI cards, metrics, and overview widgets |
  | `feature/vendors` | Vendor Marketplace listing, filtering, and management |
  | `feature/widgets` | Widget Library, widget lifecycle, and AI-assisted creation |
  | `feature/rules-engine` | Rules Engine logic, rule templates, and evaluation flows |
  | `feature/analytics` | Analytics views, reporting, and data visualization |

  Additional branches MUST follow the `feature/<short-kebab-description>` pattern and be documented
  in the relevant `spec.md` before creation.

- **Pull request requirements**: Every PR targeting `main` MUST include:
  1. A reference to the related feature specification (path or ID, e.g., `specs/001-dashboard/spec.md`).
  2. A clear description of changes made in this PR.
  3. Testing evidence (screenshots, test run output, or manual test steps with results).
  PRs that do not satisfy all three requirements MUST NOT be merged.

- **Commit message standard**: All commits MUST follow the Conventional Commits format:

  ```
  feat: add dashboard KPI cards
  fix: resolve widget lifecycle bug
  docs: update vendor specification
  refactor: improve rule engine logic
  ```

  Permitted prefixes: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `style`.
  The subject line MUST be lowercase, imperative mood, and under 72 characters.
  Breaking changes MUST append `!` after the prefix (e.g., `feat!: restructure analytics API`).

- **Documentation & spec synchronization**:
  - Documentation MUST be updated whenever feature behavior changes; a documentation update
    task MUST appear in `tasks.md` alongside its corresponding implementation task.
  - Specification artifacts (`spec.md`, `plan.md`, `tasks.md`) MUST remain synchronized with
    implementation; drift between specs and code MUST be flagged as CRITICAL during
    `/speckit.analyze` and resolved before the next merge.

**Rationale**: A disciplined branching, PR, and commit strategy ensures traceability between
requirements, planning, and implementation; keeps `main` always demo-ready; and makes the
repository history a reliable audit trail for the POC and future handover.

## Platform Architecture & Modularity

- The platform MUST support the following high-level modules at minimum:
  - Dashboard
  - Vendor Marketplace
  - Widget Library and AI-assisted widget creation (advisory only)
  - Landing Page Management
  - Rules Engine and Rule Templates
  - Publishing Workflow
  - Analytics and Reporting
- AI components MUST remain advisory:
  - AI MAY recommend widgets, rules, or layouts.
  - AI MUST NOT publish or bypass human approval flows.
- Security, role-based access, and approval workflows are governed by the README and subsequent
  specs/plan; any change to these behaviors MUST be documented as an explicit decision in `plan.md`.

## Development Workflow & Quality Gates

- The mandatory workflow for every feature is:
  1. `/speckit.constitution` (this document kept up to date as needed).
  2. `/speckit.specify` to create or update `spec.md`.
  3. `/speckit.clarify` to resolve critical ambiguities.
  4. `/speckit.plan` to generate `plan.md`, data model, contracts, and quickstart.
  5. `/speckit.tasks` to generate `tasks.md`.
  6. `/speckit.analyze` to check cross-artifact consistency and constitution alignment.
  7. `/speckit.checklist` to create governance and quality checklists.
  8. `/speckit.implement` to execute `tasks.md` and update progress.
- **No implementation task MAY start before:**
  - `spec.md`, `plan.md`, and `tasks.md` are present and marked ready by the relevant role owners.
  - At least one checklist file exists with all CRITICAL items complete or explicitly deferred by
    the Project Manager and Tech Lead.
- Any deviation from this workflow for spikes or experiments MUST:
  - Be labeled as such in branch and PR names.
  - Not be merged into `main` without backfilling the missing artifacts.

## Governance

- This constitution is the authoritative source of development governance for the Sirva CMS
  Marketplace Platform POC. In case of conflict, it overrides ad hoc practices or local team habits.
- Amendment rules:
  - Any change to principles or workflow MUST be proposed via `/speckit.constitution` and captured
    as a new version.
  - Amendments MUST describe why the change is needed (e.g., discovered constraint, improved practice).
  - MAJOR changes (breaking or relaxing non-negotiable rules) require consensus from PM, Tech Lead,
    and QA Lead.
- Versioning policy:
  - MAJOR version: Backward-incompatible governance or principle changes.
  - MINOR version: New principles or sections, or materially strengthened guidance.
  - PATCH version: Clarifications and editorial improvements with no semantic effect.
- Compliance:
  - `/speckit.analyze` MUST treat this constitution as non-negotiable; any violation is CRITICAL.
  - Code reviews MUST include a quick constitution compliance check for the affected areas.
  - New contributors MUST read this constitution and the project README before running any Spec Kit
    commands.

**Version**: 1.1.0 | **Ratified**: 2026-03-13 | **Last Amended**: 2026-03-13
