import { apiClient } from './api-client';
import { ApiResponse } from '../types/api';
import { Notification, CreateNotificationDTO } from '../types/notification';

class NotificationService {
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return apiClient.get<Notification[]>('/notifications');
  }
  
  async markAsRead(id: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/notifications/${id}/read`);
  }
  
  async markAllAsRead(): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/notifications/read-all');
  }
  
  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    return apiClient.get<{ count: number }>('/notifications/unread-count');
  }
}

export const notificationService = new NotificationService();
export default notificationService;
