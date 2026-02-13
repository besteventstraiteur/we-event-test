/**
 * API Types - Types génériques pour les réponses API
 * 
 * Définitions TypeScript centralisées pour toutes les interactions API
 */

// ============================
// RESPONSE TYPES
// ============================

/**
 * Generic API Response structure
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  statusCode?: number;
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * API Error structure
 */
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// ============================
// REQUEST TYPES
// ============================

/**
 * Pagination parameters for list requests
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Search/Filter parameters
 */
export interface FilterParams {
  search?: string;
  category?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  [key: string]: any; // Allow custom filters
}

/**
 * Combined params for list endpoints
 */
export interface ListParams extends PaginationParams, FilterParams {}

// ============================
// COMMON ENTITY FIELDS
// ============================

/**
 * Common fields present in most entities
 */
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Entity with soft delete
 */
export interface SoftDeletableEntity extends BaseEntity {
  deleted_at?: string | null;
}

// ============================
// USER & AUTH TYPES
// ============================

/**
 * User roles
 */
export enum UserRole {
  CLIENT = 'client',
  PARTNER = 'partner',
  ADMIN = 'admin',
}

/**
 * Basic User info (from JWT or user profile)
 */
export interface User extends BaseEntity {
  email: string;
  full_name?: string;
  role: UserRole;
  profile_picture_url?: string;
  phone_number?: string;
  address?: string;
  event_preferences?: Record<string, any>;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  token: string;
  user: User;
  expires_at?: string;
}

// ============================
// FILE UPLOAD TYPES
// ============================

/**
 * File upload response
 */
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

/**
 * Multiple files upload
 */
export interface MultipleUploadResponse {
  files: UploadResponse[];
}

// ============================
// STATUS ENUMS
// ============================

/**
 * Generic status for entities
 */
export enum EntityStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

/**
 * Booking status
 */
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

/**
 * Event status
 */
export enum EventStatus {
  DRAFT = 'draft',
  PLANNED = 'planned',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// ============================
// UTILITY TYPES
// ============================

/**
 * Make all properties optional (for PATCH requests)
 */
export type PartialUpdate<T> = Partial<T>;

/**
 * Make specific properties required
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Omit common fields (useful for create DTOs)
 */
export type CreateDTO<T extends BaseEntity> = Omit<T, 'id' | 'created_at' | 'updated_at'>;

/**
 * Update DTO (partial with id required)
 */
export type UpdateDTO<T extends BaseEntity> = Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>> & { id: string };

// ============================
// HELPER FUNCTIONS
// ============================

/**
 * Type guard to check if response is successful
 */
export function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { success: true } {
  return response.success === true;
}

/**
 * Type guard to check if error has validation errors
 */
export function hasValidationErrors(error: ApiError): error is ApiError & { errors: Record<string, string[]> } {
  return !!error.errors && Object.keys(error.errors).length > 0;
}

/**
 * Extract error message from ApiError
 */
export function getErrorMessage(error: ApiError): string {
  if (hasValidationErrors(error)) {
    const firstKey = Object.keys(error.errors)[0];
    return error.errors[firstKey][0];
  }
  return error.message;
}

// ============================
// EXPORT ALL
// ============================

export default {
  isSuccessResponse,
  hasValidationErrors,
  getErrorMessage,
};
