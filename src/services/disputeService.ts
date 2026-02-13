import { apiClient } from './api-client';
import { ApiResponse } from '../types/api';
import { Dispute, CreateDisputeDTO } from '../types/dispute';

class DisputeService {
  async getDisputes(): Promise<ApiResponse<Dispute[]>> {
    return apiClient.get<Dispute[]>('/disputes');
  }
  
  async createDispute(data: CreateDisputeDTO): Promise<ApiResponse<Dispute>> {
    return apiClient.post<Dispute>('/disputes', data);
  }
  
  async resolveDispute(id: string, resolution: string): Promise<ApiResponse<Dispute>> {
    return apiClient.post<Dispute>(`/disputes/${id}/resolve`, { resolution });
  }
}

export const disputeService = new DisputeService();
export default disputeService;
