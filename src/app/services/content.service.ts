import { Injectable, signal } from '@angular/core';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ContentItem, DashboardStats } from '../models/content.model';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private contentSubject = new BehaviorSubject<ContentItem[]>([]);

  constructor(private http: HttpClient) {
    this.fetchContent();
  }

  private fetchContent() {
    const url =  'https://9v6vy5y0j2.execute-api.us-east-1.amazonaws.com/default/semantic_lambda_insights' ;
    const body = { "isBanker": true,
  "top_k": 500,
  "advisor_id": "ADV-00005" };

    this.http.post<any[]>(url, body).subscribe({
      next: (data) => {
        const mapped: ContentItem[] = data.map(item => ({
          id: String(item.content_id),
          title: item.title,
          description: item.summary,
          sentiment: 'neutral', // No sentiment in API, default to 'neutral'
          time: this.getHoursAgo(item.created_at),
          tags: [
            ...(item.themes_identified ? item.themes_identified.split(',').map((t: string) => t.trim()) : []),
            ...(item.asset_classes_identified ? item.asset_classes_identified.split(',').map((t: string) => t.trim()) : []),
            ...(item.sectors_identified ? item.sectors_identified.split(',').map((t: string) => t.trim()) : []),
            ...(item.lobs_identified ? item.lobs_identified.split(',').map((t: string) => t.trim()) : [])
          ],
          author: item.author, // Not available in API
          icon: '',   // Not available in API
          theme: '',
          priority: 'normal',
          status: 'published',
          metrics: {
            readers: item.content_viewed || 0,
            rating: item.average_feedback_rating || 0,
            effectiveness: item.score || 0,
            shares: 0,
            comments: 0,
            readTime: '',
            completionRate: 0
          },
          createdAt: item.created_at
        }));
        this.contentSubject.next(mapped);
      },
      error: () => {
        this.contentSubject.next([]);
      }
    });
  }

  private getHoursAgo(dateString: string): number {
    const created = new Date(dateString).getTime();
    const now = Date.now();
    return Math.floor((now - created) / (1000 * 60 * 60));
  }

  getContent(): Observable<ContentItem[]> {
    return this.contentSubject.asObservable();
  }

  getContentById(id: string): Observable<ContentItem | undefined> {
    return this.contentSubject.pipe(
      map(content => content.find(item => item.id === id))
    );
  }

  getStats(): Observable<DashboardStats> {
    const content = this.contentSubject.value;
    const avgRating = content.length > 0 ?
      content.reduce((sum, item) => sum + (item.metrics?.rating || 0), 0) / content.length : 0;

    return new Observable<DashboardStats>(observer => {
      observer.next({
        totalContent: content.length,
        activeClients: 89,
        insightsGenerated: 156,
        avgSentiment: avgRating
      });
      observer.complete();
    });
  }

  getContentByIds(ids: string[]): Observable<ContentItem[]> {
    return this.contentSubject.pipe(
      map(content => content.filter(item => ids.includes(item.id)))
    );
  }
}
