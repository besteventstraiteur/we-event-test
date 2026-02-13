export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  link?: string;
  created_at: string;
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  MESSAGE = 'message',
  BOOKING = 'booking',
  PAYMENT = 'payment'
}

export interface CreateNotificationDTO {
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
}
