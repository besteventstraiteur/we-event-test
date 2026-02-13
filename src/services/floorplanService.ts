import { apiClient } from './api-client';
import { ApiResponse } from '../types/api';
import { FloorPlan, CreateFloorPlanDTO } from '../types/floorplan';

class FloorPlanService {
  async getFloorPlans(eventId: string): Promise<ApiResponse<FloorPlan[]>> {
    return apiClient.get<FloorPlan[]>(`/events/${eventId}/floorplans`);
  }
  
  async createFloorPlan(data: CreateFloorPlanDTO): Promise<ApiResponse<FloorPlan>> {
    return apiClient.post<FloorPlan>('/floorplans', data);
  }
}

export const floorplanService = new FloorPlanService();
export default floorplanService;
