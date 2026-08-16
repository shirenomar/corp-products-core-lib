import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";

export function initializeAuth() {
  const authService = inject(AuthService);
  return () => authService.getCurrentUser();
}
