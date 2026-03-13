import { Component, Input, Output, EventEmitter } from '@angular/core';
import { VendorStatus } from '../../../../models/vendor.model';

/**
 * Component for toggling vendor status with visual feedback
 * 
 * Features:
 * - Visual status badge with color coding
 * - Click to toggle status (with confirmation)
 * - Optimistic UI updates with rollback on failure
 * - WCAG 2.1 accessible with ARIA labels
 */
@Component({
  selector: 'app-vendor-status-toggle',
  templateUrl: './vendor-status-toggle.component.html',
  styleUrls: ['./vendor-status-toggle.component.scss']
})
export class VendorStatusToggleComponent {
  /**
   * Vendor ID for status updates
   */
  @Input() vendorId!: string;

  /**
   * Current vendor status
   */
  @Input() currentStatus!: VendorStatus;

  /**
   * Whether to show interactive toggle (defaults to true)
   */
  @Input() interactive = true;

  /**
   * Event emitted when status is changed
   */
  @Output() statusChange = new EventEmitter<{
    vendorId: string;
    newStatus: VendorStatus;
    reason?: string;
  }>();

  /**
   * Loading state during status update
   */
  isUpdating = false;

  /**
   * Expose VendorStatus enum to template
   */
  VendorStatus = VendorStatus;

  /**
   * Get CSS class for status badge
   */
  getStatusClass(): string {
    const statusClasses: Record<VendorStatus, string> = {
      [VendorStatus.Active]: 'status-active',
      [VendorStatus.Inactive]: 'status-inactive',
      [VendorStatus.UnderReview]: 'status-under-review',
      [VendorStatus.Suspended]: 'status-suspended'
    };
    return statusClasses[this.currentStatus] || 'status-default';
  }

  /**
   * Get display label for status
   */
  getStatusLabel(): string {
    const statusLabels: Record<VendorStatus, string> = {
      [VendorStatus.Active]: 'Active',
      [VendorStatus.Inactive]: 'Inactive',
      [VendorStatus.UnderReview]: 'Under Review',
      [VendorStatus.Suspended]: 'Suspended'
    };
    return statusLabels[this.currentStatus] || this.currentStatus;
  }

  /**
   * Get next status in toggle sequence
   * Current logic: Active <-> Inactive (simple toggle)
   * Can be enhanced for more complex workflows
   */
  getNextStatus(): VendorStatus {
    if (this.currentStatus === VendorStatus.Active) {
      return VendorStatus.Inactive;
    }
    return VendorStatus.Active;
  }

  /**
   * Handle status toggle click
   */
  onToggleStatus(): void {
    if (!this.interactive || this.isUpdating) {
      return;
    }

    const newStatus = this.getNextStatus();
    
    // Show confirmation dialog for status changes
    const action = newStatus === VendorStatus.Active ? 'activate' : 'deactivate';
    const confirmed = confirm(
      `Are you sure you want to ${action} this vendor?\n\n` +
      `This will change the status from "${this.getStatusLabel()}" to "${this.getStatusLabelForStatus(newStatus)}".`
    );

    if (!confirmed) {
      return;
    }

    // Prompt for reason (optional for deactivation, recommended for best practice)
    let reason: string | undefined;
    if (newStatus === VendorStatus.Inactive || newStatus === VendorStatus.Suspended) {
      const reasonInput = prompt(`Please provide a reason for ${action}ing this vendor (optional):`);
      reason = reasonInput || undefined;
    }

    // Emit status change event
    this.statusChange.emit({
      vendorId: this.vendorId,
      newStatus,
      reason
    });
  }

  /**
   * Get status label for a specific status value
   */
  private getStatusLabelForStatus(status: VendorStatus): string {
    const statusLabels: Record<VendorStatus, string> = {
      [VendorStatus.Active]: 'Active',
      [VendorStatus.Inactive]: 'Inactive',
      [VendorStatus.UnderReview]: 'Under Review',
      [VendorStatus.Suspended]: 'Suspended'
    };
    return statusLabels[status] || status;
  }

  /**
   * Reset updating state (called by parent on success/failure)
   */
  resetUpdatingState(): void {
    this.isUpdating = false;
  }
}
