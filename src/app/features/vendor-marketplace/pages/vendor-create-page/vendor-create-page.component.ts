import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VendorService } from '../../../../core/services/vendor.service';
import { VendorCreateRequest } from '../../../../models/vendor.model';

/**
 * Page component for creating a new vendor
 * 
 * Orchestrates:
 * - Vendor creation form
 * - API submission
 * - Success/error handling
 * - Navigation after success
 */
@Component({
  selector: 'app-vendor-create-page',
  templateUrl: './vendor-create-page.component.html',
  styleUrls: ['./vendor-create-page.component.scss']
})
export class VendorCreatePageComponent {
  /**
   * Error message if creation fails
   */
  errorMessage: string | null = null;

  constructor(
    private vendorService: VendorService,
    private router: Router
  ) {}

  /**
   * Handle form submission
   */
  onSubmit(formData: VendorCreateRequest): void {
    this.errorMessage = null;

    this.vendorService.createVendor(formData).subscribe({
      next: (response) => {
        // Navigate to vendor profile on success
        this.router.navigate(['/vendor-marketplace', response.vendor.id]);
      },
      error: (error) => {
        this.errorMessage = error?.message || 'Failed to create vendor. Please try again.';
        // Scroll to top to show error
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  /**
   * Handle form cancellation
   */
  onCancel(): void {
    this.router.navigate(['/vendor-marketplace']);
  }
}
