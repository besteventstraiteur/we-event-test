export interface Client {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  profile_picture_url?: string;
  events_count: number;
  created_at: string;
}

export interface UpdateClientDTO {
  full_name?: string;
  phone?: string;
  profile_picture_url?: string;
}
