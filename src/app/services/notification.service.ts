import { Injectable, signal } from '@angular/core';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSignal = signal<Notification[]>([]);

  get notifications() {
    return this.notificationsSignal.asReadonly();
  }

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration = 3000) {
    const notification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      duration
    };

    const current = this.notificationsSignal();
    this.notificationsSignal.set([...current, notification]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification.id);
      }, duration);
    }
  }

  remove(id: string) {
    const current = this.notificationsSignal();
    this.notificationsSignal.set(current.filter(n => n.id !== id));
  }

  clear() {
    this.notificationsSignal.set([]);
  }
}
