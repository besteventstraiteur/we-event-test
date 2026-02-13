export interface Task {
  id: string;
  event_id: string;
  title: string;
  description?: string;
  assigned_to?: string;
  assigned_by: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  completed_at?: string;
  category?: string;
  attachments?: string[];
  created_at: string;
  updated_at: string;
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface CreateTaskDTO {
  event_id: string;
  title: string;
  description?: string;
  assigned_to?: string;
  due_date?: string;
  priority?: TaskPriority;
  category?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  assigned_to?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
}

export interface TaskListParams {
  event_id?: string;
  assigned_to?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface TaskStats {
  total_tasks: number;
  completed: number;
  in_progress: number;
  todo: number;
  overdue: number;
}
