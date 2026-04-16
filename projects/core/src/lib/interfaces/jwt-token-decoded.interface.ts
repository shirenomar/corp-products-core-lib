import { JwtPayload } from "jwt-decode";
import { UserProfileData } from "./user-profile-data";
export interface JWTDecoded extends JwtPayload {
  permissions: string[];
  roles: string[];
  profile: UserProfileData;
}
