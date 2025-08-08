import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-content-feedback-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="show" class="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-xl font-semibold">Content Feedback</h2>
              <p class="text-sm text-gray-600">Help us improve content quality and relevance</p>
            </div>
            <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>

          <!-- Overall Rating -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
            <div class="flex space-x-1">
              <ng-container *ngFor="let star of [1,2,3,4,5]">
                <button type="button" (click)="rating = star" class="text-2xl focus:outline-none">
                  <span [class.text-yellow-500]="star <= rating" [class.text-gray-300]="star > rating">★</span>
                </button>
              </ng-container>
            </div>
            <p class="text-xs text-gray-500 mt-1">Click to rate from 1 to 5 stars</p>
          </div>

          <!-- Key Aspects -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              What aspects were most valuable? (Select all that apply)
            </label>
            <div class="grid grid-cols-2 gap-4">
              <label class="flex items-center space-x-2">
                <input type="checkbox" [(ngModel)]="aspects.accuracy" class="accent-blue-600" />
                <span>Accuracy &amp; Reliability</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" [(ngModel)]="aspects.clarity" class="accent-blue-600" />
                <span>Clarity &amp; Presentation</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" [(ngModel)]="aspects.actionable" class="accent-blue-600" />
                <span>Actionable Insights</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" [(ngModel)]="aspects.relevance" class="accent-blue-600" />
                <span>Relevance to Clients</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" [(ngModel)]="aspects.timeliness" class="accent-blue-600" />
                <span>Timeliness</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" [(ngModel)]="aspects.coverage" class="accent-blue-600" />
                <span>Comprehensive Coverage</span>
              </label>
            </div>
          </div>

          <!-- Additional Comments -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Additional Comments</label>
            <textarea
              [(ngModel)]="comments"
              rows="4"
              class="w-full p-2 border rounded-lg focus:outline-blue-500"
              placeholder="Share specific feedback, suggestions for improvement, or how this content helped with client conversations...">
            </textarea>
          </div>

          <!-- Usefulness -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              How useful was this for client conversations?
            </label>
            <select [(ngModel)]="usefulness" class="w-full p-2 border rounded">
              <option value="" disabled>Select usefulness level</option>
              <option>Very useful</option>
              <option>Somewhat useful</option>
              <option>Neutral</option>
              <option>Not very useful</option>
              <option>Not useful</option>
            </select>
          </div>

          <!-- Feedback Source -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Feedback Source</label>
            <div class="flex space-x-6">
              <label class="flex items-center space-x-2">
                <input type="radio" name="source" value="advisor" [(ngModel)]="source" class="accent-blue-600" />
                <span>Advisor Feedback</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="radio" name="source" value="client" [(ngModel)]="source" class="accent-blue-600" />
                <span>Client Feedback</span>
              </label>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex justify-end space-x-3 border-t pt-4">
            <button (click)="close.emit()" class="px-4 py-2 bg-white border rounded">Cancel</button>
            <button (click)="submit()" class="px-4 py-2 bg-blue-600 text-white rounded">Submit Feedback</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContentFeedbackModalComponent {
  @Input() show = false;
  @Output() close = new EventEmitter<void>();
  @Output() feedbackSubmitted = new EventEmitter<any>();

  rating = 0;
  aspects = {
    accuracy: false,
    clarity: false,
    actionable: false,
    relevance: false,
    timeliness: false,
    coverage: false
  };
  comments = '';
  usefulness = '';
  source: 'advisor' | 'client' = 'advisor';

  submit() {
    const payload = {
      rating: this.rating,
      aspects: Object.keys(this.aspects).filter(k => (this.aspects as any)[k]),
      comments: this.comments,
      usefulness: this.usefulness,
      source: this.source
    };
    this.feedbackSubmitted.emit(payload);
    this.close.emit();
  }
}
