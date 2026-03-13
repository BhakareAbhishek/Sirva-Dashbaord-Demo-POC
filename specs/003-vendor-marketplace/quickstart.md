# Quickstart Guide: Vendor Marketplace Module

**Feature**: `003-vendor-marketplace`  
**Framework**: Angular 14  
**Prerequisites**: Node.js 14+, Angular CLI 14, Running backend API or JSON Server mock

---

## Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Running the Application](#running-the-application)
3. [Component Usage](#component-usage)
4. [API Integration](#api-integration)
5. [Testing](#testing)
6. [Accessibility Features](#accessibility-features)
7. [Troubleshooting](#troubleshooting)

---

## Setup Instructions

### 1. Install Dependencies

```bash
# Navigate to project root
cd c:\Raaghu Project\Spec Kit Bootcamp\Sirva-Dashbaord-Demo-POC

# Install npm dependencies
npm install
```

### 2. Configure Mock Backend (Development)

The vendor marketplace uses JSON Server for mock API during development.

**Update `db.json`** with vendor sample data:

```json
{
  "vendors": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "vendorName": "Premium Movers Inc",
      "companyName": "Premium Movers Incorporated",
      "contactEmail": "contact@premiummovers.com",
      "contactPhone": "+1-555-123-4567",
      "businessDescription": "Full-service residential and commercial moving company",
      "servicesOffered": "Local moving, Long-distance moving, Packing services",
      "status": "Active",
      "createdAt": "2026-01-15T10:30:00Z",
      "createdBy": "admin-001",
      "updatedAt": "2026-03-10T14:22:00Z",
      "updatedBy": "admin-002"
    }
  ],
  "vendorStatusHistory": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440010",
      "vendorId": "550e8400-e29b-41d4-a716-446655440000",
      "previousStatus": "Active",
      "newStatus": "Inactive",
      "changedAt": "2026-02-20T11:00:00Z",
      "changedBy": "admin-002",
      "reason": "Temporary suspension pending compliance review"
    }
  ]
}
```

**Start JSON Server**:

```bash
npm run api
```

This starts the mock API at `http://localhost:3000`.

### 3. Configure Environment

**Update `src/environments/environment.ts`**:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

**Update `src/environments/environment.prod.ts`** for production:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.sirva-cms.com'
};
```

---

## Running the Application

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/vendors` to access the Vendor Marketplace.

### Production Build

```bash
npm run build
```

Outputs to `dist/` directory.

---

## Component Usage

### VendorListPageComponent

**Route**: `/vendors`

**Purpose**: Display paginated vendor list with search and filter capabilities.

**Features**:
- Real-time search across vendor name, company name, and email
- Status filter (All/Active/Inactive)
- Pagination controls
- Loading, empty, and error states
- Inline vendor status toggle

**Usage**:
```typescript
// Navigate to vendor list
this.router.navigate(['/vendors']);
```

### VendorCreatePageComponent

**Route**: `/vendors/create`

**Purpose**: Onboard new vendors with validated form.

**Features**:
- Reactive form with field-level validation
- Async email uniqueness validation
- Character limit enforcement
- Unsaved changes warning

**Usage**:
```typescript
// Navigate to vendor creation form
this.router.navigate(['/vendors/create']);
```

**Required Fields**:
- Vendor Name (max 200 chars)
- Company Name (max 200 chars)
- Contact Email (unique, valid format)

**Optional Fields**:
- Contact Phone (international format)
- Business Description (max 1000 chars)
- Services Offered (max 500 chars)

### VendorProfilePageComponent

**Route**: `/vendors/:id`

**Purpose**: Display complete vendor profile with status history.

**Features**:
- Read-only vendor details display
- Status history timeline
- Edit button navigating to edit page
- Status toggle control

**Usage**:
```typescript
// Navigate to vendor profile
this.router.navigate(['/vendors', vendorId]);
```

### VendorEditPageComponent

**Route**: `/vendors/:id/edit`

**Purpose**: Edit existing vendor profile.

**Features**:
- Pre-populated form with current vendor data
- Same validation as create form
- Duplicate email detection
- Unsaved changes warning
- Cancel with confirmation

**Usage**:
```typescript
// Navigate to vendor edit form
this.router.navigate(['/vendors', vendorId, 'edit']);
```

### VendorFormComponent

**Selector**: `app-vendor-form`

**Purpose**: Reusable reactive form for vendor create and edit operations.

**Inputs**:
- `@Input() mode: 'create' | 'edit'` - Form mode
- `@Input() initialValue?: Vendor` - Pre-populated data for edit mode

**Outputs**:
- `@Output() formSubmit: EventEmitter<VendorFormData>` - Emitted on valid form submission
- `@Output() formCancel: EventEmitter<void>` - Emitted on cancel action

**Example**:
```html
<app-vendor-form 
  [mode]="'create'"
  (formSubmit)="onSubmit($event)"
  (formCancel)="onCancel()">
</app-vendor-form>
```

### VendorStatusToggleComponent

**Selector**: `app-vendor-status-toggle`

**Purpose**: Toggle vendor status with optimistic UI updates.

**Inputs**:
- `@Input() vendor: Vendor` - Vendor to toggle
- `@Input() disabled: boolean` - Disable toggle

**Outputs**:
- `@Output() statusChange: EventEmitter<VendorStatus>` - Emitted on successful status change

**Example**:
```html
<app-vendor-status-toggle 
  [vendor]="vendor"
  (statusChange)="onStatusChange($event)">
</app-vendor-status-toggle>
```

### VendorSearchFilterComponent

**Selector**: `app-vendor-search-filter`

**Purpose**: Search input and status filter controls.

**Outputs**:
- `@Output() searchChange: EventEmitter<string>` - Emitted on search input (debounced 300ms)
- `@Output() filterChange: EventEmitter<VendorStatus | 'All'>` - Emitted on status filter change

**Example**:
```html
<app-vendor-search-filter
  (searchChange)="onSearch($event)"
  (filterChange)="onFilter($event)">
</app-vendor-search-filter>
```

---

## API Integration

### VendorService

**Location**: `src/app/core/services/vendor.service.ts`

**Methods**:

```typescript
class VendorService {
  // List vendors with pagination and filters
  listVendors(params: {
    searchTerm?: string;
    status?: VendorStatus | 'All';
    page?: number;
    pageSize?: number;
  }): Observable<VendorListResponse>;

  // Get single vendor by ID
  getVendor(id: string): Observable<VendorDetailResponse>;

  // Create new vendor
  createVendor(data: VendorCreateRequest): Observable<Vendor>;

  // Update vendor profile
  updateVendor(id: string, data: VendorUpdateRequest): Observable<Vendor>;

  // Update vendor status
  updateVendorStatus(
    id: string, 
    status: VendorStatus, 
    reason?: string
  ): Observable<Vendor>;

  // Get vendor status history
  getStatusHistory(id: string, limit?: number): Observable<VendorStatusHistory[]>;
}
```

**Usage Example**:

```typescript
import { VendorService } from '@core/services/vendor.service';

export class VendorListPageComponent {
  constructor(private vendorService: VendorService) {}

  loadVendors() {
    this.vendorService.listVendors({
      searchTerm: 'movers',
      status: 'Active',
      page: 1,
      pageSize: 20
    }).subscribe({
      next: (response) => {
        this.vendors = response.data.vendors;
        this.pagination = response.meta;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load vendors';
      }
    });
  }
}
```

### Error Handling

Service automatically maps HTTP error codes to user-friendly messages:

```typescript
{
  'VENDOR_EMAIL_DUPLICATE': 'This email address is already registered to another vendor',
  'VENDOR_NOT_FOUND': 'Vendor not found',
  'VENDOR_VALIDATION_ERROR': 'Validation failed',
  'VENDOR_UNAUTHORIZED': 'You do not have permission to perform this action',
  'VENDOR_SERVER_ERROR': 'An unexpected error occurred. Please try again.'
}
```

---

## Testing

### Run Unit Tests

```bash
npm test
```

Runs Jasmine + Karma test suite.

### Run Tests with Coverage

```bash
npm test -- --code-coverage
```

Coverage report: `coverage/index.html`

### Test Specific Component

```bash
npm test -- --include='**/vendor-list.component.spec.ts'
```

### Run Linting

```bash
npm run lint
```

### Component Test Examples

**Testing VendorFormComponent**:

```typescript
describe('VendorFormComponent', () => {
  it('should validate required fields', () => {
    component.form.controls['vendorName'].setValue('');
    expect(component.form.controls['vendorName'].hasError('required')).toBe(true);
  });

  it('should validate email format', () => {
    component.form.controls['contactEmail'].setValue('invalid-email');
    expect(component.form.controls['contactEmail'].hasError('email')).toBe(true);
  });

  it('should validate email uniqueness asynchronously', fakeAsync(() => {
    component.form.controls['contactEmail'].setValue('test@example.com');
    tick(500); // Debounce time
    expect(component.form.controls['contactEmail'].hasError('emailTaken')).toBe(true);
  }));
});
```

**Testing VendorService**:

```typescript
describe('VendorService', () => {
  it('should list vendors', () => {
    const mockResponse: VendorListResponse = { /* ... */ };
    
    service.listVendors({ page: 1 }).subscribe(response => {
      expect(response.data.vendors.length).toBeGreaterThan(0);
    });

    const req = httpMock.expectOne('http://localhost:3000/vendors?page=1');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
```

---

## Accessibility Features

### Keyboard Navigation

- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons and toggles
- **Escape**: Close dialogs and cancel operations
- **Arrow Keys**: Navigate within dropdowns and lists

### Screen Reader Support

All components include:
- ARIA labels for interactive elements
- ARIA live regions for loading and error announcements
- Semantic HTML (table, form, button tags)
- Focus management for dialogs and modals

### WCAG 2.1 Level AA Compliance

- Color contrast ratios meet 4.5:1 for normal text
- All interactive elements have visible focus indicators
- Error messages are announced to screen readers
- Forms have associated labels and instructions

### Testing Accessibility

**Automated Audit**:
```bash
# Install axe-core
npm install --save-dev @axe-core/cli

# Run accessibility audit
npx @axe-core/cli http://localhost:4200/vendors
```

**Manual Testing**:
- Test with NVDA (Windows) or JAWS screen reader
- Verify keyboard navigation without mouse
- Check color contrast with browser DevTools

---

## Troubleshooting

### Common Issues

#### 1. "Email uniqueness validator not working"

**Cause**: Backend API not implementing email check endpoint.

**Solution**: Ensure JSON Server or backend API has endpoint:
```
GET /vendors?contactEmail=test@example.com
```

Returns empty array if email is available, vendor object if taken.

#### 2. "Vendor list not loading"

**Cause**: Backend API not running or CORS issues.

**Solution**:
```bash
# Check if JSON Server is running
npm run api

# Verify API URL in environment.ts matches running server
```

#### 3. "Unsaved changes warning not appearing"

**Cause**: Form not marked as dirty or guard not applied.

**Solution**: Verify `UnsavedChangesGuard` is applied to routes:
```typescript
{
  path: 'create',
  component: VendorCreatePageComponent,
  canDeactivate: [UnsavedChangesGuard]
}
```

#### 4. "Status toggle not updating immediately"

**Cause**: Optimistic update logic not implemented.

**Solution**: Component should update local state before API call:
```typescript
toggleStatus() {
  const previousStatus = this.vendor.status;
  this.vendor.status = newStatus; // Optimistic update
  
  this.vendorService.updateVendorStatus(id, newStatus)
    .subscribe({
      error: () => {
        this.vendor.status = previousStatus; // Rollback on error
      }
    });
}
```

#### 5. "Search results not updating in real-time"

**Cause**: Search input not debounced.

**Solution**: Use RxJS debounceTime:
```typescript
this.searchControl.valueChanges
  .pipe(debounceTime(300))
  .subscribe(term => this.performSearch(term));
```

### Debug Mode

Enable Angular debug mode in `environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  debug: true
};
```

Then add console logging in service methods:
```typescript
listVendors(params: any) {
  if (environment.debug) {
    console.log('[VendorService] Listing vendors with params:', params);
  }
  return this.http.get<VendorListResponse>(`${this.apiUrl}/vendors`, { params });
}
```

### Getting Help

- **Documentation**: `/specs/003-vendor-marketplace/spec.md`
- **API Contract**: `/specs/003-vendor-marketplace/contracts/vendor-api.md`
- **Data Model**: `/specs/003-vendor-marketplace/data-model.md`
- **Tasks**: `/specs/003-vendor-marketplace/tasks.md`

---

## Next Steps

1. Review [spec.md](./spec.md) for complete feature requirements
2. Check [plan.md](./plan.md) for implementation phases
3. Follow [tasks.md](./tasks.md) for detailed development tasks
4. Reference [contracts/vendor-api.md](./contracts/vendor-api.md) for API integration

---

**Version**: 1.0  
**Last Updated**: 2026-03-13  
**Status**: Ready for development
