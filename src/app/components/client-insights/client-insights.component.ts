import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { NotificationService } from '../../services/notification.service';
import { ClientProfile } from '../../models/client.model';
import { ContentItem } from 'src/app/models/content.model';
import { ContentFeedbackModalComponent } from '../content-library/content-feedback-modal.component';
import { ContentService } from 'src/app/services/content.service';

@Component({
  selector: 'app-client-insights',
  standalone: true,
  imports: [CommonModule, FormsModule, ContentFeedbackModalComponent, FormsModule],
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
            @for (client of clients(); track client.client_id) {
              <option [value]="client.client_id">
                {{ client.full_name }}
                 <!-- (Age {{ client.age }}, {{ client.risk_profile | titlecase }}, {{client.portfolio_value}}) -->
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
              <h2 class="text-lg font-semibold text-gray-900">Client Profile: {{ selectedClient()?.full_name }}</h2>
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
                  [ngClass]="getRiskProfileClass(selectedClient()?.risk_profile || '')">
                  {{ selectedClient()?.risk_profile | titlecase }}
                </span>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-gray-600">Portfolio Value:</span>
                <span class="text-lg font-semibold text-gray-900">
                  {{ formatCurrency(selectedClient()?.portfolio_value || 0) }}
                </span>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-gray-600">Investment Goal:</span>
                <span class="text-gray-900 font-medium">
                  {{getFormattedInvestmentGolas(selectedClient()?.investment_objectives)}}
                </span>
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
              @for (allocation of selectedClient()?.portfolio?.allocations || []; track allocation.category) {
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
              @for (opportunity of opportunities || []; track opportunity) {
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
              @for (risk of risks || []; track risk) {
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
              <button 
                (click)="openFeedback()"
                class="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center space-x-1 transition-colors">
                <span>📝</span>
                <span>Feedback</span>
              </button>
            </div>

            <div class="space-y-3">
              @for (recommendation of recommendations || []; track recommendation) {
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

    <app-content-feedback-modal
        [show]="showFeedback()"
        (close)="closeFeedback()"
        (feedbackSubmitted)="onFeedbackSubmitted($event)"
      ></app-content-feedback-modal>
  `
})
export class ClientInsightsComponent implements OnInit {
  private contentService = inject(ContentService);
  private clientService = inject(ClientService);
  private notificationService = inject(NotificationService);

  clients = signal<ClientProfile[]>([]);
  selectedClient = signal<ClientProfile | null>(null);
  selectedClientId = '';
  opportunities:any = [];
  risks:any = [];
  recommendations:any = [];
  client_id_list:any =[];
  colors:any = ['#800080','#000080', '#008080','#FF0000', '#808080']

  ngOnInit() {
    this.loadClients();
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  loadClients() {
    let req={
      banker_id:["ADV-00004"]
    }
    this.clientService.getClients(req).subscribe(clients => {
      this.clients.set(clients.body);
      let clientsData :any= clients.body;
      clientsData?.forEach((client:any) => {
          client?.portfolio?.allocations.forEach((element:any) => {
          element.color = this.getRandomColor();
        });
      });
      if (clientsData.length > 0) {
        this.selectedClientId = clientsData[0].client_id;
        this.selectedClient.set(clientsData[0]);
        this.onClientChange();
      }
    });
  }

  onClientChange() {
    const client = this.clients()?.find(c => c.client_id === this.selectedClientId);
    if (client) {
      this.selectedClient.set(client);
      this.notificationService.show(`Switched to ${client.full_name}`, 'info');
    }
    let reqObj = {
      "clientIds":[this.selectedClientId]
    }
    this.clientService.getClientDeails(reqObj).subscribe(data => {
      this.opportunities = data?.body?.insights?.relevant_opportunities;
      this.risks = data?.body?.insights?.risk_considerations;
      this.recommendations = data?.body?.insights?.recommendations;
      this.client_id_list = data?.body?.client_id_list;
    })    
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
  getFormattedInvestmentGolas(goals:any){
    return goals?.join(",");
  }
  getChartSegments() {
    const client = this.selectedClient();
    if (!client?.portfolio?.allocations) return [];

    let currentAngle = 0;
    const centerX = 100;
    const centerY = 100;
    const radius = 80;
    const innerRadius = 50;

    return client.portfolio?.allocations.map(allocation => {
      const percentage = allocation.value;
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
        percentage: allocation.value
      };
    });
  }

   // Feedback modal state
  showFeedbackModal = signal(false);
  
  showFeedback() {
    return this.showFeedbackModal();
  }
   // Feedback handlers
  openFeedback() {
    this.showFeedbackModal.set(true);
  }
  closeFeedback() {
    this.showFeedbackModal.set(false);
  }

  onFeedbackSubmitted(payload: any) {
    this.notificationService.show('Feedback submitted!', 'success');
    payload.related_content = [];
    this.client_id_list?.forEach((element:any) => {
      let obj={
        id:element,
        title:null
      }
      payload.related_content.push(obj)
    });
    this.contentService.contentFeedbackSubmission(payload).subscribe(res=>{
      console.log(res);
    })
  }
}
