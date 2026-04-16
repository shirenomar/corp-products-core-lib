import { Injectable } from "@angular/core";
import { JWTDecoded } from "../interfaces/jwt-token-decoded.interface";


@Injectable({
  providedIn: "root"
})
export class UserService {
  public user: JWTDecoded | null = null;

  public userData(): JWTDecoded | null {
    if(!this.user){
      return null;
    }
    return this.user;
  }
}
