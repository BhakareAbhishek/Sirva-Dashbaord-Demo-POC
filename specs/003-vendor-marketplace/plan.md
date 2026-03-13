# Implementation Plan: Vendor Marketplace Module

**Branch**: `003-vendor-marketplace` | **Date**: 2026-03-13 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/003-vendor-marketplace/spec.md`

## Summary

Implement the Vendor Marketplace module as an Angular 14 feature module using modular architecture (`core`, `shared`, `features`). The module includes `VendorListComponent`, `VendorFormComponent`, `VendorProfileComponent`, and `VendorStatusToggleComponent`, integrates with a typed `VendorService`, consumes RESTful `/api/vendors` endpoints, and enforces requirements for email uniqueness validation, real-time search/filtering, status management with audit trail, and WCAG 2.1 accessibility compliance.

## Technical Context

**Language/Version**: TypeScript (Angular 14 baseline)  
**Primary Dependencies**: Angular 14, Angular Router, Angular Forms (Reactive Forms), RxJS, HttpClient  
**Storage**: N/A (frontend module consuming backend REST APIs)  
**Testing**: Jasmine + Karma (unit/component); Angular HttpClient testing utilities for service contracts  
**Target Platform**: Modern desktop browsers for Platform Administrator portal  
**Project Type**: Angular web application (feature module)  
**Performance Goals**: 
- Vendor list initial render within 2 seconds for datasets up to 1000 vendors
- Search filtering provides real-time feedback within 300ms
- Status toggle provides optimistic UI update within 100ms with server confirmation within 2 seconds

**Constraints**: 
- WCAG 2.1 Level AA compliance for all UI components
- Typed models for all API payloads and domain entities
- Real-time form validation with field-level error messaging
- Unsaved changes warning before navigation
- No permanent vendor deletion (deactivation only)
- Email uniqueness enforced at frontend and backend
- International phone number format support

**Scale/Scope**: 
- One new vendor marketplace feature module with 4 core components
- One service layer with full CRUD operations
- Typed API contract for vendor management
- Reusable form components and validation utilities
- Search and filter state management

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Gate

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-First Development | PASS | `spec.md` and clarifications completed before plan; implementation not started. |
| II. Angular-First Frontend | PASS | Angular 14 explicitly selected; Reactive Forms, typed models, and loading/error states planned. |
| III. Modularity & Future Expansion | PASS | Vendor module isolated as feature module with explicit API contracts and reusable components. |
| IV. Collaboration & Documentation | PASS | Plan links to spec and will generate research/data-model/contracts/quickstart artifacts. |
| V. Quality & Non-Functional Discipline | PASS | Test approach, accessibility, performance, validation, and error handling captured as measurable constraints. |

### Post-Phase 1 Re-Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-First Development | PASS | Design artifacts generated from approved spec and clarifications. |
| II. Angular-First Frontend | PASS | Module, routing, reactive forms, service, and model design all Angular 14 aligned. |
| III. Modularity & Future Expansion | PASS | Contracts and data model separate domain concerns; reusable UI components and validators identified. |
| IV. Collaboration & Documentation | PASS | Artifacts support traceable handoff into `/speckit.tasks`. |
| V. Quality & Non-Functional Discipline | PASS | Validation, error handling, optimistic updates, accessibility, unsaved changes warning, and test strategy all documented. |

## Project Structure

### Documentation (this feature)

```text
specs/003-vendor-marketplace/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── tasks.md
├── contracts/
│   ├── README.md
│   └── vendor-api.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
src/
└── app/
    ├── app-routing.module.ts
    ├── core/
    │   ├── services/
    │   │   ├── vendor.service.ts
    │   │   └── vendor.service.spec.ts
    │   ├── models/
    │   │   └── vendor-error.model.ts
    │   └── guards/
    │       └── unsaved-changes.guard.ts
    ├── shared/
    │   ├── validators/
    │   │   ├── email-unique.validator.ts
    │   │   └── phone-format.validator.ts
    │   └── components/
    │       ├── confirmation-dialog/
    │       └── error-message/
    ├── models/
    │   ├── vendor.model.ts
    │   ├── vendor-status-history.model.ts
    │   ├── vendor-list-response.model.ts
    │   └── vendor-detail-response.model.ts
    └── features/
        └── vendor-marketplace/
            ├── vendor-marketplace.module.ts
            ├── vendor-marketplace-routing.module.ts
            ├── components/
            │   ├── vendor-list/
            │   │   ├── vendor-list.component.ts
            │   │   ├── vendor-list.component.html
            │   │   ├── vendor-list.component.scss
            │   │   └── vendor-list.component.spec.ts
            │   ├── vendor-form/
            │   │   ├── vendor-form.component.ts
            │   │   ├── vendor-form.component.html
            │   │   ├── vendor-form.component.scss
            │   │   └── vendor-form.component.spec.ts
            │   ├── vendor-profile/
            │   │   ├── vendor-profile.component.ts
            │   │   ├── vendor-profile.component.html
            │   │   ├── vendor-profile.component.scss
            │   │   └── vendor-profile.component.spec.ts
            │   ├── vendor-status-toggle/
            │   │   ├── vendor-status-toggle.component.ts
            │   │   ├── vendor-status-toggle.component.html
            │   │   ├── vendor-status-toggle.component.scss
            │   │   └── vendor-status-toggle.component.spec.ts
            │   └── vendor-search-filter/
            │       ├── vendor-search-filter.component.ts
            │       ├── vendor-search-filter.component.html
            │       ├── vendor-search-filter.component.scss
            │       └── vendor-search-filter.component.spec.ts
            └── pages/
                ├── vendor-list-page/
                │   ├── vendor-list-page.component.ts
                │   ├── vendor-list-page.component.html
                │   ├── vendor-list-page.component.scss
                │   └── vendor-list-page.component.spec.ts
                ├── vendor-create-page/
                │   ├── vendor-create-page.component.ts
                │   ├── vendor-create-page.component.html
                │   ├── vendor-create-page.component.scss
                │   └── vendor-create-page.component.spec.ts
                ├── vendor-edit-page/
                │   ├── vendor-edit-page.component.ts
                │   ├── vendor-edit-page.component.html
                │   ├── vendor-edit-page.component.scss
                │   └── vendor-edit-page.component.spec.ts
                └── vendor-profile-page/
                    ├── vendor-profile-page.component.ts
                    ├── vendor-profile-page.component.html
                    ├── vendor-profile-page.component.scss
                    └── vendor-profile-page.component.spec.ts
