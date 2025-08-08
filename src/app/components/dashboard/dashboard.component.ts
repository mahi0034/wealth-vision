import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsCardComponent } from '../shared/stats-card/stats-card.component';
import { ContentService } from '../../services/content.service';
//import { ClientService } from '../../services/client.service';
import { NotificationService } from '../../services/notification.service';
import { DashboardStats, TopContent, RecentActivity } from '../../models/content.model';
import { CamelCasePipe } from 'src/app/pipes/camel-case.pipe';
import { ContentSummaryService } from 'src/app/services/content-summary.service';
import { Subject, takeUntil } from 'rxjs';
import { ContentSummaryModalComponent, PreferenceItem, SummaryDocument } from '../content-library/content-summary-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatsCardComponent, CamelCasePipe, ContentSummaryModalComponent],
  template: `
    <div>
      <!-- Page Title -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600">Welcome to your Content Mosaic command center</p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <app-stats-card
          title="Total Content"
          [value]="stats?.total_content || 0"
          icon="📚"
          trend="{{stats?.content_added_this_week}} this week"
          trendType="positive">
        </app-stats-card>
        
        <app-stats-card
          title="Active Clients"
          [value]="stats?.active_clients || 0"
          icon="👥"
          trend="{{stats?.new_clients_this_week}} new clients"
          trendType="positive">
        </app-stats-card>
        
        <app-stats-card
          title="Insights Generated"
          [value]="stats?.insights_generated || 0"
          icon="💡"
          trend="+8 today"
          trendType="positive">
        </app-stats-card>
        
        <app-stats-card
          title="Avg Sentiment"
          [value]="getFormattedSentiment()"
          icon="📊"
          trend={{getTrend(stats?.avg_sentiment)}}  
          trendType="positive">
        </app-stats-card>
      </div>

      <!-- Interactive Demo -->
      <!-- <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">🎮 Interactive Demo</h3>
        <p class="text-gray-600 mb-4">Test the notification system and see all features in action:</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            (click)="showSuccess()"
            class="flex items-center justify-center space-x-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <span>✅</span>
            <span>Success</span>
          </button>
          <button 
            (click)="showWarning()"
            class="flex items-center justify-center space-x-2 p-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
            <span>⚠️</span>
            <span>Warning</span>
          </button>
          <button 
            (click)="showError()"
            class="flex items-center justify-center space-x-2 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            <span>❌</span>
            <span>Error</span>
          </button>
          <button 
            (click)="showInfo()"
            class="flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <span>ℹ️</span>
            <span>Info</span>
          </button>
        </div>
      </div> -->

      <!-- Content Effectiveness Intelligence -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Top Performing Content -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center mb-4">
            <span class="text-lg mr-2">🎯</span>
            <h3 class="text-lg font-semibold text-gray-900">Top Performing Content</h3>
          </div>
          <div class="space-y-4">
            @for (content of topContent; track content.id) {
              <div 
                class="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100"
                (click)="viewContent(content.title)">
                <div class="flex items-center space-x-3">
                  <span class="text-2xl">{{ content.icon }}</span>
                  <div>
                    <p class="font-medium text-gray-900">{{ content.title }}</p>
                    <p class="text-sm text-gray-600">
                      <span style="font-size: 18px;">👁</span> {{ content.content_viewed }} • Sentiment: {{ getTrend(content.sentiment_score) }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold" class="font-bold text-green-600 text-lg min-w-[3rem] text-right">
                  <!--[ngClass]="getEffectivenessColor(content.effectiveness)"> -->
                    {{ content.positive_feedback_pct }}%
                  </div>
                  <div class="text-xs text-green-600">Optimistic</div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Client Action Insights -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center mb-4">
            <span class="text-lg mr-2">📊</span>
            <h3 class="text-lg font-semibold text-gray-900">Client Action Insights</h3>
          </div>
          <div class="space-y-6">
            <!-- Portfolio Adjustments -->
            <div class="flex items-center justify-between">
              <span class="text-gray-700 font-medium">Portfolio Adjustments</span>
              <div class="flex items-center space-x-3">
                <div class="w-32 bg-gray-200 rounded-full h-3">
                  <div class="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000" style="width: 67%"></div>
                </div>
                <span class="font-bold text-blue-600 text-lg min-w-[3rem] text-right">67%</span>
              </div>
            </div>

            <!-- Follow-up Meetings -->
            <div class="flex items-center justify-between">
              <span class="text-gray-700 font-medium">Follow-up Meetings</span>
              <div class="flex items-center space-x-3">
                <div class="w-32 bg-gray-200 rounded-full h-3">
                  <div class="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-1000" style="width: 45%"></div>
                </div>
                <span class="font-bold text-green-600 text-lg min-w-[3rem] text-right">45%</span>
              </div>
            </div>

            <!-- New Investments -->
            <div class="flex items-center justify-between">
              <span class="text-gray-700 font-medium">New Investments</span>
              <div class="flex items-center space-x-3">
                <div class="w-32 bg-gray-200 rounded-full h-3">
                  <div class="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-1000" style="width: 23%"></div>
                </div>
                <span class="font-bold text-purple-600 text-lg min-w-[3rem] text-right">23%</span>
              </div>
            </div>

            <!-- Performance Trends Section - Matching the Image -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="text-sm font-semibold text-gray-900">Performance Trends</span>
                <span class="text-sm text-green-600 font-medium flex items-center">
                  <span class="mr-1">↗</span>
                  <span>Improving</span>
                </span>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div class="text-center">
                  <div class="text-lg font-bold text-green-600">+23%</div>
                  <div class="text-xs text-gray-600">Engagement</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-blue-600">+18%</div>
                  <div class="text-xs text-gray-600">Action Rate</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-purple-600">4.2/5</div>
                  <div class="text-xs text-gray-600">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Content Activity - Matching the Image Layout -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Recent Content Activity</h3>
        <div class="space-y-4">
          @for (activity of recentActivity; track activity.id) {
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span class="text-lg">📈</span>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900">{{ activity.title }}</p>
                  <p class="text-sm text-gray-600">{{ activity.author | camelCase}} • {{ formatTimeAgo(activity.created_at)}}</p>
                </div>
              </div>
              <div class="flex items-center space-x-3">
               <!-- <span 
                  class="text-white text-xs px-3 py-1 rounded-full font-medium"
                  [ngClass]="getSentimentClass(activity.sentiment)">
                  {{ getSentimentLabel(activity.sentiment) }}
                </span>-->
                <button 
                  (click)="detailsEmit(activity.content_id)"
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1 transition-colors">
                  <span>👁️</span>
                  <span>Details</span>
                </button>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Welcome Message -->
      <!-- <div class="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-xl p-8 text-center">
        <div class="mb-4">
          <h2 class="text-3xl font-bold mb-2">🎉 TypeScript Compilation Fixed!</h2>
          <p class="text-xl opacity-90">Your Angular 17 application now compiles successfully with zero errors</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
            <div class="text-3xl mb-2">✅</div>
            <div class="font-semibold">TypeScript Fixed</div>
            <div class="text-sm opacity-90">No compilation errors</div>
          </div>
          <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
            <div class="text-3xl mb-2">🎯</div>
            <div class="font-semibold">All Interactive</div>
            <div class="text-sm opacity-90">Every button works</div>
          </div>
          <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
            <div class="text-3xl mb-2">📱</div>
            <div class="font-semibold">Responsive</div>
            <div class="text-sm opacity-90">Mobile-ready</div>
          </div>
          <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
            <div class="text-3xl mb-2">⚡</div>
            <div class="font-semibold">Angular 17</div>
            <div class="text-sm opacity-90">Latest features</div>
          </div>
        </div>
      </div> -->
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
  `
})
export class DashboardComponent implements OnInit {
  private contentService = inject(ContentService);
  private notificationService = inject(NotificationService);
  private summaryService = inject(ContentSummaryService);
  //private ClientService = inject(ClientService);
  private destroy$ = new Subject<void>();
  

