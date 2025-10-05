import { InjectionToken } from "@angular/core";
import { ToasterOptions } from "./interfaces";

export interface CoreConfig {
  apiPrefix: string;
  production: boolean;
  gatewayUrl: string;
  loginUrl: string;
  logoutEndpoint: string;
}

export const CORE_CONFIG = new InjectionToken<CoreConfig>("CoreConfig");


export interface ToasterInterface {
  success(options:ToasterOptions): void;
  error(options:ToasterOptions): void;
  warning(options:ToasterOptions): void;
  info(options:ToasterOptions): void;
}
export const TOASTER_SERVICE = new InjectionToken<ToasterInterface>("ToasterService");
