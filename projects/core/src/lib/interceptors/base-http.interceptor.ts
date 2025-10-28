import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import { catchError, finalize, Observable, switchMap, tap, throwError } from 'rxjs';
import { IS_SYSTEM_LOADER } from '../handlers/http-context-handler';
import { LoaderService } from '../services/loader.service';
import { CORE_CONFIG, CoreConfig } from '../core-config';
import { REQUEST_MODIFIER } from '../request-modifier';
import { APP_ERROR_HANDLER } from '../error-config';

@Injectable()
export class HttpBaseInterceptor implements HttpInterceptor {
  loaderService = inject(LoaderService);

  constructor(
    @Inject(CORE_CONFIG) protected appConfig: CoreConfig,
    @Inject(REQUEST_MODIFIER) protected requestModifier: (req: HttpRequest<any>) => HttpRequest<any>,
    @Inject(APP_ERROR_HANDLER) private appErrorHandler: (error: any) => Observable<any>
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('interceptor', this.appConfig);
    request = this.requestModifier(request);
    // Handle loader
    const IS_SYSTEM_LOADER_CHECK = request.context.get(IS_SYSTEM_LOADER);
    this.loaderService.setLoading(true, IS_SYSTEM_LOADER_CHECK, request.url);
    return next.handle(request).pipe(
       catchError((err: HttpErrorResponse) => {
        if (!this.appErrorHandler) return throwError(() => err);
        return this.appErrorHandler(err).pipe(
          switchMap((shouldRetry: boolean) => {
            if (shouldRetry) {
              return next.handle(request);
            }
            return throwError(() => err);
          })
        );
      }),
      finalize(() => this.loaderService.setLoading(false, IS_SYSTEM_LOADER_CHECK, request.url))
    );
  }
}
