/**
 * Booking Service - Gestion des réservations
 * 
 * Service pour toutes les opérations CRUD sur les réservations
 */

import { apiClient } from './api-client';
import { ApiResponse } from '../types/api';
import {
  Booking,
  CreateBookingDTO,
  UpdateBookingDTO,
  BookingListParams,
  BookingStats,
  BookingPaymentDTO,
} from '../types/booking';
import { BookingStatus } from '../types/api';
import { PROVIDER } from '../utils/endPoints';

// ============================
// BOOKING SERVICE CLASS
// ============================

export class BookingService {
  /**
   * Get all bookings (with pagination and filters)
   * @param params - Filters and pagination
   * @returns Promise with bookings list
   */
  async getAllBookings(params?: BookingListParams): Promise<ApiResponse<Booking[]>> {
    const queryString = this.buildQueryString(params);
    const url = `${PROVIDER.GET_BY_ID_DETAILS}${queryString}`;
    return apiClient.get<Booking[]>(url);
  }

  /**
   * Get booking by ID
   * @param bookingId - Booking ID
   * @returns Promise with booking details
   */
  async getBookingById(bookingId: string): Promise<ApiResponse<Booking>> {
    const url = `${PROVIDER.GET_BY_ID_DETAILS}/${bookingId}`;
    return apiClient.get<Booking>(url);
  }

  /**
   * Create a new booking
   * @param data - Booking creation data
   * @returns Promise with created booking
   */
  async createBooking(data: CreateBookingDTO): Promise<ApiResponse<Booking>> {
    return apiClient.post<Booking>(PROVIDER.REQUEST_QUOTE, data);
  }

  /**
   * Update an existing booking
   * @param bookingId - Booking ID
   * @param data - Booking update data
   * @returns Promise with updated booking
   */
  async updateBooking(bookingId: string, data: Partial<UpdateBookingDTO>): Promise<ApiResponse<Booking>> {
    const url = `${PROVIDER.UPDATE_STATUS}/${bookingId}`;
    return apiClient.put<Booking>(url, data);
  }

  /**
   * Cancel a booking
   * @param bookingId - Booking ID
   * @param reason - Cancellation reason
   * @returns Promise with updated booking
   */
  async cancelBooking(bookingId: string, reason?: string): Promise<ApiResponse<Booking>> {
    const url = `${PROVIDER.UPDATE_STATUS}/${bookingId}`;
    return apiClient.put<Booking>(url, {
      status: BookingStatus.CANCELLED,
      cancellation_reason: reason,
    });
  }

  /**
   * Confirm a booking (partner only)
   * @param bookingId - Booking ID
   * @returns Promise with updated booking
   */
  async confirmBooking(bookingId: string): Promise<ApiResponse<Booking>> {
    const url = `${PROVIDER.UPDATE_STATUS}/${bookingId}`;
    return apiClient.put<Booking>(url, {
      status: BookingStatus.CONFIRMED,
    });
  }

  /**
   * Complete a booking (after service)
   * @param bookingId - Booking ID
   * @returns Promise with updated booking
   */
  async completeBooking(bookingId: string): Promise<ApiResponse<Booking>> {
    const url = `${PROVIDER.UPDATE_STATUS}/${bookingId}`;
    return apiClient.put<Booking>(url, {
      status: BookingStatus.COMPLETED,
    });
  }

  /**
   * Record payment for booking
   * @param data - Payment data
   * @returns Promise with updated booking
   */
  async recordPayment(data: BookingPaymentDTO): Promise<ApiResponse<Booking>> {
    const url = `${PROVIDER.UPDATE_STATUS}/${data.booking_id}/payment`;
    return apiClient.post<Booking>(url, data);
  }

  /**
   * Get booking statistics
   * @returns Promise with booking stats
   */
  async getBookingStats(): Promise<ApiResponse<BookingStats>> {
    const url = `${PROVIDER.DASHBOARD}/bookings/stats`;
    return apiClient.get<BookingStats>(url);
  }

  /**
   * Get bookings for an event
   * @param eventId - Event ID
   * @returns Promise with event bookings
   */
  async getEventBookings(eventId: string): Promise<ApiResponse<Booking[]>> {
    const params: BookingListParams = {
      event_id: eventId,
    };
    return this.getAllBookings(params);
  }

  /**
   * Get upcoming bookings (partner)
   * @param limit - Maximum number of bookings
   * @returns Promise with upcoming bookings
   */
  async getUpcomingBookings(limit: number = 10): Promise<ApiResponse<Booking[]>> {
    const now = new Date().toISOString();
    const params: BookingListParams = {
      date_from: now,
      status: BookingStatus.CONFIRMED,
      limit,
      sort: 'service_date',
      order: 'asc',
    };
    return this.getAllBookings(params);
  }

  /**
   * Get pending bookings (partner)
   * @param limit - Maximum number of bookings
   * @returns Promise with pending bookings
   */
  async getPendingBookings(limit?: number): Promise<ApiResponse<Booking[]>> {
    const params: BookingListParams = {
      status: BookingStatus.PENDING,
      limit,
      sort: 'booking_date',
      order: 'desc',
    };
    return this.getAllBookings(params);
  }

  /**
   * Search bookings
   * @param keyword - Search keyword
   * @param limit - Maximum number of bookings
   * @returns Promise with matching bookings
   */
  async searchBookings(keyword: string, limit?: number): Promise<ApiResponse<Booking[]>> {
    const params: BookingListParams = {
      search: keyword,
      limit,
    };
    return this.getAllBookings(params);
  }

  // ============================
  // PRIVATE HELPERS
  // ============================

  /**
   * Build query string from params
   */
  private buildQueryString(params?: BookingListParams): string {
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

export const bookingService = new BookingService();

export default bookingService;
