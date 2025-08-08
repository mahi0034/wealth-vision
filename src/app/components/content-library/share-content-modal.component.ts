import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ClientOption {
  id: string;
  name: string;
  riskProfile: string;
  checked: boolean;
}

@Component({
  selector: 'app-share-content-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="show" class="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-auto">
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-xl font-semibold">Share Content</h2>
              <p class="text-sm text-gray-600">Share "{{contentTitle}}" with clients</p>
            </div>
            <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>

          <!-- Share Methods -->
          <h3 class="font-medium mb-2">Share Method</h3>
          <div class="grid grid-cols-2 gap-4 mb-6">
            <button 
              (click)="method='email'"
              [class.border-blue-600]="method==='email'"
              class="p-4 border rounded-lg flex flex-col items-center">
              📧  
              <span class="mt-2">Email</span>
            </button>
            <button 
              (click)="method='link'"
              [class.border-blue-600]="method==='link'"
              class="p-4 border rounded-lg flex flex-col items-center">
              🔗  
              <span class="mt-2">Shareable Link</span>
            </button>
            <button 
              (click)="method='pdf'"
              [class.border-blue-600]="method==='pdf'"
              class="p-4 border rounded-lg flex flex-col items-center">
              📄  
              <span class="mt-2">PDF Export</span>
            </button>
            <button 
              (click)="method='presentation'"
              [class.border-blue-600]="method==='presentation'"
              class="p-4 border rounded-lg flex flex-col items-center">
              📊  
              <span class="mt-2">Presentation</span>
            </button>
          </div>

          <!-- Conditional Link Field -->
          <div *ngIf="method==='link'" class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Shareable Link</label>
            <div class="flex space-x-2">
              <input 
                type="text" 
                [value]="shareUrl" 
                readonly
                class="flex-1 p-2 border rounded-lg bg-gray-100 text-sm">
              <button (click)="copyLink()" class="px-3 bg-blue-600 text-white rounded">Copy Link</button>
            </div>
          </div>

          <!-- Options -->
          <div class="mb-6 border-t pt-4">
            <label class="flex items-center space-x-2 mb-2">
              <input type="checkbox" [(ngModel)]="trackView" class="accent-blue-600">
              <span class="text-sm">Track viewing analytics</span>
            </label>
            <label class="flex items-center space-x-2 mb-2">
              <input type="checkbox" [(ngModel)]="allowComments" class="accent-blue-600">
              <span class="text-sm">Allow client comments</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="checkbox" [(ngModel)]="includeBranding" class="accent-blue-600">
              <span class="text-sm">Include advisor branding</span>
            </label>
          </div>

          <!-- Client Selection -->
          <div class="mb-6 border-t pt-4">
            <h3 class="font-medium mb-2">Share with specific clients (optional)</h3>
            <div class="space-y-2">
              <label *ngFor="let c of clients" class="flex items-center space-x-2">
                <input type="checkbox" [(ngModel)]="c.checked" class="accent-blue-600">
                <span class="text-sm">{{c.name}} ({{c.riskProfile}})</span>
              </label>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex justify-end space-x-3 border-t pt-4">
            <button (click)="close.emit()" class="px-4 py-2 bg-white border rounded">Cancel</button>
            <button (click)="share()" class="px-4 py-2 bg-blue-600 text-white rounded">Share Content</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    button.border-blue-600 { border-width: 2px; }
  `]
})
export class ShareContentModalComponent {
  @Input() show = false;
  @Input() contentTitle = '';
  @Input() shareUrl = 'https://wealthvision.com/share/abc123';
  @Input() clients: ClientOption[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() shareConfirmed = new EventEmitter<{method:string, clients:string[], options:any}>();

  method: 'email'|'link'|'pdf'|'presentation' = 'email';
  trackView = true;
  allowComments = false;
  includeBranding = true;

  copyLink() {
    navigator.clipboard.writeText(this.shareUrl);
  }

  share() {
    const selectedClients = this.clients.filter(c=>c.checked).map(c=>c.id);
    this.shareConfirmed.emit({
      method: this.method,
      clients: selectedClients,
      options: {
        trackView: this.trackView,
        allowComments: this.allowComments,
        includeBranding: this.includeBranding
      }
    });
    this.close.emit();
  }
}
