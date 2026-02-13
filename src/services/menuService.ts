import { apiClient } from './api-client';
import { ApiResponse } from '../types/api';
import { Menu, CreateMenuDTO } from '../types/menu';

class MenuService {
  async getMenus(eventId: string): Promise<ApiResponse<Menu[]>> {
    return apiClient.get<Menu[]>(`/events/${eventId}/menus`);
  }
  
  async createMenu(data: CreateMenuDTO): Promise<ApiResponse<Menu>> {
    return apiClient.post<Menu>('/menus', data);
  }
}

export const menuService = new MenuService();
export default menuService;
