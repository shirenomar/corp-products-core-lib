import { InjectionToken } from '@angular/core';

export interface AppFilesConfig {
  uploadUrl: string;
  maxFileSize?: number;
  allowedTypes?: string[];
}

export const APP_FILES_CONFIG = new InjectionToken<AppFilesConfig>('APP_FILES_CONFIG');