  stats: DashboardStats | null = null;
  showSummaryModal = signal(false);
  executiveSummary = '';
  marketOpportunities: string[] = [];
  riskFactors: string[] = [];
  documents: SummaryDocument[] = [];
  recommendedActions: string[] = [];
  showPreferenceImpact = false;
  themes: PreferenceItem[] = [];
  assetClasses: PreferenceItem[] = [];
  
  topContent: TopContent[] = [];
  //   {
  //     id: 'q4-outlook',
  //     title: 'Q4 Market Outlook',
  //     icon: '📈',
  //     clientActions: 12,
  //     positiveFeedback: 89,
  //     effectiveness: 9.2
  //   },
  //   {
  //     id: 'tech-fund', 
  //     title: 'Tech Innovation Fund',
  //     icon: '💻',
  //     clientActions: 8,
  //     positiveFeedback: 75,
  //     effectiveness: 8.4
  //   },
  //   {
  //     id: 'real-estate',
  //     title: 'Real Estate Opportunities', 
  //     icon: '🏠',
  //     clientActions: 5,
  //     positiveFeedback: 80,
  //     effectiveness: 7.8
  //   }
  // ];

  // Recent Activity data matching the image
  recentActivity: RecentActivity[] = []
  //   {
  //     id: '1',
  //     title: 'Q4 Market Outlook',
  //     author: 'Chief Investment Office',
  //     timeAgo: '2 hours ago',
  //     icon: '📈',
  //     sentiment: 'positive'
  //   },
  //   {
  //     id: '2',
  //     title: 'Tech Sector Analysis',
  //     author: 'Product Team',
  //     timeAgo: '4 hours ago',
  //     icon: '📊',
  //     sentiment: 'neutral'
  //   },
  //   {
  //     id: '3',
  //     title: 'Inflation Concerns',
  //     author: 'Economic Research',
  //     timeAgo: '6 hours ago',
  //     icon: '⚠️',
  //     sentiment: 'negative'
  //   }
  // ];

