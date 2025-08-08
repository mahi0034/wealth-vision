import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loadingService.isLoading()" 
         class="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center">
      <div class="bg-white rounded-xl shadow-2xl p-8 mx-4 max-w-sm w-full text-center">
        <!-- Animated Spinner -->
        <div class="flex justify-center mb-6">
          <div class="relative">
            <div class="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
            <div class="w-16 h-16 border-4 border-blue-600 rounded-full animate-spin absolute top-0 left-0 border-r-transparent border-t-transparent"></div>
          </div>
        </div>
        
        <!-- Loading Text -->
        <div class="space-y-2">
          <h3 class="text-lg font-semibold text-gray-800">{{ loadingService.loadingMessage() }}</h3>
          <p class="text-sm text-gray-500">Please wait...</p>
        </div>
        
        <!-- Progress Dots -->
        <div class="flex justify-center mt-4 space-x-1">
          <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0ms;"></div>
          <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 150ms;"></div>
          <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 300ms;"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-bounce {
      animation: bounce 1.4s infinite;
    }
    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% {
        transform: translateY(0);
      }
      40%, 43% {
        transform: translateY(-8px);
      }
      70% {
        transform: translateY(-4px);
      }
      90% {
        transform: translateY(-2px);
      }
    }
  `]
})
export class LoadingOverlayComponent {
  loadingService = inject(LoadingService);
}
