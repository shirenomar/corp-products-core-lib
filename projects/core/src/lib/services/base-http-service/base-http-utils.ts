import { map } from "rxjs/operators";
import { HttpOptions, HttpRequestOptionsKeys } from "./base-http-types";
import { BaseHttpResponse } from "./base-http-response";

export const resolveUrl = (baseUrl: string, options?: HttpOptions, ...args: string[]): string => {
  const { urlRewrite, urlPostfix } = options || {};

  if (urlRewrite) {
    return urlRewrite;
  }

  let result = baseUrl;

  if (args && args.length > 0 && args[0] !== "") {
    result += `/${args.join("/")}`;
  }

  if (urlPostfix) {
    result += `/${urlPostfix}`;
  }

  return result;
};

export const extractRequestOptions = (options?: any) => {
  if (!options || typeof options !== "object") {
    return {};
  }
  /* eslint-disable */
  return HttpRequestOptionsKeys.reduce((requestOptions: any, key) => {
    const value = options[key];

    if (value !== undefined) {
      requestOptions[key] = value;
    }

    return requestOptions;
  }, {});
};

export const mapResponse = <T>(options?: HttpOptions) => map((res: T) => (options?.mapFn ? options.mapFn(res) : res));

export const epmDefaultMapper = <T>(res: BaseHttpResponse<T>) => res.payload;
