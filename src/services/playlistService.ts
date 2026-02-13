import { apiClient } from './api-client';
import { ApiResponse } from '../types/api';
import { Playlist, CreatePlaylistDTO, Track } from '../types/playlist';

class PlaylistService {
  async getPlaylists(eventId: string): Promise<ApiResponse<Playlist[]>> {
    return apiClient.get<Playlist[]>(`/events/${eventId}/playlists`);
  }
  
  async createPlaylist(data: CreatePlaylistDTO): Promise<ApiResponse<Playlist>> {
    return apiClient.post<Playlist>('/playlists', data);
  }
  
  async addTrack(playlistId: string, track: Track): Promise<ApiResponse<Playlist>> {
    return apiClient.post<Playlist>(`/playlists/${playlistId}/tracks`, track);
  }
}

export const playlistService = new PlaylistService();
export default playlistService;
