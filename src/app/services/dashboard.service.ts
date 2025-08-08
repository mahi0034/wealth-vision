import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStatsApi {
  content_published: number;
  total_readers: number;
  avg_rating: number;
  effectiveness: number;
}
export interface RecentContentApi {
  id: number;
  title: string;
  theme: string;
  is_published: boolean;
  is_draft: boolean;
  total_readers: number;
  avg_rating: number;
  effectiveness_score: number;
  created_at: string;
  time_ago: string;
}
export interface AnalyticsApi {
  content_engagement: number;
  reader_retention: number;
  client_actions: number;
}
export interface DashboardApiResponse {
  dashboard: DashboardStatsApi;
  recent_content: RecentContentApi[];
  analytics: AnalyticsApi;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);

  getDashboard(authorId: string): Observable<DashboardApiResponse> {
    const url = `https://law22cnyxrrbl33rsw6f4cvos40jyaef.lambda-url.us-east-1.on.aws/api/dashboard?author_id=${authorId}`;
    return this.http.get<DashboardApiResponse>(url);
  }
}
