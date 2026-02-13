import { apiClient } from './api-client';
import { ApiResponse, PaginatedResponse } from '../types/api';
import {
  Photo,
  PhotoAlbum,
  PhotoComment,
  CreatePhotoDTO,
  UpdatePhotoDTO,
  CreateAlbumDTO,
  UpdateAlbumDTO,
  CreatePhotoCommentDTO,
  PhotoListParams,
  AlbumListParams,
  PhotoStats
} from '../types/photo';

class PhotoService {
  // ============================================
  // PHOTO CRUD
  // ============================================

  async getPhotos(params?: PhotoListParams): Promise<ApiResponse<Photo[]>> {
    return apiClient.get<Photo[]>('/photos', { params });
  }

  async getPhotoById(photoId: string): Promise<ApiResponse<Photo>> {
    return apiClient.get<Photo>(`/photos/${photoId}`);
  }

  async uploadPhoto(data: CreatePhotoDTO): Promise<ApiResponse<Photo>> {
    return apiClient.post<Photo>('/photos', data);
  }

  async updatePhoto(photoId: string, data: UpdatePhotoDTO): Promise<ApiResponse<Photo>> {
    return apiClient.patch<Photo>(`/photos/${photoId}`, data);
  }

  async deletePhoto(photoId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/photos/${photoId}`);
  }

  // ============================================
  // ALBUM MANAGEMENT
  // ============================================

  async getAlbums(params?: AlbumListParams): Promise<ApiResponse<PhotoAlbum[]>> {
    return apiClient.get<PhotoAlbum[]>('/photos/albums', { params });
  }

  async getAlbumById(albumId: string): Promise<ApiResponse<PhotoAlbum>> {
    return apiClient.get<PhotoAlbum>(`/photos/albums/${albumId}`);
  }

  async createAlbum(data: CreateAlbumDTO): Promise<ApiResponse<PhotoAlbum>> {
    return apiClient.post<PhotoAlbum>('/photos/albums', data);
  }

  async updateAlbum(albumId: string, data: UpdateAlbumDTO): Promise<ApiResponse<PhotoAlbum>> {
    return apiClient.patch<PhotoAlbum>(`/photos/albums/${albumId}`, data);
  }

  async deleteAlbum(albumId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/photos/albums/${albumId}`);
  }

  async getAlbumPhotos(albumId: string): Promise<ApiResponse<Photo[]>> {
    return apiClient.get<Photo[]>(`/photos/albums/${albumId}/photos`);
  }

  // ============================================
  // LIKES & COMMENTS
  // ============================================

  async likePhoto(photoId: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/photos/${photoId}/like`);
  }

  async unlikePhoto(photoId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/photos/${photoId}/like`);
  }

  async getPhotoComments(photoId: string): Promise<ApiResponse<PhotoComment[]>> {
    return apiClient.get<PhotoComment[]>(`/photos/${photoId}/comments`);
  }

  async addComment(data: CreatePhotoCommentDTO): Promise<ApiResponse<PhotoComment>> {
    return apiClient.post<PhotoComment>('/photos/comments', data);
  }

  async deleteComment(commentId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/photos/comments/${commentId}`);
  }

  // ============================================
  // STATS & FEATURES
  // ============================================

  async getPhotoStats(eventId?: string): Promise<ApiResponse<PhotoStats>> {
    return apiClient.get<PhotoStats>('/photos/stats', { params: { event_id: eventId } });
  }

  async getFeaturedPhotos(eventId: string): Promise<ApiResponse<Photo[]>> {
    return apiClient.get<Photo[]>('/photos/featured', { params: { event_id: eventId } });
  }

  async searchPhotos(query: string, eventId?: string): Promise<ApiResponse<Photo[]>> {
    return apiClient.get<Photo[]>('/photos/search', { params: { q: query, event_id: eventId } });
  }

  async getPhotosByTag(tag: string, eventId?: string): Promise<ApiResponse<Photo[]>> {
    return apiClient.get<Photo[]>('/photos/by-tag', { params: { tag, event_id: eventId } });
  }

  // ============================================
  // BULK OPERATIONS
  // ============================================

  async uploadMultiplePhotos(photos: CreatePhotoDTO[]): Promise<ApiResponse<Photo[]>> {
    return apiClient.post<Photo[]>('/photos/bulk-upload', { photos });
  }

  async deleteMultiplePhotos(photoIds: string[]): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/photos/bulk-delete', { photo_ids: photoIds });
  }
}

export const photoService = new PhotoService();
export default photoService;
