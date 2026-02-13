export interface Dispute {
  id: string;
  booking_id: string;
  client_id: string;
  partner_id: string;
  reason: string;
  description: string;
  status: DisputeStatus;
  resolution?: string;
  created_at: string;
  resolved_at?: string;
}

export enum DisputeStatus {
  OPEN = 'open',
  IN_REVIEW = 'in_review',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export interface CreateDisputeDTO {
  booking_id: string;
  reason: string;
  description: string;
}
