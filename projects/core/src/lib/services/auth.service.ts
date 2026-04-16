import { inject, Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CookiesStorageKeys, LocalStorageKeys } from '../handlers/stortage';
import { CORE_CONFIG, CoreConfig } from '../core-config';
import { BaseHttpService, HttpConfig } from './base-http-service';
import { StorageService } from '../services';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseHttpService {
  public isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  private storageService = inject(StorageService);
  private userService = inject(UserService);

  constructor(@Inject(CORE_CONFIG) protected appConfig: CoreConfig) {
    super();
    this.isUserLoggedIn$.next(this.isLoggedIn());
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

  isUserExists(): boolean {
    return !!this.userService.userData();
  }

  getUserToken(): string | null {
    return this.storageService.cookies.get(CookiesStorageKeys.AUTHORIZATION);
  }

  setUserToken(token?: string) {
    return this.storageService.local.set(LocalStorageKeys.TOKEN, token);
  }

  logoutFromSSO() {
    const logoutUrl = this.appConfig.logoutEndpoint;
    return this.single<unknown>('', {
      urlRewrite: logoutUrl,
    });
  }

  clearAuth() {
    this.storageService.local.clear();
    this.storageService.session.clear();
    this.storageService.cookies.clear(CookiesStorageKeys.AUTHORIZATION);
    this.isUserLoggedIn$.next(false);
    window.location.href = this.appConfig.loginUrl;
  }
}
