/**
 * Package Service - Gestion des packages/prestations
 * 
 * Service pour toutes les opérations CRUD sur les packages
 */

import { apiClient } from './api-client';
import { ApiResponse } from '../types/api';
import {
  Package,
  CreatePackageDTO,
  UpdatePackageDTO,
  PackageListParams,
  PackageStats,
  ApprovalStatus,
} from '../types/package';
import { PROVIDER } from '../utils/endPoints';

// ============================
// PACKAGE SERVICE CLASS
// ============================

export class PackageService {
  /**
   * Get all packages (with pagination and filters)
   * @param params - Filters and pagination
   * @returns Promise with packages list
   */
  async getAllPackages(params?: PackageListParams): Promise<ApiResponse<Package[]>> {
    const queryString = this.buildQueryString(params);
    const url = `${PROVIDER.GET_ALL_PROFILES}${queryString}`;
    return apiClient.get<Package[]>(url);
  }

  /**
   * Get my packages (partner only)
   * @param params - Filters and pagination
   * @returns Promise with my packages
   */
  async getMyPackages(params?: PackageListParams): Promise<ApiResponse<Package[]>> {
    const queryString = this.buildQueryString(params);
    const url = `${PROVIDER.GET_PROFILE}${queryString}`;
    return apiClient.get<Package[]>(url);
  }

  /**
   * Get package by ID
   * @param packageId - Package ID
   * @returns Promise with package details
   */
  async getPackageById(packageId: string): Promise<ApiResponse<Package>> {
    const url = `${PROVIDER.GET_ALL_PROFILES}/${packageId}`;
    return apiClient.get<Package>(url);
  }

  /**
   * Create a new package
   * @param data - Package creation data
   * @returns Promise with created package
   */
  async createPackage(data: CreatePackageDTO): Promise<ApiResponse<Package>> {
    return apiClient.post<Package>(PROVIDER.GET_PROFILE, data);
  }

  /**
   * Update an existing package
   * @param packageId - Package ID
   * @param data - Package update data
   * @returns Promise with updated package
   */
  async updatePackage(packageId: string, data: Partial<UpdatePackageDTO>): Promise<ApiResponse<Package>> {
    const url = `${PROVIDER.GET_PROFILE}/${packageId}`;
    return apiClient.put<Package>(url, data);
  }

  /**
   * Delete a package
   * @param packageId - Package ID
   * @returns Promise with success response
   */
  async deletePackage(packageId: string): Promise<ApiResponse<void>> {
    const url = `${PROVIDER.GET_PROFILE}/${packageId}`;
    return apiClient.delete<void>(url);
  }

  /**
   * Get package statistics (for partner dashboard)
   * @returns Promise with package stats
   */
  async getPackageStats(): Promise<ApiResponse<PackageStats>> {
    const url = `${PROVIDER.DASHBOARD}`;
    return apiClient.get<PackageStats>(url);
  }

  /**
   * Search packages by location and filters
   * @param location - City or location
   * @param params - Additional filters
   * @returns Promise with matching packages
   */
  async searchPackagesByLocation(
    location: string,
    params?: PackageListParams
  ): Promise<ApiResponse<Package[]>> {
    const searchParams: PackageListParams = {
      ...params,
      city: location,
    };
    return this.getAllPackages(searchParams);
  }

  /**
   * Get featured packages
   * @param limit - Maximum number of packages
   * @returns Promise with featured packages
   */
  async getFeaturedPackages(limit: number = 10): Promise<ApiResponse<Package[]>> {
    const params: PackageListParams = {
      is_featured: true,
      limit,
      sort: 'popularity',
      order: 'desc',
    };
    return this.getAllPackages(params);
  }

  /**
   * Get packages by category
   * @param categoryId - Category ID
   * @param limit - Maximum number of packages
   * @returns Promise with category packages
   */
  async getPackagesByCategory(categoryId: string, limit?: number): Promise<ApiResponse<Package[]>> {
    const params: PackageListParams = {
      category_id: categoryId,
      limit,
    };
    return this.getAllPackages(params);
  }

  /**
   * Request quote for a package
   * @param packageId - Package ID
   * @param requestData - Quote request data
   * @returns Promise with quote request response
   */
  async requestQuote(packageId: string, requestData: any): Promise<ApiResponse<any>> {
    return apiClient.post<any>(PROVIDER.REQUEST_QUOTE, {
      package_id: packageId,
      ...requestData,
    });
  }

  /**
   * Approve/Reject package (admin only)
   * @param packageId - Package ID
   * @param status - Approval status
   * @param reason - Reason for rejection (optional)
   * @returns Promise with updated package
   */
  async updateApprovalStatus(
    packageId: string,
    status: ApprovalStatus,
    reason?: string
  ): Promise<ApiResponse<Package>> {
    const url = `${PROVIDER.GET_PROFILE}/${packageId}/approval`;
    return apiClient.put<Package>(url, { approval_status: status, reason });
  }

  // ============================
  // PRIVATE HELPERS
  // ============================

  /**
   * Build query string from params
   */
  private buildQueryString(params?: PackageListParams): string {
    if (!params) return '';
    
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, String(v)));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });
    
    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
  }
}

// ============================
// SINGLETON INSTANCE
// ============================

export const packageService = new PackageService();

export default packageService;
