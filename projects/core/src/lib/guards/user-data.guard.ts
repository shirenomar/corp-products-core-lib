import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from '../services';
import { map, catchError, of } from 'rxjs';

export const authUserDataGuard: CanActivateFn = () => {
  const userService = inject(UserService);

  if (userService.userData()) {
    return true;
  }

  return userService.getUserDataAsJWTDecoded().pipe(
    map(() => true),
    catchError(() => {
      return of(false);
    })
  );
};
