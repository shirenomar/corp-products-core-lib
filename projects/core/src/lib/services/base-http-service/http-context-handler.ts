import { HttpContext, HttpContextToken } from '@angular/common/http';

export const CUSTOM_URL = new HttpContextToken<string>(()=> '');

export class HttpContextHandler {
  static setCustomUrl(url: string) {
    return new HttpContext().set(CUSTOM_URL, url);
  }
}
