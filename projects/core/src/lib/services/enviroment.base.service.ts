import { Injectable } from '@angular/core';

export interface EnvironmentConfig {
  baseUrl: string;
}

@Injectable({
  providedIn: 'root', // Ensures the service is provided at the root level
})
export class EnvironmentService {
  constructor(private config: EnvironmentConfig) {}

  getApiUrl() {
    return this.config.baseUrl;
  }
}
