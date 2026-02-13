/**
 * Message Service - Gestion de la messagerie
 * 
 * Service pour toutes les opérations sur les conversations et messages
 */

import { apiClient } from './api-client';
import { ApiResponse } from '../types/api';
import {
  Conversation,
  Message,
  CreateConversationDTO,
  SendMessageDTO,
  UpdateMessageDTO,
  ConversationListParams,
  MessageListParams,
  MessageStats,
} from '../types/message';

// Note: Les endpoints exacts devront être ajustés selon votre API
// Pour l'instant, on utilise des endpoints génériques

// ============================
// MESSAGE SERVICE CLASS
// ============================

export class MessageService {
  private baseUrl = '/api/conversations';
  
  // ============================
  // CONVERSATIONS
  // ============================

  /**
   * Get all conversations for current user
   * @param params - Filters and pagination
   * @returns Promise with conversations list
   */
  async getConversations(params?: ConversationListParams): Promise<ApiResponse<Conversation[]>> {
    const queryString = this.buildQueryString(params);
    const url = `${this.baseUrl}${queryString}`;
    return apiClient.get<Conversation[]>(url);
  }

  /**
   * Get conversation by ID
   * @param conversationId - Conversation ID
   * @returns Promise with conversation details
   */
  async getConversationById(conversationId: string): Promise<ApiResponse<Conversation>> {
    const url = `${this.baseUrl}/${conversationId}`;
    return apiClient.get<Conversation>(url);
  }

  /**
   * Create a new conversation
   * @param data - Conversation creation data
   * @returns Promise with created conversation
   */
  async createConversation(data: CreateConversationDTO): Promise<ApiResponse<Conversation>> {
    return apiClient.post<Conversation>(this.baseUrl, data);
  }

  /**
   * Archive a conversation
   * @param conversationId - Conversation ID
   * @returns Promise with updated conversation
   */
  async archiveConversation(conversationId: string): Promise<ApiResponse<Conversation>> {
    const url = `${this.baseUrl}/${conversationId}/archive`;
    return apiClient.put<Conversation>(url, {});
  }

  /**
   * Unarchive a conversation
   * @param conversationId - Conversation ID
   * @returns Promise with updated conversation
   */
  async unarchiveConversation(conversationId: string): Promise<ApiResponse<Conversation>> {
    const url = `${this.baseUrl}/${conversationId}/unarchive`;
    return apiClient.put<Conversation>(url, {});
  }

  /**
   * Delete a conversation
   * @param conversationId - Conversation ID
   * @returns Promise with success response
   */
  async deleteConversation(conversationId: string): Promise<ApiResponse<void>> {
    const url = `${this.baseUrl}/${conversationId}`;
    return apiClient.delete<void>(url);
  }

  // ============================
  // MESSAGES
  // ============================

  /**
   * Get messages for a conversation
   * @param params - Message list params
   * @returns Promise with messages list
   */
  async getMessages(params: MessageListParams): Promise<ApiResponse<Message[]>> {
    const queryString = this.buildQueryString(params);
    const url = `${this.baseUrl}/${params.conversation_id}/messages${queryString}`;
    return apiClient.get<Message[]>(url);
  }

  /**
   * Send a message
   * @param data - Message data
   * @returns Promise with sent message
   */
  async sendMessage(data: SendMessageDTO): Promise<ApiResponse<Message>> {
    const url = `${this.baseUrl}/${data.conversation_id}/messages`;
    return apiClient.post<Message>(url, data);
  }

  /**
   * Edit a message
   * @param messageId - Message ID
   * @param data - Update data
   * @returns Promise with updated message
   */
  async editMessage(messageId: string, data: UpdateMessageDTO): Promise<ApiResponse<Message>> {
    const url = `${this.baseUrl}/messages/${messageId}`;
    return apiClient.put<Message>(url, data);
  }

