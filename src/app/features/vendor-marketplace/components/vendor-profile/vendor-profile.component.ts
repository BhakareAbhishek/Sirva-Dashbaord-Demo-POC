import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Vendor, VendorStatusHistory, VendorStatus } from '../../../../models/vendor.model';

/**
 * Component for displaying vendor profile in read-only mode
 * 
 * Features:
 * - Comprehensive vendor information display
 * - Status history timeline
 * - Service badges
 * - Eligibility indicators
 * - Navigation to edit mode
 * - WCAG 2.1 accessible
 */
@Component({
  selector: 'app-vendor-profile',
  templateUrl: './vendor-profile.component.html',
  styleUrls: ['./vendor-profile.component.scss']
})
export class VendorProfileComponent {
  /**
   * Vendor data to display
   */
  @Input() vendor!: Vendor;

  /**
   * Status change history
   */
  @Input() statusHistory: VendorStatusHistory[] = [];

  /**
   * Loading state for status history
   */
  @Input() isLoadingHistory = false;

  /**
   * Event emitted when edit button is clicked
   */
  @Output() editVendor = new EventEmitter<void>();

  /**
   * Event emitted when status change is requested
   */
  @Output() statusChange = new EventEmitter<{ newStatus: VendorStatus; reason?: string }>();

  /**
   * Whether to show edit button (based on permissions)
   */
  @Input() canEdit = true;

  /**
   * Expose VendorStatus enum to template
   */
  VendorStatus = VendorStatus;

  /**
   * Handle edit button click
   */
  onEdit(): void {
    this.editVendor.emit();
  }

  /**
   * Handle status toggle
   */
  onStatusToggle(event: { vendorId: string; newStatus: VendorStatus; reason?: string }): void {
    this.statusChange.emit({
      newStatus: event.newStatus,
      reason: event.reason
    });
  }

  /**
   * Format date to readable string
   */
  formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Format relative time (e.g., "2 hours ago")
   */
  formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSeconds < 60) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
    return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
  }

  /**
   * Get CSS class for eligibility badge
   */
  getEligibilityClass(): string {
    return this.vendor.isEligible ? 'badge-eligible' : 'badge-restricted';
  }

  /**
   * Get eligibility label
   */
  getEligibilityLabel(): string {
    return this.vendor.isEligible ? 'Eligible' : 'Restricted';
  }

  /**
   * Get status label for history item
   */
  getStatusLabel(status: VendorStatus): string {
    const labels: Record<VendorStatus, string> = {
      [VendorStatus.Active]: 'Active',
      [VendorStatus.Inactive]: 'Inactive',
      [VendorStatus.UnderReview]: 'Under Review',
      [VendorStatus.Suspended]: 'Suspended'
    };
    return labels[status] || status;
  }

  /**
   * Get CSS class for status badge in history
   */
  getStatusClass(status: VendorStatus): string {
    const classes: Record<VendorStatus, string> = {
      [VendorStatus.Active]: 'status-active',
      [VendorStatus.Inactive]: 'status-inactive',
      [VendorStatus.UnderReview]: 'status-under-review',
      [VendorStatus.Suspended]: 'status-suspended'
    };
    return classes[status] || 'status-default';
  }
}
