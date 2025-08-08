import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { ContentService } from '../../services/content.service';
import { NotificationService } from '../../services/notification.service';
import { ContentCardComponent } from './content-card/content-card.component';
import { ContentItem } from '../../models/content.model';
import { 
  ContentSummaryModalComponent, 
  SummaryDocument, 
  PreferenceItem 
} from './content-summary-modal.component';
import { ShareContentModalComponent, ClientOption } from './share-content-modal.component';
import { ContentFeedbackModalComponent } from './content-feedback-modal.component';
import { ContentSummaryService } from '../../services/content-summary.service';
import { ContentComparisonModalComponent, ComparisonContent } from './content-comparison-modal.component';


@Component({
  selector: 'app-content-library',
  standalone: true,
  imports: [CommonModule, FormsModule, ContentComparisonModalComponent, ContentCardComponent, ContentSummaryModalComponent, ShareContentModalComponent, ContentFeedbackModalComponent ],
  template: `
    <div>
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Content Library</h1>
        <p class="text-gray-600">Manage and organize your wealth management content</p>
      </div>

      <!-- Search and Filter Bar -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <!-- Search -->
          <div class="flex-1 lg:max-w-md">
            <div class="relative">
              <input 
                type="text" 
                [(ngModel)]="searchQuery"
                (ngModelChange)="onSearchChange($event)"
                placeholder="Search content by title, description, or tags..." 
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-400 text-xl">🔍</span>
              </div>
            </div>
          </div>

          <!-- Filters -->
          <div class="flex items-center space-x-3">
            <select 
              [(ngModel)]="sentimentFilter"
              (ngModelChange)="onFilterChange()"
              class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Cautious</option>
            </select>

            <select 
              [(ngModel)]="timeFilter"
              (ngModelChange)="onFilterChange()"
              class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            @if (selectedContent().length > 0) {
              <div class="flex items-center space-x-2 ml-4">
                <span class="text-sm text-gray-600 font-medium">{{ selectedContent().length }} selected</span>
                 @if (selectedContent().length == 2) {
                <button 
                  (click)="openCompare(contentA, contentB)"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                  📊 Compare
                </button>
                 }
                <button 
                  (click)="openSummary()"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                  📝 Summarize
                </button>
                <button 
                  (click)="clearSelection()"
                  class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium">
                  Clear
                </button>
              </div>
            }

             <!-- New Upload button and hidden file input -->
            <div>
              <button 
                type="button"
                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                (click)="fileInput.click()">
                <!-- <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4m0 0l-4 4m4-4v12" />
                </svg> -->
                <span>Upload File</span>
              </button>
              <input 
                #fileInput
                type="file" 
                class="hidden" 
                (change)="onFileSelected($event)" 
                [attr.multiple]="allowMultiple ? '' : null"
                />
            </div>

            <button 
              (click)="toggleSelectAll()"
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">
              {{ selectedContent().length > 0 ? 'Clear All' : 'Select All' }}
            </button>
          </div>
        </div>
      </div>
      <app-content-summary-modal
        [show]="showSummaryModal()"
        [executiveSummary]="executiveSummary"
        [marketOpportunities]="marketOpportunities"
        [riskFactors]="riskFactors"
        [documents]="documents"
        [recommendedActions]="recommendedActions"
        [showPreferenceImpact]="showPreferenceImpact"
        [themes]="themes"
        [assetClasses]="assetClasses"
        (close)="closeSummary()"
        (export)="exportSummary()">
      </app-content-summary-modal>

      <!-- Place the modal at the root of the template: -->
      <app-content-comparison-modal
        [show]="showCompareModal"
        [left]="compareContentLeft"
        [right]="compareContentRight"
        [commonThemes]="compareCommonThemes"
        [uniquePerspectives]="compareUniquePerspectives"
        [sentimentCounts]="compareSentimentCounts"
        [recommendations]="compareRecommendations"
        (close)="showCompareModal=false"
      ></app-content-comparison-modal>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        @for (item of filteredContent(); track item.id) {
          <app-content-card
            [content]="item"
            [isSelected]="isSelected(item.id)"
            (selectionChanged)="onSelectionChanged($event)"
            (share)="openShare(item)"
            (feedback)="openFeedback(item)"
            (details)="openDetails(item)">
          </app-content-card>
        }
      </div>

      <!-- Share Modal -->
      <app-share-content-modal
        [show]="showShareModal()"
        [contentTitle]="shareTitle"
        [shareUrl]="shareUrl"
        [clients]="clientOptions"
        (close)="showShareModal.set(false)"
        (shareConfirmed)="onShareConfirmed($event)"
        
      ></app-share-content-modal>

      <app-content-feedback-modal
        [show]="showFeedback()"
        (close)="closeFeedback()"
        (feedbackSubmitted)="onFeedbackSubmitted($event)"
      ></app-content-feedback-modal>

      <!-- Empty State -->
      @if (filteredContent().length === 0) {
        <div class="text-center py-16">
          <div class="text-8xl mb-6">📄</div>
          <h3 class="text-2xl font-semibold text-gray-900 mb-3">No content found</h3>
          <p class="text-gray-600 mb-6">Try adjusting your search criteria or filters to find what you're looking for.</p>
          <button 
            (click)="clearFilters()"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Clear All Filters
          </button>
        </div>
      }
    </div>
  `
})
export class ContentLibraryComponent implements OnInit, OnDestroy {
  
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  private contentService = inject(ContentService);
  private notificationService = inject(NotificationService);
  private summaryService = inject(ContentSummaryService);
  private contentIdFeedback = '0' ;
  contentA = {
  id: '1',
  title: 'Q4 2024 Market Outlook',
  sentiment: 'positive',
  createdAt: '2025-08-06T10:00:00Z',
  tags: ['Market Analysis', 'Growth', 'Opportunity'],
  description: 'Comprehensive analysis of trends and outlook for Q4 2024'
};

