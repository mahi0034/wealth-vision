import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

interface Tab {
  id: string;
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex space-x-8">
          @for (tab of tabs; track tab.id) {
            <a 
              [routerLink]="tab.route"
              routerLinkActive="tab-active"
              (click)="onTabClick(tab.label)"
              class="py-4 px-2 font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-2">
              <span class="text-xl">{{ tab.icon }}</span>
              <span>{{ tab.label }}</span>
            </a>
          }
        </div>
      </div>
    </nav>
  `
})
export class NavigationComponent {
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  tabs: Tab[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📈', route: '/dashboard' },
    { id: 'content', label: 'Content Library', icon: '📄', route: '/content' },
    { id: 'insights', label: 'Client Insights', icon: '💡', route: '/insights' },
    { id: 'creator', label: 'Content Creator', icon: '✍️', route: '/creator' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️', route: '/preferences' }
  ];

  onTabClick(tabName: string) {
    this.notificationService.show(`📍 Navigated to ${tabName}`, 'info', 2000);
  }
}
