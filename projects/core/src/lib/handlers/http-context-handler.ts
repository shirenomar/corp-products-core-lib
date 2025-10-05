import { HttpContext, HttpContextToken } from "@angular/common/http";

export const IS_SYSTEM_LOADER = new HttpContextToken<boolean>(() => true); // set default loader
export const USE_API_PREFIX = new HttpContextToken<boolean>(() => true); // set default loader

export class HttpContextHandler {
  static setLoaderType(isSystemLoader: boolean) {
    return new HttpContext().set(IS_SYSTEM_LOADER, isSystemLoader);
  }

  static useApiPrefix(hasBaseSegment: boolean) {
    return new HttpContext().set(USE_API_PREFIX, hasBaseSegment);
  }
}
