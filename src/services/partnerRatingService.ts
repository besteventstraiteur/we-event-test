/**
 * Partner Rating Service - Gestion de la notation mutuelle
 * 
 * Service pour toutes les opérations sur les notations Partner → Client/Partner
 */

import { apiClient } from './api-client';
import { ApiResponse } from '../types/api';
import {
  PartnerRating,
  CreatePartnerRatingDTO,
  UpdatePartnerRatingDTO,
  AddRatingResponseDTO,
  PartnerRatingListParams,
  RatingStats,
  RatingSummary,
  RatedType,
} from '../types/partnerRating';

// ============================
// PARTNER RATING SERVICE CLASS
// ============================

export class PartnerRatingService {
  private baseUrl = '/api/partner-ratings';
  
  // ============================
  // CRUD OPERATIONS
  // ============================

  /**
   * Create a new rating
   * @param data - Rating creation data
   * @returns Promise with created rating
   */
  async createRating(data: CreatePartnerRatingDTO): Promise<ApiResponse<PartnerRating>> {
    return apiClient.post<PartnerRating>(this.baseUrl, data);
  }

  /**
   * Update an existing rating
   * @param ratingId - Rating ID
   * @param data - Rating update data
   * @returns Promise with updated rating
   */
  async updateRating(ratingId: string, data: Partial<UpdatePartnerRatingDTO>): Promise<ApiResponse<PartnerRating>> {
    const url = `${this.baseUrl}/${ratingId}`;
    return apiClient.put<PartnerRating>(url, data);
  }

  /**
   * Delete a rating
   * @param ratingId - Rating ID
   * @returns Promise with success response
   */
  async deleteRating(ratingId: string): Promise<ApiResponse<void>> {
    const url = `${this.baseUrl}/${ratingId}`;
    return apiClient.delete<void>(url);
  }

  /**
   * Add response to a rating
   * @param data - Response data
   * @returns Promise with updated rating
   */
  async addResponse(data: AddRatingResponseDTO): Promise<ApiResponse<PartnerRating>> {
    const url = `${this.baseUrl}/${data.rating_id}/response`;
    return apiClient.post<PartnerRating>(url, { response: data.response });
  }

  // ============================
  // QUERY OPERATIONS
  // ============================

  /**
   * Get ratings given by current partner
   * @param params - Filters and pagination
   * @returns Promise with ratings list
   */
  async getGivenRatings(params?: PartnerRatingListParams): Promise<ApiResponse<PartnerRating[]>> {
    const queryString = this.buildQueryString(params);
    const url = `${this.baseUrl}/given${queryString}`;
    return apiClient.get<PartnerRating[]>(url);
  }

  /**
   * Get ratings received by current user
   * @param params - Filters and pagination
   * @returns Promise with ratings list
   */
  async getReceivedRatings(params?: PartnerRatingListParams): Promise<ApiResponse<PartnerRating[]>> {
    const queryString = this.buildQueryString(params);
    const url = `${this.baseUrl}/received${queryString}`;
    return apiClient.get<PartnerRating[]>(url);
  }

  /**
   * Get average rating for a user
   * @param userId - User ID
   * @param type - User type (client or partner)
   * @param publicOnly - Only include public ratings
   * @returns Promise with rating stats
   */
  async getAverageRating(
    userId: string,
    type: RatedType,
    publicOnly: boolean = true
  ): Promise<ApiResponse<RatingStats>> {
    const url = `${this.baseUrl}/average/${userId}?type=${type}&public_only=${publicOnly}`;
    return apiClient.get<RatingStats>(url);
  }

  /**
   * Get ratings for an event
   * @param eventId - Event ID
   * @returns Promise with ratings list
   */
  async getEventRatings(eventId: string): Promise<ApiResponse<PartnerRating[]>> {
    const url = `${this.baseUrl}/event/${eventId}`;
    return apiClient.get<PartnerRating[]>(url);
  }

  /**
   * Check if rating exists
   * @param ratedId - Rated user ID
   * @param eventId - Event ID
   * @returns Promise with existence check
   */
  async checkRatingExists(
    ratedId: string,
    eventId: string
  ): Promise<ApiResponse<{ exists: boolean; rating?: PartnerRating }>> {
    const url = `${this.baseUrl}/exists?rated_id=${ratedId}&event_id=${eventId}`;
    return apiClient.get<{ exists: boolean; rating?: PartnerRating }>(url);
  }

