import { inject, Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { AuthService } from "./auth.service";
import { JWTDecoded } from "../interfaces/jwt-token-decoded.interface";

@Injectable({
  providedIn: "root"
})
export class JwtDecoderService {
  authService = inject(AuthService);
  public decodedToken: JWTDecoded;

  constructor() {
    this.decodeToken();
  }

  public decodeToken() {
    const token: string = this.authService.getUserToken() as string;
    if (token) {
      this.decodedToken = jwtDecode(token);
    }
  }
}
