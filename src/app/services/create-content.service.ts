import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateContentRequest {
  title: string;
  theme: string;
  target_audience: string;
  priority_level: string;
  expected_sentiment: string;
  content_body: string;
  tags: string;
  author_id: string;
  notify_advisors: boolean;
  enable_analytics: boolean;
}

export interface CreateContentResponse {
  id: number;
  message: string;
  initial_analysis: {
    overall_score: number;
    readability_score: number;
    compliance_score: number;
    engagement_prediction: number;
    risk_level: string;
  };
}

@Injectable({ providedIn: 'root' })
export class CreateContentService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://law22cnyxrrbl33rsw6f4cvos40jyaef.lambda-url.us-east-1.on.aws/api/content';

  createContent(payload: CreateContentRequest): Observable<CreateContentResponse> {
    return this.http.post<CreateContentResponse>(this.API_URL, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
