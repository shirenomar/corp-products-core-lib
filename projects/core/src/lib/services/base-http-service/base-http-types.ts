import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Params as RouterParams } from '@angular/router';

export interface HttpConfig {
  apiUrl?: string;
  microServiceUrl:string;
  globalMapFn?: (res: any) => any;
  methods?: ServiceConfig;
}

export type Params =
  | HttpParams
  | { [param: string]: string | string[] | unknown };
export type HttpRequestOptions = {
  headers?:
    | HttpHeaders
    | RouterParams
    | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] } | Params;
  context?: HttpContext;
  reportProgress?: boolean;
  observe?: 'events';
  responseType?: string;
};
export const HttpRequestOptionsKeys: Array<keyof Required<HttpRequestOptions>> =
  ['headers', 'params', 'context', 'reportProgress', 'observe', 'responseType'];

export type HttpOptions<T = any> = HttpRequestOptions & {
  urlRewrite?: string;
  urlPostfix?: string;
  mapFn?: (res: any) => T;
};

export interface ServiceConfig {
  single?: HttpOptions;
  getAll?: HttpOptions;
  add?: HttpOptions;
  update?: HttpOptions;
  delete?: HttpOptions;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
