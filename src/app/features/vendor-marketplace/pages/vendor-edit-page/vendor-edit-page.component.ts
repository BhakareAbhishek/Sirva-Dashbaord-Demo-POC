import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VendorService } from '../../../../core/services/vendor.service';
import { Vendor, VendorUpdateRequest } from '../../../../models/vendor.model';

/**
 * Page component for editing an existing vendor
 * 
 * Orchestrates:
 * - Loading vendor data
 * - Vendor update form
 * - API submission
 * - Success/error handling
 * - Navigation after success
 */
@Component({
  selector: 'app-vendor-edit-page',
  templateUrl: './vendor-edit-page.component.html',
  styleUrls: ['./vendor-edit-page.component.scss']
})
export class VendorEditPageComponent implements OnInit, OnDestroy {
  /**
   * Vendor being edited
   */
  vendor: Vendor | null = null;

  /**
   * Loading state
   */
  isLoading = true;

  /**
   * Error message if loading or update fails
   */
  errorMessage: string | null = null;

  /**
   * Vendor ID from route params
   */
  private vendorId!: string;

  /**
   * Subject for component cleanup
   */
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vendorService: VendorService
  ) {}

  ngOnInit(): void {
    // Get vendor ID from route params
    this.vendorId = this.route.snapshot.paramMap.get('id')!;
    this.loadVendor();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load vendor data
   */
  private loadVendor(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.vendorService.getVendor(this.vendorId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.vendor = response.vendor;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error?.message || 'Failed to load vendor details.';
          this.isLoading = false;
        }
      });
  }

  /**
   * Handle form submission
   */
  onSubmit(formData: VendorUpdateRequest): void {
    this.errorMessage = null;

    this.vendorService.updateVendor(this.vendorId, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Navigate to vendor profile on success
          this.router.navigate(['/vendor-marketplace', this.vendorId]);
        },
        error: (error) => {
          this.errorMessage = error?.message || 'Failed to update vendor. Please try again.';
          // Scroll to top to show error
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
  }

  /**
   * Handle form cancellation
   */
  onCancel(): void {
    this.router.navigate(['/vendor-marketplace', this.vendorId]);
  }

  /**
   * Retry loading vendor data
   */
  onRetry(): void {
    this.loadVendor();
  }
}
