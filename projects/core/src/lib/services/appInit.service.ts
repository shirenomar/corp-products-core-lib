import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, map, Observable, of } from 'rxjs';
import { CORE_CONFIG, CoreConfig } from '../core-config';
import { UserService } from './user.service';
import { JWTDecoded } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class AppInitService {
  private http = inject(HttpClient);
  private appConfig = inject<CoreConfig>(CORE_CONFIG);
  private userService = inject(UserService);
  initializeApp(): Observable<boolean> {
    return this.http.get<{ payload: JWTDecoded }>(this.appConfig.introspection).pipe(
      tap((response) => {
        console.log(response.payload);
        this.userService.user = response.payload;
      }),
      map(() => true),
      catchError((error) => {
        console.error('App init failed', error);
        return of(false);
      })
    );
  }
}
