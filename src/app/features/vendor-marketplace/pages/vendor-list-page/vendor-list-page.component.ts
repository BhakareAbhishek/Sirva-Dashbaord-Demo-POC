import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { VendorService } from '../../../../core/services/vendor.service';
import { Vendor, VendorStatus, VendorSearchParams, PaginationMeta } from '../../../../models/vendor.model';

/**
 * VendorListPageComponent
 * 
 * Smart component that orchestrates vendor listing with search, filtering, and pagination.
 * Integrates VendorListComponent (table), VendorSearchFilterComponent, and pagination controls.
 * 
 * Features:
 * - Real-time search with 300ms debounce
 * - Status filtering (All/Active/Inactive)
 * - Pagination with configurable page size
 * - Loading, empty, and error states
 * - Retry capability on errors
 */
@Component({
  selector: 'app-vendor-list-page',
  templateUrl: './vendor-list-page.component.html',
  styleUrls: ['./vendor-list-page.component.scss']
})
export class VendorListPageComponent implements OnInit, OnDestroy {
  vendors: Vendor[] = [];
  pagination: PaginationMeta = {
    currentPage: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false
  };

  isLoading = false;
  error: string | null = null;

  // Expose Math to template
  Math = Math;

  // Search and filter state
  searchTerm = '';
  statusFilter: VendorStatus | 'All' = 'All';
  currentPage = 1;
  pageSize = 20;

  private destroy$ = new Subject<void>();
  private searchSubject$ = new BehaviorSubject<string>('');
  private filterSubject$ = new BehaviorSubject<VendorStatus | 'All'>('All');

  constructor(
    private vendorService: VendorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Keep search and filter in sync, including first load.
    combineLatest([
      this.searchSubject$
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      ),
      this.filterSubject$.pipe(distinctUntilChanged())
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([term, status]) => {
        const isSearchChanged = this.searchTerm !== term;
        const isFilterChanged = this.statusFilter !== status;

        this.searchTerm = term;
        this.statusFilter = status;

        if (isSearchChanged || isFilterChanged) {
          this.currentPage = 1;
        }

        this.loadVendors();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load vendors from API with current search/filter/pagination params
   */
  loadVendors(): void {
    this.isLoading = true;
    this.error = null;

    const params: VendorSearchParams = {
      search: this.searchTerm || undefined,
      status: this.statusFilter !== 'All' ? this.statusFilter : undefined,
      page: this.currentPage,
      pageSize: this.pageSize
    };

    this.vendorService.listVendors(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.vendors = response.vendors;
          this.pagination = response.pagination;
          this.isLoading = false;
        },
        error: (error) => {
          this.error = error.message || 'Failed to load vendors. Please try again.';
          this.isLoading = false;
          this.vendors = [];
        }
      });
  }

  /**
   * Handle search input change
   */
  onSearchChange(searchTerm: string): void {
    this.searchSubject$.next(searchTerm);
  }

  /**
   * Handle status filter change
   */
  onFilterChange(status: VendorStatus | 'All'): void {
    this.filterSubject$.next(status);
  }

  /**
   * Handle pagination - next page
   */
  onNextPage(): void {
    if (this.pagination.hasNext) {
      this.currentPage++;
      this.loadVendors();
    }
  }

  /**
   * Handle pagination - previous page
   */
  onPreviousPage(): void {
    if (this.pagination.hasPrevious) {
      this.currentPage--;
      this.loadVendors();
    }
  }

  /**
   * Handle page size change
   */
  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1; // Reset to first page
    this.loadVendors();
  }

  /**
   * Navigate to vendor creation page
   */
  onAddVendor(): void {
    this.router.navigate(['/vendor-marketplace/create']);
  }

  /**
   * Navigate to vendor profile page
   */
  onViewVendor(vendorId: string): void {
    this.router.navigate(['/vendor-marketplace', vendorId]);
  }

  /**
   * Handle vendor status change from toggle
   */
  onStatusChange(event: { vendorId: string; newStatus: VendorStatus; reason?: string }): void {
    this.error = null;

    this.vendorService
      .updateVendorStatus(event.vendorId, event.newStatus, event.reason)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const updatedVendor = response.vendor;
          const vendorIndex = this.vendors.findIndex((vendor) => vendor.id === updatedVendor.id);
          if (vendorIndex >= 0) {
            this.vendors[vendorIndex] = updatedVendor;
            this.vendors = [...this.vendors];
          } else {
            this.loadVendors();
          }
        },
        error: (error) => {
          this.error = error?.message || 'Failed to update vendor status. Please try again.';
        }
      });
  }

  /**
   * Retry loading vendors after error
   */
  onRetry(): void {
    this.loadVendors();
  }
}
