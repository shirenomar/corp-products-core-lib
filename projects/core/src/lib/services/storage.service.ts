import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {
  CookiesStorageKeys,
  LocalStorageKeys,
  SessionStorageKeys,
  StorageEnum,
} from '../handlers/stortage';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private cookieService = inject(CookieService);

  public get cookies() {
    return {
      set: (key: CookiesStorageKeys, value: string, expires?: number) =>
        this.cookieService.set(key, value, expires),
      get: (key: CookiesStorageKeys) => this.cookieService.get(key),
      clear: (key: CookiesStorageKeys) => this.cookieService.delete(key),
    };
  }

  public local = {
    set: (key: LocalStorageKeys, value: unknown) =>
      this.setItem(key, value, localStorage.setItem.bind(localStorage)),
    get: <T>(key: LocalStorageKeys) =>
      this.getItem<T>(key, localStorage.getItem.bind(localStorage)),
    clear: () => localStorage.clear(),
  };

  public session = {
    set: (key: SessionStorageKeys, value: unknown) =>
      this.setItem(key, value, sessionStorage.setItem.bind(sessionStorage)),
    get: <T>(key: SessionStorageKeys) =>
      this.getItem<T>(key, sessionStorage.getItem.bind(sessionStorage)),
    clear: () => sessionStorage.clear(),
  };

  private setItem(
    key: StorageEnum,
    value: unknown,
    setFn: (k: string, v: string) => void
  ): void {
    if (!key) return;
    setFn(key as string, typeof value === 'string' ? value : JSON.stringify(value));
  }

  private getItem<T>(
    key: StorageEnum,
    getFn: (k: string) => string | null,
    withParsing = false
  ): T | null {
    const data = getFn(key as string) ?? null;
    if (data) {
      return withParsing ? (JSON.parse(data) as T) : (data as unknown as T);
    }
    return null;
  }
}