 contentB = {
  id: '2',
  title: 'Banking Sector Update',
  sentiment: 'neutral',
  createdAt: '2025-08-06T08:00:00Z',
  tags: ['Banking', 'Regulatory'],
  description: 'Latest banking sector regulatory developments and sector outlook'
};

  content = signal<ContentItem[]>([]);
  filteredContent = signal<ContentItem[]>([]);
  selectedContent = signal<string[]>([]);

  searchQuery = '';
  sentimentFilter = '';
  timeFilter = '';

  showShareModal = signal(false);

  shareTitle = '';
  shareUrl = '';
  clientOptions: ClientOption[] = [];

   // Feedback modal state
  showFeedbackModal = signal(false);

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.performSearch(query);
    });
  }

  ngOnInit() {
    this.loadContent();
    this.notificationService.show('📚 Content Library loaded successfully', 'success');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  showCompareModal = false;
compareContentLeft: ComparisonContent = {
  title: '',
  sentiment: 'positive',
  published: '',
  tags: []
};
compareContentRight: ComparisonContent = {
  title: '',
  sentiment: 'neutral',
  published: '',
  tags: []
};
compareCommonThemes: string[] = [];
compareUniquePerspectives: string[] = [];
compareSentimentCounts = { positive: 0, neutral: 0, cautious: 0 };
compareRecommendations = {
  contentStrategy: '',
  clientCommunication: '',
  nextSteps: ''
};

allowMultiple = false; // Set true if you want to allow multiple files

onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const files = Array.from(input.files);

  // For demo, just log file names
  console.log('Selected files:', files);

  // TODO: Implement your upload logic here, e.g.:
  // this.contentService.uploadFiles(files).subscribe(...)

  // Optionally show notification on success or failure
  this.notificationService.show(`${files.length} file(s) selected for upload`, 'info');

  // Reset the input value to allow selecting the same file again if needed
  input.value = '';
}

