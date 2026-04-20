import { inject, Injectable, signal, computed } from "@angular/core";
import { JWTDecoded } from "../interfaces/jwt-token-decoded.interface";
import { HttpClient } from "@angular/common/http";
import { CORE_CONFIG, CoreConfig } from "../core-config";
import { catchError, of, tap } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class UserService {
  private http = inject(HttpClient);
  private appConfig = inject<CoreConfig>(CORE_CONFIG);

  private _user = signal<JWTDecoded | null>(null);

  public userData = computed(() => this._user());

  getUserDataAsJWTDecoded() {
    return this.http.get<{ payload: JWTDecoded }>(this.appConfig.introspection).pipe(
      tap((response) => {
        this._user.set(response.payload);
      }),
      catchError((error) => {
        console.error('App init failed', error);
        this._user.set(null);
        return of(null);
      })
    );
  }
}
