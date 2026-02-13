import { apiClient } from './api-client';
import { ApiResponse } from '../types/api';
import { Trend, CreateTrendDTO } from '../types/trend';

class TrendService {
  async getTrends(): Promise<ApiResponse<Trend[]>> {
    return apiClient.get<Trend[]>('/trends');
  }
  
  async createTrend(data: CreateTrendDTO): Promise<ApiResponse<Trend>> {
    return apiClient.post<Trend>('/trends', data);
  }
}

export const trendService = new TrendService();
export default trendService;