```

## Implementation Phases

### Phase 0: Research & Design *(Current)*

**Deliverable**: Complete planning artifacts for development handoff

- [x] Create feature specification (`spec.md`)
- [x] Document clarifications and acceptance criteria
- [x] Define data models (`data-model.md`)
- [x] Document API contracts (`contracts/vendor-api.md`)
- [x] Create implementation plan (`plan.md`)
- [ ] Create task breakdown (`tasks.md`)
- [ ] Document technical research findings (`research.md`)
- [ ] Create quickstart guide (`quickstart.md`)
- [ ] Complete requirements checklist (`checklists/requirements.md`)

### Phase 1: Foundation & Infrastructure

**Goal**: Establish module scaffolding, routing, models, and service layer

**Dependencies**: None (initial setup)

**Deliverables**:
- Vendor marketplace feature module and routing configured
- TypeScript models for all vendor entities and API responses
- VendorService with full CRUD operations and typed HttpClient integration
- Shared validators for email uniqueness and phone format
- Unsaved changes guard for form navigation protection
- Unit tests for service layer and validators

**Key Activities**:
1. Generate feature module skeleton with Angular CLI
2. Define routing structure for list, create, edit, and profile pages
3. Implement TypeScript interfaces and enums from data model
4. Build VendorService with methods for list, get, create, update, updateStatus
5. Implement async email uniqueness validator with debouncing
6. Create unsaved changes guard with confirmation dialog
7. Write comprehensive service unit tests with HttpClientTestingModule

### Phase 2: Vendor Listing & Search (User Story 4, P3 + Supporting US1)

**Goal**: Implement vendor list view with real-time search and filtering

**Dependencies**: Phase 1 (service layer must be complete)

**Deliverables**:
- VendorListPageComponent with pagination and state management
- VendorListComponent (presentational table component)
- VendorSearchFilterComponent for search input and status dropdown
- Real-time search with debouncing (300ms)
- Status filter (All/Active/Inactive)
- Loading, empty, and error states
- Pagination controls
- Responsive table layout
- Component and integration tests

**Key Activities**:
1. Create vendor list page container component
2. Build reusable vendor table component with sorting
3. Implement search/filter component with reactive forms
4. Add real-time search with RxJS debounceTime operator
5. Implement pagination controls and page size selector
6. Handle loading skeletons and empty state messaging
7. Add error handling with retry capability
8. Style for accessibility (ARIA labels, keyboard navigation)
9. Write component tests for search, filter, pagination interactions

### Phase 3: Vendor Onboarding (User Story 1, P1)

**Goal**: Implement vendor creation workflow with validation

**Dependencies**: Phase 1 (service and validators must be complete)

**Deliverables**:
- VendorCreatePageComponent with form orchestration
- VendorFormComponent (reusable reactive form)
- Field-level validation with real-time error messages
- Email uniqueness validation with async validator
- Required field validation
- Character limit validation
- Phone format validation
- Unsaved changes warning on navigation
- Success confirmation and navigation to vendor profile
- Form submission error handling
- Component and form validation tests

**Key Activities**:
1. Create vendor create page component
2. Build reusable vendor form component with reactive forms
3. Implement FormBuilder with validators for all fields
4. Add async email uniqueness validator with loading indicator
5. Display field-level validation errors below inputs
6. Implement unsaved changes detection and guard integration
7. Handle form submission with loading state and error messaging
8. Navigate to vendor profile on successful creation
9. Add accessibility attributes (labels, error announcements)
10. Write form validation and submission tests

### Phase 4: Vendor Profile Management (User Story 2, P1)

**Goal**: Implement vendor profile view and edit capability

**Dependencies**: Phase 1 and Phase 3 (service, form component must exist)

**Deliverables**:
- VendorProfilePageComponent with read-only profile view
- VendorEditPageComponent reusing VendorFormComponent
- Status history display in profile view
- Edit mode toggle
- Pre-populated form with existing vendor data
- Update operation with conflict handling
- Success feedback and profile refresh
- Cancel operation with unsaved changes warning
- Component tests for profile display and edit workflow

**Key Activities**:
1. Create vendor profile page component
2. Implement vendor detail retrieval and display
3. Show status history timeline in profile view
4. Add edit button navigating to edit page
5. Create vendor edit page reusing form component
6. Pre-populate form fields with current vendor data
7. Handle update submission with conflict error handling
8. Show success message and navigate back to profile
9. Implement cancel with unsaved changes confirmation
10. Write tests for profile display and edit operations

### Phase 5: Vendor Status Control (User Story 3, P2)

**Goal**: Implement vendor status activation and deactivation

**Dependencies**: Phase 2 and Phase 4 (list and profile views must exist)

**Deliverables**:
- VendorStatusToggleComponent (reusable toggle control)
- Optimistic UI update with server confirmation
- Status toggle in vendor list (inline)
- Status toggle in vendor profile page
- Confirmation dialog for status changes
- Rollback on failure with error messaging
- Audit trail update on status change
- Component tests for toggle interaction and error handling

**Key Activities**:
1. Create vendor status toggle component with slide toggle UI
2. Implement confirmation dialog for status changes
3. Add optimistic UI update (toggle immediately)
4. Call VendorService.updateStatus with new status
5. Handle success: update local state, show success toast
6. Handle failure: rollback toggle, show error message
7. Integrate toggle in vendor list rows
8. Integrate toggle in vendor profile header
9. Refresh status history after successful toggle
10. Write tests for optimistic update and rollback scenarios

### Phase 6: Polish & Accessibility

**Goal**: Ensure WCAG 2.1 compliance and production readiness

**Dependencies**: Phases 2-5 (all features implemented)

**Deliverables**:
- WCAG 2.1 Level AA compliance verification
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast compliance
- Error announcement via ARIA live regions
- Loading state announcements
- Responsive design for various screen sizes
- Performance optimization (lazy loading, virtual scrolling)
- Accessibility audit report

**Key Activities**:
1. Run automated accessibility audits (axe, Lighthouse)
2. Add ARIA labels, roles, and live regions
3. Implement keyboard navigation (Tab, Enter, Escape)
4. Test with screen readers (NVDA, JAWS)
5. Verify color contrast ratios meet WCAG standards
6. Add focus indicators and skip links
7. Implement responsive breakpoints
8. Optimize list rendering for large datasets
9. Add loading announcements for screen readers
10. Document accessibility features in quickstart guide

### Phase 7: Testing & Documentation

**Goal**: Comprehensive test coverage and developer documentation

**Dependencies**: All implementation phases complete

**Deliverables**:
- Unit tests for all components (>80% coverage)
- Service integration tests with mocked HTTP
- Form validation test suite
- Accessibility test suite
- End-to-end user flow tests (optional, if E2E framework available)
- Updated quickstart guide with setup instructions
- Code review and quality assurance

**Key Activities**:
1. Complete unit tests for all components
2. Verify service layer tests with edge cases
3. Test form validations (sync and async)
4. Test error handling and retry logic
5. Test pagination, search, and filter combinations
6. Verify accessibility features programmatically
7. Update quickstart guide with component usage examples
8. Perform code review for best practices
9. Run full test suite and verify coverage
10. Address any failing tests or quality issues

## Technical Architecture

### Component Hierarchy

```
VendorMarketplaceModule
├── Pages (Smart Components)
│   ├── VendorListPageComponent
│   │   ├── VendorSearchFilterComponent
│   │   └── VendorListComponent
│   │       └── VendorStatusToggleComponent (per row)
│   ├── VendorCreatePageComponent
│   │   └── VendorFormComponent
│   ├── VendorEditPageComponent
│   │   └── VendorFormComponent (reused)
│   └── VendorProfilePageComponent
│       ├── VendorStatusToggleComponent
│       └── Status History Timeline
└── Shared Services
    ├── VendorService (core)
    ├── EmailUniqueValidator (shared)
    └── UnsavedChangesGuard (core)
