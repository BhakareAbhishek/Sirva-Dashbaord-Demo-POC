# Sirva CMS Marketplace Platform - Dashboard Demo POC

This repository contains a Proof of Concept (POC) implementation of the Sirva CMS Marketplace Platform.

The platform enables vendors to create and manage promotional widgets that can be delivered dynamically across Sirva web and mobile applications. The POC demonstrates:

- Governance workflows and approval gates
- Widget lifecycle management
- Rule-based targeting
- Analytics insights
- AI-assisted widget creation (advisory)

Development follows a Spec-First workflow using Spec Kit in Cursor.

## Overview

- **Framework**: Angular 14
- **Development Method**: Approach A - Spec-First Development
 - **Spec Kit Docs**: [Spec Kit on GitHub](https://github.com/github/spec-kit)

---

## Development Philosophy (Approach A)

Before implementation code begins, we complete and approve:

`constitution -> specification -> clarification -> plan -> tasks -> checklist -> implementation`

Implementation starts only after key artifacts are approved:

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md` (or checklist artifacts under `checklists/`)

This ensures traceability from requirement to delivery.

---

## Technology Stack

- **Frontend**: Angular 14
- **AI Development Tool**: Cursor
- **Specification Framework**: Spec Kit
- **Version Control**: Git
- **Design Source**: Figma
- **Mock API**: `json-server` (`db.json` + `routes.json`)

---

## Repository Structure

```text
Sirva-Dashbaord-Demo-POC/
├── .cursor/
│   └── rules/                       # Cursor rules for collaboration/workflow
├── .specify/
│   ├── templates/                   # Spec Kit templates
│   ├── memory/                      # Constitution and memory artifacts
│   └── specs/                       # Generated specs (if using .specify output mode)
├── specs/
│   ├── main/                        # Platform-level specs and architecture
│   ├── 002-admin-dashboard/         # Dashboard feature artifacts
│   └── 003-vendor-marketplace/      # Vendor marketplace feature artifacts
├── src/
│   └── app/
│       ├── core/                    # Services, guards, cross-cutting logic
│       ├── features/                # Feature modules (dashboard, vendor marketplace, ...)
│       └── models/                  # TypeScript models/interfaces
├── db.json                          # Mock database for json-server
├── routes.json                      # API route mappings for json-server
└── README.md
```

### Feature Spec Folder Pattern

Each feature should include:

```text
specs/<feature-id>/
├── spec.md
├── plan.md
├── tasks.md
├── quickstart.md
├── data-model.md
├── research.md
├── contracts/
└── checklists/
```

---

## Team Roles and Responsibilities

| Member | Role | Responsibilities |
|---|---|---|
| Member 1 | Project Manager / Product Owner | Scope, timeline, constitution governance, artifact approval |
| Member 2 | Business Analyst | Requirement decomposition, `specify` + `clarify`, documentation quality |
| Member 3 | UI/UX Designer | Figma parity, accessibility review, UX consistency |
| Member 4 | Tech Lead / Architect | `plan`, modular architecture, services and technical direction |
| Member 5 | Frontend Developer | `implement`, Angular module/component implementation |
| Member 6 | QA Engineer | `checklist`, validation evidence, test and release quality gate |

---

## Spec Kit Command Workflow

All development follows this sequence:

1. `/speckit.constitution`
2. `/speckit.specify`
3. `/speckit.clarify`
4. `/speckit.plan`
5. `/speckit.tasks`
6. `/speckit.analyze`
7. `/speckit.checklist`
8. `/speckit.implement`

### Governance Rule

- No implementation before `spec`, `plan`, `tasks`, and checklist artifacts are approved.
- `/speckit.implement` executes only after analyze/checklist findings are resolved or explicitly accepted.

---

## Constitution Setup (Role-wise Prompts)

The constitution is executed once at project start and extended by all team members.

### Prompt 1 - Project Governance & Development Principles

- **Role**: Project Manager / Product Owner
- **Command**: `/speckit.constitution`
- **Prompt intent**: Define Spec-First workflow, mandatory approvals, PR review policy, contribution accountability, modularity and traceability standards.

### Prompt 2 - Repository Governance & Git Workflow

- **Role**: Business Analyst / Documentation Owner
- **Command**: `/speckit.constitution`
- **Prompt intent**: Feature-branch strategy, branch naming conventions, commit format, PR template expectations, and spec-to-code synchronization requirements.

### Prompt 3 - UI/UX Standards (WCAG 2.1)

- **Role**: UI/UX Designer
- **Command**: `/speckit.constitution`
- **Prompt intent**: Enterprise UI consistency and accessibility requirements aligned to [WCAG 2.1](https://www.w3.org/TR/WCAG21/).

### Prompt 4 - Platform Architecture Standards

- **Role**: Tech Lead / Architect
- **Command**: `/speckit.constitution`
- **Prompt intent**: Angular feature-module architecture, shared/core module boundaries, service-based API communication, and scalability rules.

### Prompt 5 - Code Quality Standards

- **Role**: Frontend Developer
- **Command**: `/speckit.constitution`
- **Prompt intent**: Strict typing, lint/format discipline, reusable components, service-oriented logic, and loading/error state requirements.

### Prompt 6 - QA & Testing Standards

- **Role**: QA Engineer
- **Command**: `/speckit.constitution`
- **Prompt intent**: QA checklists before implementation, functional + regression standards, and QA approval as merge gate.

**Primary output**: `.specify/memory/constitution.md`

---

## Phase 2 - Platform Specification & Architecture

Goal: Define platform architecture and module boundaries before coding.

| Step | Command | Responsible |
|---|---|---|
| Platform Specification | `/speckit.specify` | Business Analyst |
| Requirement Clarification | `/speckit.clarify` | Business Analyst |
| Architecture Plan | `/speckit.plan` | Tech Lead |
| Task Breakdown | `/speckit.tasks` | Tech Lead + Developer |
| QA Architecture Checklist | `/speckit.checklist` | QA Engineer |

### Phase 2 Outputs

- `specs/main/spec.md` (or equivalent feature spec)
- `specs/main/plan.md`
- `specs/main/tasks.md`
- `specs/main/checklists/*`

---

## Feature 1 - Dashboard Module Workflow

Purpose: Admin-level overview of vendors, widgets, approvals, engagement metrics.

| Step | Command | Responsible |
|---|---|---|
| Specify | `/speckit.specify` | Business Analyst |
| Clarify | `/speckit.clarify` | Business Analyst |
| Plan | `/speckit.plan` | Tech Lead |
| Tasks | `/speckit.tasks` | Tech Lead + Developer |
| Checklist | `/speckit.checklist` | QA Engineer |
| Implement | `/speckit.implement` | Frontend Developer |

### Dashboard deliverables covered

- `DashboardComponent`
- `KpiCardComponent`
- `AnalyticsChartComponent`
- `RecentActivityComponent`
- `DashboardService`
- Feature routing and modular integration
- Loading/error behaviors

---

## Prompt Bank (Copy/Paste Short Form)

Use this section for quick execution in Cursor.

### `/speckit.specify`

Create a comprehensive platform specification for Sirva CMS Marketplace Platform with modules: Dashboard, Vendor Marketplace, Widget Library, Landing Page Management, Rules Engine, Rule Templates, Publishing Workflow, Analytics, AI Assisted Widget Creation, and AI Personalization.

### `/speckit.clarify`

Review specification and clarify chart library choice, widget delivery API shape, rule evaluation strategy, endpoint contracts, and loading/error behavior.

### `/speckit.plan`

Generate technical implementation plan for Angular 14 modular architecture, routing, shared/core boundaries, API service layer, and typed models.

### `/speckit.tasks`

Break plan into dependency-ordered implementation tasks with exact file paths and parallelizable markers.

### `/speckit.checklist`

Create QA checklist validating architecture consistency, feature module setup, accessibility, API integration behavior, and scalability readiness.

### `/speckit.implement`

Implement approved tasks in sequence with Angular best practices and strict TypeScript.

---

## Branching, Commits, and PR Standards

### Branch naming

- `feature/dashboard`
- `feature/vendors`
- `feature/widgets`
- `feature/rules-engine`
- `feature/analytics`

### Commit message format

- `feat: add dashboard KPI cards`
- `fix: resolve widget lifecycle bug`
- `docs: update vendor specification`
- `refactor: improve rule engine logic`

### PR must include

- Linked spec/plan/tasks reference
- Summary of changes
- Test evidence
- QA notes

---

## Evidence Checklist for Presentation

Collect and present:

- Spec Kit command execution screenshots (`/speckit.*`)
- Generated artifacts (`spec.md`, `plan.md`, `tasks.md`, contracts, data-model, checklists)
- Test outputs and QA checklist results
- Demo flow showing:
  - Dashboard metrics
  - Vendor Marketplace workflows
  - Routing/module structure
  - Error/loading state handling

---

## Recommended Demo Script (6 Members)

1. **PM**: Problem framing + governance model + delivery gates
2. **BA**: Spec quality and acceptance criteria mapping
3. **UI/UX**: Figma alignment + accessibility decisions
4. **Tech Lead**: Architecture and module/service design
5. **Developer**: Implemented modules and reusable components
6. **QA**: Checklist outcomes, quality status, known gaps/risks

---

## Local Setup (Quick)

```powershell
cd "c:\Raaghu Project\Spec Kit Bootcamp\Sirva-Dashbaord-Demo-POC"
npm install
npm run api
npm start
```

- Frontend: `http://localhost:4200`
- Mock API: `http://localhost:3000`

---

## Spec-First Gate (Non-Negotiable)

Coding starts only when:

- Constitution is agreed
- Specs and clarifications are finalized
- Plan and tasks are approved
- Checklist risks are reviewed

This repository is evaluated not only by code output, but by requirement traceability and disciplined execution.

