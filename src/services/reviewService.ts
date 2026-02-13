import { apiClient } from './api-client';
import { ApiResponse } from '../types/api';
import { Review, CreateReviewDTO } from '../types/review';

class ReviewService {
  async getReviews(partnerId: string): Promise<ApiResponse<Review[]>> {
    return apiClient.get<Review[]>(`/partners/${partnerId}/reviews`);
  }
  
  async createReview(data: CreateReviewDTO): Promise<ApiResponse<Review>> {
    return apiClient.post<Review>('/reviews', data);
  }
  
  async markHelpful(id: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/reviews/${id}/helpful`);
  }
}

export const reviewService = new ReviewService();
export default reviewService;
