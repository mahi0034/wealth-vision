import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private loadingService = inject(LoadingService);
  private activeRequests = 0;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Don't show loading for certain requests (optional)
    if (this.shouldSkipLoading(req)) {
      return next.handle(req);
    }

    // Increment active requests and show loading
    this.activeRequests++;
    this.loadingService.show('Loading...');

    return next.handle(req).pipe(
      finalize(() => {
        // Decrement active requests and hide loading when no more requests
        this.activeRequests--;
        if (this.activeRequests <= 0) {
          this.activeRequests = 0;
          this.loadingService.hide();
        }
      })
    );
  }

  private shouldSkipLoading(req: HttpRequest<any>): boolean {
    // Skip loading for certain URLs if needed
    // return req.url.includes('/skip-loading');
    return false;
  }
}
