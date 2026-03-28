export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}
