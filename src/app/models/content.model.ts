export interface ContentItem {
  id: string;
  title: string;
  description: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  time: number;
  tags: string[];
  author: string;
  icon: string;
  theme?: string;
  priority?: 'normal' | 'high' | 'urgent';
  status?: 'draft' | 'published' | 'archived';
  metrics?: ContentMetrics;
  createdAt: string;
  updatedAt?: string;
}

export interface ContentMetrics {
  readers: number;
  rating: number;
  effectiveness: number;
  shares: number;
  comments: number;
  readTime?: string;
  completionRate?: number;
}

export interface DashboardStats {
  total_content: number;
  active_clients: number;
  insights_generated: number;
  avg_sentiment: number;
  content_added_this_week: number;
  new_clients_this_week: number
}

export interface TopContent {
  id: string;
  title: string;
  icon: string;
  clientActions: number;
  positiveFeedback: number;
  effectiveness: number;
  content_viewed: number;
  positive_feedback_pct: number;
  sentiment_score:number
}

export interface RecentActivity {
  id: string;
  title: string;
  author: string;
  timeAgo: string;
  icon: string;
  sentiment: string;
  created_at:string;
  content_id:string;
}
