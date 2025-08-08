// src/app/components/content-creator/create-content-modal.component.ts

import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateContentService, CreateContentRequest, CreateContentResponse } from '../../services/create-content.service';
import { NotificationService } from '../../services/notification.service';
import { ReviewContentService, ReviewRequest, ReviewResponse } from '../../services/review-content.service';

@Component({
  selector: 'app-create-content-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (show) {
      <div class="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900">Create New Content</h2>
              <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>

            <!-- Form -->
            <form #f="ngForm" class="space-y-4">
              <!-- Title & Theme -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Content Title</label>
                  <input
                    type="text"
                    name="title"
                    [(ngModel)]="formData.title"
                    class="w-full p-2 border rounded-lg focus:outline-blue-500"
                    placeholder="Enter content title"
                    required>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                  <select
                    name="theme"
                    [(ngModel)]="formData.theme"
                    class="w-full p-2 border rounded-lg focus:outline-blue-500"
                    required>
                    <option value="" disabled>Select theme</option>
                    <option>Market Analysis</option>
                    <option>Technology Insights</option>
                    <option>Real Estate</option>
                    <option>Banking</option>
                    <option>Economic Research</option>
                  </select>
                </div>
              </div>

              <!-- Audience / Priority / Sentiment -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                  <select
                    name="target_audience"
                    [(ngModel)]="formData.target_audience"
                    class="w-full p-2 border rounded-lg focus:outline-blue-500">
                    <option>All Advisors</option>
                    <option>Private Banking</option>
                    <option>HNW</option>
                    <option>Retail</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    name="priority_level"
                    [(ngModel)]="formData.priority_level"
                    class="w-full p-2 border rounded-lg focus:outline-blue-500">
                    <option>Normal</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Expected Sentiment</label>
                  <select
                    name="expected_sentiment"
                    [(ngModel)]="formData.expected_sentiment"
                    class="w-full p-2 border rounded-lg focus:outline-blue-500">
                    <option>Auto-detect</option>
                    <option>Positive</option>
                    <option>Neutral</option>
                    <option>Cautious</option>
                  </select>
                </div>
              </div>

              <!-- Body -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Content Body</label>
                <textarea
                  name="content_body"
                  [(ngModel)]="formData.content_body"
                  rows="4"
                  class="w-full p-2 border rounded-lg focus:outline-blue-500"
                  placeholder="Enter your content here..."
                  required></textarea>
              </div>
              <!-- Tags & Author -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    [(ngModel)]="formData.tags"
                    class="w-full p-2 border rounded-lg focus:outline-blue-500"
                    placeholder="market-analysis, Q4, volatility, diversification">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Author ID</label>
                  <input
                    type="text"
                    name="author_id"
                    [(ngModel)]="formData.author_id"
                    class="w-full p-2 border rounded-lg focus:outline-blue-500"
                    placeholder="ADV-00004"
                    required>
                </div>
              </div>
              <!-- Publishing Options -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-3">Publishing Options</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label class="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="notify_advisors"
                      [(ngModel)]="formData.notify_advisors"
                      class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500">
                    <span class="text-sm text-gray-700">Notify advisors</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="enable_analytics"
                      [(ngModel)]="formData.enable_analytics"
                      class="h-4 w-4 text-purple-600 rounded focus:ring-purple-500">
                    <span class="text-sm text-gray-700">Enable analytics tracking</span>
                  </label>
                </div>
              </div>
  
              <!-- Review Results -->
              <div *ngIf="reviewResponse" class="p-4 bg-gray-50 border rounded-lg space-y-2">
                <h3 class="text-lg font-medium text-gray-800">Review Analysis</h3>
                <div>
                  <strong>Content Score:</strong> {{ reviewResponse.content_score }}
                </div>
                <div>
                  <strong>Readability Score:</strong> {{ reviewResponse.readability_score }}
                </div>
                <div>
                  <strong>Compliance Score:</strong> {{ reviewResponse.compliance_score }}
                </div>
                <div>
                  <strong>Engagement Prediction:</strong> {{ reviewResponse.engagement_prediction }}
                </div>
                <div>
                  <strong>Effectiveness Score:</strong> {{ reviewResponse.effectiveness_score }}
                </div>
                <div>
                  <strong>Risk Level:</strong> {{ reviewResponse.risk_level }}
                </div>
                <div class="mt-2">
                  <strong>Feedback:</strong>
                  <ul class="list-disc list-inside">
                    <li>{{ reviewResponse.analysis_feedback.readability }}</li>
                    <li>{{ reviewResponse.analysis_feedback.compliance }}</li>
                    <li>{{ reviewResponse.analysis_feedback.engagement }}</li>
                  </ul>
                </div>
                <div class="mt-2">
                  <strong>Recommendations:</strong>
                  <ul class="list-disc list-inside">
                    <li *ngFor="let rec of reviewResponse.recommendations">{{ rec }}</li>
                  </ul>
                </div>
              </div>

              <!-- Buttons -->
              <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  class="px-4 py-2 text-gray-700 bg-white border rounded hover:bg-gray-50"
                  (click)="closeModal()">
                  Cancel
                </button>
                <button
                  type="button"
                  class="px-4 py-2 text-white bg-yellow-600 rounded hover:bg-yellow-700"
                  [disabled]="reviewing"
                  (click)="onReview()">
                  {{ reviewing ? 'Reviewing...' : 'Review' }}
                </button>
                <button
                  type="button"
                  class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                  (click)="onCreate()">
                  Create Content
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `
})
export class CreateContentModalComponent {
  @Input() show = false;
  @Output() close = new EventEmitter<void>();

  formData: CreateContentRequest = {
    title: '',
    theme: '',
    target_audience: 'All Advisors',
    priority_level: 'Normal',
    expected_sentiment: 'Auto-detect',
    content_body: '',
    tags: '',
    author_id: '',
    notify_advisors: true,
    enable_analytics: true
  };

  reviewResponse: ReviewResponse | null = null;
  reviewing = false;

  private createService = inject(CreateContentService);
  private reviewService = inject(ReviewContentService);
  private notification = inject(NotificationService);

  closeModal() {
    this.close.emit();
  }

  onReview() {
    this.reviewing = true;
    const payload: ReviewRequest = {
      content_text: this.formData.content_body,
      title: this.formData.title,
      theme: this.formData.theme,
      target_audience: this.formData.target_audience
    };
    this.reviewService.analyzeContent(payload).subscribe({
      next: (res: ReviewResponse) => {
        this.reviewResponse = res;
        this.reviewing = false;
      },
      error: err => {
        console.error('Review error', err);
        this.notification.show('Review failed', 'error');
        this.reviewing = false;
      }
    });
  }

  onCreate() {
    this.createService.createContent(this.formData).subscribe({
      next: (res: CreateContentResponse) => {
        this.notification.show(res.message, 'success');
        this.closeModal();
      },
      error: err => {
        console.error('Create error', err);
        this.notification.show('Failed to create content', 'error');
      }
    });
  }
}
