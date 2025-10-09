import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { StorageHandler } from '../handlers/storage-handler';
import { CookieService } from 'ngx-cookie-service';
import { CORE_CONFIG, CoreConfig } from '../core-config';
import { CookiesStorageKeys } from '../handlers';

export const authGuard: CanActivateFn = () => {
  const appConfig = inject<CoreConfig>(CORE_CONFIG);
  const cookieService = inject(CookieService);
  StorageHandler.init(cookieService);
  const token: string | null = StorageHandler.cookies.get(CookiesStorageKeys.AUTHORIZATION);

  if (!token) {
    window.location.href = appConfig.loginUrl;
    return false;
  }

  return true;
};
