import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CORE_CONFIG, CoreConfig } from '../core-config';
import { CookiesStorageKeys } from '../handlers';
import { StorageService } from '../services';

export const authGuard: CanActivateFn = () => {
  const appConfig = inject<CoreConfig>(CORE_CONFIG);
  const storageService = inject(StorageService);

  const token: string | null = storageService.cookies.get(CookiesStorageKeys.AUTHORIZATION);

  if (!token) {
    window.location.href = appConfig.loginUrl;
    return false;
  }

  return true;
};
