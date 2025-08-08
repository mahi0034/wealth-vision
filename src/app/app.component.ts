import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { NotificationComponent } from './components/shared/notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    NavigationComponent,
    NotificationComponent
  ],
  template: `
    <div class="bg-gray-50 min-h-screen">
      <app-header></app-header>
      <app-navigation></app-navigation>

      <main class="max-w-7xl mx-auto px-4 py-8">
        <router-outlet></router-outlet>
      </main>

      <app-notification></app-notification>
    </div>
  `
})
export class AppComponent {
  title = 'WealthVision';
}