```

### State Management

**Approach**: Component-local state with service-layer caching

- Page components manage local state via RxJS observables
- VendorService maintains simple in-memory cache for list data
- Cache invalidated on create, update, or status change
- No global state management (NgRx not required for this scope)

### Form Strategy

**Approach**: Reactive Forms with custom validators

- Use Angular Reactive Forms for all vendor forms
- Field-level validation with real-time error display
- Async email uniqueness validator with debouncing
- Unsaved changes detection via form dirty state
- Reusable VendorFormComponent for create and edit

### Error Handling

**Approach**: Centralized error handling with user-friendly messaging

- Service layer maps HTTP error codes to user messages
- Component-level error display with inline messaging
- Retry capability for network errors
- Rollback for optimistic update failures
- Toast notifications for success/failure feedback

### Performance Considerations

- Implement virtual scrolling if vendor list exceeds 1000 items
- Debounce search input (300ms) to reduce API calls
- Lazy load vendor marketplace module via routing
- Use OnPush change detection where applicable
- Optimize table rendering with trackBy functions

### Accessibility Strategy

- Use semantic HTML elements (table, form, button)
- Provide ARIA labels for all interactive elements
- Announce loading and error states via aria-live regions
- Support full keyboard navigation (Tab, Enter, Escape)
- Ensure color contrast ratios meet WCAG 2.1 AA standards
- Test with screen readers (NVDA, JAWS, VoiceOver)

## Testing Strategy

### Unit Tests (Jasmine + Karma)

- **Service Layer**: Test all CRUD operations, error handling, HTTP calls
- **Components**: Test user interactions, form validation, state transitions
- **Validators**: Test email uniqueness, phone format validation
- **Guards**: Test unsaved changes detection and confirmation

### Integration Tests

- **Form Validation**: Test complete form submission workflows
- **Search/Filter**: Test combined search and filter logic
- **Status Toggle**: Test optimistic updates and rollback

### Accessibility Tests

- **Automated**: Run axe-core and Lighthouse audits
- **Manual**: Test keyboard navigation and screen reader compatibility

### Coverage Goals

- **Overall**: >80% code coverage
- **Service Layer**: >90% coverage
- **Critical Paths**: 100% coverage (form submission, status toggle)

## Dependencies

### External Dependencies

- Angular 14 (framework)
- Angular Forms (reactive forms)
- RxJS (reactive programming)
- Angular HttpClient (API integration)

### Internal Dependencies

- Authentication service (for Platform Administrator role verification)
- Shared UI components (confirmation dialog, error message)
- Routing configuration (app-level lazy loading)

### Backend Dependencies

- Vendor API endpoints (see `contracts/vendor-api.md`)
- Email uniqueness validation endpoint
- Status management with audit trail
- Search and filtering support

## Risk Assessment

### Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Email uniqueness validation race conditions | Medium | Implement server-side final validation; show clear error on conflict |
| Large vendor datasets (>1000) causing UI lag | Medium | Implement pagination with virtual scrolling; optimize rendering |
| Concurrent edits by multiple administrators | Low | Show last updated timestamp; handle 409 Conflict responses |
| Unsaved changes lost during navigation | High | Implement unsaved changes guard with confirmation dialog |
| Accessibility compliance gaps | High | Conduct early accessibility audits; test with screen readers |

### Integration Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Backend API not ready during frontend development | Medium | Use JSON Server with mock data; follow API contract strictly |
| API contract changes after frontend development starts | Medium | Version API endpoints; use typed models to detect breaking changes |
| Authentication/authorization integration issues | Medium | Mock auth service for unit tests; coordinate with auth team |

## Success Metrics

### Functional Completeness

- [ ] All user stories (US1-US4) implemented and tested
- [ ] All acceptance criteria met
- [ ] All edge cases handled
- [ ] WCAG 2.1 Level AA compliance verified

### Performance Targets

- [ ] Vendor list loads within 2 seconds (up to 1000 vendors)
- [ ] Search provides feedback within 300ms
- [ ] Status toggle updates UI within 100ms (optimistic)
- [ ] Form submission completes within 2 seconds

### Quality Targets

- [ ] >80% unit test coverage
- [ ] All critical paths have 100% coverage
- [ ] Zero accessibility violations (automated audit)
- [ ] All TypeScript strict mode enabled
- [ ] No console errors or warnings

### Documentation Completeness

- [ ] Quickstart guide completed
- [ ] API contracts documented
- [ ] Component usage examples provided
- [ ] Setup instructions verified

## Next Steps

1. Complete tasks breakdown in `tasks.md`
2. Conduct technical research for phone validation and virtual scrolling
3. Set up mock backend with JSON Server
4. Begin Phase 1: Foundation & Infrastructure implementation
5. Schedule accessibility review checkpoints throughout development

---

**Status**: Planning complete, ready for task breakdown and implementation
