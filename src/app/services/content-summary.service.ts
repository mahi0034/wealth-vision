import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SummaryInsightResponse {
  executive_summary: string;
  key_insights: {
    market_opportunities: string[];
    risk_factors: string[];
  };
  content_breakdown: Array<{
    sentiment: 'Positive' | 'Neutral' | 'Negative';
    title: string;
    updated_at: string;
    relevance_score: number;
    key_points: string[];
    preference_alignment: string;
  }>;
  recommended_actions: string[];
  preference_impact: {
    themes: Array<{
      name: string;
      summary: string;
      confidence: number;
      sentiment: string;
      highlights: string;
      preference_status: string;
      advisor_alignment: string;
    }>;
    regions: Array<{
      name: string;
      summary: string;
      confidence: number;
      sentiment: string;
      highlights: string;
      preference_status: string;
      advisor_alignment: string;
    }>;
    asset_classes: Array<{
      name: string;
      summary: string;
      confidence: number;
      sentiment: string;
      highlights: string;
      preference_status: string;
      advisor_alignment: string;
    }>;
    sectors: Array<{
      name: string;
      summary: string;
      confidence: number;
      sentiment: string;
      highlights: string;
      preference_status: string;
      advisor_alignment: string;
    }>;
    lobs: Array<{
      name: string;
      summary: string;
      confidence: number;
      sentiment: string;
      highlights: string;
      preference_status: string;
      advisor_alignment: string;
    }>;
  };
  metadata: {
    generated_at: string;
    model_used: string;
    content_count: number;
    advisor_id: string;
    analysis_type: string;
  };
}

@Injectable({ providedIn: 'root' })
export class ContentSummaryService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://prdaxfsvogzt6uju2liy3wrh4u0dqcfn.lambda-url.us-east-1.on.aws/';

  /**
   * Fetches content summary from the real API endpoint
   * @param contentIds Array of content ID strings
   * @param advisorId Advisor ID (e.g., "ADV-00004")
   * @param preferenceImpactFlag Whether to include preference impact analysis
   */
  getSummary(contentIds: string[], advisorId: string, preferenceImpactFlag: boolean = true): Observable<SummaryInsightResponse> {
    const payload = {
      'content-id': contentIds,
      'advisor-id': advisorId,
      'preference_impact_flag': preferenceImpactFlag
    };

    return this.http.post<SummaryInsightResponse>(this.API_URL, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
