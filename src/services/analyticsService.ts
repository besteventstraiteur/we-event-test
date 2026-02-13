import { apiClient } from './api-client';
import { ApiResponse } from '../types/api';
import { PlatformAnalytics, PartnerAnalytics } from '../types/analytics';

class AnalyticsService {
  async getPlatformAnalytics(period?: string): Promise<ApiResponse<PlatformAnalytics>> {
    return apiClient.get<PlatformAnalytics>('/analytics/platform', { params: { period } });
  }
  
  async getPartnerAnalytics(partnerId: string, period?: string): Promise<ApiResponse<PartnerAnalytics>> {
    return apiClient.get<PartnerAnalytics>(`/analytics/partner/${partnerId}`, { params: { period } });
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
