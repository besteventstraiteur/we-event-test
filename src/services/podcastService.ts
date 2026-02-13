import { apiClient } from './api-client';
import { ApiResponse } from '../types/api';
import { Podcast, CreatePodcastDTO } from '../types/podcast';

class PodcastService {
  async getPodcasts(): Promise<ApiResponse<Podcast[]>> {
    return apiClient.get<Podcast[]>('/podcasts');
  }
  
  async getPodcastById(id: string): Promise<ApiResponse<Podcast>> {
    return apiClient.get<Podcast>(`/podcasts/${id}`);
  }
  
  async createPodcast(data: CreatePodcastDTO): Promise<ApiResponse<Podcast>> {
    return apiClient.post<Podcast>('/podcasts', data);
  }
  
  async playPodcast(id: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/podcasts/${id}/play`);
  }
}

export const podcastService = new PodcastService();
export default podcastService;
