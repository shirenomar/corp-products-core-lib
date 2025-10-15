import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import { finalize, Observable, tap } from 'rxjs';
import { IS_SYSTEM_LOADER, USE_API_PREFIX } from '../handlers/http-context-handler';
import { LoaderService } from '../services/loader.service';
import { CORE_CONFIG, CoreConfig } from '../core-config';
import { REQUEST_MODIFIER } from '../request-modifier';

@Injectable()
export class HttpBaseInterceptor implements HttpInterceptor {
  loaderService = inject(LoaderService);

  constructor(
    @Inject(CORE_CONFIG) protected appConfig: CoreConfig,
    @Inject(REQUEST_MODIFIER) protected requestModifier: (req: HttpRequest<any>) => HttpRequest<any>
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('interceptor', this.appConfig);
    request = this.requestModifier(request);

    // Handle loader
    const IS_SYSTEM_LOADER_CHECK = request.context.get(IS_SYSTEM_LOADER);
    this.loaderService.setLoading(true, IS_SYSTEM_LOADER_CHECK, request.url);

    return next.handle(request).pipe(
      // Handler Token
      tap((event) => {
        //  if (event instanceof HttpResponse && request.url.includes(User_Token)) {
        // Set user token ..
        //  }
      }),
      finalize(() => this.loaderService.setLoading(false, IS_SYSTEM_LOADER_CHECK, request.url))
    );
  }
}
