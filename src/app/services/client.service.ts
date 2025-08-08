import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ClientProfile } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private clientsSignal = signal<ClientProfile[]>([
    {
      id: 'client1',
      name: 'Sarah Johnson',
      age: 45,
      riskProfile: 'conservative',
      portfolioValue: 1200000,
      investmentGoal: 'Retirement Planning',
      portfolioAllocation: [
        { category: 'Bonds', percentage: 45, color: '#3B82F6' },
        { category: 'Large Cap Stocks', percentage: 30, color: '#10B981' },
        { category: 'International', percentage: 15, color: '#F59E0B' },
        { category: 'Cash', percentage: 10, color: '#EF4444' }
      ],
      opportunities: [
        'Conservative Bond Funds',
        'Dividend Growth Stocks',
        'Real Estate Investment'
      ],
      risks: [
        'Inflation Impact on Bonds',
        'Low Equity Exposure',
        'Retirement Timeline'
      ],
      recommendations: [
        'Increase TIPS allocation',
        'Consider ESG funds',
        'Review in 6 months'
      ]
    },
    {
      id: 'client2',
      name: 'Michael Chen',
      age: 32,
      riskProfile: 'aggressive',
      portfolioValue: 450000,
      investmentGoal: 'Wealth Accumulation',
      portfolioAllocation: [
        { category: 'Growth Stocks', percentage: 60, color: '#8B5CF6' },
        { category: 'Tech Funds', percentage: 20, color: '#06B6D4' },
        { category: 'Emerging Markets', percentage: 15, color: '#F97316' },
        { category: 'Bonds', percentage: 5, color: '#84CC16' }
      ],
      opportunities: [
        'Tech Innovation Fund',
        'Emerging Markets',
        'Growth Stocks'
      ],
      risks: [
        'High Volatility Exposure',
        'Sector Concentration',
        'Market Timing Risk'
      ],
      recommendations: [
        'Diversify sectors',
        'Add international exposure',
        'Dollar-cost averaging'
      ]
    },
    {
      id: 'client3',
      name: 'Robert Williams',
      age: 58,
      riskProfile: 'moderate',
      portfolioValue: 2100000,
      investmentGoal: 'Pre-Retirement',
      portfolioAllocation: [
        { category: 'Balanced Funds', percentage: 40, color: '#6366F1' },
        { category: 'Dividend Stocks', percentage: 35, color: '#10B981' },
        { category: 'Bonds', percentage: 15, color: '#F59E0B' },
        { category: 'REITs', percentage: 10, color: '#EF4444' }
      ],
      opportunities: [
        'Balanced Funds',
        'Income-Generating Assets',
        'Target-Date Funds'
      ],
      risks: [
        'Sequence of Returns',
        'Healthcare Costs',
        'Longevity Risk'
      ],
      recommendations: [
        'Gradual de-risking',
        'Income ladder strategy',
        'Tax-loss harvesting'
      ]
    }
  ]);

  getClients(): Observable<ClientProfile[]> {
    return of(this.clientsSignal());
  }

  getClientById(id: string): Observable<ClientProfile | undefined> {
    return of(this.clientsSignal().find(client => client.id === id));
  }

  updateClient(id: string, updates: Partial<ClientProfile>): Observable<ClientProfile | null> {
    const clients = this.clientsSignal();
    const index = clients.findIndex(client => client.id === id);

    if (index === -1) {
      return of(null);
    }

    const updatedClient = { ...clients[index], ...updates };
    const newClients = [...clients];
    newClients[index] = updatedClient;

    this.clientsSignal.set(newClients);
    return of(updatedClient);
  }
}
