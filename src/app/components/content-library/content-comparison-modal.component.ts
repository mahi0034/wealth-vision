import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ComparisonContent {
  title: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  published: string; // e.g. "2h ago"
  tags: string[];
}

@Component({
  selector: 'app-content-comparison-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" class="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div class="bg-white shadow-2xl rounded-2xl w-full max-w-3xl max-h-[94vh] overflow-y-auto">
        <div class="px-7 py-7">
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Content Comparison Analysis</h2>
              <div class="text-sm text-gray-500">
                Comparing: <span class="font-medium text-blue-700">{{ left.title }}</span> vs <span class="font-medium text-purple-700">{{ right.title }}</span>
              </div>
            </div>
            <button (click)="close.emit()" class="text-gray-400 text-3xl font-bold">&times;</button>
          </div>
          
          <!-- Overview Comparison (side-by-side cards) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-7">
            <div class="bg-blue-50 p-4 rounded-xl border">
              <div class="text-sm font-semibold text-blue-800 mb-1">{{ left.title }}</div>
              <div class="flex items-center mb-2 space-x-2">
                <span [class.bg-green-200]="left.sentiment==='positive'"
                      [class.bg-yellow-100]="left.sentiment==='neutral'"
                      [class.bg-orange-200]="left.sentiment==='negative'"
                      class="px-2 py-1 rounded text-xs font-medium uppercase"
                      [ngClass]="{
                        'text-green-900': left.sentiment==='positive',
                        'text-yellow-700': left.sentiment==='neutral',
                        'text-orange-700': left.sentiment==='negative'
                      }"
                >{{ left.sentiment }}</span>
                <span class="text-xs text-gray-400">{{ left.published }}</span>
              </div>
              <div class="flex flex-wrap gap-1 mb-1">
                <span *ngFor="let tag of left.tags" class="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">{{ tag }}</span>
              </div>
            </div>
            <div class="bg-purple-50 p-4 rounded-xl border">
              <div class="text-sm font-semibold text-purple-800 mb-1">{{ right.title }}</div>
              <div class="flex items-center mb-2 space-x-2">
                <span [class.bg-green-200]="right.sentiment==='positive'"
                      [class.bg-yellow-100]="right.sentiment==='neutral'"
                      [class.bg-orange-200]="right.sentiment==='negative'"
                      class="px-2 py-1 rounded text-xs font-medium uppercase"
                      [ngClass]="{
                        'text-green-900': right.sentiment==='positive',
                        'text-yellow-700': right.sentiment==='neutral',
                        'text-orange-700': right.sentiment==='negative'
                      }"
                >{{ right.sentiment }}</span>
                <span class="text-xs text-gray-400">{{ right.published }}</span>
              </div>
              <div class="flex flex-wrap gap-1 mb-1">
                <span *ngFor="let tag of right.tags" class="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded">{{ tag }}</span>
              </div>
            </div>
          </div>

          <!-- Sentiment Analysis -->
          <div class="flex items-center mb-2">
            <span class="mr-2 text-lg">🧑‍⚖️</span>
            <span class="font-semibold text-gray-900">Sentiment Analysis</span>
          </div>
          <div class="mb-5 ml-7">
            <div class="flex items-center space-x-3 mb-2">
              <span class="flex items-center text-green-700"><span class="w-2 h-2 rounded-full bg-green-500 mr-1"></span> Positive: {{ sentimentCounts.positive }}</span>
              <span class="flex items-center text-yellow-700"><span class="w-2 h-2 rounded-full bg-yellow-400 mr-1"></span> Neutral: {{ sentimentCounts.neutral }}</span>
              <span class="flex items-center text-orange-700"><span class="w-2 h-2 rounded-full bg-orange-400 mr-1"></span> Cautious: {{ sentimentCounts.cautious }}</span>
            </div>
            <div class="text-xs text-gray-600">Overall sentiment leans optimistic across selected content.</div>
          </div>

          <!-- Key Themes Comparison -->
          <div class="flex items-center mb-2">
            <span class="mr-2 text-lg">🔍</span>
            <span class="font-semibold text-gray-900">Key Themes Comparison</span>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="font-semibold text-xs text-gray-700 mb-1">Common Themes</div>
              <ul class="list-disc ml-5 text-sm text-gray-800 space-y-1">
                <li *ngFor="let commonTheme of commonThemes">{{ commonTheme }}</li>
              </ul>
            </div>
            <div>
              <div class="font-semibold text-xs text-gray-700 mb-1">Unique Perspectives</div>
              <ul class="list-disc ml-5 text-sm text-gray-800 space-y-1">
                <li *ngFor="let unique of uniquePerspectives">{{ unique }}</li>
              </ul>
            </div>
          </div>

          <!-- AI Recommendations -->
          <div class="flex items-center mb-2">
            <span class="mr-2 text-lg">💡</span>
            <span class="font-semibold text-gray-900">AI Recommendations</span>
          </div>
          <div class="bg-blue-50 border-l-4 border-blue-300 rounded p-4 text-[15px] mb-2">
            <strong>Content Strategy:</strong> {{ recommendations.contentStrategy }}
            <br>
            <strong>Client Communication:</strong> {{ recommendations.clientCommunication }}
            <br>
            <strong>Next Steps:</strong> {{ recommendations.nextSteps }}
          </div>
          <div class="flex justify-end pt-3 mt-2">
            <button (click)="close.emit()" class="px-4 py-2 text-gray-700 bg-white border rounded">Close</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContentComparisonModalComponent {
  @Input() show = false;
  @Input() left: ComparisonContent = {
    title: 'Q4 2024 Market Outlook', sentiment: 'positive', published: '2h ago', tags: ['Market Analysis', 'Growth', 'Opportunity']
  };
  @Input() right: ComparisonContent = {
    title: 'Banking Sector Update', sentiment: 'neutral', published: '4h ago', tags: ['Banking', 'Regulatory']
  };
  @Input() commonThemes: string[] = [
    'Market outlook and trends', 'Risk assessment and management', 'Investment opportunities'
  ];
  @Input() uniquePerspectives: string[] = [
    'Q4 2024 Market Outlook: Quarterly market forecasting',
    'Banking Sector Update: Sector-specific regulatory focus'
  ];
  @Input() sentimentCounts = { positive: 1, neutral: 1, cautious: 0 };
  @Input() recommendations: {
    contentStrategy: string; clientCommunication: string; nextSteps: string;
  } = {
    contentStrategy: 'Leverage optimistic outlook to discuss growth opportunities and portfolio expansion.',
    clientCommunication: 'Use positive market insights to discuss portfolio optimization and new opportunities.',
    nextSteps: 'Schedule follow-up meetings to discuss insights, update client portfolios based on analysis, and monitor market developments.'
  };

  @Output() close = new EventEmitter<void>();
}
