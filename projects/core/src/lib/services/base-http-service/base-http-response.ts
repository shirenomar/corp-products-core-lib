export interface BaseHttpResponse<T> {
  code: number;
  errors: BaseError;
  payload: T;
  serviceTime: string;
  success: boolean;
}

interface BaseError {
  errorCode: string;
  type: string;
  timestamp: string;
  param: string[];
}
