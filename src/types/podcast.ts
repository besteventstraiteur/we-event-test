export interface Podcast {
  id: string;
  title: string;
  description?: string;
  audio_url: string;
  duration_seconds: number;
  cover_image?: string;
  author: string;
  published_at: string;
  plays_count: number;
  likes_count: number;
  created_at: string;
}

export interface CreatePodcastDTO {
  title: string;
  description?: string;
  audio_url: string;
  duration_seconds: number;
  cover_image?: string;
}
