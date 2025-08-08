import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SummaryDocument {
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  title: string;
  timeAgo: string;
  relevanceScore?: number;
  keyPoints?: string[];
  preferenceAlignment?: string;
}

export interface PreferenceItem {
  name: string;
  summary: string;
  confidence: number;
  sentiment: string;
  highlights: string;
  preferenceStatus: string;
  advisorAlignment: string;
}

@Component({
  selector: 'app-content-summary-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="show" class="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Content Summary</h2>
              <p class="text-sm text-gray-600">Analysis of {{documents.length}} selected documents</p>
            </div>
            <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
          </div>
          
          <!-- Executive Summary -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <div class="flex items-center mb-3">
              <span class="text-2xl mr-2">📄</span>
              <h3 class="text-lg font-semibold text-gray-900">Executive Summary</h3>
            </div>
            <p class="text-gray-700 text-sm leading-relaxed">{{ executiveSummary }}</p>
          </div>
          
          <!-- Key Insights -->
          <div class="bg-white rounded-lg p-4 mb-6 border">
            <div class="flex items-center mb-3">
              <span class="text-2xl mr-2">💡</span>
              <h3 class="text-lg font-semibold text-gray-900">Key Insights</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="text-sm font-semibold text-gray-800 mb-2">Market Opportunities</h4>
                <div *ngFor="let opportunity of marketOpportunities">
                  <p class="text-sm text-gray-700 flex items-start mb-2">
                    <span class="inline-block w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                    {{ opportunity }}
                  </p>
                </div>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-gray-800 mb-2">Risk Factors</h4>
                <div *ngFor="let risk of riskFactors">
                  <p class="text-sm text-gray-700 flex items-start mb-2">
                    <span class="inline-block w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                    {{ risk }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Content Breakdown -->
          <div class="bg-white rounded-lg p-4 mb-6 border">
            <div class="flex items-center mb-3">
              <span class="text-2xl mr-2">📊</span>
              <h3 class="text-lg font-semibold text-gray-900">Content Breakdown</h3>
            </div>
            <div class="space-y-4">
              <div *ngFor="let doc of documents" class="border rounded-lg p-4">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center space-x-3">
                    <span 
                      class="px-2 py-1 rounded-full text-xs font-medium"
                      [ngClass]="{
                        'bg-green-100 text-green-800': doc.sentiment === 'Positive',
                        'bg-yellow-100 text-yellow-800': doc.sentiment === 'Neutral',
                        'bg-red-100 text-red-800': doc.sentiment === 'Negative'
                      }">
                      {{ doc.sentiment }}
                    </span>
                    <span *ngIf="doc.relevanceScore" class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {{ doc.relevanceScore }}% relevant
                    </span>
                  </div>
                  <span class="text-xs text-gray-500">{{ doc.timeAgo }}</span>
                </div>
                <h4 class="font-medium text-gray-800 mb-2">{{ doc.title }}</h4>
                <div *ngIf="doc.keyPoints && doc.keyPoints.length > 0" class="text-sm text-gray-600">
                  <ul class="list-disc pl-4 space-y-1">
                    <li *ngFor="let point of doc.keyPoints">{{ point }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Preference Impact (if available) -->
          <div *ngIf="showPreferenceImpact && (themes.length > 0 || assetClasses.length > 0)" class="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <div class="flex items-center mb-3">
              <span class="text-2xl mr-2">🎯</span>
              <h3 class="text-lg font-semibold text-gray-900">Preference Impact Analysis</h3>
            </div>
            
            <!-- Themes -->
            <div *ngIf="themes.length > 0" class="mb-4">
              <h4 class="text-sm font-semibold text-gray-800 mb-2">Investment Themes</h4>
              <div class="grid gap-3">
                <div *ngFor="let theme of themes" class="bg-white rounded p-3 border">
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-medium">{{ theme.name }}</span>
                    <span class="text-xs bg-gray-100 px-2 py-1 rounded">{{ theme.confidence }}% confidence</span>
                  </div>
                  <p class="text-sm text-gray-600 mb-2">{{ theme.summary }}</p>
                  <p class="text-xs text-gray-500">{{ theme.highlights }}</p>
                </div>
              </div>
            </div>

            <!-- Asset Classes -->
            <div *ngIf="assetClasses.length > 0" class="mb-4">
              <h4 class="text-sm font-semibold text-gray-800 mb-2">Asset Classes</h4>
              <div class="grid gap-3">
                <div *ngFor="let asset of assetClasses" class="bg-white rounded p-3 border">
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-medium">{{ asset.name }}</span>
                    <span class="text-xs bg-gray-100 px-2 py-1 rounded">{{ asset.confidence }}% confidence</span>
                  </div>
                  <p class="text-sm text-gray-600 mb-2">{{ asset.summary }}</p>
                  <p class="text-xs text-gray-500">{{ asset.highlights }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Recommended Actions -->
          <div class="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
            <div class="flex items-center mb-3">
              <span class="text-2xl mr-2">✅</span>
              <h3 class="text-lg font-semibold text-gray-900">Recommended Actions</h3>
            </div>
            <div class="space-y-2">
              <label *ngFor="let action of recommendedActions; let i = index" class="flex items-start cursor-pointer">
                <input 
                  type="checkbox" 
                  class="mt-1 mr-3 accent-green-600 cursor-pointer" 
                  [checked]="completedActions[i]"
                  (change)="toggleAction(i)"
                />
                <span class="text-sm text-gray-700" [class.line-through]="completedActions[i]">{{ action }}</span>
              </label>
            </div>
          </div>
          
          <!-- Footer Buttons -->
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button 
              (click)="close.emit()" 
              class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
              Close
            </button>
            <button 
              (click)="export.emit()" 
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium">
              Export Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContentSummaryModalComponent {
  @Input() show = false;
  @Input() executiveSummary = '';
  @Input() marketOpportunities: string[] = [];
  @Input() riskFactors: string[] = [];
  @Input() documents: SummaryDocument[] = [];
  @Input() recommendedActions: string[] = [];
  @Input() showPreferenceImpact = false;
  @Input() themes: PreferenceItem[] = [];
  @Input() assetClasses: PreferenceItem[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() export = new EventEmitter<void>();

  completedActions: boolean[] = [];

  ngOnInit() {
    this.completedActions = new Array(this.recommendedActions.length).fill(false);
  }

  toggleAction(index: number) {
    this.completedActions[index] = !this.completedActions[index];
  }
}
