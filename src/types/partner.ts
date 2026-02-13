export interface Partner {
  id: string;
  user_id: string;
  business_name: string;
  description?: string;
  category: string;
  verified: boolean;
  rating: number;
  reviews_count: number;
  packages_count: number;
  profile_picture_url?: string;
  cover_image_url?: string;
  phone: string;
  email: string;
  address?: string;
  created_at: string;
}

export interface UpdatePartnerDTO {
  business_name?: string;
  description?: string;
  category?: string;
  phone?: string;
  address?: string;
  profile_picture_url?: string;
  cover_image_url?: string;
}
