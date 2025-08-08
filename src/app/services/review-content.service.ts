// src/app/services/review-content.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReviewRequest {
  content_text: string;
  title: string;
  theme: string;
  target_audience: string;
}

export interface ReviewResponse {
  content_score: number;
  readability_score: number;
  compliance_score: number;
  engagement_prediction: number;
  effectiveness_score: number;
  risk_level: string;
  analysis_feedback: {
    readability: string;
    compliance: string;
    engagement: string;
  };
  recommendations: string[];
}

@Injectable({ providedIn: 'root' })
export class ReviewContentService {
  private http = inject(HttpClient);
  private readonly REVIEW_URL =
    'https://law22cnyxrrbl33rsw6f4cvos40jyaef.lambda-url.us-east-1.on.aws/api/content/analyze';

  analyzeContent(payload: ReviewRequest): Observable<ReviewResponse> {
    return this.http.post<ReviewResponse>(this.REVIEW_URL, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
