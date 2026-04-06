import { inject, Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { CookiesStorageKeys, LocalStorageKeys } from '../handlers/stortage';
import { CORE_CONFIG, CoreConfig } from '../core-config';
import { BaseHttpService, HttpConfig } from './base-http-service';
import { JwtDecoderService, StorageService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseHttpService {
  public isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  private storageService = inject(StorageService);
  private readonly jwtDecoderService = inject(JwtDecoderService);

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
      this.storageService.cookies.set(CookiesStorageKeys.AUTHORIZATION, token);
      window.location.search = '';
    }
    this.jwtDecoderService.decodeToken();
  }

  setUserAuthentication(): Observable<any> {
    return this.single<any>("", { urlRewrite: "user/token" }).pipe(tap((token)=> {
      this.storageService.cookies.set(CookiesStorageKeys.AUTHORIZATION, token);
      this.jwtDecoderService.decodeToken();
    }));
  }

  setLocalAuthentication(token?: string): Observable<any> {
    token && this.storageService.local.set(LocalStorageKeys.TOKEN, token);
    return of(token);
  }

  isLoggedIn(): boolean {
    return !!this.getUserToken();
  }

  getUserToken(): string | null {
    return this.storageService.cookies.get(CookiesStorageKeys.AUTHORIZATION) ||
      this.storageService.local.get(LocalStorageKeys.TOKEN);
  }

  logoutFromSSO() {
    const logoutUrl = this.appConfig.logoutEndpoint;
    return this.single<unknown>('', {
      urlRewrite: logoutUrl,
    });
  }

  logout() {
    this.clearStorage();
    window.location.href = this.appConfig.logoutEndpoint;
  }

  clearStorage() {
    this.storageService.local.clear();
    this.storageService.session.clear();
    this.storageService.cookies.clear(CookiesStorageKeys.AUTHORIZATION);
    this.isUserLoggedIn$.next(false);
  }

  clearAuth() {
    this.clearStorage();
    window.location.href = this.appConfig.loginUrl;
  }

}
