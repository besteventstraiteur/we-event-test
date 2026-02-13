export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  parent_id?: string;
  created_at: string;
}

export interface CreateCategoryDTO {
  name: string;
  description?: string;
  icon?: string;
  parent_id?: string;
}
