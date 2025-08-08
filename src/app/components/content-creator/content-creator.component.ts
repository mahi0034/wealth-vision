import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../services/content.service';
import { NotificationService } from '../../services/notification.service';
import { CreateContentModalComponent } from './create-content-modal.component';

interface AuthorStats {
  contentPublished: number;
  totalReaders: number;
  avgRating: number;
  effectiveness: number;
  growthStats: {
    contentGrowth: string;
    readersGrowth: string;
    ratingGrowth: string;
    effectivenessGrowth: string;
  };
}

interface RecentContent {
  id: string;
  title: string;
  publishedTime: string;
  readers: number;
  rating: number;
  icon: string;
}

interface PerformanceMetric {
  label: string;
  percentage: number;
  color: string;
}

interface TopTheme {
  name: string;
  rating: number;
}

interface AuthorComparison {
  id: string;
  name: string;
  avatar: string;
  avatarInitials: string;
  contentPublished: number;
  totalReaders: number;
  avgRating: number;
  topThemes: string[];
  effectiveness: number;
  isCurrentUser: boolean;
}

@Component({
  selector: 'app-content-creator',
  standalone: true,
  imports: [CommonModule, FormsModule,CreateContentModalComponent],
  template: `
    <div>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <!-- Content Published -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-gray-600 text-sm font-medium">Content Published</p>
              <p class="text-3xl font-bold text-gray-900">{{ authorStats().contentPublished }}</p>
            </div>
            <div class="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <span class="text-2xl">📝</span>
            </div>
          </div>
          <div class="text-sm font-medium text-green-600">
            {{ authorStats().growthStats.contentGrowth }}
          </div>
        </div>

        <!-- Total Readers -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-gray-600 text-sm font-medium">Total Readers</p>
              <p class="text-3xl font-bold text-gray-900">{{ formatNumber(authorStats().totalReaders) }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span class="text-2xl">👥</span>
            </div>
          </div>
          <div class="text-sm font-medium text-green-600">
            {{ authorStats().growthStats.readersGrowth }}
          </div>
        </div>

        <!-- Avg Rating -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-gray-600 text-sm font-medium">Avg Rating</p>
              <p class="text-3xl font-bold text-gray-900">{{ authorStats().avgRating }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span class="text-2xl">⭐</span>
            </div>
          </div>
          <div class="text-sm font-medium text-green-600">
            {{ authorStats().growthStats.ratingGrowth }}
          </div>
        </div>

        <!-- Effectiveness -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-gray-600 text-sm font-medium">Effectiveness</p>
              <p class="text-3xl font-bold text-gray-900">{{ authorStats().effectiveness }}%</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span class="text-2xl">📈</span>
            </div>
          </div>
          <div class="text-sm font-medium text-green-600">
            {{ authorStats().growthStats.effectivenessGrowth }}
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            (click)="openCreateModal()"
            class="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            <span>🏠</span>
            <span class="font-medium">Create Content</span>
          </button>

          
          <button 
            (click)="publishToPortal()"
            class="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            <span>🌟</span>
            <span class="font-medium">Publish to Portal</span>
          </button>

          <button 
            (click)="emailCampaign()"
            class="flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
            <span>📩</span>
            <span class="font-medium">Email Campaign</span>
          </button>

          <button 
            (click)="viewAnalytics()"
            class="flex items-center justify-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
            <span>📋</span>
            <span class="font-medium">View Analytics</span>
          </button>
        </div>
      </div>
      <!-- Create Content Modal -->
          <app-create-content-modal
            [show]="showModal()"
            (close)="closeCreateModal()"
            (contentCreated)="handleContentCreated($event)">
          </app-create-content-modal>
      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- My Recent Content -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">My Recent Content</h3>
            <select 
              [(ngModel)]="selectedAuthor"
              class="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500">
              <option value="John Smith (Me)">John Smith (Me)</option>
              <option value="Sarah Davis">Sarah Davis</option>
              <option value="Michael Brown">Michael Brown</option>
            </select>
          </div>

          <div class="space-y-4">
            @for (content of recentContent(); track content.id) {
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                  <span class="text-lg">{{ content.icon }}</span>
                  <div>
                    <h4 class="font-medium text-gray-900">{{ content.title }}</h4>
                    <p class="text-sm text-gray-600">{{ content.publishedTime }} • {{ content.readers }} readers</p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="text-sm font-medium text-blue-600">{{ content.rating }}★</span>
                  <button class="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Performance Analytics -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Performance Analytics</h3>

          <div class="space-y-6">
            @for (metric of performanceMetrics(); track metric.label) {
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700">{{ metric.label }}</span>
                  <span class="text-sm font-medium text-gray-900">{{ metric.percentage }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="h-2 rounded-full transition-all duration-500"
                    [style.width.%]="metric.percentage"
                    [style.background-color]="metric.color">
                  </div>
                </div>
              </div>
            }

            <div class="mt-8">
              <h4 class="text-sm font-semibold text-gray-900 mb-4">Top Performing Themes</h4>
              <div class="space-y-3">
                @for (theme of topThemes(); track theme.name) {
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-700">{{ theme.name }}</span>
                    <span class="text-sm font-medium text-gray-900">{{ theme.rating }}★</span>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Author Performance Comparison -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Author Performance Comparison</h3>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-3 px-2 text-sm font-medium text-gray-700">Author</th>
                <th class="text-center py-3 px-2 text-sm font-medium text-gray-700">Content Published</th>
                <th class="text-center py-3 px-2 text-sm font-medium text-gray-700">Total Readers</th>
                <th class="text-center py-3 px-2 text-sm font-medium text-gray-700">Avg Rating</th>
                <th class="text-center py-3 px-2 text-sm font-medium text-gray-700">Top Themes</th>
                <th class="text-center py-3 px-2 text-sm font-medium text-gray-700">Effectiveness</th>
              </tr>
            </thead>
            <tbody>
              @for (author of authorComparisons(); track author.id) {
                <tr class="border-b border-gray-100 hover:bg-gray-50">
                  <td class="py-4 px-2">
                    <div class="flex items-center space-x-3">
                      <div 
                        class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        [style.background-color]="author.avatar">
                        {{ author.avatarInitials }}
                      </div>
                      <span class="font-medium text-gray-900">
                        {{ author.name }}
                        @if (author.isCurrentUser) {
                          <span class="text-blue-600">(You)</span>
                        }
                      </span>
                    </div>
                  </td>
                  <td class="text-center py-4 px-2">
                    <span class="font-medium">{{ author.contentPublished }}</span>
                  </td>
                  <td class="text-center py-4 px-2">
                    <span class="font-medium">{{ formatNumber(author.totalReaders) }}</span>
                  </td>
                  <td class="text-center py-4 px-2">
                    <span class="font-medium text-green-600">{{ author.avgRating }}★</span>
                  </td>
                  <td class="text-center py-4 px-2">
                    <div class="flex justify-center space-x-1">
                      @for (theme of author.topThemes; track theme) {
                        <span 
                          class="px-2 py-1 rounded-full text-xs font-medium"
                          [ngClass]="getThemeClass(theme)">
                          {{ theme }}
                        </span>
                      }
                    </div>
                  </td>
                  <td class="text-center py-4 px-2">
                    <span class="font-medium">{{ author.effectiveness }}%</span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ContentCreatorComponent implements OnInit {
  private contentService = inject(ContentService);
  private notificationService = inject(NotificationService);
  showModal = signal(false);

  selectedAuthor = 'John Smith (Me)';

  // Signals for reactive data
  authorStats = signal<AuthorStats>({
    contentPublished: 47,
    totalReaders: 2847,
    avgRating: 8.4,
    effectiveness: 87,
    growthStats: {
      contentGrowth: '+5 this month',
      readersGrowth: '+234 this week',
      ratingGrowth: '+0.3 this month',
      effectivenessGrowth: '+5% this month'
    }
  });

  recentContent = signal<RecentContent[]>([
    {
      id: '1',
      title: 'Q4 Market Outlook',
      publishedTime: 'Published 2 hours ago',
      readers: 156,
      rating: 9.2,
      icon: '📈'
    },
    {
      id: '2',
      title: 'Tech Innovation Fund',
      publishedTime: 'Published 1 day ago',
      readers: 89,
      rating: 8.4,
      icon: '📘'
    },
    {
      id: '3',
      title: 'Real Estate Opportunities',
      publishedTime: 'Published 2 days ago',
      readers: 67,
      rating: 7.9,
      icon: '🏠'
    }
  ]);

  performanceMetrics = signal<PerformanceMetric[]>([
    { label: 'Content Engagement', percentage: 87, color: '#3B82F6' },
    { label: 'Reader Retention', percentage: 73, color: '#10B981' },
    { label: 'Client Actions', percentage: 45, color: '#8B5CF6' }
  ]);

  topThemes = signal<TopTheme[]>([
    { name: 'Market Analysis', rating: 8.9 },
    { name: 'Technology Insights', rating: 8.4 },
    { name: 'Real Estate', rating: 7.8 }
  ]);

  authorComparisons = signal<AuthorComparison[]>([
    {
      id: '1',
      name: 'John Smith (You)',
      avatar: '#3B82F6',
      avatarInitials: 'JS',
      contentPublished: 47,
      totalReaders: 2847,
      avgRating: 8.4,
      topThemes: ['Market Analysis', 'Tech'],
      effectiveness: 87,
      isCurrentUser: true
    },
    {
      id: '2',
      name: 'Sarah Davis',
      avatar: '#10B981',
      avatarInitials: 'SD',
      contentPublished: 32,
      totalReaders: 1923,
      avgRating: 8.1,
      topThemes: ['Banking', 'Risk'],
      effectiveness: 82,
      isCurrentUser: false
    },
    {
      id: '3',
      name: 'Michael Brown',
      avatar: '#F59E0B',
      avatarInitials: 'MB',
      contentPublished: 28,
      totalReaders: 1654,
      avgRating: 7.9,
      topThemes: ['Global', 'Inflation'],
      effectiveness: 78,
      isCurrentUser: false
    }
  ]);

  ngOnInit() {
    this.notificationService.show('Content Creator dashboard loaded', 'success');
  }

  openCreateModal() {
    this.showModal.set(true);
  }

  closeCreateModal() {
    this.showModal.set(false);
  }

  handleContentCreated(data: any) {
    if (data.isDraft) {
      this.notificationService.show('Draft saved successfully!', 'success');
    } else {
      this.notificationService.show('Content created successfully!', 'success');
    }
    // Optionally send `data` to your service:
    // this.contentService.createContent(data).subscribe();
  }

  formatNumber(value: number): string {
    if (value >= 1000) {
      return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return value.toString();
  }

  getThemeClass(theme: string): string {
    const themeClasses: { [key: string]: string } = {
      'Market Analysis': 'bg-blue-100 text-blue-800',
      'Tech': 'bg-purple-100 text-purple-800',
      'Banking': 'bg-green-100 text-green-800',
      'Risk': 'bg-yellow-100 text-yellow-800',
      'Global': 'bg-teal-100 text-teal-800',
      'Inflation': 'bg-red-100 text-red-800'
    };
    return themeClasses[theme] || 'bg-gray-100 text-gray-800';
  }

  // Quick Action Methods
  createContent() {
    this.notificationService.show('Opening content creator...', 'info');
  }

  publishToPortal() {
    this.notificationService.show('Publishing content to portal...', 'success');
  }

  emailCampaign() {
    this.notificationService.show('Opening email campaign creator...', 'info');
  }

  viewAnalytics() {
    this.notificationService.show('Loading detailed analytics...', 'info');
  }
}
