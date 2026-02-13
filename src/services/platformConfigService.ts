import { apiClient } from './api-client';
import { ApiResponse } from '../types/api';
import { PlatformConfig, UpdateConfigDTO } from '../types/platformConfig';

class PlatformConfigService {
  async getConfigs(): Promise<ApiResponse<PlatformConfig[]>> {
    return apiClient.get<PlatformConfig[]>('/config');
  }
  
  async getConfigByKey(key: string): Promise<ApiResponse<PlatformConfig>> {
    return apiClient.get<PlatformConfig>(`/config/${key}`);
  }
  
  async updateConfig(key: string, data: UpdateConfigDTO): Promise<ApiResponse<PlatformConfig>> {
    return apiClient.patch<PlatformConfig>(`/config/${key}`, data);
  }
}

export const platformConfigService = new PlatformConfigService();
export default platformConfigService;
