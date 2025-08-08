import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface EmailContentOption {
  id: string;
  title: string;
  readers: number;
  rating: number;
  selected: boolean;
}

@Component({
  selector: 'app-create-email-campaign-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="show" class="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-auto">
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-center justify-between mb-2">
            <div>
              <h2 class="text-xl font-semibold">Create Email Campaign</h2>
              <p class="text-sm text-gray-500">Send content updates to subscribed clients and advisors</p>
            </div>
            <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
          </div>

          <form (ngSubmit)="sendCampaign()">
            <!-- Campaign Name and Template -->
            <div class="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label class="text-xs font-semibold text-gray-700">Campaign Name</label>
                <input type="text" [(ngModel)]="form.campaignName" name="campaignName" class="w-full p-2 border rounded focus:outline-blue-500" required />
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-700">Email Template</label>
                <select [(ngModel)]="form.emailTemplate" name="emailTemplate" class="w-full p-2 border rounded focus:outline-blue-500" required>
                  <option value="Market Update">Market Update</option>
                  <option value="Performance">Performance</option>
                  <option value="Portfolio Insight">Portfolio Insight</option>
                </select>
              </div>
            </div>

            <!-- Content Selection -->
            <div class="mb-3">
              <label class="block text-xs font-semibold text-gray-700 mb-1">Select Content to Include</label>
              <div class="space-y-2 max-h-32 overflow-y-auto">
                <label *ngFor="let c of emailContents" class="flex items-center space-x-2">
                  <input type="checkbox" [(ngModel)]="c.selected" name="content-{{c.id}}" class="accent-blue-600" />
                  <span class="font-medium">{{c.title}}</span>
                  <span class="text-xs text-gray-500 ml-3">{{c.readers}} readers • {{c.rating}}★ rating</span>
                </label>
              </div>
            </div>

            <!-- Target Audience -->
            <div class="mb-3">
              <label class="block text-xs font-semibold text-gray-700 mb-1">Target Audience</label>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <div class="font-semibold text-sm mb-1 text-blue-800">Advisors</div>
                  <label class="flex items-center space-x-2"><input type="checkbox" [(ngModel)]="form.advisors.all" name="adv-all" /><span>All Advisors</span></label>
                  <label class="flex items-center space-x-2"><input type="checkbox" [(ngModel)]="form.advisors.senior" name="adv-senior" /><span>Senior Advisors (89)</span></label>
                  <label class="flex items-center space-x-2"><input type="checkbox" [(ngModel)]="form.advisors.new" name="adv-new" /><span>New Advisors (34)</span></label>
                </div>
                <div>
                  <div class="font-semibold text-sm mb-1 text-blue-800">Clients</div>
                  <label class="flex items-center space-x-2"><input type="checkbox" [(ngModel)]="form.clients.subscribed" name="cli-subscribed" /><span>Subscribed Clients (1,234)</span></label>
                  <label class="flex items-center space-x-2"><input type="checkbox" [(ngModel)]="form.clients.hnw" name="cli-hnw" /><span>High Net Worth (456)</span></label>
                  <label class="flex items-center space-x-2"><input type="checkbox" [(ngModel)]="form.clients.activeTraders" name="cli-traders" /><span>Active Traders (234)</span></label>
                </div>
              </div>
            </div>

            <!-- Subject and Message -->
            <div class="mb-3">
              <label class="block text-xs font-semibold text-gray-700">Email Subject</label>
              <input type="text" [(ngModel)]="form.emailSubject" name="emailSubject" class="w-full p-2 border rounded focus:outline-blue-500" required />
            </div>
            <div class="mb-3">
              <label class="block text-xs font-semibold text-gray-700">Personal Message (Optional)</label>
              <textarea [(ngModel)]="form.personalMessage" name="personalMessage" rows="2" class="w-full p-2 border rounded focus:outline-blue-500"></textarea>
            </div>

            <!-- Send Schedule -->
            <div class="mb-3">
              <label class="block text-xs font-semibold text-gray-700 mb-1">Send Schedule</label>
              <select [(ngModel)]="form.sendSchedule" name="sendSchedule" class="w-full p-2 border rounded focus:outline-blue-500">
                <option value="immediate">Send Immediately</option>
                <option value="scheduled">Schedule Send</option>
              </select>
            </div>

            <!-- Campaign Settings -->
            <div class="mb-4 bg-yellow-50 border border-yellow-200 p-3 rounded">
              <div class="font-semibold text-xs text-yellow-700 mb-2">Campaign Settings</div>
              <div class="grid grid-cols-2 gap-4">
                <label class="flex items-center space-x-2">
                  <input type="checkbox" [(ngModel)]="form.settings.trackOpens" name="trackOpens" class="accent-blue-600" />
                  <span class="text-sm">Track email opens</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input type="checkbox" [(ngModel)]="form.settings.trackClicks" name="trackClicks" class="accent-yellow-600" />
                  <span class="text-sm">Track link clicks</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input type="checkbox" [(ngModel)]="form.settings.includeUnsubscribe" name="includeUnsubscribe" class="accent-green-600" />
                  <span class="text-sm">Include unsubscribe link</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input type="checkbox" [(ngModel)]="form.settings.personalizeContent" name="personalizeContent" class="accent-purple-600" />
                  <span class="text-sm">Personalize content</span>
                </label>
              </div>
            </div>

            <div class="text-right text-xs text-gray-500 mb-2">
              Estimated recipients: {{ estimatedRecipients }}
            </div>

            <!-- Footer -->
            <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button type="button" (click)="close.emit()" class="px-4 py-2 bg-white border rounded">Cancel</button>
              <button type="button" (click)="previewCampaign()" class="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100">Preview</button>
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded font-semibold">Send Campaign</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class CreateEmailCampaignModalComponent implements OnInit {
  @Input() show = false;
  @Input() emailContents: EmailContentOption[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() campaignSent = new EventEmitter<any>();

  form = {
    campaignName: '',
    emailTemplate: 'Market Update',
    advisors: { all: true, senior: false, new: false },
    clients: { subscribed: false, hnw: false, activeTraders: false },
    emailSubject: '',
    personalMessage: '',
    sendSchedule: 'immediate',
    settings: {
      trackOpens: true,
      trackClicks: true,
      includeUnsubscribe: true,
      personalizeContent: false
    }
  };

  estimatedRecipients = 247;

  ngOnInit() {
    // Estimate recipients logic could depend on content/audience/real API
    // For demo, it's a static value. Bind dynamically if needed.
  }

  previewCampaign() {
    // Show preview UI/modal here
    alert('Previewing email campaign...');
  }

  sendCampaign() {
    const selectedContent = this.emailContents.filter(c => c.selected);
    this.campaignSent.emit({ ...this.form, selectedContent });
    this.close.emit();
  }
}
