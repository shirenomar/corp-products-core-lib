import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, retry, timer } from 'rxjs';

export class GlobalHttpErrorInterceptor implements HttpInterceptor {
  // check if it is a server error to retry the request
  shouldRetry(error: HttpErrorResponse) {
    if (error.status >= 500) {
      return timer(1000);
    }
    throw error;
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry({
        count: 1,
        delay: this.shouldRetry
      })
    );
  }
}
