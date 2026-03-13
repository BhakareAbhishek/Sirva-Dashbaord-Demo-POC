import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VendorService } from '../../../../core/services/vendor.service';
import { Vendor, VendorStatusHistory, VendorStatus } from '../../../../models/vendor.model';

/**
 * Page component for displaying vendor profile
 * 
 * Orchestrates:
 * - Loading vendor data
 * - Loading status history
 * - Vendor profile display
 * - Navigation to edit mode
 * - Status updates
 */
@Component({
  selector: 'app-vendor-profile-page',
  templateUrl: './vendor-profile-page.component.html',
  styleUrls: ['./vendor-profile-page.component.scss']
})
export class VendorProfilePageComponent implements OnInit, OnDestroy {
  /**
   * Vendor being displayed
   */
  vendor: Vendor | null = null;

  /**
   * Status change history
   */
  statusHistory: VendorStatusHistory[] = [];

  /**
   * Loading state for vendor data
   */
  isLoading = true;

  /**
   * Loading state for status history
   */
  isLoadingHistory = false;

  /**
   * Error message if loading fails
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
          // Load status history after vendor is loaded
          this.loadStatusHistory();
        },
        error: (error) => {
          this.errorMessage = error?.message || 'Failed to load vendor profile.';
          this.isLoading = false;
        }
      });
  }

  /**
   * Load status change history
   */
  private loadStatusHistory(): void {
    this.isLoadingHistory = true;

    this.vendorService.getStatusHistory(this.vendorId, 10)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (history) => {
          this.statusHistory = history;
          this.isLoadingHistory = false;
        },
        error: () => {
          // Fail silently for history, don't block profile display
          this.statusHistory = [];
          this.isLoadingHistory = false;
        }
      });
  }

  /**
   * Handle edit button click
   */
  onEdit(): void {
    this.router.navigate(['/vendor-marketplace', this.vendorId, 'edit']);
  }

  /**
   * Handle status change
   */
  onStatusChange(event: { newStatus: VendorStatus; reason?: string }): void {
    if (!this.vendor) return;

    // Optimistic update
    const previousStatus = this.vendor.status;
    this.vendor.status = event.newStatus;

    this.vendorService.updateVendorStatus(this.vendorId, event.newStatus, event.reason)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Reload status history to show the change
          this.loadStatusHistory();
        },
        error: (error) => {
          // Rollback on failure
          if (this.vendor) {
            this.vendor.status = previousStatus;
          }
          alert(error?.message || 'Failed to update vendor status.');
        }
      });
  }

  /**
   * Retry loading vendor data
   */
  onRetry(): void {
    this.loadVendor();
  }

  /**
   * Navigate back to vendor list
   */
  onBackToList(): void {
    this.router.navigate(['/vendor-marketplace']);
  }
}