  ngOnInit() {
    this.loadDashboardData();
    // Welcome message
    setTimeout(() => {
      this.notificationService.show('🎉 Dashboard loaded with updated layout matching your requirements!', 'success', 4000);
    }, 1000);
  }

  loadDashboardData() {
    this.contentService.getStats().subscribe(res => {
      this.stats = res.stats;
      this.topContent = res?.top_content_by_feedback;
      this.recentActivity = res?.recent_content;
    });
  }

  // FIXED: This method properly handles the null value and formatting
  getFormattedSentiment(): string {
    if (!this.stats || this.stats.avg_sentiment == null) {
      return '0.0';
    }
    return this.stats.avg_sentiment.toFixed(1);
  }
  getTrend(score:any){
    if(score== 'None'){
        return "unknown"
    } else if(score <= '-6'){
        return  "Very Negative"
    } else if(score <= -2){
        return "Negative"
    } else if(score <= 2){
        return "Neutral"
    } else if(score <= 6){
        return "Positive"
    } else{
        return "Very Positive"
    }
  }

  getEffectivenessColor(effectiveness: number): string {
    if (effectiveness >= 9) return 'text-green-600';
    if (effectiveness >= 8) return 'text-blue-600';
    return 'text-yellow-600';
  }

  getSentimentClass(sentiment: string): string {
    switch (sentiment) {
      case 'positive': return 'bg-green-500';
      case 'neutral': return 'bg-yellow-500';
      case 'negative': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }

  getSentimentLabel(sentiment: string): string {
    switch (sentiment) {
      case 'positive': return 'Positive';
      case 'neutral': return 'Neutral';
      case 'negative': return 'Cautious';
      default: return 'Unknown';
    }
  }

  showSuccess() {
    this.notificationService.show('🎉 Success! Dashboard layout updated to match your requirements.', 'success');
  }

  showWarning() {
    this.notificationService.show('⚠️ Warning! This is a test warning message.', 'warning');
  }

  showError() {
    this.notificationService.show('❌ Error! This is a test error message - but your app is working fine!', 'error');
  }

  showInfo() {
    this.notificationService.show('ℹ️ Info! Dashboard now matches the layout shown in your image.', 'info');
  }

  viewContent(title: string) {
    this.notificationService.show(`📖 Opening: ${title}`, 'info');
  }

  daysBefore(dateString:string) {
      // Parse the input date string into a Date object
      const givenDate:any = new Date(dateString);
      
      // Get the current date
      const currentDate:any = new Date();
      
      // Set time to midnight for accurate day comparison
      givenDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      
      // Calculate the difference in time (in milliseconds)
      const timeDiff = currentDate - givenDate;
      
      // Convert time difference to days
      const daysDiff = timeDiff / (1000 * 3600 * 24);
      
      // Return the number of days, rounded to the nearest integer
      return Math.floor(daysDiff);
  }

   // Utility
  formatTimeAgo(isoDate: string): string {
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

  closeSummary() {
    this.showSummaryModal.set(false);
  }

  exportSummary() {
    // Export logic or download PDF
    this.notificationService.show('Summary exported!', 'success');
    this.closeSummary();
  }

  detailsEmit(contentId:string){
    this.summaryService.getSummary([contentId], 'ADV-00004', true)
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
}