import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageHandler } from '../handlers/storage-handler';
import { LocalStorageKeys } from '../handlers/stortage';
import { CORE_CONFIG, CoreConfig } from '../core-config';
import { BaseHttpService, HttpConfig } from './base-http-service';

export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseHttpService {
  public isUserLoggedIn$ = new BehaviorSubject(this.isLoggedIn());

  constructor(@Inject(CORE_CONFIG) protected appConfig: CoreConfig) {
    super();
  }
  override setApiConfig(): HttpConfig {
    return {
      apiUrl: '',
      microServiceUrl: '',
    };
  }

  initAuthentication() {
    const token: string | null = new URLSearchParams(window.location.search).get('token');
    if (token) {
      this.setAuthentication(token);
      window.location.search = '';
    }
  }

  setAuthentication(token: string) {
    this.isUserLoggedIn$.next(true);
    this.setUserToken(token);
  }

  isLoggedIn(): boolean {
    return !!this.getUserToken();
  }

  getUserToken(): string | null {
    // return StorageHandler.local.get(LocalStorageKeys.TOKEN);
    return getCookie('Authorization');
  }

  setUserToken(token?: string) {
    return StorageHandler.local.set(LocalStorageKeys.TOKEN, token);
  }

  logoutFromSSO() {
    const logoutUrl = this.appConfig.logoutEndpoint;
    return this.single<unknown>('', {
      urlRewrite: logoutUrl,
    });
  }

  clearAuth() {
    StorageHandler.local.clear();
    StorageHandler.session.clear();
    this.isUserLoggedIn$.next(false);
    window.location.href = this.appConfig.loginUrl;
  }
}
