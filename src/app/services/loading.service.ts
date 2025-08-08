import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingState = signal(false);
  private loadingMessageState = signal('Loading...');

  public isLoading = this.loadingState.asReadonly();
  public loadingMessage = this.loadingMessageState.asReadonly();

  show(message: string = 'Loading...') {
    this.loadingMessageState.set(message);
    this.loadingState.set(true);
  }

  hide() {
    this.loadingState.set(false);
  }
}
