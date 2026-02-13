export interface Inspiration {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  category_id: string;
  tags: string[];
  likes_count: number;
  saves_count: number;
  is_featured: boolean;
  created_at: string;
}

export interface CreateInspirationDTO {
  title: string;
  description?: string;
  image_url: string;
  category_id: string;
  tags?: string[];
}
