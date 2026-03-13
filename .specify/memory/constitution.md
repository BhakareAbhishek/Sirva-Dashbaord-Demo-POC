<!--
Sync Impact Report
- Version change: 1.0.0 → 1.1.0
- Modified principles:
  - V. Quality, Traceability, and Non-Functional Discipline (expanded with explicit QA and testing standards)
- Added sections:
  - None
- Removed sections:
  - None
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (Constitution Check gates aligned; QA expectations referenced via constitution)
  - ✅ .specify/templates/spec-template.md (acceptance criteria and edge cases already required; aligns with QA standards)
  - ✅ .specify/templates/tasks-template.md (supports adding QA and regression tasks per feature)
  - ✅ .cursor/commands/speckit.constitution.md (constitution sync instructions already aligned)
  - ✅ .cursor/commands/speckit.specify.md (spec quality and governance flow aligned)
  - ✅ .cursor/commands/speckit.clarify.md (runs before plan per constitution)
  - ✅ .cursor/commands/speckit.plan.md (constitution check draws from this document)
  - ✅ .cursor/commands/speckit.tasks.md (tasks depend on approved spec and plan)
  - ✅ .cursor/commands/speckit.analyze.md (treats constitution as non‑negotiable)
  - ✅ .cursor/commands/speckit.checklist.md (checklists used as pre‑implementation and QA gates)
  - ✅ .cursor/commands/speckit.implement.md (enforces pre‑implementation artifacts and checklists)
- Follow-up TODOs:
  - None (QA and testing standards fully captured for this POC)
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
- `/speckit.analyze` MUST run after `tasks.md` generation and BEFORE `/speckit.implement` for every feature, and any CRITICAL issues MUST be resolved or explicitly deferred with owner and rationale.

**Rationale**: Spec-First governance ensures the hackathon POC remains coherent, reviewable, and demonstrably traceable from idea to implementation, even with multiple contributors working in parallel.

### II. Angular-First Frontend with Clear Boundaries

- Angular 14 is the default and preferred framework for all UI implementation in this POC.
- Frontend code MUST:
  - Use typed models and interfaces for all data flowing between components and services.
  - Encapsulate feature logic into reusable, testable Angular modules and components.
  - Implement clear loading, error, and empty states for every user-facing page or widget.
- Any deviation from Angular 14 (e.g., use of raw HTML/JS or a different framework) MUST be:
  - Justified in `plan.md` with trade-offs.
  - Approved via code review on a dedicated PR.

**Rationale**: Standardizing on Angular 14 keeps the POC consistent, maintainable, and easier for new team members to understand and extend.

### III. Modularity, Maintainability, and Future Expansion

- The system MUST be decomposed into well-defined, modular domains (e.g., Dashboard, Vendor Marketplace, Widget Library, Rules Engine, Publishing Workflow, Analytics).
- Each module MUST:
  - Have clearly documented responsibilities in `spec.md` and `plan.md`.
  - Expose well-defined contracts (interfaces, APIs, or shared models) documented under `contracts/` where applicable.
  - Avoid tight coupling to other modules; cross-module dependencies MUST be explicit in `plan.md`.
- Refactoring to improve readability, reuse, or separation of concerns is encouraged and SHOULD be captured as tasks in `tasks.md` with clear module ownership.

**Rationale**: A modular architecture is essential for evolving the Sirva CMS Marketplace Platform beyond the POC without rewriting core flows.

### IV. Collaboration, Reviews, and Documentation Ownership

- All pull requests targeting the main branch MUST:
  - Be raised from a feature or fix branch.
  - Receive at least one peer review before merge (self-approval is not allowed).
  - Demonstrate traceability back to a feature spec and tasks (reference feature number or path in description).
- Every team member MUST:
  - Contribute at least one constitution/spec/plan/tasks/documentation update.
  - Contribute implementation and/or test commits aligned to tasks in `tasks.md`.
- Major decisions (architecture choices, data model changes, workflow design, governance exceptions) MUST be:
  - Documented in `plan.md`, `research.md`, or a clearly linked decision log.
  - Referenced in PR descriptions for discoverability.

**Rationale**: Shared ownership, reviews, and decision logging improve quality, knowledge transfer, and credibility of the POC during judging and future handover.

### V. Quality, Traceability, and Non-Functional Discipline

- Requirements quality:
  - Specifications MUST use measurable, testable language; vague terms (e.g., “fast”, “secure”, “user-friendly”) MUST be refined in `/speckit.clarify` before planning.
  - `/speckit.checklist` MUST be used to create “unit tests for English” before implementation; incomplete critical checklist items MUST be addressed or explicitly deferred with owner and reason.
- QA and testing standards:
  - Every feature MUST include at least one QA checklist under its `checklists/` directory before implementation begins.
  - All features MUST be validated against their specification, including documented acceptance criteria and success metrics.
  - UI behavior MUST match the agreed Figma (or equivalent) design reference for that feature.
  - Edge cases MUST be identified, documented (in `spec.md`, tests, or checklists), and explicitly tested.
  - Functional testing MUST validate core workflows for each P1 and P2 user story at minimum; these tests MAY be automated or manual but MUST be represented as tasks.
  - When major features or core workflows change, regression testing MUST be performed and captured as tasks before release.
  - QA approval (via checklist completion and/or review sign-off) is REQUIRED before merging pull requests into the main branch.
- Implementation quality:
  - Tests (unit, integration, or end-to-end as appropriate) SHOULD be defined for critical flows and recorded as tasks.
  - Logging and basic observability SHOULD be included for key operations where it aids debugging during the POC.
- Traceability:
  - Each task in `tasks.md` MUST map to at least one user story or requirement.
  - Each implementation commit SHOULD reference the relevant task ID(s) and feature.

**Rationale**: Explicit QA standards, traceability, and quality discipline ensure the POC demonstrates enterprise-grade reliability and correctness even with hackathon time constraints.

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
- Security, role-based access, and approval workflows are governed by the README and subsequent specs/plan; any change to these behaviors MUST be documented as an explicit decision in `plan.md`.

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
  - At least one checklist file exists with all CRITICAL items complete or explicitly deferred by the Project Manager and Tech Lead.
- Any deviation from this workflow for spikes or experiments MUST:
  - Be labeled as such in branch and PR names.
  - Not be merged into main without backfilling the missing artifacts.

## Governance

- This constitution is the authoritative source of development governance for the Sirva CMS Marketplace Platform POC. In case of conflict, it overrides ad hoc practices or local team habits.
- Amendment rules:
  - Any change to principles or workflow MUST be proposed via `/speckit.constitution` and captured as a new version.
  - Amendments MUST describe why the change is needed (e.g., discovered constraint, improved practice).
  - MAJOR changes (breaking or relaxing non-negotiable rules) require consensus from PM, Tech Lead, and QA Lead.
- Versioning policy:
  - MAJOR version: Backward-incompatible governance or principle changes.
  - MINOR version: New principles or sections, or materially strengthened guidance.
  - PATCH version: Clarifications and editorial improvements with no semantic effect.
- Compliance:
  - `/speckit.analyze` MUST treat this constitution as non-negotiable; any violation is CRITICAL.
  - Code reviews MUST include a quick constitution compliance check for the affected areas.
  - New contributors MUST read this constitution and the project README before running any Spec Kit commands.

**Version**: 1.1.0 | **Ratified**: 2026-03-13 | **Last Amended**: 2026-03-13

