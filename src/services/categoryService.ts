import { apiClient } from './api-client';
import { ApiResponse } from '../types/api';
import { Category, CreateCategoryDTO } from '../types/category';

class CategoryService {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return apiClient.get<Category[]>('/categories');
  }
  
  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    return apiClient.get<Category>(`/categories/${id}`);
  }
  
  async createCategory(data: CreateCategoryDTO): Promise<ApiResponse<Category>> {
    return apiClient.post<Category>('/categories', data);
  }
}

export const categoryService = new CategoryService();
export default categoryService;
