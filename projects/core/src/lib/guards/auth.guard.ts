import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services';
import { StorageHandler } from '../handlers/storage-handler';
import { CookieService } from 'ngx-cookie-service';
import { CORE_CONFIG, CoreConfig } from '../core-config';

export const authGuard: CanActivateFn = () => {
  const appConfig = inject<CoreConfig>(CORE_CONFIG);
  const authService = inject(AuthService);
  const cookieService = inject(CookieService);
  const token: string | null = authService.getUserToken();

  StorageHandler.init(cookieService);
  if (!token) {
    window.location.href = appConfig.loginUrl;
    return false;
  }

  return true;
};
