import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { PermissionsService } from "../services";
import { RoutePermissionsInfo } from "../interfaces";

export const permissionsGuard: CanActivateFn = (route) => {
  const permissionsService = inject(PermissionsService);
  const router = inject(Router);
  const { key, action }: RoutePermissionsInfo = route.data["permissions"];

  if (!route.data["permissions"] || (route.data["permissions"] && permissionsService.routeGuardChecker(key, action))) {
    return true;
  } else {
    router.navigate(["no-access"]);
    return false;
  }
};
