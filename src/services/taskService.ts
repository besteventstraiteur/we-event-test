import { apiClient } from './api-client';
import { ApiResponse } from '../types/api';
import { Task, CreateTaskDTO, UpdateTaskDTO, TaskListParams, TaskStats } from '../types/task';

class TaskService {
  async getTasks(params?: TaskListParams): Promise<ApiResponse<Task[]>> {
    return apiClient.get<Task[]>('/tasks', { params });
  }

  async getTaskById(taskId: string): Promise<ApiResponse<Task>> {
    return apiClient.get<Task>(`/tasks/${taskId}`);
  }

  async createTask(data: CreateTaskDTO): Promise<ApiResponse<Task>> {
    return apiClient.post<Task>('/tasks', data);
  }

  async updateTask(taskId: string, data: UpdateTaskDTO): Promise<ApiResponse<Task>> {
    return apiClient.patch<Task>(`/tasks/${taskId}`, data);
  }

  async deleteTask(taskId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/tasks/${taskId}`);
  }

  async getTaskStats(eventId: string): Promise<ApiResponse<TaskStats>> {
    return apiClient.get<TaskStats>('/tasks/stats', { params: { event_id: eventId } });
  }
}

export const taskService = new TaskService();
export default taskService;
