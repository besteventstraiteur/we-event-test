import { apiClient } from './api-client';
import { ApiResponse } from '../types/api';
import { Client, UpdateClientDTO } from '../types/client';

class ClientService {
  async getMyProfile(): Promise<ApiResponse<Client>> {
    return apiClient.get<Client>('/clients/me');
  }
  
  async updateProfile(data: UpdateClientDTO): Promise<ApiResponse<Client>> {
    return apiClient.patch<Client>('/clients/me', data);
  }
}

export const clientService = new ClientService();
export default clientService;
