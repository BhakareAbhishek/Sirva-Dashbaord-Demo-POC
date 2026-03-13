import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VendorService } from '../../../../core/services/vendor.service';
import { Vendor, VendorCreateRequest, VendorUpdateRequest } from '../../../../models/vendor.model';

/**
 * Reusable form component for creating and editing vendors
 * 
 * Features:
 * - Reactive forms with comprehensive validation
 * - Async email uniqueness validation (500ms debounce)
 * - Phone number format validation
 * - Character limits with counters
 * - Unsaved changes detection
 * - WCAG 2.1 accessible with field-level error messages
 */
@Component({
  selector: 'app-vendor-form',
  templateUrl: './vendor-form.component.html',
  styleUrls: ['./vendor-form.component.scss']
})
export class VendorFormComponent implements OnInit, OnDestroy {
  /**
   * Vendor data for edit mode (null for create mode)
   */
  @Input() vendor: Vendor | null = null;

  /**
   * Event emitted when form is submitted with valid data
   */
  @Output() submitForm = new EventEmitter<VendorCreateRequest | VendorUpdateRequest>();

  /**
   * Event emitted when form is cancelled
   */
  @Output() cancelForm = new EventEmitter<void>();

  /**
   * Reactive form group
   */
  vendorForm!: FormGroup;

  /**
   * Whether form is in edit mode
   */
  isEditMode = false;

  /**
   * Form submission loading state
   */
  isSubmitting = false;

  /**
   * Available service options (from spec: relocation, real estate, mortgage, moving)
   */
  availableServices = [
    'Relocation Services',
    'Real Estate',
    'Mortgage Services',
    'Moving Services',
    'Household Goods',
    'Expense Management',
    'Immigration Services',
    'Destination Services'
  ];

  /**
   * Character limits
   */
  limits = {
    name: 200,
    companyName: 200,
    description: 1000
  };

  /**
   * Subject for component cleanup
   */
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.vendor;
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize the form with validators
   */
  private initializeForm(): void {
    this.vendorForm = this.fb.group({
      name: [
        this.vendor?.name || '',
        [Validators.required, Validators.maxLength(this.limits.name)]
      ],
      companyName: [
        this.vendor?.companyName || '',
        [Validators.required, Validators.maxLength(this.limits.companyName)]
      ],
      email: [
        this.vendor?.email || '',
        [Validators.required, Validators.email],
        [this.emailUniqueValidator.bind(this)]
      ],
      phone: [
        this.vendor?.phone || '',
        [Validators.required, this.phoneValidator]
      ],
      description: [
        this.vendor?.description || '',
        [Validators.maxLength(this.limits.description)]
      ],
      services: [
        this.vendor?.services || [],
        [Validators.required, Validators.minLength(1)]
      ]
    });
  }

  /**
   * Async validator for email uniqueness
   */
  private emailUniqueValidator(control: AbstractControl): Promise<ValidationErrors | null> {
    if (!control.value) {
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      // Debounce the API call
      setTimeout(() => {
        const excludeId = this.isEditMode && this.vendor ? this.vendor.id : undefined;
        
        this.vendorService.checkEmailAvailability(control.value, excludeId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (isAvailable) => {
              resolve(isAvailable ? null : { emailTaken: true });
            },
            error: () => {
              // On error, assume email is valid to not block submission
              resolve(null);
            }
          });
      }, 500);
    });
  }

  /**
   * Validator for phone number format
   * Accepts formats: (123) 456-7890, 123-456-7890, 123.456.7890, 1234567890
   */
  private phoneValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(control.value) ? null : { invalidPhone: true };
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.vendorForm.invalid || this.isSubmitting) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.vendorForm.controls).forEach(key => {
        this.vendorForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const formData = this.vendorForm.value;

    if (this.isEditMode) {
      const updateData: VendorUpdateRequest = {
        name: formData.name,
        companyName: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        description: formData.description,
        services: formData.services
      };
      this.submitForm.emit(updateData);
    } else {
      const createData: VendorCreateRequest = formData;
      this.submitForm.emit(createData);
    }
  }

  /**
   * Handle form cancellation
   */
  onCancel(): void {
    if (this.hasUnsavedChanges()) {
      const confirmed = confirm(
        'You have unsaved changes. Are you sure you want to cancel?'
      );
      if (!confirmed) {
        return;
      }
    }
    this.cancelForm.emit();
  }

  /**
   * Check if form has unsaved changes
   */
  hasUnsavedChanges(): boolean {
    return this.vendorForm.dirty && !this.isSubmitting;
  }

  /**
   * Check if a field has an error
   */
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.vendorForm.get(fieldName);
    return !!(field?.hasError(errorType) && field?.touched);
  }

  /**
   * Get error message for a field
   */
  getErrorMessage(fieldName: string): string {
    const field = this.vendorForm.get(fieldName);
    if (!field || !field.touched) {
      return '';
    }

    if (field.hasError('required')) {
      return 'This field is required';
    }
    if (field.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field.hasError('emailTaken')) {
      return 'This email is already registered';
    }
    if (field.hasError('invalidPhone')) {
      return 'Please enter a valid phone number';
    }
    if (field.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength'].requiredLength;
      return `Maximum ${maxLength} characters allowed`;
    }
    if (field.hasError('minlength')) {
      return 'At least one service must be selected';
    }

    return '';
  }

  /**
   * Get remaining character count for a field
   */
  getRemainingChars(fieldName: string): number {
    const field = this.vendorForm.get(fieldName);
    const value = field?.value || '';
    const limit = this.limits[fieldName as keyof VendorFormCharLimits] || 0;
    return limit - value.length;
  }

  /**
   * Toggle service selection
   */
  toggleService(service: string): void {
    const currentServices = this.vendorForm.get('services')?.value || [];
    const index = currentServices.indexOf(service);

    if (index > -1) {
      currentServices.splice(index, 1);
    } else {
      currentServices.push(service);
    }

    this.vendorForm.patchValue({ services: currentServices });
    this.vendorForm.get('services')?.markAsTouched();
  }

  /**
   * Check if a service is selected
   */
  isServiceSelected(service: string): boolean {
    const currentServices = this.vendorForm.get('services')?.value || [];
    return currentServices.includes(service);
  }

  /**
   * Reset submission state (called by parent on error)
   */
  resetSubmittingState(): void {
    this.isSubmitting = false;
  }
}

type VendorFormCharLimits = {
  name: number;
  companyName: number;
  description: number;
};
