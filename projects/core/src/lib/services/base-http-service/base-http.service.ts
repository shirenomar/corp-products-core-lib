import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpConfig, HttpOptions, ServiceConfig } from './base-http-types';
import { epmDefaultMapper, extractRequestOptions, mapResponse, resolveUrl } from './base-http-utils';

export abstract class BaseHttpService {
  private readonly http: HttpClient = inject(HttpClient);

  get url(): string {
    const { apiUrl,microServiceUrl } = this.setApiConfig();
    return `${microServiceUrl}${apiUrl ? `/${apiUrl}` : ''}`;
  }

  get methodsConfig(): ServiceConfig | undefined {
    const { methods } = this.setApiConfig();
    return methods;
  }

  get globalMapFn(): (res: any) => any {
    const { globalMapFn } = this.setApiConfig();
    return globalMapFn || epmDefaultMapper;
  }

  abstract setApiConfig(): HttpConfig;

  single<T>(id: string | number, options?: HttpOptions): Observable<T> {
    const activeOptions = options || this.getMethodConfig('single');
    const url = resolveUrl(this.url, activeOptions, id?.toString());
    const requestOptions = extractRequestOptions(activeOptions);

    return this.http
      .get<T>(url, requestOptions)
      .pipe(mapResponse(this.getMapFun(activeOptions)));
  }

  getAll<T>(options?: HttpOptions): Observable<T> {
    const activeOptions = options || this.getMethodConfig('getAll');
    const url = resolveUrl(this.url, activeOptions);
    const requestOptions = extractRequestOptions(activeOptions);

    return this.http
      .get<T>(url, requestOptions)
      .pipe(mapResponse(this.getMapFun(activeOptions)));
  }

  add<T>(body: unknown, options?: HttpOptions): Observable<T> {
    const activeOptions = options || this.getMethodConfig('add');
    const url = resolveUrl(this.url, activeOptions);
    const requestOptions = { ...extractRequestOptions(activeOptions) };

    return this.http
      .post<T>(url, body, requestOptions)
      .pipe(mapResponse(this.getMapFun(activeOptions)));
  }

  update<T>(
    id: string | number,
    body: unknown,
    options?: HttpOptions
  ): Observable<T> {
    const activeOptions = options || this.getMethodConfig('update');
    const url = resolveUrl(this.url, activeOptions, id?.toString());
    const requestOptions = { ...extractRequestOptions(activeOptions) };

    return this.http
      .put<T>(url, body, requestOptions)
      .pipe(mapResponse(this.getMapFun(activeOptions)));
  }

  delete<T>(id: string | number, options?: HttpOptions): Observable<T> {
    const activeOptions = options || this.getMethodConfig('delete');
    const url = resolveUrl(this.url, activeOptions, id?.toString());
    const requestOptions = extractRequestOptions(activeOptions);

    return this.http
      .delete<T>(url, requestOptions)
      .pipe(mapResponse(this.getMapFun(activeOptions)));
  }

  protected getMethodConfig(method: keyof ServiceConfig): any {
    return this.methodsConfig ? this.methodsConfig[method] : undefined;
  }

  protected getMapFun(options?: HttpOptions) {
    const getMapFunObj = {
      default: { mapFn: epmDefaultMapper },
      custom: { mapFn: this.globalMapFn },
    };

    if (
      options &&
      (options?.reportProgress || options?.responseType === 'blob')
    ) {
      return { mapFn: (res: unknown) => res };
    }

    if (options && options?.mapFn) {
      return { mapFn: options.mapFn };
    }

    const isGlobalMapFnValid =
      this.globalMapFn && typeof this.globalMapFn === 'function';
    return isGlobalMapFnValid ? getMapFunObj.custom : getMapFunObj.default;
  }
}
