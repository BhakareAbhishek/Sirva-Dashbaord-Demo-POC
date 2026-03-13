/**
 * Vendor Marketplace Data Models
 * Defines TypeScript interfaces and enums for vendor management
 */

/**
 * Vendor status enumeration
 * Active: Vendor has platform access and can create widgets
 * Inactive: Vendor is deactivated and cannot access features
 * UnderReview: Vendor application is being reviewed
 * Suspended: Vendor access is temporarily suspended
 */
export enum VendorStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  UnderReview = 'Under Review',
  Suspended = 'Suspended'
}

/**
 * Core vendor entity representing a service provider
 * in the Sirva marketplace ecosystem
 */
export interface Vendor {
  /** Unique vendor identifier (UUID v4) */
  id: string;
  
  /** Display name for the vendor */
  name: string;
  
  /** Legal company name */
  companyName: string;
  
  /** Primary contact email (must be unique, case-insensitive) */
  email: string;
  
  /** Contact phone number */
  phone: string;
  
  /** Description of vendor business and capabilities */
  description?: string;
  
  /** Services provided by the vendor */
  services: string[];
  
  /** Vendor account status */
  status: VendorStatus;
  
  /** Whether vendor is eligible for widget creation */
  isEligible: boolean;
  
  /** Number of active widgets */
  activeWidgetCount: number;
  
  /** Last activity timestamp (ISO 8601) */
  lastActivity: string | null;
  
  /** Timestamp when vendor was onboarded (ISO 8601) */
  createdAt: string;
  
  /** Timestamp of last profile update (ISO 8601) */
  updatedAt: string;
}

/**
 * Request payload for creating a new vendor
 */
export interface VendorCreateRequest {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  description?: string;
  services: string[];
}

/**
 * Request payload for updating vendor profile
 */
export interface VendorUpdateRequest {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  description?: string;
  services: string[];
}

/**
 * Request payload for changing vendor status
 */
export interface VendorStatusUpdateRequest {
  status: VendorStatus;
  reason?: string;
}

/**
 * Pagination metadata for vendor list responses
 */
export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * API response for vendor listing
 */
export interface VendorListResponse {
  vendors: Vendor[];
  pagination: PaginationMeta;
}

/**
 * Vendor status history entry for audit trail
 */
export interface VendorStatusHistory {
  id: string;
  vendorId: string;
  status: VendorStatus;
  changedAt: string;
  changedBy: string;
  reason?: string;
}

/**
 * API response for vendor detail retrieval
 */
export interface VendorDetailResponse {
  vendor: Vendor;
}

/**
 * Search and filter parameters for vendor listing
 */
export interface VendorSearchParams {
  search?: string;
  status?: VendorStatus | null;
  page?: number;
  pageSize?: number;
}

