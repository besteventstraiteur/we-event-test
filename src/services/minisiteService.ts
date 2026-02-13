import { apiClient } from './api-client';
import { ApiResponse } from '../types/api';
import { MiniSite, CreateMiniSiteDTO } from '../types/minisite';

class MiniSiteService {
  async getMiniSite(slug: string): Promise<ApiResponse<MiniSite>> {
    return apiClient.get<MiniSite>(`/minisites/${slug}`);
  }
  
  async createMiniSite(data: CreateMiniSiteDTO): Promise<ApiResponse<MiniSite>> {
    return apiClient.post<MiniSite>('/minisites', data);
  }
  
  async updateMiniSite(id: string, data: Partial<CreateMiniSiteDTO>): Promise<ApiResponse<MiniSite>> {
    return apiClient.patch<MiniSite>(`/minisites/${id}`, data);
  }
}

export const minisiteService = new MiniSiteService();
export default minisiteService;
