import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

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
              <h1 class="text-3xl font-bold">WealthVision</h1>
              <p class="text-blue-100 text-sm">Content & Client Insights Platform</p>
            </div>
          </div>
          <div class="flex items-center space-x-6">
            <div class="text-right">
              <p class="font-semibold text-lg">Welcome, Chief Investment Office</p>
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

  ngOnInit() {
    this.intervalId = window.setInterval(() => {
      this.currentTime.set(new Date());
    }, 60000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
