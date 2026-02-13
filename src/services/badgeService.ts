import { apiClient } from './api-client';
import { ApiResponse } from '../types/api';
import { Badge, PartnerBadge, CreateBadgeDTO } from '../types/badge';

class BadgeService {
  async getBadges(): Promise<ApiResponse<Badge[]>> {
    return apiClient.get<Badge[]>('/badges');
  }
  
  async getPartnerBadges(partnerId: string): Promise<ApiResponse<PartnerBadge[]>> {
    return apiClient.get<PartnerBadge[]>(`/partners/${partnerId}/badges`);
  }
  
  async awardBadge(partnerId: string, badgeId: string): Promise<ApiResponse<PartnerBadge>> {
    return apiClient.post<PartnerBadge>(`/partners/${partnerId}/badges`, { badge_id: badgeId });
  }
}

export const badgeService = new BadgeService();
export default badgeService;
