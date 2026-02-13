import { apiClient } from './api-client';
import { ApiResponse } from '../types/api';
import { Inspiration, CreateInspirationDTO } from '../types/inspiration';

class InspirationService {
  async getInspirations(): Promise<ApiResponse<Inspiration[]>> {
    return apiClient.get<Inspiration[]>('/inspirations');
  }
  
  async getInspirationById(id: string): Promise<ApiResponse<Inspiration>> {
    return apiClient.get<Inspiration>(`/inspirations/${id}`);
  }
  
  async createInspiration(data: CreateInspirationDTO): Promise<ApiResponse<Inspiration>> {
    return apiClient.post<Inspiration>('/inspirations', data);
  }
  
  async likeInspiration(id: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/inspirations/${id}/like`);
  }
  
  async saveInspiration(id: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/inspirations/${id}/save`);
  }
}

export const inspirationService = new InspirationService();
export default inspirationService;
