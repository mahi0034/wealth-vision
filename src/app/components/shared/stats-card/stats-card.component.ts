import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm p-6 card-hover border border-gray-100 transition-all duration-300">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-600 text-sm font-medium mb-1">{{ title }}</p>
          <p class="text-3xl font-bold text-gray-900">{{ value }}</p>
        </div>
        <div class="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
          <span class="text-2xl">{{ icon }}</span>
        </div>
      </div>
      @if (trend) {
        <div class="mt-4">
          <span 
            class="text-sm font-medium flex items-center space-x-1"
            [ngClass]="getTrendClass()">
            <span>{{ getTrendIcon() }}</span>
            <span>{{ trend }}</span>
          </span>
        </div>
      }
    </div>
  `
})
export class StatsCardComponent {
  @Input() title!: string;
  @Input() value!: number | string;
  @Input() icon!: string;
  @Input() trend?: string;
  @Input() trendType: 'positive' | 'negative' | 'neutral' = 'neutral';

  getTrendClass(): string {
    switch (this.trendType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  getTrendIcon(): string {
    switch (this.trendType) {
      case 'positive': return '↗️';
      case 'negative': return '↘️';
      default: return '➡️';
    }
  }
}
