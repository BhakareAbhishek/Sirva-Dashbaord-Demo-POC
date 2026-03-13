# Technical Research: Vendor Marketplace Module

**Branch**: `003-vendor-marketplace`  
**Date**: 2026-03-13  
**Researchers**: Development Team  
**Status**: Research Complete

---

## Research Areas

1. [Phone Number Validation](#phone-number-validation)
2. [Email Uniqueness Validation](#email-uniqueness-validation)
3. [Virtual Scrolling for Large Datasets](#virtual-scrolling-for-large-datasets)
4. [Optimistic UI Updates](#optimistic-ui-updates)
5. [Unsaved Changes Detection](#unsaved-changes-detection)
6. [WCAG 2.1 Accessibility Compliance](#wcag-21-accessibility-compliance)
7. [Angular Reactive Forms Best Practices](#angular-reactive-forms-best-practices)

---

## 1. Phone Number Validation

### Requirement

Support international phone number formats for vendor contact phone field (FR-007).

### Research Findings

**Option 1: Custom Regex Pattern (Recommended)**

```typescript
export const PHONE_REGEX = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

export function phoneFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Optional field
    }
    const valid = PHONE_REGEX.test(control.value);
    return valid ? null : { phoneFormat: { value: control.value } };
  };
}
```

**Pros**:
- No external dependencies
- Lightweight
- Covers most international formats

**Cons**:
- Not as comprehensive as dedicated libraries
- May not validate country-specific rules

**Option 2: libphonenumber-js Library**

```bash
npm install libphonenumber-js
```

```typescript
import { parsePhoneNumber } from 'libphonenumber-js';

export function phoneFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    try {
      const phoneNumber = parsePhoneNumber(control.value);
      return phoneNumber.isValid() ? null : { phoneFormat: true };
    } catch {
      return { phoneFormat: true };
    }
  };
}
```

**Pros**:
- Comprehensive international support
- Country-specific validation
- Format normalization

**Cons**:
- Adds ~200KB to bundle size
- Complexity may be overkill for simple validation

### Recommendation

**Use Option 1 (Custom Regex)** for initial implementation:
- Meets requirement for international format support
- Minimal bundle impact
- Sufficient for vendor contact information use case
- Can upgrade to libphonenumber-js later if needed

### Implementation Notes

- Phone field is optional, validator only runs if value present
- Display format examples in placeholder: "+1-555-123-4567"
- Max length: 20 characters (enforced separately)

---

## 2. Email Uniqueness Validation

### Requirement

Prevent duplicate vendor emails (FR-004) with async validation during form input.

### Research Findings

**Angular Async Validator Approach**

```typescript
export class EmailUniqueValidator implements AsyncValidator {
  constructor(private vendorService: VendorService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }

    return timer(500).pipe(
      switchMap(() => 
        this.vendorService.checkEmailAvailability(control.value)
      ),
      map(available => available ? null : { emailTaken: true }),
      catchError(() => of(null)) // Don't block form on network error
    );
  }
}
```

**Key Considerations**:

1. **Debouncing**: Use `timer(500)` to wait for user to finish typing
2. **Cancellation**: Use `switchMap` to cancel previous requests
3. **Error Handling**: Return `null` on network errors to prevent blocking form
4. **Edit Mode**: Skip validation if email unchanged from initial value

**Backend API Requirement**:

```
GET /api/vendors?contactEmail=test@example.com
```

Response:
```json
{
  "data": { "vendors": [] }  // Empty = available
}
```

or

```json
{
  "data": { "vendors": [{ "id": "...", "contactEmail": "test@example.com" }] }  // Taken
}
```

### Recommendation

**Implement async validator with 500ms debounce**:
- Provides real-time feedback without excessive API calls
- `switchMap` prevents race conditions
- Graceful degradation on network errors
- Edit mode optimization (skip if email unchanged)

### Implementation Notes

- Show loading spinner during validation
- Display clear error message: "This email address is already registered to another vendor"
- Backend enforces uniqueness as final validation
- Case-insensitive comparison

---

## 3. Virtual Scrolling for Large Datasets

### Requirement

Maintain UI performance for vendor lists exceeding 1000 items (FR-021).

### Research Findings

**Angular CDK Virtual Scroll**

```bash
npm install @angular/cdk
```

```typescript
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  imports: [ScrollingModule]
})
export class VendorMarketplaceModule {}
```

```html
<cdk-virtual-scroll-viewport itemSize="50" class="vendor-list-viewport">
  <table>
    <tr *cdkVirtualFor="let vendor of vendors" class="vendor-row">
      <td>{{ vendor.vendorName }}</td>
      <td>{{ vendor.companyName }}</td>
      <!-- ... -->
    </tr>
  </table>
</cdk-virtual-scroll-viewport>
```

**Performance Benefits**:
- Renders only visible items + buffer
- Handles 10,000+ items without lag
- Minimal memory footprint

**Considerations**:
- Requires fixed item height (`itemSize="50"`)
- May need CSS adjustments for table layout
- Accessibility requires ARIA attributes

**Alternative: Pagination (Current Approach)**

- Simpler implementation
- Better for most use cases
- Proven pattern in existing codebase
- No additional dependencies

### Recommendation

**Start with pagination (current approach)**:
- Sufficient for up to 1000 vendors
- Consistent with existing dashboard patterns
- Simpler accessibility story
- Lower implementation complexity

**Upgrade to virtual scrolling only if**:
- Dataset regularly exceeds 1000 items
- User feedback indicates performance issues
- Backend supports efficient data streaming

### Implementation Notes

- Default page size: 20 items
- Page size options: 20, 50, 100
- Show total count and current page range
- Maintain scroll position on page change

---

## 4. Optimistic UI Updates

### Requirement

Status toggle provides immediate UI feedback (FR-019) with server rollback on failure.

### Research Findings

**Pattern: Optimistic Update with Rollback**

```typescript
export class VendorStatusToggleComponent {
  toggleStatus() {
    // Capture current state
    const previousStatus = this.vendor.status;
    const newStatus = previousStatus === 'Active' ? 'Inactive' : 'Active';

    // Optimistic update (immediate UI change)
    this.vendor.status = newStatus;
    this.isLoading = true;

    // Server confirmation
    this.vendorService.updateVendorStatus(this.vendor.id, newStatus, this.reason)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (updatedVendor) => {
          // Success: emit event, show toast
          this.statusChange.emit(updatedVendor.status);
          this.showSuccessToast(`Vendor ${newStatus === 'Active' ? 'activated' : 'deactivated'}`);
        },
        error: (error) => {
          // Failure: rollback to previous state
          this.vendor.status = previousStatus;
          this.showErrorToast('Status update failed. Please try again.');
        }
      });
  }
}
```

**Key Principles**:
1. Update UI immediately for perceived performance
2. Capture previous state for rollback
3. Show loading indicator during server confirmation
4. Rollback on error with clear error message
5. Emit success event for parent component updates

**User Experience Benefits**:
- Feels instantaneous (<100ms perceived latency)
- Reduces perceived wait time
- Graceful degradation on failure

### Recommendation

**Implement optimistic updates for status toggle**:
- Meets FR-019 requirement for 200ms perceived update
- Standard pattern in modern web applications
- Improves user satisfaction

### Implementation Notes

- Show subtle loading indicator (e.g., pulse effect on toggle)
- Disable toggle during server confirmation
- Log rollbacks for debugging
- Consider confirmation dialog before toggle for added safety

---

## 5. Unsaved Changes Detection

### Requirement

Warn administrators before navigating away from unsaved vendor form changes (FR-018).

### Research Findings

**Angular CanDeactivate Guard**

```typescript
export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({ providedIn: 'root' })
export class UnsavedChangesGuard implements CanDeactivate<CanComponentDeactivate> {
  constructor(private dialog: MatDialog) {}

  canDeactivate(
    component: CanComponentDeactivate
  ): boolean | Observable<boolean> {
    if (component.canDeactivate()) {
      return true;
    }

    return this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          title: 'Unsaved Changes',
          message: 'You have unsaved changes. Are you sure you want to leave?',
          confirmText: 'Leave',
          cancelText: 'Stay'
        }
      })
      .afterClosed()
      .pipe(
        map(result => result === true)
      );
  }
}
```

**Component Implementation**:

```typescript
export class VendorCreatePageComponent implements CanComponentDeactivate {
  form: FormGroup;

  canDeactivate(): boolean {
    return !this.form.dirty || this.form.submitted;
  }
}
```

**Route Configuration**:

```typescript
{
  path: 'create',
  component: VendorCreatePageComponent,
  canDeactivate: [UnsavedChangesGuard]
}
```

**Detection Strategy**:
- Use `FormGroup.dirty` flag (tracks if user modified any field)
- Skip warning if form successfully submitted
- Reset dirty flag on successful save

### Recommendation

**Implement CanDeactivate guard with confirmation dialog**:
- Standard Angular pattern
- Reusable across all form pages
- Prevents accidental data loss
- Meets accessibility requirements

### Implementation Notes

- Apply guard to create and edit routes
- Use Material Dialog or custom confirmation component
- Consider browser beforeunload event for external navigation
- Test with keyboard navigation (Tab + Enter)

---

## 6. WCAG 2.1 Accessibility Compliance

### Requirement

All vendor management UI components must conform to WCAG 2.1 Level AA (FR-020).

### Research Findings

**Key WCAG 2.1 Level AA Requirements**:

1. **Perceivable**:
   - Color contrast ratio ≥ 4.5:1 for normal text
   - Alternative text for images
   - Proper heading hierarchy (h1, h2, h3)

2. **Operable**:
   - All functionality accessible via keyboard
   - No keyboard traps
   - Visible focus indicators
   - Skip links for navigation

3. **Understandable**:
   - Clear labels for form inputs
   - Error messages associated with fields
   - Consistent navigation patterns

4. **Robust**:
   - Valid HTML
   - ARIA attributes where needed
   - Screen reader compatibility

**Angular Accessibility Best Practices**:

```html
<!-- Form labels -->
<label for="vendorName">
  Vendor Name <span aria-label="required">*</span>
</label>
<input 
  id="vendorName" 
  formControlName="vendorName"
  aria-required="true"
  aria-invalid="vendorNameControl.invalid && vendorNameControl.touched"
  aria-describedby="vendorName-error">
<span id="vendorName-error" role="alert" *ngIf="vendorNameControl.invalid">
  Vendor name is required
</span>

<!-- Loading states -->
<div role="status" aria-live="polite" *ngIf="isLoading">
  Loading vendors...
</div>

<!-- Error announcements -->
<div role="alert" aria-live="assertive" *ngIf="error">
  {{ error }}
</div>

<!-- Data table -->
<table role="table" aria-label="Vendor list">
  <thead>
    <tr role="row">
      <th role="columnheader" scope="col">Vendor Name</th>
    </tr>
  </thead>
  <tbody>
    <tr role="row" *ngFor="let vendor of vendors">
      <td role="cell">{{ vendor.vendorName }}</td>
    </tr>
  </tbody>
</table>
```

**Testing Tools**:

1. **Automated**:
   - axe DevTools (Chrome extension)
   - Lighthouse (Chrome DevTools)
   - axe-core (npm package for automated tests)

2. **Manual**:
   - Screen readers: NVDA (Windows), JAWS (Windows), VoiceOver (Mac)
   - Keyboard navigation testing
   - Color contrast checkers

### Recommendation

**Implement comprehensive accessibility features**:
- Use semantic HTML elements
- Add ARIA attributes for dynamic content
- Test with screen readers
- Run automated audits in CI/CD pipeline

### Implementation Notes

- Create accessibility checklist for each component
- Include accessibility tests in component specs
- Document keyboard shortcuts in quickstart guide
- Conduct accessibility review before production release

---

## 7. Angular Reactive Forms Best Practices

### Requirement

Implement vendor forms using Angular Reactive Forms with comprehensive validation.

### Research Findings

**FormBuilder Pattern**:

```typescript
export class VendorFormComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      vendorName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(200)
      ]],
      companyName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(200)
      ]],
      contactEmail: ['', 
        [Validators.required, Validators.email],
        [emailUniqueValidator(this.vendorService)]  // Async validator
      ],
      contactPhone: ['', [phoneFormatValidator()]],
      businessDescription: ['', [Validators.maxLength(1000)]],
      servicesOffered: ['', [Validators.maxLength(500)]]
    });
  }

  get vendorNameControl() {
    return this.form.get('vendorName')!;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.formSubmit.emit(this.form.value);
  }
}
```

**Error Display Pattern**:

```html
<div class="form-field">
  <label for="vendorName">Vendor Name *</label>
  <input 
    id="vendorName" 
    formControlName="vendorName"
    [class.error]="vendorNameControl.invalid && vendorNameControl.touched">
  
  <div class="error-messages" *ngIf="vendorNameControl.invalid && vendorNameControl.touched">
    <span *ngIf="vendorNameControl.hasError('required')">
      Vendor name is required
    </span>
    <span *ngIf="vendorNameControl.hasError('minlength')">
      Vendor name must be at least 2 characters
    </span>
    <span *ngIf="vendorNameControl.hasError('maxlength')">
      Vendor name cannot exceed 200 characters
    </span>
  </div>
</div>
```

**Best Practices**:

1. **Use FormBuilder**: Cleaner syntax than new FormGroup()
2. **Getter Methods**: Create getters for frequently accessed controls
3. **MarkAllAsTouched**: Show all errors on submit attempt
4. **Separate Validators**: Keep validators in separate files for reusability
5. **OnPush Change Detection**: Use for better performance
6. **Unsubscribe**: Use takeUntil or async pipe to prevent memory leaks

### Recommendation

**Follow Angular style guide for reactive forms**:
- Use FormBuilder
- Implement custom validators as functions or classes
- Display field-level errors below inputs
- Show loading state for async validators
- Reset form after successful submission

### Implementation Notes

- Create reusable error message component
- Centralize validation error messages
- Add character count for fields with maxLength
- Disable submit button while form is invalid or submitting
- Clear form after successful vendor creation

---

## Summary & Recommendations

### Approved Approaches

| Area | Approach | Rationale |
|------|----------|-----------|
| Phone Validation | Custom regex pattern | Sufficient for use case, minimal bundle impact |
| Email Uniqueness | Async validator with 500ms debounce | Real-time feedback, prevents race conditions |
| Large Datasets | Pagination (upgrade to virtual scroll if needed) | Simpler, consistent with existing patterns |
| Status Toggles | Optimistic UI updates with rollback | Perceived performance, standard pattern |
| Unsaved Changes | CanDeactivate guard with confirmation | Prevents data loss, reusable |
| Accessibility | Comprehensive WCAG 2.1 AA implementation | Required for compliance |
| Forms | Reactive Forms with FormBuilder | Angular best practice, maintainable |

### Technical Stack Summary

**Core Dependencies**:
- Angular 14
- Angular Reactive Forms
- RxJS 7
- Angular HttpClient

**Optional Dependencies** (if needed later):
- @angular/cdk (for virtual scrolling)
- libphonenumber-js (for advanced phone validation)
- axe-core (for automated accessibility testing)

### Next Steps

1. Review and approve research findings
2. Begin Phase 1: Foundation & Infrastructure implementation
3. Set up mock backend with JSON Server
4. Create vendor module scaffolding
5. Implement typed models and service layer

---

**Research Status**: ✅ Complete  
**Reviewed By**: Development Team  
**Date**: 2026-03-13  
**Ready for Implementation**: Yes
