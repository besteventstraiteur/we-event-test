import { apiClient } from './api-client';
import { ApiResponse } from '../types/api';
import {
  Video,
  VideoComment,
  CreateVideoDTO,
  UpdateVideoDTO,
  CreateVideoCommentDTO,
  RecordVideoViewDTO,
  VideoListParams,
  VideoStats
} from '../types/video';

class VideoService {
  async getVideos(params?: VideoListParams): Promise<ApiResponse<Video[]>> {
    return apiClient.get<Video[]>('/videos', { params });
  }

  async getVideoById(videoId: string): Promise<ApiResponse<Video>> {
    return apiClient.get<Video>(`/videos/${videoId}`);
  }

  async uploadVideo(data: CreateVideoDTO): Promise<ApiResponse<Video>> {
    return apiClient.post<Video>('/videos', data);
  }

  async updateVideo(videoId: string, data: UpdateVideoDTO): Promise<ApiResponse<Video>> {
    return apiClient.patch<Video>(`/videos/${videoId}`, data);
  }

  async deleteVideo(videoId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/videos/${videoId}`);
  }

  async getVideoComments(videoId: string): Promise<ApiResponse<VideoComment[]>> {
    return apiClient.get<VideoComment[]>(`/videos/${videoId}/comments`);
  }

  async addComment(data: CreateVideoCommentDTO): Promise<ApiResponse<VideoComment>> {
    return apiClient.post<VideoComment>('/videos/comments', data);
  }

  async deleteComment(commentId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/videos/comments/${commentId}`);
  }

  async likeVideo(videoId: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/videos/${videoId}/like`);
  }

  async unlikeVideo(videoId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/videos/${videoId}/like`);
  }

  async recordView(data: RecordVideoViewDTO): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/videos/views', data);
  }

  async getVideoStats(eventId?: string): Promise<ApiResponse<VideoStats>> {
    return apiClient.get<VideoStats>('/videos/stats', { params: { event_id: eventId } });
  }

  async getFeaturedVideos(eventId: string): Promise<ApiResponse<Video[]>> {
    return apiClient.get<Video[]>('/videos/featured', { params: { event_id: eventId } });
  }

  async searchVideos(query: string, eventId?: string): Promise<ApiResponse<Video[]>> {
    return apiClient.get<Video[]>('/videos/search', { params: { q: query, event_id: eventId } });
  }
}

export const videoService = new VideoService();
export default videoService;
