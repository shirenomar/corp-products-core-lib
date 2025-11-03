import { InjectionToken } from '@angular/core';

export const APP_ERROR_HANDLER = new InjectionToken<(error: any) => void>(
  'APP_ERROR_HANDLER',
  {
    factory: () => (error: any) => {
      console.warn('No APP_ERROR_HANDLER provided', error);
    },
  }
);
