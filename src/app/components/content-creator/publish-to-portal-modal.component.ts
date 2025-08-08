import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface PublishContentOption {
  id: string;
  title: string;
  createdAgo: string;
  selected: boolean;
}

@Component({
  selector: 'app-publish-to-portal-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="show" class="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-auto">
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">Publish to Portal</h2>
            <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
          </div>
          <p class="mb-5 text-gray-500 text-sm">Select content to publish to advisor portals</p>

          <form (ngSubmit)="publish()">
            <!-- Select Content to Publish -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">Select Content to Publish</label>
              <div class="space-y-3 h-32 overflow-y-auto">
                <label *ngFor="let content of contentOptions" class="flex items-center space-x-2">
                  <input type="checkbox" [(ngModel)]="content.selected" name="content-{{content.id}}" class="accent-blue-600" />
                  <span class="font-medium">{{ content.title }}</span>
                  <span class="text-xs text-gray-500">Draft • Created {{ content.createdAgo }} ago</span>
                </label>
              </div>
            </div>

            <!-- Target Portals -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">Target Portals</label>
              <div class="grid grid-cols-2 gap-4">
                <label class="flex items-center space-x-2">
                  <input type="checkbox" [(ngModel)]="targetPortals.advisorPortal" name="advisorPortal" />
                  <span>Advisor Portal</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input type="checkbox" [(ngModel)]="targetPortals.clientPortal" name="clientPortal" />
                  <span>Client Portal</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input type="checkbox" [(ngModel)]="targetPortals.mobileApp" name="mobileApp" />
                  <span>Mobile App</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input type="checkbox" [(ngModel)]="targetPortals.externalWebsite" name="externalWebsite" />
                  <span>External Website</span>
                </label>
              </div>
            </div>

            <!-- Publication Schedule -->
            <div class="mb-6 grid grid-cols-2 gap-4 items-end">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                <input type="date" [(ngModel)]="publishDate" name="publishDate" class="w-full border rounded p-2" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Publish Time</label>
                <input type="time" [(ngModel)]="publishTime" name="publishTime" class="w-full border rounded p-2" />
              </div>
            </div>

            <!-- Publishing Options -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">Publishing Options</label>
              <div class="space-y-2">
                <label class="flex items-center space-x-2"><input type="checkbox" [(ngModel)]="options.featured" name="featured" class="accent-purple-500" /><span>Mark as featured content</span></label>
                <label class="flex items-center space-x-2"><input type="checkbox" [(ngModel)]="options.pushNotifications" name="pushNotifications" class="accent-green-600" /><span>Send push notifications</span></label>
                <label class="flex items-center space-x-2"><input type="checkbox" [(ngModel)]="options.socialSharing" name="socialSharing" class="accent-blue-600" /><span>Enable social sharing</span></label>
                <label class="flex items-center space-x-2"><input type="checkbox" [(ngModel)]="options.trackMetrics" name="trackMetrics" class="accent-orange-500" /><span>Track engagement metrics</span></label>
              </div>
            </div>

            <!-- Footer Buttons -->
            <div class="flex justify-end space-x-3 pt-4 border-t">
              <button type="button" (click)="close.emit()" class="px-4 py-2 bg-white border rounded">Cancel</button>
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Publish Content</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class PublishToPortalModalComponent {
  @Input() show = false;
  @Input() contentOptions: PublishContentOption[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() portalPublish = new EventEmitter<any>();

  targetPortals = {
    advisorPortal: true,
    clientPortal: false,
    mobileApp: false,
    externalWebsite: false
  };

  publishDate = '';
  publishTime = '';

  options = {
    featured: false,
    pushNotifications: false,
    socialSharing: true,
    trackMetrics: true
  };

  publish() {
    const selectedContent = this.contentOptions.filter(c => c.selected);
    this.portalPublish.emit({
      content: selectedContent,
      targetPortals: this.targetPortals,
      publishDate: this.publishDate,
      publishTime: this.publishTime,
      options: this.options
    });
    this.close.emit();
  }
}
