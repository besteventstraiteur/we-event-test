export interface Playlist {
  id: string;
  event_id: string;
  name: string;
  tracks: Track[];
  created_by: string;
  is_public: boolean;
  created_at: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration_seconds: number;
  spotify_id?: string;
}

export interface CreatePlaylistDTO {
  event_id: string;
  name: string;
  tracks?: Track[];
  is_public?: boolean;
}
