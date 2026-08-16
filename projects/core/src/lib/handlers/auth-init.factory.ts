import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";

export function initializeAuth(loginUrl: string) {
  const authService = inject(AuthService);
  return () => authService.getCurrentUser(loginUrl);
}
