import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_HTTP_CONFIG } from '../interceptors';
import { BaseHttpService, HttpConfig } from './base-http-service';

@Injectable({
  providedIn: 'root'
})
export class ListOfValues extends BaseHttpService {
  override setApiConfig(): HttpConfig {
    return {
      microServiceUrl: APP_HTTP_CONFIG.LOV_BASE_URL,
      apiUrl: "lookups"
    };
  }

  getRolesByGroup<T>(group: string): Observable<T> {
    return this.getAll<T>({
      urlPostfix: group
    });
  }
}
