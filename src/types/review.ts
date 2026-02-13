export interface Review {
  id: string;
  partner_id: string;
  client_id: string;
  event_id: string;
  rating: number;
  comment: string;
  verified_booking: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewDTO {
  partner_id: string;
  event_id: string;
  rating: number;
  comment: string;
}
