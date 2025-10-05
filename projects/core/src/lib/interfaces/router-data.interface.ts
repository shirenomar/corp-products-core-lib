import { Route } from "@angular/router";
import {PermissionsActions, UserPermissionsEnum} from "../enums";

export interface RouteData {
  breadcrumb?: ((data: RouteData) => string) | string;
  showBreadcrumb?: boolean;
  isClickableInBreadcrumb?: boolean;
  permissions?: RoutePermissionsInfo;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
export interface RoutePermissionsInfo {
  key: UserPermissionsEnum;
  action: PermissionsActions;
}
export interface AppRoute extends Route {
  data?: RouteData;
  children?: AppRoute[];
}
