import { Component, Output, EventEmitter } from '@angular/core';
import { VendorStatus } from '../../../../models/vendor.model';

/**
 * Component for searching and filtering vendors
 * 
 * Features:
 * - Search input with debouncing handled by parent
 * - Status filter dropdown
 * - Clear filters functionality
 * - WCAG 2.1 accessible with proper labels
 */
@Component({
  selector: 'app-vendor-search-filter',
  templateUrl: './vendor-search-filter.component.html',
  styleUrls: ['./vendor-search-filter.component.scss']
})
export class VendorSearchFilterComponent {
  /**
   * Event emitted when search query changes
   */
  @Output() searchChange = new EventEmitter<string>();

  /**
   * Event emitted when filter criteria changes
   */
  @Output() filterChange = new EventEmitter<VendorStatus | 'All'>();

  /**
   * Current search query
   */
  searchQuery = '';

  /**
   * Current selected status filter
   */
  selectedStatus: VendorStatus | 'All' = 'All';

  /**
   * Available status filter options
   */
  statusOptions = [
    { value: 'All' as const, label: 'All Statuses' },
    { value: VendorStatus.Active, label: 'Active' },
    { value: VendorStatus.Inactive, label: 'Inactive' },
    { value: VendorStatus.UnderReview, label: 'Under Review' },
    { value: VendorStatus.Suspended, label: 'Suspended' }
  ];

  /**
   * Handle search input change
   */
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.searchChange.emit(this.searchQuery);
  }

  /**
   * Handle status filter change
   */
  onStatusFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value as VendorStatus | 'All';
    this.selectedStatus = value;
    this.filterChange.emit(this.selectedStatus);
  }

  /**
   * Clear all filters
   */
  onClearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = 'All';
    this.searchChange.emit(this.searchQuery);
    this.filterChange.emit(this.selectedStatus);
  }

  /**
   * Check if any filters are active
   */
  hasActiveFilters(): boolean {
    return this.searchQuery.length > 0 || this.selectedStatus !== 'All';
  }
}
