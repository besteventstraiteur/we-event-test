import { apiClient } from './api-client';
import { ApiResponse } from '../types/api';
import { Partner, UpdatePartnerDTO } from '../types/partner';

class PartnerService {
  async getPartners(): Promise<ApiResponse<Partner[]>> {
    return apiClient.get<Partner[]>('/partners');
  }
  
  async getPartnerById(id: string): Promise<ApiResponse<Partner>> {
    return apiClient.get<Partner>(`/partners/${id}`);
  }
  
  async getMyProfile(): Promise<ApiResponse<Partner>> {
    return apiClient.get<Partner>('/partners/me');
  }
  
  async updateProfile(data: UpdatePartnerDTO): Promise<ApiResponse<Partner>> {
    return apiClient.patch<Partner>('/partners/me', data);
  }
}

export const partnerService = new PartnerService();
export default partnerService;
