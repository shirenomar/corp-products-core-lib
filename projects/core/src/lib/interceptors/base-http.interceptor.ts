import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Inject, inject, Injectable } from "@angular/core";
import { finalize, Observable, tap } from "rxjs";
import { IS_SYSTEM_LOADER, USE_API_PREFIX } from "../handlers/http-context-handler";
import { AuthService } from "../services/auth.service";
import { LoaderService } from "../services/loader.service";
import { CORE_CONFIG, CoreConfig } from "../core-config";

@Injectable()
export class HttpBaseInterceptor implements HttpInterceptor {
  authService = inject(AuthService);
  loaderService = inject(LoaderService);

  constructor(@Inject(CORE_CONFIG) protected appConfig: CoreConfig) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log("interceptor", this.appConfig);
    const useApiPrefix = request.context.get(USE_API_PREFIX);
    const URL = `${this.appConfig.gatewayUrl}${useApiPrefix ? this.appConfig.apiPrefix : ""}${request.url}`;
    const token = this.authService.getUserToken();

    const defaultHeader: any = {
      Authorization: `Bearer ${token}`,
      Language: "en"
    };

    //Handel Headers
    for (const key in defaultHeader) {
      request = request.clone({
        setHeaders: { [key]: request.headers.get(key) ? request.headers.get(key) : defaultHeader[key] }
      });
    }

    // Clone the request
    request = request.clone({
      url: URL
    });

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
