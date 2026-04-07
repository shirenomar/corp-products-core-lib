import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CORE_CONFIG, CoreConfig } from '../core-config';
import { AuthService } from '../services';

export const authGuard: CanActivateFn = () => {
  const appConfig = inject<CoreConfig>(CORE_CONFIG);
  const authService = inject(AuthService);

  if (!authService.isLoggedIn()) {
    window.location.href = appConfig.loginUrl;
    return false;
  }

  return true;
};
