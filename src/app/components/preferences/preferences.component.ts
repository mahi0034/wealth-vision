// src/app/components/preferences/preferences.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

interface ContentType {
  id: string;
  label: string;
  icon: string;
  selected: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
}

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 space-y-8 bg-gray-50 min-h-screen">
      <!-- Content Preferences -->
      <section class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Content Preferences</h2>
        
        <!-- Preferred Content Types -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <label *ngFor="let ct of contentTypes" class="flex items-center space-x-2 p-3 border rounded cursor-pointer"
                 [class.border-blue-600]="ct.selected">
            <input type="checkbox" [(ngModel)]="ct.selected" name="{{ct.id}}" class="hidden" />
            <span class="text-2xl">{{ct.icon}}</span>
            <span>{{ct.label}}</span>
          </label>
        </div>

        <!-- Notification Preferences -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Content Frequency</label>
            <select [(ngModel)]="notificationFrequency" class="w-full p-2 border rounded">
              <option>Daily digest</option>
              <option>Weekly summary</option>
              <option>Real-time alerts</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Priority Content</label>
            <select [(ngModel)]="priorityContent" class="w-full p-2 border rounded">
              <option>All content</option>
              <option>High priority only</option>
              <option>Custom filters</option>
            </select>
          </div>
        </div>

        <!-- Content Customization -->
        <div class="space-y-2 mb-6">
          <h3 class="text-lg font-medium mb-2">Content Customization</h3>
          <label class="flex items-center space-x-2">
            <input type="checkbox" [(ngModel)]="customization.includeClientRecommendations" class="accent-blue-600" />
            <span>Include client-specific recommendations</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" [(ngModel)]="customization.showSentiment" class="accent-blue-600" />
            <span>Show sentiment analysis</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" [(ngModel)]="customization.includeTechnicalCharts" class="accent-blue-600" />
            <span>Include technical analysis charts</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" [(ngModel)]="customization.highlightInsights" class="accent-blue-600" />
            <span>Highlight actionable insights</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" [(ngModel)]="customization.includeCompetitorAnalysis" class="accent-blue-600" />
            <span>Include competitor analysis</span>
          </label>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-4">
          <button (click)="resetDefaults()" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Reset to Defaults</button>
          <button (click)="savePreferences()" class="px-6 py-2 bg-blue-600 text-white rounded">Save Preferences</button>
        </div>
      </section>

      <!-- Sharing & Collaboration Settings -->
      <section class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Sharing & Collaboration Settings</h2>
        
        <!-- Default Share Settings -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Default sharing method</label>
            <select [(ngModel)]="sharing.defaultMethod" class="w-full p-2 border rounded">
              <option>Shareable Link</option>
              <option>Email</option>
              <option>PDF Export</option>
              <option>Presentation</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Link expiration</label>
            <select [(ngModel)]="sharing.linkExpiration" class="w-full p-2 border rounded">
              <option>1 day</option>
              <option>7 days</option>
              <option>30 days</option>
              <option>Never</option>
            </select>
          </div>
        </div>
        <div class="space-y-2 mb-6">
          <label class="flex items-center space-x-2">
            <input type="checkbox" [(ngModel)]="sharing.includeAdvisorName" class="accent-blue-600" />
            <span>Include advisor name</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" [(ngModel)]="sharing.allowClientComments" class="accent-blue-600" />
            <span>Allow client comments</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" [(ngModel)]="sharing.trackAnalytics" class="accent-blue-600" />
            <span>Track viewing analytics</span>
          </label>
        </div>

        <!-- Team Collaboration -->
        <div class="mb-4">
          <h3 class="text-lg font-medium mb-2">Team Collaboration</h3>
          <div class="space-y-2">
            <div *ngFor="let tm of teamMembers" class="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">{{tm.initials}}</div>
                <div>
                  <p>{{tm.name}}</p>
                  <p class="text-xs text-gray-500">{{tm.role}}</p>
                </div>
              </div>
              <button (click)="removeMember(tm.id)" class="text-red-600 hover:underline text-sm">Remove</button>
            </div>
            <button (click)="addMember()" class="mt-2 text-blue-600 hover:underline text-sm">+ Add team member</button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end">
          <button (click)="saveSettings()" class="px-6 py-2 bg-blue-600 text-white rounded">Save Settings</button>
        </div>
      </section>
    </div>
  `
})
export class PreferencesComponent implements OnInit {
  constructor(private notif: NotificationService) {}

  contentTypes: ContentType[] = [
    { id:'market', label:'Market Analysis', icon:'📈', selected:true },
    { id:'economic', label:'Economic Data', icon:'📊', selected:false },
    { id:'product', label:'Product Updates', icon:'📦', selected:true },
    { id:'risk', label:'Risk Analysis', icon:'⚠️', selected:false },
    { id:'sector', label:'Sector Research', icon:'🔍', selected:false },
    { id:'global', label:'Global Markets', icon:'🌍', selected:true },
  ];

  notificationFrequency = 'Daily digest';
  priorityContent = 'High priority only';

  customization = {
    includeClientRecommendations: true,
    showSentiment: true,
    includeTechnicalCharts: false,
    highlightInsights: true,
    includeCompetitorAnalysis: false
  };

  sharing = {
    defaultMethod: 'Shareable Link',
    linkExpiration: '7 days',
    includeAdvisorName: true,
    allowClientComments: false,
    trackAnalytics: true
  };

  teamMembers: TeamMember[] = [
    { id:'tm1', name:'John Davis', role:'Lead Banker', initials:'JD' },
    { id:'tm2', name:'Sarah Miller', role:'Investment Counselor', initials:'SM' }
  ];

  ngOnInit() {}

  resetDefaults() {
    this.contentTypes.forEach(ct => ct.selected = false);
    this.contentTypes[0].selected = true;
    this.notificationFrequency = 'Daily digest';
    this.priorityContent = 'High priority only';
    this.customization = {
      includeClientRecommendations: true,
      showSentiment: true,
      includeTechnicalCharts: false,
      highlightInsights: true,
      includeCompetitorAnalysis: false
    };
    this.sharing = {
      defaultMethod: 'Shareable Link',
      linkExpiration: '7 days',
      includeAdvisorName: true,
      allowClientComments: false,
      trackAnalytics: true
    };
    this.notif.show('Preferences reset to defaults', 'info');
  }

  savePreferences() {
    this.notif.show('Preferences saved successfully!', 'success');
  }

  removeMember(id: string) {
    this.teamMembers = this.teamMembers.filter(m => m.id !== id);
  }

  addMember() {
    const name = prompt('Enter new member name:');
    if (!name) return;
    const initials = name.split(' ').map(n=>n[0]).join('').toUpperCase();
    const role = prompt(`Role for ${name}:`) || '';
    this.teamMembers.push({ id:Date.now().toString(), name, role, initials });
    this.notif.show(`${name} added to team`, 'success');
  }

  saveSettings() {
    this.notif.show('Settings saved successfully!', 'success');
  }
}
