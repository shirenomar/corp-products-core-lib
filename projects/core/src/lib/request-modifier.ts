import { InjectionToken } from '@angular/core';
import { HttpRequest } from '@angular/common/http';

export type RequestModifier = (req: HttpRequest<any>) => HttpRequest<any>;

export const REQUEST_MODIFIER = new InjectionToken<RequestModifier>('REQUEST_MODIFIER');
