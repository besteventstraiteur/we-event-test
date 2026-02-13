/**
 * Event Service - Gestion des événements
 * 
 * Service pour toutes les opérations CRUD sur les événements
 */

import { apiClient } from './api-client';
import { ApiResponse, PaginatedResponse } from '../types/api';
import {
  Event,
  CreateEventDTO,
  UpdateEventDTO,
  EventListParams,
  EventStats,
} from '../types/event';
import { PROVIDER } from '../utils/endPoints';

// ============================
// EVENT SERVICE CLASS
// ============================

export class EventService {
  /**
   * Get all events for current user (with pagination and filters)
   * @param params - Filters and pagination
   * @returns Promise with paginated events
   */
  async getMyEvents(params?: EventListParams): Promise<ApiResponse<Event[]>> {
    const queryString = this.buildQueryString(params);
    const url = `${PROVIDER.GET_EVENTS}${queryString}`;
    return apiClient.get<Event[]>(url);
  }

  /**
   * Get event by ID
   * @param eventId - Event ID
   * @returns Promise with event details
   */
  async getEventById(eventId: string): Promise<ApiResponse<Event>> {
    const url = `${PROVIDER.GET_EVENT_BY_ID}/${eventId}`;
    return apiClient.get<Event>(url);
  }

  /**
   * Create a new event
   * @param data - Event creation data
   * @returns Promise with created event
   */
  async createEvent(data: CreateEventDTO): Promise<ApiResponse<Event>> {
    return apiClient.post<Event>(PROVIDER.CREATE_EVENT, data);
  }

  /**
   * Update an existing event
   * @param eventId - Event ID
   * @param data - Event update data
   * @returns Promise with updated event
   */
  async updateEvent(eventId: string, data: Partial<UpdateEventDTO>): Promise<ApiResponse<Event>> {
    const url = `${PROVIDER.UPDATE_EVENT}/${eventId}`;
    return apiClient.put<Event>(url, data);
  }

  /**
   * Delete an event
   * @param eventId - Event ID
   * @returns Promise with success response
   */
  async deleteEvent(eventId: string): Promise<ApiResponse<void>> {
    const url = `${PROVIDER.DELETE_EVENT}/${eventId}`;
    return apiClient.delete<void>(url);
  }

  /**
   * Get event statistics (for dashboard)
   * @returns Promise with event stats
   */
  async getEventStats(): Promise<ApiResponse<EventStats>> {
    const url = `${PROVIDER.GET_EVENTS}/stats`;
    return apiClient.get<EventStats>(url);
  }

  /**
   * Get upcoming events
   * @param limit - Maximum number of events to return
   * @returns Promise with upcoming events
   */
  async getUpcomingEvents(limit: number = 5): Promise<ApiResponse<Event[]>> {
    const now = new Date().toISOString();
    const params: EventListParams = {
      date_from: now,
      limit,
      sort: 'start_date',
      order: 'asc',
    };
    return this.getMyEvents(params);
  }

  /**
   * Get past events
   * @param limit - Maximum number of events to return
   * @returns Promise with past events
   */
  async getPastEvents(limit: number = 10): Promise<ApiResponse<Event[]>> {
    const now = new Date().toISOString();
    const params: EventListParams = {
      date_to: now,
      limit,
      sort: 'start_date',
      order: 'desc',
    };
    return this.getMyEvents(params);
  }

  /**
   * Search events by keyword
   * @param keyword - Search keyword
   * @param limit - Maximum number of events to return
   * @returns Promise with matching events
   */
  async searchEvents(keyword: string, limit: number = 20): Promise<ApiResponse<Event[]>> {
    const params: EventListParams = {
      search: keyword,
      limit,
    };
    return this.getMyEvents(params);
  }

  // ============================
  // PRIVATE HELPERS
  // ============================

  /**
   * Build query string from params
   * @param params - Query parameters
   * @returns Query string (e.g., "?page=1&limit=10")
   */
  private buildQueryString(params?: EventListParams): string {
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

/**
 * Singleton instance of EventService
 * Usage: import { eventService } from '@/services/eventService';
 */
export const eventService = new EventService();

/**
 * Default export for convenience
 */
export default eventService;
