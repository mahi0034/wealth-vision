import { Component, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="gradient-bg text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span class="text-2xl">📊</span>
            </div>
            <div>
              <h1 class="text-3xl font-bold">Content Mosaic</h1>
              <p class="text-blue-100 text-sm">Content & Client Insights Platform</p>
            </div>
          </div>
          <div class="flex items-center space-x-6">
            <div class="text-right">
              <p class="font-semibold text-lg">{{welcomeText()}}</p>
              <p class="text-blue-100 text-sm">Last updated: {{ currentTime() | date:'short' }}</p>
            </div>
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center shadow-lg">
              <span class="text-2xl">👤</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentTime = signal(new Date());
  private intervalId?: number;

  private router = inject(Router);

  welcomeText = signal('Welcome, Advisor');  // Default welcome text

  private routerSub?: Subscription;

  ngOnInit() {
    // Initial check for current URL
    this.updateWelcomeText(this.router.url);

    // Subscribe to router events to detect route changes
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navEndEvent = event as NavigationEnd;
        this.updateWelcomeText(navEndEvent.urlAfterRedirects);
      });
    this.intervalId = window.setInterval(() => {
      this.currentTime.set(new Date());
    }, 60000);

  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.routerSub?.unsubscribe();
  }

  private updateWelcomeText(url: string) {
    // Check if the current URL contains the "creator" route (Content Creator tab)
    if (url.includes('/creator')) {
      this.welcomeText.set('Welcome, Chief Investment Office');
    } else {
      this.welcomeText.set('Welcome, Advisor');
    }
  }

}
