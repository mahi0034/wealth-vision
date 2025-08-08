export interface ClientProfile {
  id: string;
  name: string;
  age: number;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  portfolioValue: number;
  investmentGoal: string;
  portfolioAllocation: PortfolioAllocation[];
  opportunities: string[];
  risks: string[];
  recommendations: string[];
}

export interface PortfolioAllocation {
  category: string;
  percentage: number;
  color: string;
}