  /**
   * Delete a message
   * @param messageId - Message ID
   * @returns Promise with success response
   */
  async deleteMessage(messageId: string): Promise<ApiResponse<void>> {
    const url = `${this.baseUrl}/messages/${messageId}`;
    return apiClient.delete<void>(url);
  }

  /**
   * Mark messages as read
   * @param conversationId - Conversation ID
   * @param messageIds - Array of message IDs (optional, marks all if not provided)
   * @returns Promise with success response
   */
  async markAsRead(conversationId: string, messageIds?: string[]): Promise<ApiResponse<void>> {
    const url = `${this.baseUrl}/${conversationId}/read`;
    return apiClient.post<void>(url, { message_ids: messageIds });
  }

  /**
   * Upload attachment
   * @param file - File to upload
   * @returns Promise with upload URL
   */
  async uploadAttachment(file: File): Promise<ApiResponse<{ url: string; name: string; size: number }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Utiliser l'endpoint d'upload existant
    return apiClient.post<{ url: string; name: string; size: number }>(
      '/api/common/upload',
      formData
    );
  }

  // ============================
  // STATISTICS
  // ============================

  /**
   * Get message statistics
   * @returns Promise with message stats
   */
  async getMessageStats(): Promise<ApiResponse<MessageStats>> {
    const url = `${this.baseUrl}/stats`;
    return apiClient.get<MessageStats>(url);
  }

  /**
   * Get unread count
   * @returns Promise with unread count
   */
  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    const url = `${this.baseUrl}/unread-count`;
    return apiClient.get<{ count: number }>(url);
  }

  // ============================
  // REAL-TIME (WebSocket methods - to be implemented)
  // ============================

  /**
   * Connect to WebSocket for real-time messaging
   * @param userId - Current user ID
   * @returns WebSocket connection
   */
  connectWebSocket(userId: string): WebSocket | null {
    // TODO: Implement WebSocket connection
    // const ws = new WebSocket(`wss://api-staging.we-event.eu/ws?user_id=${userId}`);
    // return ws;
    console.warn('WebSocket not implemented yet');
    return null;
  }

  /**
   * Send typing indicator
   * @param conversationId - Conversation ID
   * @param isTyping - Whether user is typing
   */
  sendTypingIndicator(conversationId: string, isTyping: boolean): void {
    // TODO: Implement via WebSocket
    // ws.send(JSON.stringify({ type: 'user:typing', conversation_id: conversationId, is_typing: isTyping }));
    console.warn('Typing indicator not implemented yet');
  }

  // ============================
  // SEARCH & FILTER
  // ============================

  /**
   * Search conversations
   * @param keyword - Search keyword
   * @param limit - Maximum number of results
   * @returns Promise with matching conversations
   */
  async searchConversations(keyword: string, limit?: number): Promise<ApiResponse<Conversation[]>> {
    const params: ConversationListParams = {
      search: keyword,
      limit,
    };
    return this.getConversations(params);
  }

  /**
   * Get conversations with unread messages
   * @param limit - Maximum number of conversations
   * @returns Promise with conversations
   */
  async getUnreadConversations(limit?: number): Promise<ApiResponse<Conversation[]>> {
    const url = `${this.baseUrl}/unread${limit ? `?limit=${limit}` : ''}`;
    return apiClient.get<Conversation[]>(url);
  }

  /**
   * Get conversation for an event
   * @param eventId - Event ID
   * @returns Promise with conversation
   */
  async getEventConversation(eventId: string): Promise<ApiResponse<Conversation>> {
    const params: ConversationListParams = {
      event_id: eventId,
      limit: 1,
    };
    const response = await this.getConversations(params);
    
    if (response.success && response.data.length > 0) {
      return {
        ...response,
        data: response.data[0],
      };
    }
    
    throw new Error('Conversation not found');
  }

  // ============================
  // PRIVATE HELPERS
  // ============================

  /**
   * Build query string from params
   */
  private buildQueryString(params?: any): string {
    if (!params) return '';
    
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && key !== 'conversation_id') {
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

export const messageService = new MessageService();

export default messageService;
