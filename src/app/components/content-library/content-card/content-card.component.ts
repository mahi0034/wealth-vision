import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentItem } from '../../../models/content.model';

@Component({
  selector: 'app-content-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm p-6 card-hover border border-gray-200 transition-all duration-300" 
         [class.ring-2]="isSelected" 
         [class.ring-blue-500]="isSelected"
         [class.shadow-lg]="isSelected">

      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center space-x-3">
          <input 
            type="checkbox" 
            [checked]="isSelected"
            (change)="onSelectionChange($event)"
            class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
          <span class="text-3xl">{{ content.icon }}</span>
          <span 
            class="text-white text-xs px-3 py-1 rounded-full font-medium"
            [ngClass]="getSentimentClass()">
            {{ content.sentiment | titlecase }}
          </span>
        </div>
        <div class="text-right">
          <span class="text-xs text-gray-500">{{ getTimeAgo() }}</span>
          @if (content.priority && content.priority !== 'normal') {
            <div class="mt-1">
              <span 
                class="text-xs px-2 py-1 rounded-full font-medium"
                [ngClass]="getPriorityClass()">
                {{ content.priority | titlecase }}
              </span>
            </div>
          }
        </div>
      </div>

      <h4 class="font-bold text-gray-900 mb-3 text-lg leading-tight">{{ content.title }}</h4>
      <p class="text-sm text-gray-600 mb-4 line-clamp-3">{{ content.description }}</p>

      <div class="flex flex-wrap gap-2 mb-4">
        @for (tag of content.tags; track tag) {
          <span 
            class="text-xs px-2 py-1 rounded-full font-medium"
            [ngClass]="getTagClass(tag)">
            #{{ tag }}
          </span>
        }
      </div>
      <div class="text-xs text-gray-500 mb-3">
        <span class="text-xs text-gray-500">By</span>
          <span class="text-xs font-medium text-gray-700">  {{ content.author }}</span>
        
      </div>
      <!-- Author and Actions -->
      <div class="flex items-center justify-center w-full pt-4 border-t border-gray-100">
  <div class="flex space-x-4">
    <button 
      (click)="share.emit(content.id)"
      class="text-green-600 hover:text-green-800 text-sm font-medium flex items-center space-x-1 transition-colors">
      <span>📤</span>
      <span>Share</span>
    </button>
    <button 
      (click)="feedback.emit(content.id)"
      class="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center space-x-1 transition-colors">
      <span>📝</span>
      <span>Feedback</span>
    </button>
    <button 
      (click)="details.emit(content.id)"
      class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1 transition-colors">
      <span>👁️</span>
      <span>Details</span>
    </button>
  </div>
</div>


      <!-- Metrics -->
      @if (content.metrics) {
        <div class="mt-4 pt-4 border-t border-gray-100">
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-lg font-bold text-blue-600">{{ content.metrics.readers }}</div>
              <div class="text-xs text-gray-500">Readers</div>
            </div>
            <div>
              <div class="text-lg font-bold text-yellow-600">{{ content.metrics.rating }}★</div>
              <div class="text-xs text-gray-500">Rating</div>
            </div>
            <div>
              <div class="text-lg font-bold text-green-600">{{ content.metrics.effectiveness }}%</div>
              <div class="text-xs text-gray-500">Effective</div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ContentCardComponent {
  @Input() content!: ContentItem;
  @Input() isSelected = false;
  @Output() selectionChanged = new EventEmitter<{ contentId: string; selected: boolean }>();
  @Output() share = new EventEmitter<string>();
  @Output() feedback = new EventEmitter<string>();
  @Output() details = new EventEmitter<string>();

  onSelectionChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.selectionChanged.emit({
      contentId: this.content.id,
      selected: target.checked
    });
  }

  getSentimentClass(): string {
    switch (this.content.sentiment) {
      case 'positive': return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'neutral': return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      case 'negative': return 'bg-gradient-to-r from-red-500 to-red-600';
      default: return 'bg-gray-500';
    }
  }

  getPriorityClass(): string {
    switch (this.content.priority) {
      case 'high': return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'urgent': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getTagClass(tag: string): string {
    const tagClasses: { [key: string]: string } = {
      'market-analysis': 'bg-blue-100 text-blue-800',
      'growth': 'bg-green-100 text-green-800',
      'banking': 'bg-purple-100 text-purple-800',
      'regulatory': 'bg-yellow-100 text-yellow-800',
      'inflation': 'bg-red-100 text-red-800',
      'risk': 'bg-orange-100 text-orange-800',
      'technology': 'bg-indigo-100 text-indigo-800',
      'innovation': 'bg-emerald-100 text-emerald-800',
      'global': 'bg-teal-100 text-teal-800',
      'weekly-report': 'bg-cyan-100 text-cyan-800',
      'real-estate': 'bg-amber-100 text-amber-800',
      'opportunity': 'bg-lime-100 text-lime-800'
    };

    return tagClasses[tag] || 'bg-gray-100 text-gray-800';
  }

  getTimeAgo(): string {
    if (this.content.time < 24) {
      return `${this.content.time}h ago`;
    } else {
      const days = Math.floor(this.content.time / 24);
      return `${days}d ago`;
    }
  }

  viewDetails() {
    console.log('View details for:', this.content.id);
  }
}
