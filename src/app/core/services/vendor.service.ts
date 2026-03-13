import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Vendor,
  VendorStatus,
  VendorCreateRequest,
  VendorUpdateRequest,
  VendorStatusUpdateRequest,
  VendorListResponse,
  VendorDetailResponse,
  VendorSearchParams,
  VendorStatusHistory
} from '../../models/vendor.model';

/**
 * VendorService
 * 
 * Handles all API interactions for vendor management operations including
 * CRUD operations, status management, search/filtering, and status history.
 * 
 * All methods use typed HttpClient calls and include comprehensive error handling.
 */
@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private readonly apiUrl = `${environment.apiUrl}/vendors`;
  private readonly listRequestTimeoutMs = Math.min(environment.apiTimeout, 2500);

  constructor(private http: HttpClient) {}

  /**
   * List vendors with pagination, search, and filtering
   * 
   * @param params Search and filter parameters
   * @returns Observable of paginated vendor list response
   */
  listVendors(params: VendorSearchParams = {}): Observable<VendorListResponse> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;

    return this.http
      .get<unknown>(this.apiUrl)
      .pipe(
        timeout(this.listRequestTimeoutMs),
        map((response) => this.normalizeListResponse(response, params, page, pageSize)),
        catchError(() =>
          // Match dashboard behavior: keep page usable with fallback data if API is unavailable.
          of(this.normalizeListResponse(this.getDemoVendors(), params, page, pageSize))
        )
      );
  }

  /**
   * Get single vendor by ID with optional status history
   * 
   * @param id Vendor UUID
   * @returns Observable of vendor detail response
   */
  getVendor(id: string): Observable<VendorDetailResponse> {
    return this.http.get<unknown>(`${this.apiUrl}/${id}`).pipe(
      map((response) => ({
        vendor: this.extractVendor(response),
      })),
      catchError(this.handleError)
    );
  }

  /**
   * Create a new vendor
   * 
   * @param data Vendor creation payload
   * @returns Observable of created vendor detail
   */
  createVendor(data: VendorCreateRequest): Observable<VendorDetailResponse> {
    return this.http.post<unknown>(this.apiUrl, data).pipe(
      map((response) => ({
        vendor: this.extractVendor(response),
      })),
      catchError(this.handleError)
    );
  }

  /**
   * Update vendor profile
   * 
   * @param id Vendor UUID
   * @param data Vendor update payload
   * @returns Observable of updated vendor detail
   */
  updateVendor(id: string, data: VendorUpdateRequest): Observable<VendorDetailResponse> {
    return this.http.patch<unknown>(`${this.apiUrl}/${id}`, data).pipe(
      map((response) => ({
        vendor: this.extractVendor(response),
      })),
      catchError(this.handleError)
    );
  }

  /**
   * Update vendor status (activate/deactivate)
   * 
   * @param id Vendor UUID
   * @param status New vendor status
   * @param reason Optional reason for status change
   * @returns Observable of updated vendor detail
   */
  updateVendorStatus(id: string, status: VendorStatus, reason?: string): Observable<VendorDetailResponse> {
    const payload: VendorStatusUpdateRequest = { status, reason };

    // Prefer contract endpoint; fallback for local JSON server mock.
    return this.http.patch<unknown>(`${this.apiUrl}/${id}/status`, payload).pipe(
      map((response) => ({
        vendor: this.extractVendor(response),
      })),
      catchError(() =>
        this.http.patch<unknown>(`${this.apiUrl}/${id}`, { status }).pipe(
          map((response) => ({
            vendor: this.extractVendor(response),
          })),
          catchError(this.handleError)
        )
      )
    );
  }

  /**
   * Get vendor status change history
   * 
   * @param id Vendor UUID
   * @param limit Maximum number of history entries (default: 10)
   * @returns Observable of status history array
   */
  getStatusHistory(id: string, limit: number = 10): Observable<VendorStatusHistory[]> {
    return this.http
      .get<unknown>(`${this.apiUrl}/${id}/status-history`)
      .pipe(
        map((response) => {
          if (Array.isArray(response)) {
            return (response as VendorStatusHistory[]).slice(0, limit);
          }
          const wrappedHistory = (response as { data?: { history?: VendorStatusHistory[] } })?.data?.history;
          if (Array.isArray(wrappedHistory)) {
            return wrappedHistory.slice(0, limit);
          }
          const history = (response as { history?: VendorStatusHistory[] })?.history;
          return Array.isArray(history) ? history.slice(0, limit) : [];
        }),
      catchError(this.handleError)
    );
  }

  /**
   * Check if email is available (for async validation)
   * 
   * @param email Email address to check
   * @param excludeVendorId Optional vendor ID to exclude from check (for edit mode)
   * @returns Observable of boolean (true if available, false if taken)
   */
  checkEmailAvailability(email: string, excludeVendorId?: string): Observable<boolean> {
    return this.http.get<unknown>(this.apiUrl).pipe(
      map((response) => this.extractVendorList(response)),
      map((vendors) =>
        vendors.filter((vendor) => {
          if (excludeVendorId && vendor.id === excludeVendorId) {
            return false;
          }
          return vendor.email?.trim().toLowerCase() === email.trim().toLowerCase();
        }).length === 0
      ),
      catchError(() => throwError(() => new Error('Email availability check failed')))
    );
  }

  private normalizeListResponse(
    body: unknown,
    params: VendorSearchParams,
    currentPage: number,
    pageSize: number
  ): VendorListResponse {
    const searchText = params.search?.trim().toLowerCase() ?? '';
    const filteredBySearch = this.extractVendorList(body).filter((vendor) => {
      if (!searchText) {
        return true;
      }
      return (
        vendor.name?.toLowerCase().includes(searchText) ||
        vendor.companyName?.toLowerCase().includes(searchText) ||
        vendor.email?.toLowerCase().includes(searchText)
      );
    });
    const filteredVendors = params.status
      ? filteredBySearch.filter((vendor) => vendor.status === params.status)
      : filteredBySearch;
    const totalItems = filteredVendors.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pagedVendors = filteredVendors.slice(start, end);

    return {
      vendors: pagedVendors,
      pagination: {
        currentPage,
        pageSize,
        totalItems,
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrevious: currentPage > 1,
      },
    };
  }

  private extractVendorList(body: unknown): Vendor[] {
    if (Array.isArray(body)) {
      return body as Vendor[];
    }

    const maybeWrapped = body as {
      data?: { vendors?: Vendor[] };
      vendors?: Vendor[];
    };

    const nestedVendors = maybeWrapped?.data?.vendors;
    if (Array.isArray(nestedVendors)) {
      return nestedVendors;
    }
    if (Array.isArray(maybeWrapped?.vendors)) {
      return maybeWrapped.vendors;
    }

    return [];
  }

  private extractVendor(body: unknown): Vendor {
    const maybeWrapped = body as { data?: { vendor?: Vendor }; vendor?: Vendor };
    return maybeWrapped?.data?.vendor ?? maybeWrapped?.vendor ?? (body as Vendor);
  }

  // Development fallback so vendor list still renders when API is down.
  private getDemoVendors(): Vendor[] {
    return [
      {
        id: 'demo-vendor-1',
        name: 'Sirva Mobility',
        companyName: 'Sirva Mobility Solutions Inc.',
        email: 'contact@sirvamobility.com',
        phone: '(555) 234-5678',
        description: 'Global relocation services provider.',
        services: ['Relocation Services', 'Moving Services', 'Destination Services'],
        status: VendorStatus.Active,
        isEligible: true,
        activeWidgetCount: 12,
        lastActivity: '2026-03-13T11:15:00Z',
        createdAt: '2026-01-15T10:00:00Z',
        updatedAt: '2026-03-13T11:15:00Z',
      },
      {
        id: 'demo-vendor-2',
        name: 'Global Relocation Services',
        companyName: 'Global Relocation Services LLC',
        email: 'info@globalrelocation.com',
        phone: '(555) 345-6789',
        description: 'Corporate and international relocation specialist.',
        services: ['Relocation Services', 'Real Estate', 'Expense Management'],
        status: VendorStatus.Active,
        isEligible: true,
        activeWidgetCount: 8,
        lastActivity: '2026-03-13T09:30:00Z',
        createdAt: '2026-02-20T14:30:00Z',
        updatedAt: '2026-03-12T16:00:00Z',
      },
      {
        id: 'demo-vendor-3',
        name: 'Corporate Housing Solutions',
        companyName: 'Corporate Housing Solutions Group',
        email: 'support@corphousing.com',
        phone: '(555) 456-7890',
        description: 'Temporary housing for relocating employees.',
        services: ['Relocation Services', 'Real Estate', 'Destination Services'],
        status: VendorStatus.UnderReview,
        isEligible: false,
        activeWidgetCount: 0,
        lastActivity: null,
        createdAt: '2026-03-10T09:15:00Z',
        updatedAt: '2026-03-10T09:15:00Z',
      },
      {
        id: 'demo-vendor-4',
        name: 'International Moving Company',
        companyName: 'International Moving & Storage Co.',
        email: 'hello@intlmoving.com',
        phone: '(555) 567-8901',
        description: 'Specialized in international moves.',
        services: ['Moving Services', 'Household Goods', 'Immigration Services'],
        status: VendorStatus.Active,
        isEligible: true,
        activeWidgetCount: 15,
        lastActivity: '2026-03-13T08:20:00Z',
        createdAt: '2026-02-05T11:00:00Z',
        updatedAt: '2026-03-11T14:30:00Z',
      },
    ];
  }

  /**
   * Centralized error handling
   * Maps HTTP error codes to user-friendly messages
   * 
   * @param error HTTP error response
   * @returns Observable error with user-friendly message
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error.error && error.error.error) {
      const apiError = error.error.error;
      
      // Map API error codes to user-friendly messages
      const errorMessages: Record<string, string> = {
        'VENDOR_EMAIL_DUPLICATE': 'This email address is already registered to another vendor',
        'VENDOR_NOT_FOUND': 'Vendor not found',
        'VENDOR_VALIDATION_ERROR': apiError.message || 'Validation failed',
        'VENDOR_UNAUTHORIZED': 'You do not have permission to perform this action',
        'VENDOR_FORBIDDEN': 'Access forbidden',
        'VENDOR_SERVER_ERROR': 'Server error occurred. Please try again later'
      };

      errorMessage = errorMessages[apiError.code] || apiError.message || errorMessage;
    } else if (error.status === 0) {
      errorMessage = 'Network error. Please check your connection and try again.';
    } else if (error.status === 404) {
      errorMessage = 'Vendor not found';
    } else if (error.status === 409) {
      errorMessage = 'This email address is already registered to another vendor';
    } else if (error.status >= 500) {
      errorMessage = 'Server error occurred. Please try again later.';
    }

    return throwError(() => new Error(errorMessage));
  }
}
