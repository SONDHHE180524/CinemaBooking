import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Notification, NotificationResponse } from '../models/notification.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // State for components to reactively bind to
  public notifications = signal<Notification[]>([]);
  public unreadCount = signal<number>(0);

  constructor(private apiService: ApiService) {}

  fetchNotifications(): Observable<NotificationResponse> {
    return this.apiService.get<NotificationResponse>('/user/notifications').pipe(
      tap(response => {
        this.notifications.set(response.notifications);
        this.unreadCount.set(response.unreadCount);
      })
    );
  }

  markAsRead(): Observable<any> {
    return this.apiService.post<any>('/user/notifications/mark-read').pipe(
      tap(() => {
        // Optimistically update the UI
        this.unreadCount.set(0);
        const currentNotifs = this.notifications();
        this.notifications.set(
          currentNotifs.map(n => ({ ...n, isRead: true }))
        );
      })
    );
  }
}
