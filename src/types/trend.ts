export interface Trend {
  id: string;
  title: string;
  description?: string;
  category: string;
  popularity_score: number;
  image_url?: string;
  created_at: string;
}

export interface CreateTrendDTO {
  title: string;
  description?: string;
  category: string;
  image_url?: string;
}
