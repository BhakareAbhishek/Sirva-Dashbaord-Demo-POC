# Sirva CMS Marketplace Platform - Hackathon Execution Guide

This README documents how to execute the project using Spec-Driven Development with Spec Kit from start to implementation, while ensuring all six team roles are actively used.

Decision for this repo: **Approach A (Spec-First)**.  
We will complete constitution, spec, clarification, plan, tasks, and quality gates first.  
Framework implementation starts only after spec artifacts are approved.

References:
- Figma: [Enterprise CMS Marketplace Platform](https://tack-case-95137354.figma.site/governance)
- Spec Kit: [github/spec-kit](https://github.com/github/spec-kit)

## 1) Team Structure (6 People, All Roles Covered)

Use this role mapping during execution and demo:

| Person | Primary Role | Secondary Role | Responsibility in Spec Kit Flow |
|---|---|---|---|
| 1 | Project Manager | Product Owner | Scope, timeline, decision log, final sign-off |
| 2 | Business Analyst | Documentation | Requirements breakdown, acceptance criteria |
| 3 | UI/UX Designer | Design QA | Figma mapping, UX validation |
| 4 | Developer A | Tech Lead | Architecture, backend/API planning and implementation |
| 5 | Developer B | Frontend Developer | Widget UI, integration, implementation |
| 6 | QA Engineer | Test Lead | Checklist, quality validation, test evidence |

## 2) Project Initialization (PowerShell)

Run these commands from this project root:

```powershell
# Install Spec Kit CLI (one-time)
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# Move to this repository
cd "c:\Raaghu Project\Spec Kit Bootcamp\Sirva-Dashbaord-Demo-POC"

# Initialize Spec Kit for Cursor
specify init . --ai cursor-agent --script ps --force
```

If you face Windows encoding issue while running `specify init`:

```powershell
$env:PYTHONUTF8=1
$env:PYTHONIOENCODING='utf-8'
specify init . --ai cursor-agent --script ps --force
```

## 3) Mandatory Spec Kit Command Sequence

Run these slash commands in Cursor chat in exact order:

1. `/speckit.constitution`
2. `/speckit.specify`
3. `/speckit.clarify`
4. `/speckit.plan`
5. `/speckit.tasks`
6. `/speckit.analyze`
7. `/speckit.checklist`
8. `/speckit.implement`

This sequence gives a complete start-to-end execution trail for hackathon judging.

Approach A governance rule:
- Do not start framework coding before `/speckit.tasks` is approved by PM + Architect + QA.
- `/speckit.implement` should execute only after `/speckit.analyze` and `/speckit.checklist` findings are resolved or accepted.

## 4) Role Ownership Across Commands

- **Project Manager:** Runs `/speckit.constitution` (quality, governance, compliance principles)
- **Business Analyst:** Runs `/speckit.specify` (full module requirements and user stories)
- **UI/UX Designer:** Runs `/speckit.clarify` (resolves UX-level open points)
- **Developer A (Tech Lead):** Runs `/speckit.plan` (architecture, APIs, data model, workflows)
- **Developer B (Frontend):** Runs `/speckit.tasks` and `/speckit.implement` (task execution)
- **QA Engineer:** Runs `/speckit.analyze` and `/speckit.checklist` (validation and quality proof)

## 5) Copy-Ready Prompts for Each Phase

### `/speckit.constitution`
"Create principles for security, approval governance, role-based access, AI advisory-only behavior, auditability, test coverage minimum, and performance SLAs for widget delivery."

### `/speckit.specify`
"Build Sirva CMS Marketplace Platform with modules: Dashboard, Vendor Marketplace, Widget Library, AI-assisted widget creation, Landing Pages, Rules Engine, Rule Templates, Publishing Workflow, Analytics, and AI Personalization advisory recommendations. Include roles: Platform Admin, Vendor, Sirva Apps. Include lifecycle Draft -> Review -> Approved -> Published -> Expired and approval comments."

### `/speckit.clarify`
"Ask structured clarification questions for unknowns: required fields per widget type, rule-node schema, mandatory approval gates, analytics event definitions, persona taxonomy, and POC scope constraints."

### `/speckit.plan`
"Create a technical plan for POC with APIs for widgets/rules/vendors/analytics, RBAC, approval workflow, event tracking, and dynamic widget delivery endpoint for web/mobile consumers."

### `/speckit.tasks`
"Generate dependency-ordered tasks with [P] parallel tasks and test-first structure. Include exact file paths."

### `/speckit.analyze`
"Run cross-artifact consistency check for spec, plan, tasks; flag missing requirements and governance conflicts."

### `/speckit.checklist`
"Generate release-readiness checklist for functional completeness, UX parity with Figma, QA, security, and performance."

### `/speckit.implement`
"Execute tasks in order, respecting dependencies and tests."

## 6) What to Show as Execution Evidence

Capture these artifacts/screenshots for final presentation:

- Terminal outputs for `specify init` and `specify check`
- Cursor screenshots of each `/speckit.*` command execution
- Generated artifacts:
  - `.specify/memory/constitution.md`
  - `specs/<feature>/spec.md`
  - `specs/<feature>/plan.md`
  - `specs/<feature>/tasks.md`
  - `contracts`, `data-model`, `research`, and `quickstart` files
- QA evidence:
  - Checklist pass/fail report
  - Test run output
  - Defect list and retest evidence

## 7) Recommended POC Scope (to Avoid Over-Engineering)

Keep implementation intentionally focused:

- 3 widget types: Banner, Promo Card, CTA
- 3 rule templates: Mobile-only, Geography, Persona
- Basic approval flow with comments
- Core analytics only: impressions, clicks, leads
- AI personalization as advisory recommendations only (no auto-publish)

## 8) Suggested Hackathon Timeline

- **Hour 1:** Constitution + Specify + Clarify
- **Hour 2:** Plan + Tasks + Architecture sign-off
- **Hours 3-5:** Implementation in parallel
- **Hour 6:** QA validation, checklist, and demo prep

## 9) Module Coverage Checklist for This Problem Statement

- Dashboard
- Vendor Marketplace
- Widget Library
- AI-Assisted Widget Creation
- Landing Page Management
- Rules Engine
- Rule Templates
- Publishing Workflow
- Analytics
- AI Personalization (advisory only)

If all the above are traceable from `spec.md` -> `plan.md` -> `tasks.md` -> implementation, your end-to-end Spec-Driven Development story is complete.

## 10) Member-Wise Messages to Pass (Copy/Paste)

Use these exact messages in Cursor chat so each member has a visible contribution, including constitution updates.

### A) Project Manager (Constitution Base)

Command:

`/speckit.constitution`

Message to pass:

"Create project constitution for Sirva CMS Marketplace Platform. Include governance principles for approval workflow, role accountability, audit trail, release quality gates, and decision ownership. Ensure AI modules are advisory only and cannot bypass admin approvals."

Expected output ownership:
- Governance rules
- Approval and rejection policy
- Definition of Done gates

### B) Business Analyst (Constitution Enhancement + Specify)

Constitution update message:

"Update constitution with requirement traceability rules. Every feature must map to user stories, acceptance criteria, and measurable outcomes. Add clarity standards for ambiguous requirements and mandatory assumptions log."

Specify command:

`/speckit.specify`

Specify message:

"Build Sirva CMS Marketplace Platform with modules: Dashboard, Vendor Marketplace, Widget Library, AI-assisted widget creation, Landing Page Management, Rules Engine, Rule Templates, Publishing Workflow, Analytics, and AI Personalization. Include roles Platform Admin, Vendor, Sirva Apps, with clear user stories and acceptance criteria."

### C) UI/UX Designer (Constitution UX Standards + Clarify)

Constitution update message:

"Add UI/UX constitution standards: accessibility baseline, responsive behavior, design consistency with Figma, form validation behavior, error-state clarity, and reusable component-first design."

Clarify command:

`/speckit.clarify`

Clarify message:

"Ask structured UX clarification questions for widget creation steps, rule builder usability, landing page editor behavior, mobile responsiveness, and approval workflow screens. Capture unresolved UX assumptions explicitly."

### D) Developer A / Tech Lead (Constitution Engineering + Plan)

Constitution update message:

"Add engineering constitution standards: modular architecture, API contract-first design, RBAC enforcement, secure defaults, logging and observability, and performance SLOs for widget fetch APIs."

Plan command:

`/speckit.plan`

Plan message (spec-first, framework-neutral):

"Create implementation plan for Sirva CMS Marketplace POC with modular architecture, API contracts, RBAC, approval workflow, rules engine, analytics events, and deployment assumptions. Keep technology choice open until plan review; include selection criteria and trade-offs."

### E) Developer B / Frontend (Constitution FE Quality + Tasks + Implement)

Constitution update message:

"Add frontend constitution standards: consistent component structure, shared UI library usage, typed models/interfaces, loading/error/empty states for all pages, and testability requirements."

Tasks command:

`/speckit.tasks`

Tasks message:

"Generate dependency-ordered tasks with [P] for parallel work across frontend, backend, and QA validation. Include exact file paths and checkpoints per user story."

Implement command:

`/speckit.implement`

Implement message:

"Execute tasks in order with dependency awareness, maintain role-based features, preserve approval governance, and update progress at each checkpoint."

### F) QA Engineer (Constitution Quality Gates + Analyze + Checklist)

Constitution update message:

"Add QA constitution standards: test strategy (unit/integration/e2e), minimum coverage thresholds, severity classification, entry/exit criteria, non-functional checks, and release blocking conditions."

Analyze command:

`/speckit.analyze`

Analyze message:

"Run consistency analysis across constitution, spec, plan, and tasks. Flag missing requirements, conflicting assumptions, and uncovered acceptance criteria."

Checklist command:

`/speckit.checklist`

Checklist message:

"Create release-readiness checklist covering functionality, UX parity with Figma, RBAC/security, analytics accuracy, workflow governance, and regression risk."

## 11) Git Branch, Commit, and PR Plan for All Members

Each member should create one constitution PR and additional phase PRs to prove contribution.

Branch naming:
- `feat/constitution-pm-governance`
- `feat/constitution-ba-traceability`
- `feat/constitution-uiux-standards`
- `feat/constitution-deva-architecture`
- `feat/constitution-devb-frontend-quality`
- `feat/constitution-qa-quality-gates`

Commit message pattern:
- `docs(constitution): add <role-specific principle>`
- `docs(spec): refine <module or user story>`
- `docs(plan): add <technical decision>`
- `chore(tasks): generate and refine task breakdown`
- `feat(<module>): implement <feature>`
- `test(<module>): add validation for <scenario>`

PR title format:
- `[ROLE] Constitution update - <focus>`
- `[ROLE] Spec update - <focus>`
- `[ROLE] Plan/tasks/implementation - <focus>`

PR description template:

```md
## Role
<PM/BA/UIUX/DevA/DevB/QA>

## What I changed
- ...

## Why
- ...

## Evidence
- Command run:
- Artifact updated:
- Screenshot/log reference:

## Review checklist
- [ ] Aligns with constitution
- [ ] Traceable to spec/plan/tasks
- [ ] No governance bypass
```

## 12) Demo Script (Who Speaks and Shows What)

Use this quick sequence in final presentation:

1. **PM (1 min):** Problem statement, governance model, team workflow.
2. **BA (1 min):** `/speckit.specify` output and acceptance criteria mapping.
3. **UI/UX (1 min):** Figma parity and clarified UX decisions.
4. **Dev A (1 min):** Architecture and `/speckit.plan` artifacts.
5. **Dev B (1 min):** `/speckit.tasks` and implementation progress.
6. **QA (1 min):** `/speckit.analyze`, `/speckit.checklist`, test and readiness status.

This makes all 6 members active in both execution and presentation.

## 13) Spec-First Gate (Before Any Framework Code)

Coding starts only when all checks are satisfied:

- Constitution has role-wise non-negotiables from all contributors.
- `spec.md` has complete user stories and measurable acceptance criteria.
- Clarifications are resolved and documented.
- `plan.md` has architecture decisions, contracts, and risk notes.
- `tasks.md` is dependency-ordered and assigned across team members.
- Analyze/checklist issues are closed, deferred with reason, or approved by PM.

Only after this gate should the team choose and start implementation stack (Angular or any approved alternative).

