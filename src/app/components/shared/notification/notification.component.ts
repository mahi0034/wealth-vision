import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      @for (notification of notificationService.notifications(); track notification.id) {
        <div 
          class="px-6 py-4 rounded-lg shadow-xl text-white flex items-start space-x-3 notification-enter backdrop-blur-sm"
          [ngClass]="getNotificationClass(notification.type)">
          <span class="text-xl flex-shrink-0 mt-0.5">{{ getNotificationIcon(notification.type) }}</span>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium leading-5 break-words">{{ notification.message }}</p>
          </div>
          <button 
            (click)="notificationService.remove(notification.id)"
            class="flex-shrink-0 ml-2 text-white hover:text-gray-200 transition-colors">
            <span class="text-lg">×</span>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-enter {
      animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class NotificationComponent {
  notificationService = inject(NotificationService);

  getNotificationClass(type: string): string {
    switch (type) {
      case 'success': return 'bg-gradient-to-r from-green-500 to-green-600 border border-green-400';
      case 'error': return 'bg-gradient-to-r from-red-500 to-red-600 border border-red-400';
      case 'warning': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 border border-yellow-400';
      default: return 'bg-gradient-to-r from-blue-500 to-blue-600 border border-blue-400';
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  }
}
