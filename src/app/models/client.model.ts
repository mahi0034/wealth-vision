export interface ClientProfile {
  client_id: string;
  full_name: string;
  age: number;
  risk_profile: 'conservative' | 'moderate' | 'aggressive';
  portfolio_value: number;
  investment_objectives: string[];
  portfolio:{
    allocations: PortfolioAllocation[];
  }
  opportunities: string[];
  risks: string[];
  recommendations: string[];
}

export interface PortfolioAllocation {
  category: string;
  value: number;
  color: string;
}
