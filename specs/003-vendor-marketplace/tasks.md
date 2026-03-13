# Tasks: Vendor Marketplace Module

**Input**: Design documents from `/specs/003-vendor-marketplace/`  
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/vendor-api.md`, `quickstart.md`

**Tests**: Unit and component tests are included because the specification requires comprehensive testing for vendor management components and service behavior.

**Organization**: Tasks are grouped by user story and implementation phase to allow independent implementation and validation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on incomplete tasks)
- **[Story]**: User story mapping (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- All tasks include explicit file paths

---

## Phase 1: Foundation & Infrastructure (Shared Prerequisites)

**Purpose**: Initialize Angular vendor marketplace feature scaffolding and baseline dependencies.

**CRITICAL**: Complete this phase before starting user-story implementation.

- [ ] T001 Create vendor marketplace feature module and routing module in `src/app/features/vendor-marketplace/vendor-marketplace.module.ts` and `src/app/features/vendor-marketplace/vendor-marketplace-routing.module.ts`
- [ ] T002 [P] Define `VendorStatus` enum in `src/app/models/vendor.model.ts`
- [ ] T003 [P] Define `Vendor` interface in `src/app/models/vendor.model.ts`
- [ ] T004 [P] Define `VendorStatusHistory` interface in `src/app/models/vendor-status-history.model.ts`
- [ ] T005 [P] Define `VendorListResponse` and `PaginationMeta` interfaces in `src/app/models/vendor-list-response.model.ts`
- [ ] T006 [P] Define `VendorDetailResponse` interface in `src/app/models/vendor-detail-response.model.ts`
- [ ] T007 [P] Define `VendorError` and `ErrorDetail` interfaces in `src/app/core/models/vendor-error.model.ts`
- [ ] T008 Create `VendorService` shell with constructor and HttpClient injection in `src/app/core/services/vendor.service.ts`
- [ ] T009 Implement `VendorService.listVendors()` method with typed HttpClient call to `GET /api/vendors` in `src/app/core/services/vendor.service.ts`
- [ ] T010 [P] Implement `VendorService.getVendor(id)` method with typed HttpClient call to `GET /api/vendors/{id}` in `src/app/core/services/vendor.service.ts`
- [ ] T011 [P] Implement `VendorService.createVendor(data)` method with typed HttpClient call to `POST /api/vendors` in `src/app/core/services/vendor.service.ts`
- [ ] T012 [P] Implement `VendorService.updateVendor(id, data)` method with typed HttpClient call to `PATCH /api/vendors/{id}` in `src/app/core/services/vendor.service.ts`
- [ ] T013 [P] Implement `VendorService.updateVendorStatus(id, status, reason)` method with typed HttpClient call to `PATCH /api/vendors/{id}/status` in `src/app/core/services/vendor.service.ts`
- [ ] T014 [P] Implement `VendorService.getStatusHistory(id)` method with typed HttpClient call to `GET /api/vendors/{id}/status-history` in `src/app/core/services/vendor.service.ts`
- [ ] T015 Implement error normalization helper `parseVendorError()` in `src/app/core/services/vendor.service.ts` to map HTTP errors to user-friendly messages
- [ ] T016 Create async email uniqueness validator in `src/app/shared/validators/email-unique.validator.ts` calling `VendorService` to check email availability
- [ ] T017 [P] Create phone format validator in `src/app/shared/validators/phone-format.validator.ts` supporting international formats
- [ ] T018 Create `UnsavedChangesGuard` implementing `CanDeactivate` in `src/app/core/guards/unsaved-changes.guard.ts`
- [ ] T019 Implement app-level lazy route for vendor marketplace in `src/app/app-routing.module.ts`
- [ ] T020 [P] Add unit tests for `VendorService` CRUD methods in `src/app/core/services/vendor.service.spec.ts`
- [ ] T021 [P] Add unit tests for email uniqueness validator in `src/app/shared/validators/email-unique.validator.spec.ts`
- [ ] T022 [P] Add unit tests for phone format validator in `src/app/shared/validators/phone-format.validator.spec.ts`

**Checkpoint**: Routing + typed models + service layer + validators are ready; user story work can proceed.

---

## Phase 2: Vendor Listing & Search (User Story 4, Priority: P3)

**Goal**: Display vendor list with real-time search and filtering capabilities.

**Independent Test**: Open `/vendors` as admin, verify vendor table loads with pagination, enter search text and verify real-time filtering, apply status filter and verify results update.

### Tests for User Story 4

- [ ] T023 [P] [US4] Add vendor list table rendering tests in `src/app/features/vendor-marketplace/components/vendor-list/vendor-list.component.spec.ts`
- [ ] T024 [P] [US4] Add search filter component interaction tests in `src/app/features/vendor-marketplace/components/vendor-search-filter/vendor-search-filter.component.spec.ts`
- [ ] T025 [P] [US4] Add pagination controls interaction tests in `src/app/features/vendor-marketplace/pages/vendor-list-page/vendor-list-page.component.spec.ts`

### Implementation for User Story 4

- [ ] T026 [P] [US4] Create vendor list page component shell in `src/app/features/vendor-marketplace/pages/vendor-list-page/vendor-list-page.component.ts`, `.html`, `.scss`
- [ ] T027 [P] [US4] Create vendor list presentational component in `src/app/features/vendor-marketplace/components/vendor-list/vendor-list.component.ts`, `.html`, `.scss`
- [ ] T028 [P] [US4] Create vendor search filter component in `src/app/features/vendor-marketplace/components/vendor-search-filter/vendor-search-filter.component.ts`, `.html`, `.scss`
- [ ] T029 [US4] Wire vendor list page component declarations/exports in `src/app/features/vendor-marketplace/vendor-marketplace.module.ts`
- [ ] T030 [US4] Implement feature route mapping to `VendorListPageComponent` at `/vendors` in `src/app/features/vendor-marketplace/vendor-marketplace-routing.module.ts`
- [ ] T031 [US4] Implement vendor list data retrieval and pagination state management in `src/app/features/vendor-marketplace/pages/vendor-list-page/vendor-list-page.component.ts`
- [ ] T032 [US4] Implement search input with debounceTime (300ms) in `src/app/features/vendor-marketplace/components/vendor-search-filter/vendor-search-filter.component.ts`
- [ ] T033 [US4] Implement status dropdown filter (All/Active/Inactive) in `src/app/features/vendor-marketplace/components/vendor-search-filter/vendor-search-filter.component.ts`
- [ ] T034 [US4] Combine search and filter criteria using RxJS combineLatest in `src/app/features/vendor-marketplace/pages/vendor-list-page/vendor-list-page.component.ts`
- [ ] T035 [US4] Render vendor table with columns (name, company, email, status, actions) in `src/app/features/vendor-marketplace/components/vendor-list/vendor-list.component.html`
- [ ] T036 [US4] Implement loading skeleton state for vendor list in `src/app/features/vendor-marketplace/components/vendor-list/vendor-list.component.html`
- [ ] T037 [US4] Implement empty state messaging ("No vendors found") in `src/app/features/vendor-marketplace/components/vendor-list/vendor-list.component.html`
- [ ] T038 [US4] Implement inline error state with retry action in `src/app/features/vendor-marketplace/pages/vendor-list-page/vendor-list-page.component.html`
- [ ] T039 [US4] Add pagination controls (previous, next, page size selector) in `src/app/features/vendor-marketplace/pages/vendor-list-page/vendor-list-page.component.html`
- [ ] T040 [US4] Add ARIA labels and keyboard navigation support for search and table in `src/app/features/vendor-marketplace/components/vendor-search-filter/vendor-search-filter.component.html` and vendor-list components
- [ ] T041 [US4] Style vendor list table for responsive layout and accessibility in `src/app/features/vendor-marketplace/components/vendor-list/vendor-list.component.scss`

**Checkpoint**: US4 is independently functional and testable.

---

## Phase 3: Vendor Onboarding (User Story 1, Priority: P1) 🎯 MVP

**Goal**: Enable Platform Administrators to create new vendor profiles with validated data.

**Independent Test**: Open `/vendors/create` as admin, fill out onboarding form with valid data, submit and verify new vendor appears in listing with Active status.

### Tests for User Story 1

- [ ] T042 [P] [US1] Add vendor form field validation tests in `src/app/features/vendor-marketplace/components/vendor-form/vendor-form.component.spec.ts`
- [ ] T043 [P] [US1] Add async email uniqueness validation tests in `src/app/features/vendor-marketplace/components/vendor-form/vendor-form.component.spec.ts`
- [ ] T044 [P] [US1] Add form submission success/error tests in `src/app/features/vendor-marketplace/pages/vendor-create-page/vendor-create-page.component.spec.ts`

### Implementation for User Story 1

- [ ] T045 [P] [US1] Create vendor create page component shell in `src/app/features/vendor-marketplace/pages/vendor-create-page/vendor-create-page.component.ts`, `.html`, `.scss`
- [ ] T046 [P] [US1] Create reusable vendor form component in `src/app/features/vendor-marketplace/components/vendor-form/vendor-form.component.ts`, `.html`, `.scss`
- [ ] T047 [US1] Wire vendor create page and form component declarations/exports in `src/app/features/vendor-marketplace/vendor-marketplace.module.ts`
- [ ] T048 [US1] Implement feature route mapping to `VendorCreatePageComponent` at `/vendors/create` in `src/app/features/vendor-marketplace/vendor-marketplace-routing.module.ts`
- [ ] T049 [US1] Build reactive form with FormBuilder for all vendor fields in `src/app/features/vendor-marketplace/components/vendor-form/vendor-form.component.ts`
- [ ] T050 [US1] Add required field validators for vendorName, companyName, contactEmail in `src/app/features/vendor-marketplace/components/vendor-form/vendor-form.component.ts`
- [ ] T051 [US1] Add email format validator (Validators.email) for contactEmail in `src/app/features/vendor-marketplace/components/vendor-form/vendor-form.component.ts`
- [ ] T052 [US1] Add async email uniqueness validator to contactEmail field in `src/app/features/vendor-marketplace/components/vendor-form/vendor-form.component.ts`
- [ ] T053 [US1] Add phone format validator to contactPhone field in `src/app/features/vendor-marketplace/components/vendor-form/vendor-form.component.ts`
- [ ] T054 [US1] Add maxLength validators (name: 200, company: 200, description: 1000, services: 500) in `src/app/features/vendor-marketplace/components/vendor-form/vendor-form.component.ts`
- [ ] T055 [US1] Render form fields (vendor name, company, email, phone, description, services) in `src/app/features/vendor-marketplace/components/vendor-form/vendor-form.component.html`
- [ ] T056 [US1] Display field-level validation errors below each input in `src/app/features/vendor-marketplace/components/vendor-form/vendor-form.component.html`
- [ ] T057 [US1] Show loading indicator during email uniqueness validation in `src/app/features/vendor-marketplace/components/vendor-form/vendor-form.component.html`
- [ ] T058 [US1] Implement form submission handler in `src/app/features/vendor-marketplace/pages/vendor-create-page/vendor-create-page.component.ts` calling `VendorService.createVendor()`
- [ ] T059 [US1] Handle form submission loading state and disable submit button during API call in `src/app/features/vendor-marketplace/pages/vendor-create-page/vendor-create-page.component.ts`
- [ ] T060 [US1] Handle submission success: navigate to vendor profile page in `src/app/features/vendor-marketplace/pages/vendor-create-page/vendor-create-page.component.ts`
- [ ] T061 [US1] Handle submission errors: display inline error message with field-specific feedback in `src/app/features/vendor-marketplace/pages/vendor-create-page/vendor-create-page.component.html`
- [ ] T062 [US1] Apply unsaved changes guard to create page route in `src/app/features/vendor-marketplace/vendor-marketplace-routing.module.ts`
- [ ] T063 [US1] Add ARIA labels, required indicators, and error announcements in `src/app/features/vendor-marketplace/components/vendor-form/vendor-form.component.html`
- [ ] T064 [US1] Style form layout for accessibility and responsiveness in `src/app/features/vendor-marketplace/components/vendor-form/vendor-form.component.scss`

**Checkpoint**: US1 is independently functional and testable as MVP.

---

## Phase 4: Vendor Profile Management (User Story 2, Priority: P1) 🎯 MVP

**Goal**: Display vendor details and enable profile editing with validation.

**Independent Test**: Select vendor from list, view profile page with all details, click edit, modify information, save and verify updates reflected in profile and listing.

### Tests for User Story 2

- [ ] T065 [P] [US2] Add vendor profile display tests in `src/app/features/vendor-marketplace/pages/vendor-profile-page/vendor-profile-page.component.spec.ts`
- [ ] T066 [P] [US2] Add vendor edit form pre-population tests in `src/app/features/vendor-marketplace/pages/vendor-edit-page/vendor-edit-page.component.spec.ts`
- [ ] T067 [P] [US2] Add update submission success/error tests in `src/app/features/vendor-marketplace/pages/vendor-edit-page/vendor-edit-page.component.spec.ts`

### Implementation for User Story 2

- [ ] T068 [P] [US2] Create vendor profile page component shell in `src/app/features/vendor-marketplace/pages/vendor-profile-page/vendor-profile-page.component.ts`, `.html`, `.scss`
- [ ] T069 [P] [US2] Create vendor edit page component shell in `src/app/features/vendor-marketplace/pages/vendor-edit-page/vendor-edit-page.component.ts`, `.html`, `.scss`
- [ ] T070 [US2] Wire vendor profile and edit page component declarations/exports in `src/app/features/vendor-marketplace/vendor-marketplace.module.ts`
- [ ] T071 [US2] Implement feature route mapping to `VendorProfilePageComponent` at `/vendors/:id` in `src/app/features/vendor-marketplace/vendor-marketplace-routing.module.ts`
- [ ] T072 [US2] Implement feature route mapping to `VendorEditPageComponent` at `/vendors/:id/edit` in `src/app/features/vendor-marketplace/vendor-marketplace-routing.module.ts`
- [ ] T073 [US2] Implement vendor detail retrieval using route params in `src/app/features/vendor-marketplace/pages/vendor-profile-page/vendor-profile-page.component.ts`
- [ ] T074 [US2] Render vendor profile details (all fields) in read-only format in `src/app/features/vendor-marketplace/pages/vendor-profile-page/vendor-profile-page.component.html`
- [ ] T075 [US2] Render vendor status history timeline in `src/app/features/vendor-marketplace/pages/vendor-profile-page/vendor-profile-page.component.html`
- [ ] T076 [US2] Add "Edit" button navigating to edit page in `src/app/features/vendor-marketplace/pages/vendor-profile-page/vendor-profile-page.component.html`
- [ ] T077 [US2] Implement vendor detail retrieval for edit page using route params in `src/app/features/vendor-marketplace/pages/vendor-edit-page/vendor-edit-page.component.ts`
- [ ] T078 [US2] Pre-populate vendor form component with existing vendor data in `src/app/features/vendor-marketplace/pages/vendor-edit-page/vendor-edit-page.component.ts` passing data to `VendorFormComponent`
- [ ] T079 [US2] Add form mode input (@Input() mode: 'create' | 'edit') to `VendorFormComponent` in `src/app/features/vendor-marketplace/components/vendor-form/vendor-form.component.ts`
- [ ] T080 [US2] Implement update submission handler in `src/app/features/vendor-marketplace/pages/vendor-edit-page/vendor-edit-page.component.ts` calling `VendorService.updateVendor()`
- [ ] T081 [US2] Handle update success: navigate back to profile page in `src/app/features/vendor-marketplace/pages/vendor-edit-page/vendor-edit-page.component.ts`
- [ ] T082 [US2] Handle update errors: display inline error message with field-specific feedback (409 for duplicate email) in `src/app/features/vendor-marketplace/pages/vendor-edit-page/vendor-edit-page.component.html`
- [ ] T083 [US2] Add "Cancel" button navigating back to profile with unsaved changes warning in `src/app/features/vendor-marketplace/pages/vendor-edit-page/vendor-edit-page.component.html`
- [ ] T084 [US2] Apply unsaved changes guard to edit page route in `src/app/features/vendor-marketplace/vendor-marketplace-routing.module.ts`
- [ ] T085 [US2] Implement loading skeleton for profile and history in `src/app/features/vendor-marketplace/pages/vendor-profile-page/vendor-profile-page.component.html`
- [ ] T086 [US2] Implement error state with retry for profile page in `src/app/features/vendor-marketplace/pages/vendor-profile-page/vendor-profile-page.component.html`
- [ ] T087 [US2] Style profile page layout for readability and accessibility in `src/app/features/vendor-marketplace/pages/vendor-profile-page/vendor-profile-page.component.scss`

**Checkpoint**: US2 is independently functional and testable as MVP.

---

## Phase 5: Vendor Status Control (User Story 3, Priority: P2)

**Goal**: Enable administrators to activate and deactivate vendors with optimistic UI updates.

**Independent Test**: Toggle vendor status from Active to Inactive in vendor list or profile, verify immediate UI update, confirm status change persists on page refresh.

### Tests for User Story 3

- [ ] T088 [P] [US3] Add status toggle component interaction tests in `src/app/features/vendor-marketplace/components/vendor-status-toggle/vendor-status-toggle.component.spec.ts`
- [ ] T089 [P] [US3] Add optimistic update and rollback tests in `src/app/features/vendor-marketplace/components/vendor-status-toggle/vendor-status-toggle.component.spec.ts`
- [ ] T090 [P] [US3] Add confirmation dialog tests in `src/app/features/vendor-marketplace/components/vendor-status-toggle/vendor-status-toggle.component.spec.ts`

### Implementation for User Story 3

- [ ] T091 [P] [US3] Create vendor status toggle component in `src/app/features/vendor-marketplace/components/vendor-status-toggle/vendor-status-toggle.component.ts`, `.html`, `.scss`
- [ ] T092 [US3] Wire vendor status toggle component declarations/exports in `src/app/features/vendor-marketplace/vendor-marketplace.module.ts`
- [ ] T093 [US3] Implement toggle UI with slide toggle or switch control in `src/app/features/vendor-marketplace/components/vendor-status-toggle/vendor-status-toggle.component.html`
- [ ] T094 [US3] Add confirmation dialog display before status change in `src/app/features/vendor-marketplace/components/vendor-status-toggle/vendor-status-toggle.component.ts`
- [ ] T095 [US3] Implement optimistic UI update (toggle immediately) in `src/app/features/vendor-marketplace/components/vendor-status-toggle/vendor-status-toggle.component.ts`
- [ ] T096 [US3] Call `VendorService.updateVendorStatus()` after confirmation in `src/app/features/vendor-marketplace/components/vendor-status-toggle/vendor-status-toggle.component.ts`
- [ ] T097 [US3] Handle status update success: emit status change event to parent, show success toast in `src/app/features/vendor-marketplace/components/vendor-status-toggle/vendor-status-toggle.component.ts`
- [ ] T098 [US3] Handle status update failure: rollback toggle to previous state, show error message in `src/app/features/vendor-marketplace/components/vendor-status-toggle/vendor-status-toggle.component.ts`
- [ ] T099 [US3] Integrate status toggle in vendor list table rows in `src/app/features/vendor-marketplace/components/vendor-list/vendor-list.component.html`
- [ ] T100 [US3] Integrate status toggle in vendor profile page header in `src/app/features/vendor-marketplace/pages/vendor-profile-page/vendor-profile-page.component.html`
- [ ] T101 [US3] Refresh vendor list after status change in `src/app/features/vendor-marketplace/pages/vendor-list-page/vendor-list-page.component.ts`
- [ ] T102 [US3] Refresh status history after status change in `src/app/features/vendor-marketplace/pages/vendor-profile-page/vendor-profile-page.component.ts`
- [ ] T103 [US3] Add ARIA labels and keyboard support for toggle control in `src/app/features/vendor-marketplace/components/vendor-status-toggle/vendor-status-toggle.component.html`
- [ ] T104 [US3] Style toggle control for accessibility and visual feedback in `src/app/features/vendor-marketplace/components/vendor-status-toggle/vendor-status-toggle.component.scss`

**Checkpoint**: US3 is independently functional and testable.

---

## Phase 6: Polish & Accessibility

**Goal**: Ensure WCAG 2.1 Level AA compliance and production-ready UX.

**Independent Test**: Run automated accessibility audits, test keyboard navigation, verify screen reader compatibility, validate responsive design.

- [ ] T105 Run automated accessibility audit (axe-core, Lighthouse) on all vendor pages and fix critical issues
- [ ] T106 [P] Add ARIA labels to all interactive elements (buttons, links, form inputs) across vendor components
- [ ] T107 [P] Implement aria-live regions for loading and error announcements in vendor list and form components
- [ ] T108 Verify keyboard navigation (Tab, Enter, Escape) works for all vendor workflows (list, create, edit, toggle)
- [ ] T109 Test vendor pages with screen readers (NVDA or JAWS on Windows) and fix identified issues
- [ ] T110 [P] Verify color contrast ratios meet WCAG 2.1 AA standards (4.5:1 for normal text) across all vendor components
- [ ] T111 [P] Add focus indicators and skip links for keyboard navigation in vendor list and form pages
- [ ] T112 Implement responsive breakpoints for mobile, tablet, and desktop views in all vendor components
- [ ] T113 Optimize vendor list rendering with trackBy function for Angular change detection performance
- [ ] T114 Implement virtual scrolling for vendor list if dataset exceeds 1000 items (optional performance enhancement)
- [ ] T115 Add loading announcements via aria-live for screen readers during API calls in all vendor pages
- [ ] T116 Document accessibility features and keyboard shortcuts in quickstart guide

**Checkpoint**: All accessibility and polish requirements met.

---

## Phase 7: Testing & Documentation

**Goal**: Comprehensive test coverage and complete developer documentation.

**Independent Test**: Run full test suite and verify >80% coverage, validate all documentation is accurate and complete.

- [ ] T117 Complete unit tests for all vendor components with >80% statement coverage
- [ ] T118 [P] Add service layer edge case tests (network errors, timeouts, malformed responses) in `src/app/core/services/vendor.service.spec.ts`
- [ ] T119 [P] Add form validation edge case tests (empty submissions, field length limits, special characters) in vendor form component tests
- [ ] T120 Add integration tests for combined search and filter logic in vendor list page tests
- [ ] T121 [P] Add pagination boundary tests (first page, last page, page size changes) in vendor list page tests
- [ ] T122 Verify accessibility features programmatically with automated tests (axe-core integration)
- [ ] T123 Create quickstart guide with component usage examples, setup instructions, and API integration details in `specs/003-vendor-marketplace/quickstart.md`
- [ ] T124 Update `README.md` at workspace root with vendor marketplace module overview and link to specs
- [ ] T125 Perform code review for TypeScript best practices, Angular style guide compliance, and code consistency
- [ ] T126 Run full test suite (`npm test`) and verify all tests pass with target coverage
- [ ] T127 Address any failing tests, linting errors, or code quality issues identified during review
- [ ] T128 Mark all tasks complete and update feature status to "Ready for Demo" in spec document

**Checkpoint**: All testing and documentation complete, feature ready for production deployment.

---

## Summary by User Story

### User Story 1 - Onboard New Vendors (P1)
- **Tasks**: T042-T064 (23 tasks)
- **Key Deliverables**: Vendor create page, reusable form component, field validation, email uniqueness check
- **MVP Milestone**: ✓

### User Story 2 - Manage Vendor Profiles (P1)
- **Tasks**: T065-T087 (23 tasks)
- **Key Deliverables**: Vendor profile page, vendor edit page, status history display, form pre-population
- **MVP Milestone**: ✓

### User Story 3 - Control Vendor Platform Access (P2)
- **Tasks**: T088-T104 (17 tasks)
- **Key Deliverables**: Status toggle component, optimistic updates, confirmation dialogs, rollback handling

### User Story 4 - Search and Filter Vendors (P3)
- **Tasks**: T023-T041 (19 tasks)
- **Key Deliverables**: Vendor list page, search component, filter component, pagination controls

### Foundation & Infrastructure
- **Tasks**: T001-T022 (22 tasks)
- **Key Deliverables**: Module scaffolding, typed models, service layer, validators, routing

### Polish & Accessibility
- **Tasks**: T105-T116 (12 tasks)
- **Key Deliverables**: WCAG compliance, keyboard navigation, screen reader support, responsive design

### Testing & Documentation
- **Tasks**: T117-T128 (12 tasks)
- **Key Deliverables**: Test coverage, quickstart guide, code review, production readiness

---

**Total Tasks**: 128  
**MVP Tasks**: 68 (Foundation + US1 + US2)  
**Estimated Effort**: 4-6 weeks for full implementation with testing and documentation