// Example method (trigger when user clicks "Compare" and passes two content items)
openCompare(a: any, b: any) {
  this.compareContentLeft = {
    title: a.title,
    sentiment: a.sentiment || 'positive',
    published: this.getTimeAgo(new Date(a.createdAt)),
    tags: a.tags || []
  };
  this.compareContentRight = {
    title: b.title,
    sentiment: b.sentiment || 'neutral',
    published: this.getTimeAgo(new Date(b.createdAt)),
    tags: b.tags || []
  };
  this.compareCommonThemes = [
    'Market outlook and trends',
    'Risk assessment and management',
    'Investment opportunities'
  ];
  this.compareUniquePerspectives = [
    `${a.title}: Quarterly market forecasting`,
    `${b.title}: Sector-specific regulatory focus`
  ];
  this.compareSentimentCounts = {
    positive: (a.sentiment === 'positive' ? 1 : 0) + (b.sentiment === 'positive' ? 1 : 0),
    neutral: (a.sentiment === 'neutral' ? 1 : 0) + (b.sentiment === 'neutral' ? 1 : 0),
    cautious: (a.sentiment === 'negative' ? 1 : 0) + (b.sentiment === 'negative' ? 1 : 0),
  };
  this.compareRecommendations = {
    contentStrategy: 'Leverage optimistic outlook to discuss growth opportunities and portfolio expansion.',
    clientCommunication: 'Use positive market insights to discuss portfolio optimization and new opportunities.',
    nextSteps: 'Schedule follow-up meetings to discuss insights, update client portfolios based on analysis, and monitor market developments.'
  };
  this.showCompareModal = true;
}

  
  showSummaryModal = signal(false);
  executiveSummary = '';
  marketOpportunities: string[] = [];
  riskFactors: string[] = [];
  documents: SummaryDocument[] = [];
  recommendedActions: string[] = [];
  showPreferenceImpact = false;
  themes: PreferenceItem[] = [];
  assetClasses: PreferenceItem[] = [];

   openShare(item: ContentItem) {
    this.shareTitle = item.title;
    this.shareUrl = `https://wealthvision.com/share/${item.id}`;
    this.showShareModal.set(true);
  }

  onShareConfirmed(event: { method: string, clients: string[], options: any }) {
    // TODO: call your share API e.g. this.contentService.shareContent(...)
    console.log('Share confirmed:', event);
    this.notificationService.show('Content shared successfully!', 'success');
  }

  openSummary() {
     const selected = this.selectedContent();
    if (selected.length === 0) {
      this.notificationService.show('Please select at least one content item', 'warning');
      return;
    }
    this.fetchSummary(selected);
  }

  getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = Math.floor((+now - +new Date(date)) / 1000 / 60); // minutes
  if (diff < 60) return `${diff}m ago`;
  if (diff < 24*60) return `${Math.floor(diff/60)}h ago`;
  return `${Math.floor(diff/60/24)}d ago`;
}

  private fetchSummary(contentIds: string[]) {
    this.summaryService.getSummary(contentIds, 'ADV-00004', true)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.populateSummaryData(response);
          this.showSummaryModal.set(true);
        },
        error: (error) => {
          console.error('Summary API Error:', error);
          this.notificationService.show('Failed to fetch content summary', 'error');
        }
      });
  }

  private populateSummaryData(response: any) {
    this.executiveSummary = response.executive_summary;
    this.marketOpportunities = response.key_insights.market_opportunities;
    this.riskFactors = response.key_insights.risk_factors;
    
    // Map content breakdown
    this.documents = response.content_breakdown.map((item: any) => ({
      sentiment: item.sentiment,
      title: item.title,
      timeAgo: this.formatTimeAgo(item.updated_at),
      relevanceScore: item.relevance_score,
      keyPoints: item.key_points,
      preferenceAlignment: item.preference_alignment
    }));
    
    this.recommendedActions = response.recommended_actions;
    
    // Map preference impact
    if (response.preference_impact) {
      this.showPreferenceImpact = true;
      this.themes = response.preference_impact.themes?.map((theme: any) => ({
        name: theme.name,
        summary: theme.summary,
        confidence: theme.confidence,
        sentiment: theme.sentiment,
        highlights: theme.highlights,
        preferenceStatus: theme.preference_status,
        advisorAlignment: theme.advisor_alignment
      })) || [];
      
      this.assetClasses = response.preference_impact.asset_classes?.map((asset: any) => ({
        name: asset.name,
        summary: asset.summary,
        confidence: asset.confidence,
        sentiment: asset.sentiment,
        highlights: asset.highlights,
        preferenceStatus: asset.preference_status,
        advisorAlignment: asset.advisor_alignment
      })) || [];
    }
  }

  // Called when “View Details” or Bulk “Summarize”
  openDetails(item: ContentItem) {
    
    this.fetchSummary([item.id]);
  }

  closeSummary() {
    this.showSummaryModal.set(false);
  }
  exportSummary() {
    // Export logic or download PDF
    this.notificationService.show('Summary exported!', 'success');
    this.closeSummary();
  }
  loadContent() {
    this.contentService.getContent()
      .pipe(takeUntil(this.destroy$))
      .subscribe(content => {
        this.content.set(content);
        this.applyFilters();
      });
  }

  onSearchChange(query: string) {
    this.searchSubject.next(query);
  }

  performSearch(query: string) {
    this.searchQuery = query;
    this.applyFilters();
  }

  // Feedback handlers
  openFeedback(item: ContentItem) {
    this.showFeedbackModal.set(true);
    this.contentIdFeedback = item.id;

  }
  closeFeedback() {
    this.showFeedbackModal.set(false);
  }
  onFeedbackSubmitted(payload: any) {
    this.notificationService.show('Feedback submitted!', 'success');
    payload.related_content = [];
    let obj={
        id:this.contentIdFeedback,
        title:null
      }
      payload.related_content.push(obj)
      this.contentIdFeedback = '0';
    // this.selectedContent().forEach((element:any) => {
    //   let obj={
    //     id:element,
    //     title:null
    //   }
    //   payload.related_content.push(obj)
    // });
    this.contentService.contentFeedbackSubmission(payload).subscribe(res=>{
      this.contentService.fetchContent();
    })
  }
   showFeedback() {
    return this.showFeedbackModal();
  }

  onFilterChange() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.content()];

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (this.sentimentFilter) {
      filtered = filtered.filter(item => item.sentiment === this.sentimentFilter);
    }

    if (this.timeFilter) {
      const ranges = { today: 24, week: 168, month: 720 };
      const maxHours = ranges[this.timeFilter as keyof typeof ranges];
      if (maxHours) {
        filtered = filtered.filter(item => item.time <= maxHours);
      }
    }

    this.filteredContent.set(filtered);
  }

  clearFilters() {
    this.searchQuery = '';
    this.sentimentFilter = '';
    this.timeFilter = '';
    this.applyFilters();
    this.notificationService.show('Filters cleared', 'info');
  }

  isSelected(contentId: string): boolean {
    return this.selectedContent().includes(contentId);
  }

  onSelectionChanged(event: { contentId: string; selected: boolean }) {
    const current = this.selectedContent();
    if (event.selected) {
      if (!current.includes(event.contentId)) {
        this.selectedContent.set([...current, event.contentId]);
      }
    } else {
      this.selectedContent.set(current.filter(id => id !== event.contentId));
    }
  }

  toggleSelectAll() {
    if (this.selectedContent().length > 0) {
      this.selectedContent.set([]);
      this.notificationService.show('All content deselected', 'info');
    } else {
      this.selectedContent.set(this.filteredContent().map(item => item.id));
      this.notificationService.show(`Selected all ${this.filteredContent().length} items`, 'success');
    }
  }

  clearSelection() {
    this.selectedContent.set([]);
    this.notificationService.show('Selection cleared', 'info');
  }

  compareSelected() {
    if (this.selectedContent().length < 2) {
      this.notificationService.show('Please select at least 2 documents to compare', 'warning');
      return;
    }

    this.notificationService.show(`Comparing ${this.selectedContent().length} documents...`, 'info');
    setTimeout(() => {
      this.notificationService.show('Content comparison completed!', 'success');
    }, 2000);
  }

  summarizeSelected() {
    if (this.selectedContent().length === 0) {
      this.notificationService.show('Please select content to summarize', 'warning');
      return;
    }

    this.notificationService.show(`Generating summary for ${this.selectedContent().length} items...`, 'info');
    setTimeout(() => {
      this.notificationService.show('Content summary generated!', 'success');
    }, 2000);
  }

  onShareClicked(contentId: string) {
    this.notificationService.show(`Opening share options for content...`, 'info');
    setTimeout(() => {
      this.notificationService.show('Content shared successfully!', 'success');
    }, 1500);
  }

  onFeedbackClicked(contentId: string) {
    this.notificationService.show(`Opening feedback form...`, 'info');
    setTimeout(() => {
      this.notificationService.show('Feedback submitted successfully!', 'success');
    }, 1500);
  }

  // Utility
  private formatTimeAgo(isoDate: string): string {
    const date = new Date(isoDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;
    
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return '1 month ago';
    return `${diffMonths} months ago`;
  }
}
