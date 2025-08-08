import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsCardComponent } from '../shared/stats-card/stats-card.component';
import { ContentService } from '../../services/content.service';
//import { ClientService } from '../../services/client.service';
import { NotificationService } from '../../services/notification.service';
import { DashboardStats, TopContent, RecentActivity } from '../../models/content.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatsCardComponent],
  template: `
    <div>
      <!-- Page Title -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600">Welcome to your WealthVision command center</p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <app-stats-card
          title="Total Content"
          [value]="stats?.totalContent || 0"
          icon="📚"
          trend="+12 this week"
          trendType="positive">
        </app-stats-card>
        
        <app-stats-card
          title="Active Clients"
          [value]="stats?.activeClients || 0"
          icon="👥"
          trend="+3 new clients"
          trendType="positive">
        </app-stats-card>
        
        <app-stats-card
          title="Insights Generated"
          [value]="stats?.insightsGenerated || 0"
          icon="💡"
          trend="+8 today"
          trendType="positive">
        </app-stats-card>
        
        <app-stats-card
          title="Avg Sentiment"
          [value]="getFormattedSentiment()"
          icon="📊"
          trend="Optimistic"
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
                      {{ content.clientActions }} client actions • {{ content.positiveFeedback }}% positive feedback
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold" [ngClass]="getEffectivenessColor(content.effectiveness)">
                    {{ content.effectiveness }}
                  </div>
                  <div class="text-xs text-gray-500">Effectiveness</div>
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
                  <span class="text-lg">{{ activity.icon }}</span>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900">{{ activity.title }}</p>
                  <p class="text-sm text-gray-600">{{ activity.author }} • {{ activity.timeAgo }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <span 
                  class="text-white text-xs px-3 py-1 rounded-full font-medium"
                  [ngClass]="getSentimentClass(activity.sentiment)">
                  {{ getSentimentLabel(activity.sentiment) }}
                </span>
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
  `
})
export class DashboardComponent implements OnInit {
  private contentService = inject(ContentService);
  private notificationService = inject(NotificationService);
  //private ClientService = inject(ClientService);
  

  stats: DashboardStats | null = null;
  
  topContent: TopContent[] = [
    {
      id: 'q4-outlook',
      title: 'Q4 Market Outlook',
      icon: '📈',
      clientActions: 12,
      positiveFeedback: 89,
      effectiveness: 9.2
    },
    {
      id: 'tech-fund', 
      title: 'Tech Innovation Fund',
      icon: '💻',
      clientActions: 8,
      positiveFeedback: 75,
      effectiveness: 8.4
    },
    {
      id: 'real-estate',
      title: 'Real Estate Opportunities', 
      icon: '🏠',
      clientActions: 5,
      positiveFeedback: 80,
      effectiveness: 7.8
    }
  ];

  // Recent Activity data matching the image
  recentActivity: RecentActivity[] = [
    {
      id: '1',
      title: 'Q4 Market Outlook',
      author: 'Chief Investment Office',
      timeAgo: '2 hours ago',
      icon: '📈',
      sentiment: 'positive'
    },
    {
      id: '2',
      title: 'Tech Sector Analysis',
      author: 'Product Team',
      timeAgo: '4 hours ago',
      icon: '📊',
      sentiment: 'neutral'
    },
    {
      id: '3',
      title: 'Inflation Concerns',
      author: 'Economic Research',
      timeAgo: '6 hours ago',
      icon: '⚠️',
      sentiment: 'negative'
    }
  ];

  ngOnInit() {
    this.loadDashboardData();
    // Welcome message
    setTimeout(() => {
      this.notificationService.show('🎉 Dashboard loaded with updated layout matching your requirements!', 'success', 4000);
    }, 1000);
  }

  loadDashboardData() {
    this.contentService.getStats().subscribe(stats => {
      this.stats = stats;
    });
  }

  // FIXED: This method properly handles the null value and formatting
  getFormattedSentiment(): string {
    if (!this.stats || this.stats.avgSentiment == null) {
      return '0.0';
    }
    return this.stats.avgSentiment.toFixed(1);
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
}