import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import { catchError, finalize, Observable, switchMap, throwError, from, mergeMap } from 'rxjs';
import { IS_SYSTEM_LOADER } from '../handlers/http-context-handler';
import { LoaderService } from '../services/loader.service';
import { CORE_CONFIG, CoreConfig } from '../core-config';
import { REQUEST_MODIFIER } from '../request-modifier';
import { APP_ERROR_HANDLER } from '../error-config';
import { ErrorCode } from '../enums/error-code.enum';

@Injectable()
export class HttpBaseInterceptor implements HttpInterceptor {
  isRefreshTokenCalled = false;
  pendingRequests: { req: HttpRequest<any>; next: HttpHandler }[] = [];
  loaderService = inject(LoaderService);

  constructor(
    @Inject(CORE_CONFIG) protected appConfig: CoreConfig,
    @Inject(REQUEST_MODIFIER)
    protected requestModifier: (req: HttpRequest<any>) => HttpRequest<any>,
    @Inject(APP_ERROR_HANDLER)
    private appErrorHandler: (error: any) => Observable<any>,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    request = this.requestModifier(request);

    const IS_SYSTEM_LOADER_CHECK = request.context.get(IS_SYSTEM_LOADER);
    this.loaderService.setLoading(true, IS_SYSTEM_LOADER_CHECK, request.url);

    return next.handle(request).pipe(
      catchError((err) => {
        const errorCode = err?.error?.errors?.errorCode;

        // Only auth-expired should enter the refresh flow
        if (errorCode !== ErrorCode.JWT_EXPIRED) {
          if (errorCode === ErrorCode.UNAUTHORIZED) {
            return this.appErrorHandler(err).pipe(switchMap(() => throwError(() => err)));
          }
          return throwError(() => err);
        }

        this.pendingRequests.push({ req: request, next });

        if (!this.isRefreshTokenCalled) {
          this.isRefreshTokenCalled = true;
          return this.appErrorHandler(err).pipe(
            switchMap((shouldRetry: boolean) => {
              this.isRefreshTokenCalled = false;
              const queued = [...this.pendingRequests];
              this.pendingRequests = [];

              if (shouldRetry && queued.length > 0) {
                return from(queued).pipe(
                  mergeMap((p) => p.next.handle(p.req))
                );
              }
              return throwError(() => err);
            }),
            catchError((e) => {
              this.isRefreshTokenCalled = false;
              this.pendingRequests = [];
              return throwError(() => e);
            }),
          );
        }
        return throwError(() => err);
      }),
      finalize(() =>
        this.loaderService.setLoading(false, IS_SYSTEM_LOADER_CHECK, request.url)
      )
    );
  }
}
