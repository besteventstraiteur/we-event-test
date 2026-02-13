/**
 * API Client - Couche d'abstraction pour les requêtes HTTP
 * 
 * Wrapper autour d'axiosClient existant avec support TypeScript
 * et gestion d'erreurs améliorée
 */

import { 
  getRequest, 
  postRequest, 
  putRequest,
  patchRequest,
  deleteRequest 
} from '../utils/http-client/axiosClient';

// ============================
// TYPES
// ============================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// ============================
// API CLIENT CLASS
// ============================

export class ApiClient {
  /**
   * GET request
   * @param url - Endpoint URL
   * @returns Promise with typed response
   */
  async get<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await getRequest(url);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * POST request
   * @param url - Endpoint URL
   * @param data - Request body
   * @param headers - Optional custom headers
   * @returns Promise with typed response
   */
  async post<T>(url: string, data: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    try {
      const response = await postRequest(url, data, headers);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * PUT request
   * @param url - Endpoint URL
   * @param data - Request body
   * @param headers - Optional custom headers
   * @returns Promise with typed response
   */
  async put<T>(url: string, data: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    try {
      const response = await putRequest(url, data, headers);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * PATCH request
   * @param url - Endpoint URL
   * @param data - Request body
   * @param headers - Optional custom headers
   * @returns Promise with typed response
   */
  async patch<T>(url: string, data: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    try {
      const response = await patchRequest(url, data, headers);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * DELETE request
   * @param url - Endpoint URL
   * @returns Promise with typed response
   */
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await deleteRequest(url, {});
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors in a consistent way
   * @param error - Error object from axios
   * @returns Formatted ApiError
   */
  private handleError(error: any): ApiError {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || 'Une erreur est survenue',
        statusCode: error.response.status,
        errors: error.response.data?.errors,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'Aucune réponse du serveur',
        statusCode: 0,
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'Erreur inconnue',
        statusCode: -1,
      };
    }
  }
}

// ============================
// SINGLETON INSTANCE
// ============================

/**
 * Singleton instance of ApiClient
 * Usage: import { apiClient } from '@/services/api-client';
 */
export const apiClient = new ApiClient();

/**
 * Default export for convenience
 */
export default apiClient;
