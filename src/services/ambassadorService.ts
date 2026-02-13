import { apiClient } from './api-client';
import { ApiResponse } from '../types/api';
import { Ambassador, CreateAmbassadorDTO } from '../types/ambassador';

class AmbassadorService {
  async getAmbassadors(): Promise<ApiResponse<Ambassador[]>> {
    return apiClient.get<Ambassador[]>('/ambassadors');
  }
  
  async createAmbassador(data: CreateAmbassadorDTO): Promise<ApiResponse<Ambassador>> {
    return apiClient.post<Ambassador>('/ambassadors', data);
  }
  
  async getAmbassadorStats(id: string): Promise<ApiResponse<any>> {
    return apiClient.get<any>(`/ambassadors/${id}/stats`);
  }
}

export const ambassadorService = new AmbassadorService();
export default ambassadorService;
