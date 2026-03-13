import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Vendor, VendorStatus } from '../../../../models/vendor.model';

/**
 * Presentational component for displaying a list of vendors in a table format
 * 
 * Features:
 * - Responsive table layout matching UI mockup
 * - Status badges with color coding
 * - Eligibility indicators
 * - Action buttons (View, Edit)
 * - Optimized rendering with trackBy
 * - WCAG 2.1 Level AA accessibility
 */
@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent {
  /**
   * Array of vendors to display
   */
  @Input() vendors: Vendor[] = [];

  /**
   * Event emitted when user clicks to view vendor details
   */
  @Output() viewVendor = new EventEmitter<string>();

  /**
   * Event emitted when user changes vendor status
   */
  @Output() statusChange = new EventEmitter<{ vendorId: string; newStatus: VendorStatus; reason?: string }>();

  /**
   * TrackBy function for optimized rendering of vendor list
   */
  trackByVendorId(index: number, vendor: Vendor): string {
    return vendor.id;
  }

  /**
   * Get CSS class for vendor status badge
   */
  getStatusClass(status: VendorStatus): string {
    const statusClasses: Record<VendorStatus, string> = {
      [VendorStatus.Active]: 'status-active',
      [VendorStatus.Inactive]: 'status-inactive',
      [VendorStatus.UnderReview]: 'status-under-review',
      [VendorStatus.Suspended]: 'status-suspended'
    };
    return statusClasses[status] || 'status-default';
  }

  /**
   * Get display label for vendor status
   */
  getStatusLabel(status: VendorStatus): string {
    const statusLabels: Record<VendorStatus, string> = {
      [VendorStatus.Active]: 'Active',
      [VendorStatus.Inactive]: 'Inactive',
      [VendorStatus.UnderReview]: 'Under Review',
      [VendorStatus.Suspended]: 'Suspended'
    };
    return statusLabels[status] || status;
  }

  /**
   * Get CSS class for eligibility badge
   */
  getEligibilityClass(isEligible: boolean): string {
    return isEligible ? 'eligibility-eligible' : 'eligibility-restricted';
  }

  /**
   * Get display label for eligibility status
   */
  getEligibilityLabel(isEligible: boolean): string {
    return isEligible ? 'Eligible' : 'Restricted';
  }

  /**
   * Handle view vendor button click
   */
  onViewVendor(vendorId: string): void {
    this.viewVendor.emit(vendorId);
  }

  /**
   * Handle status toggle
   */
  onStatusToggle(event: { vendorId: string; newStatus: VendorStatus; reason?: string }): void {
    this.statusChange.emit(event);
  }

  /**
   * Format date string to readable format
   */
  formatDate(dateString: string | null): string {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  /**
   * Get comma-separated list of services
   */
  getServicesList(services: string[]): string {
    if (!services || services.length === 0) return 'None';
    if (services.length <= 3) return services.join(', ');
    return `${services.slice(0, 3).join(', ')} +${services.length - 3}`;
  }
}
