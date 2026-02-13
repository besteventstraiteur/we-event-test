export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  price?: number;
  image_url?: string;
  allergens?: string[];
  is_vegetarian: boolean;
  is_vegan: boolean;
}

export interface Menu {
  id: string;
  event_id: string;
  name: string;
  items: MenuItem[];
  created_at: string;
}

export interface CreateMenuDTO {
  event_id: string;
  name: string;
  items: Omit<MenuItem, 'id'>[];
}