  // ============================
  // STATISTICS & SUMMARIES
  // ============================

  /**
   * Get rating summary for a user (for profile display)
   * @param userId - User ID
   * @param type - User type
   * @returns Promise with rating summary
   */
  async getRatingSummary(userId: string, type: RatedType): Promise<ApiResponse<RatingSummary>> {
    const url = `${this.baseUrl}/summary/${userId}?type=${type}`;
    return apiClient.get<RatingSummary>(url);
  }

  /**
   * Get my rating statistics (partner dashboard)
   * @returns Promise with rating stats
   */
  async getMyRatingStats(): Promise<ApiResponse<RatingStats>> {
    const url = `${this.baseUrl}/my-stats`;
    return apiClient.get<RatingStats>(url);
  }

  /**
   * Get ratings breakdown for current partner
   * @returns Promise with detailed stats
   */
  async getRatingsBreakdown(): Promise<ApiResponse<{
    received: RatingStats;
    given: {
      clients: RatingStats;
      partners: RatingStats;
    };
  }>> {
    const url = `${this.baseUrl}/breakdown`;
    return apiClient.get<any>(url);
  }

  // ============================
  // FILTERED QUERIES
  // ============================

  /**
   * Get ratings for clients
   * @param params - Filters
   * @returns Promise with client ratings
   */
  async getClientRatings(params?: PartnerRatingListParams): Promise<ApiResponse<PartnerRating[]>> {
    const clientParams: PartnerRatingListParams = {
      ...params,
      rated_type: RatedType.CLIENT,
    };
    return this.getGivenRatings(clientParams);
  }

  /**
   * Get ratings for partners
   * @param params - Filters
   * @returns Promise with partner ratings
   */
  async getPartnerRatings(params?: PartnerRatingListParams): Promise<ApiResponse<PartnerRating[]>> {
    const partnerParams: PartnerRatingListParams = {
      ...params,
      rated_type: RatedType.PARTNER,
    };
    return this.getGivenRatings(partnerParams);
  }

  /**
   * Get public ratings for a user (for public profile)
   * @param userId - User ID
   * @param type - User type
   * @param limit - Maximum number of ratings
   * @returns Promise with public ratings
   */
  async getPublicRatings(
    userId: string,
    type: RatedType,
    limit: number = 10
  ): Promise<ApiResponse<PartnerRating[]>> {
    const url = `${this.baseUrl}/public/${userId}?type=${type}&limit=${limit}`;
    return apiClient.get<PartnerRating[]>(url);
  }

  /**
   * Get recent ratings (for dashboard)
   * @param limit - Maximum number of ratings
   * @returns Promise with recent ratings
   */
  async getRecentRatings(limit: number = 5): Promise<ApiResponse<PartnerRating[]>> {
    const params: PartnerRatingListParams = {
      limit,
      sort: 'created_at',
      order: 'desc',
    };
    return this.getReceivedRatings(params);
  }

  // ============================
  // ADMIN OPERATIONS
  // ============================

  /**
   * Report a rating (admin moderation)
   * @param ratingId - Rating ID
   * @param reason - Report reason
   * @returns Promise with success response
   */
  async reportRating(ratingId: string, reason: string): Promise<ApiResponse<void>> {
    const url = `${this.baseUrl}/${ratingId}/report`;
    return apiClient.post<void>(url, { reason });
  }

  /**
   * Get reported ratings (admin only)
   * @returns Promise with reported ratings
   */
  async getReportedRatings(): Promise<ApiResponse<PartnerRating[]>> {
    const url = `${this.baseUrl}/reported`;
    return apiClient.get<PartnerRating[]>(url);
  }

  // ============================
  // PRIVATE HELPERS
  // ============================

  /**
   * Build query string from params
   */
  private buildQueryString(params?: PartnerRatingListParams): string {
    if (!params) return '';
    
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
    
    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
  }
}

// ============================
// SINGLETON INSTANCE
// ============================

export const partnerRatingService = new PartnerRatingService();

export default partnerRatingService;
