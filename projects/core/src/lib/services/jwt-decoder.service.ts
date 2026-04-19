import { inject, Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { AuthService } from "./auth.service";
import { JWTDecoded } from "../interfaces/jwt-token-decoded.interface";


@Injectable({
  providedIn: "root"
})
export class JwtDecoderService {
  private authService = inject(AuthService);
  public decodedToken: JWTDecoded | null = null;

  public decodeToken(): JWTDecoded | null {
    const token = this.authService.getUserToken();
    if (!token) return null;

    try {
      this.decodedToken = jwtDecode<JWTDecoded>(token);
      return this.decodedToken;
    } catch (err) {
      console.error("Failed to decode token:", err);
      return null;
    }
  }
}
