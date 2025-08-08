import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content-analytics-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" class="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-2 max-h-[97vh] overflow-y-auto border border-gray-200"
      >
        <div class="p-7">
          <!-- Header -->
          <div class="flex items-start justify-between mb-5">
            <div>
              <h2 class="text-2xl font-semibold text-gray-900">Content Analytics Dashboard</h2>
              <div class="text-sm text-gray-500">Detailed performance metrics for your content</div>
            </div>
            <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600 text-3xl font-bold leading-none">&times;</button>
          </div>

          <!-- Four summary stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div class="rounded-lg bg-blue-50 py-5 text-center shadow border border-blue-100">
              <div class="text-3xl text-blue-700 font-bold">{{summary.totalContent}}</div>
              <div class="text-xs text-blue-700 mt-2 font-semibold tracking-wide">Total Content</div>
              <div class="text-[11px] text-gray-400 mt-1">+5 this month</div>
            </div>
            <div class="rounded-lg bg-green-50 py-5 text-center shadow border border-green-100">
              <div class="text-3xl text-green-700 font-bold">{{summary.totalReaders}}</div>
              <div class="text-xs text-green-700 mt-2 font-semibold tracking-wide">Total Readers</div>
              <div class="text-[11px] text-gray-400 mt-1">+234 this week</div>
            </div>
            <div class="rounded-lg bg-yellow-50 py-5 text-center shadow border border-yellow-100">
              <div class="text-3xl text-yellow-700 font-bold">{{summary.avgRating}}</div>
              <div class="text-xs text-yellow-700 mt-2 font-semibold tracking-wide">Avg Rating</div>
              <div class="text-[11px] text-gray-400 mt-1">+0.3 this month</div>
            </div>
            <div class="rounded-lg bg-purple-50 py-5 text-center shadow border border-purple-100">
              <div class="text-3xl text-purple-700 font-bold">{{summary.effectiveness}}%</div>
              <div class="text-xs text-purple-700 mt-2 font-semibold tracking-wide">Effectiveness</div>
              <div class="text-[11px] text-gray-400 mt-1">+5% this month</div>
            </div>
          </div>

          <!-- Content performance details table -->
          <div class="mb-8">
            <div class="font-semibold text-lg text-gray-900 mb-2">Content Performance Details</div>
            <div class="overflow-x-auto">
              <table class="min-w-full text-sm border border-gray-200 rounded-lg bg-white shadow">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="text-left px-4 py-3 font-medium text-xs text-gray-700">Content Title</th>
                    <th class="text-left px-4 py-3 font-medium text-xs text-gray-700">Theme</th>
                    <th class="text-left px-4 py-3 font-medium text-xs text-gray-700">Readers</th>
                    <th class="text-left px-4 py-3 font-medium text-xs text-gray-700">Rating</th>
                    <th class="text-left px-4 py-3 font-medium text-xs text-gray-700">Effectiveness</th>
                    <th class="text-left px-4 py-3 font-medium text-xs text-gray-700">Published</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let perf of contentPerformance" class="border-t border-gray-100">
                    <td class="px-4 py-3">{{ perf.title }}</td>
                    <td class="px-4 py-3">
                      <span class="inline-block py-1 px-2 rounded bg-gray-100 text-xs">{{ perf.theme }}</span>
                    </td>
                    <td class="px-4 py-3">{{ perf.readers }}</td>
                    <td class="px-4 py-3 font-semibold text-green-700">{{ perf.rating }}★</td>
                    <td class="px-4 py-3 font-semibold text-purple-700">{{ perf.effectiveness }}%</td>
                    <td class="px-4 py-3 text-xs text-gray-400">{{ perf.publishedAgo }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Two-column Performance/Engagement block -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <!-- Performance by Theme box -->
            <div class="bg-white border border-gray-200 rounded-lg shadow p-5">
              <div class="font-semibold mb-3">Performance by Theme</div>
              <div class="flex flex-col space-y-2">
                <div class="flex items-center" *ngFor="let th of themePerformance">
                  <span class="w-2 h-2 rounded-full mr-3" [ngStyle]="{'background-color': th.color}"></span>
                  <span class="w-36 text-sm">{{th.label}}</span>
                  <span class="ml-auto font-semibold">{{th.avgRating}}★</span>
                </div>
              </div>
            </div>
            <!-- Reader Engagement Trends -->
            <div class="bg-white border border-gray-200 rounded-lg shadow p-5">
              <div class="font-semibold mb-3">Reader Engagement Trends</div>
              <div class="space-y-1">
                <div>Average Read Time: <span class="font-semibold">{{engagement.avgReadTime}}</span></div>
                <div>Completion Rate: <span class="font-semibold text-green-800">{{engagement.completionRate}}</span></div>
                <div>Share Rate: <span class="font-semibold text-blue-700">{{engagement.shareRate}}</span></div>
                <div>Comment Rate: <span class="font-semibold text-purple-700">{{engagement.commentRate}}</span></div>
                <div class="mt-2 text-xs text-gray-500">Top Performing Days:</div>
                <div class="flex space-x-3 text-xs mt-1">
                  <span *ngFor="let td of engagement.topDays">
                    <span class="font-bold text-blue-700">{{td.day}}</span> <span>{{td.engagement}}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Email Campaign Performance table -->
          <div>
            <div class="font-semibold text-lg text-gray-900 mb-2">Email Campaign Performance</div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm rounded bg-white border border-gray-200 shadow">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="text-left px-4 py-3 font-medium text-xs text-gray-700">Campaign</th>
                    <th class="text-left px-4 py-3 font-medium text-xs text-gray-700">Recipients</th>
                    <th class="text-left px-4 py-3 font-medium text-xs text-gray-700">Open Rate</th>
                    <th class="text-left px-4 py-3 font-medium text-xs text-gray-700">Click Rate</th>
                    <th class="text-left px-4 py-3 font-medium text-xs text-gray-700">Sent Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let campaign of emailCampaigns" class="border-t border-gray-100">
                    <td class="px-4 py-3">{{ campaign.name }}</td>
                    <td class="px-4 py-3">{{ campaign.recipients }}</td>
                    <td class="px-4 py-3 font-semibold text-green-700">{{ campaign.openRate }}%</td>
                    <td class="px-4 py-3 font-semibold text-blue-700">{{ campaign.clickRate }}%</td>
                    <td class="px-4 py-3 text-xs text-gray-400">{{ campaign.sentDate }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- Footer -->
          <div class="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
            <button (click)="close.emit()" class="px-4 py-2 text-gray-700 bg-white border rounded">Close</button>
            <button class="px-4 py-2 bg-blue-600 text-white rounded font-semibold">Export Report</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContentAnalyticsModalComponent implements OnInit {
  @Input() show = false;
  @Output() close = new EventEmitter<void>();

  summary = {
    totalContent: 47,
    totalReaders: 2847,
    avgRating: 8.4,
    effectiveness: 87
  };

  contentPerformance = [
    { title: 'Q4 Market Outlook', theme: 'Market Analysis', readers: 156, rating: 9.2, effectiveness: 92, publishedAgo: '2 hours ago' },
    { title: 'Tech Innovation Fund', theme: 'Product Updates', readers: 89, rating: 8.4, effectiveness: 84, publishedAgo: '1 day ago' },
    { title: 'Real Estate Opportunities', theme: 'Sector Research', readers: 67, rating: 7.8, effectiveness: 78, publishedAgo: '2 days ago' }
  ];

  themePerformance = [
    { label: 'Market Analysis', avgRating: 8.9, color: '#2563eb' },
    { label: 'Technology Insights', avgRating: 8.4, color: '#059669' },
    { label: 'Real Estate', avgRating: 7.8, color: '#f59e42' },
    { label: 'Risk Analysis', avgRating: 7.2, color: '#d97706' }
  ];

  engagement = {
    avgReadTime: '4m 32s',
    completionRate: '73%',
    shareRate: '12%',
    commentRate: '8%',
    topDays: [
      { day: 'Tuesday', engagement: '89% engagement' },
      { day: 'Wednesday', engagement: '84% engagement' },
      { day: 'Thursday', engagement: '81% engagement' }
    ]
  };

  emailCampaigns = [
    { name: 'Q4 Market Update', recipients: 1481, openRate: 68, clickRate: 23, sentDate: 'Yesterday' },
    { name: 'Tech Innovation Alert', recipients: 892, openRate: 72, clickRate: 28, sentDate: '3 days ago' }
  ];

  ngOnInit() {}
}
