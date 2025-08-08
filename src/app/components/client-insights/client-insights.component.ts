import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { NotificationService } from '../../services/notification.service';
import { ClientProfile } from '../../models/client.model';

@Component({
  selector: 'app-client-insights',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <!-- Page Header -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Client Portfolio Insights</h1>
        <div class="w-80">
          <select 
            [(ngModel)]="selectedClientId"
            (ngModelChange)="onClientChange()"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            @for (client of clients(); track client.id) {
              <option [value]="client.id">
                {{ client.name }} (Age {{ client.age }}, {{ client.riskProfile | titlecase }})
              </option>
            }
          </select>
        </div>
      </div>

      @if (selectedClient()) {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Client Profile Card -->
          <div class="bg-gray-100 rounded-xl p-6">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span class="text-white text-lg">👤</span>
              </div>
              <h2 class="text-lg font-semibold text-gray-900">Client Profile: {{ selectedClient()?.name }}</h2>
            </div>

            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Age:</span>
                <span class="text-lg font-semibold text-gray-900">{{ selectedClient()?.age }}</span>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-gray-600">Risk Profile:</span>
                <span 
                  class="px-3 py-1 rounded-full text-sm font-medium"
                  [ngClass]="getRiskProfileClass(selectedClient()?.riskProfile || '')">
                  {{ selectedClient()?.riskProfile | titlecase }}
                </span>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-gray-600">Portfolio Value:</span>
                <span class="text-lg font-semibold text-gray-900">
                  {{ formatCurrency(selectedClient()?.portfolioValue || 0) }}
                </span>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-gray-600">Investment Goal:</span>
                <span class="text-gray-900 font-medium">{{ selectedClient()?.investmentGoal }}</span>
              </div>
            </div>
          </div>

          <!-- Portfolio Allocation Chart -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h2 class="text-lg font-semibold text-gray-900 mb-6">Portfolio Allocation</h2>

            <!-- Pie Chart Container -->
            <div class="flex items-center justify-center mb-6">
              <div class="relative w-64 h-64">
                <!-- Pie Chart SVG -->
                <svg viewBox="0 0 200 200" class="w-full h-full transform -rotate-90">
                  @for (segment of getChartSegments(); track segment.category; let i = $index) {
                    <path
                      [attr.d]="segment.path"
                      [attr.fill]="segment.color"
                      [attr.stroke]="'white'"
                      [attr.stroke-width]="2"
                      class="hover:opacity-80 transition-opacity cursor-pointer">
                    </path>
                  }
                  <!-- Center circle for donut effect -->
                  <circle cx="100" cy="100" r="50" fill="white"></circle>
                </svg>
              </div>
            </div>

            <!-- Legend -->
            <div class="grid grid-cols-2 gap-3">
              @for (allocation of selectedClient()?.portfolioAllocation || []; track allocation.category) {
                <div class="flex items-center space-x-2">
                  <div 
                    class="w-3 h-3 rounded-full"
                    [style.background-color]="allocation.color">
                  </div>
                  <span class="text-sm text-gray-700">{{ allocation.category }}</span>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Three Column Layout for Insights -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Relevant Opportunities -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex items-center space-x-2 mb-4">
              <div class="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                <span class="text-green-600 text-sm">✓</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Relevant Opportunities</h3>
            </div>

            <div class="space-y-3">
              @for (opportunity of selectedClient()?.opportunities || []; track opportunity) {
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span class="text-gray-700 text-sm">{{ opportunity }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Risk Considerations -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex items-center space-x-2 mb-4">
              <div class="w-6 h-6 bg-yellow-100 rounded flex items-center justify-center">
                <span class="text-yellow-600 text-sm">⚠</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Risk Considerations</h3>
            </div>

            <div class="space-y-3">
              @for (risk of selectedClient()?.risks || []; track risk) {
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span class="text-gray-700 text-sm">{{ risk }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Recommendations -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex items-center space-x-2 mb-4">
              <div class="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                <span class="text-blue-600 text-sm">💡</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Recommendations</h3>
            </div>

            <div class="space-y-3">
              @for (recommendation of selectedClient()?.recommendations || []; track recommendation) {
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span class="text-gray-700 text-sm">{{ recommendation }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ClientInsightsComponent implements OnInit {
  private clientService = inject(ClientService);
  private notificationService = inject(NotificationService);

  clients = signal<ClientProfile[]>([]);
  selectedClient = signal<ClientProfile | null>(null);
  selectedClientId = '';

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getClients().subscribe(clients => {
      this.clients.set(clients);
      if (clients.length > 0) {
        // Select Robert Williams by default as shown in the image
        const robert = clients.find(c => c.name === 'Robert Williams');
        if (robert) {
          this.selectedClientId = robert.id;
          this.selectedClient.set(robert);
        } else {
          this.selectedClientId = clients[0].id;
          this.selectedClient.set(clients[0]);
        }
      }
    });
  }

  onClientChange() {
    const client = this.clients().find(c => c.id === this.selectedClientId);
    if (client) {
      this.selectedClient.set(client);
      this.notificationService.show(`Switched to ${client.name}`, 'info');
    }
  }

  getRiskProfileClass(riskProfile: string): string {
    switch (riskProfile.toLowerCase()) {
      case 'conservative':
        return 'bg-blue-100 text-blue-800';
      case 'moderate':
        return 'bg-orange-100 text-orange-800';
      case 'aggressive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value);
  }

  getChartSegments() {
    const client = this.selectedClient();
    if (!client?.portfolioAllocation) return [];

    let currentAngle = 0;
    const centerX = 100;
    const centerY = 100;
    const radius = 80;
    const innerRadius = 50;

    return client.portfolioAllocation.map(allocation => {
      const percentage = allocation.percentage;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      // Convert angles to radians
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      // Calculate arc path
      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const x3 = centerX + innerRadius * Math.cos(endRad);
      const y3 = centerY + innerRadius * Math.sin(endRad);
      const x4 = centerX + innerRadius * Math.cos(startRad);
      const y4 = centerY + innerRadius * Math.sin(startRad);

      const largeArc = angle > 180 ? 1 : 0;

      const path = [
        `M ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
        'Z'
      ].join(' ');

      currentAngle += angle;

      return {
        category: allocation.category,
        path: path,
        color: allocation.color,
        percentage: allocation.percentage
      };
    });
  }
}
