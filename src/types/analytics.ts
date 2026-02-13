export interface PlatformAnalytics {
  total_users: number;
  total_partners: number;
  total_clients: number;
  total_events: number;
  total_bookings: number;
  total_revenue: number;
  active_events: number;
  completed_events: number;
  average_rating: number;
  period: string;
}

export interface PartnerAnalytics {
  partner_id: string;
  total_packages: number;
  total_bookings: number;
  total_revenue: number;
  average_rating: number;
  response_rate: number;
  completion_rate: number;
  period: string;
}
