import { Inject, inject, Injectable, InjectionToken } from '@angular/core';
import {
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { HttpContextHandler } from '../handlers/http-context-handler';
import {
  catchError,
  from,
  identity,
  map,
  mergeMap,
  Observable,
  of,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { BaseHttpResponse, BaseHttpService, HttpConfig } from './base-http-service';
import { AuthService } from './auth.service';
import {
  Attachment,
  AttachmentStatusDisplay,
  UploadStatusConfigMap,
} from '../models/attachment.interface';
import { APP_FILES_CONFIG } from '../app-files-config';
import { UploadStatus } from '../enums/upload-status.enum';

export const UPLOAD_STATUS_CONFIG = new InjectionToken<UploadStatusConfigMap>(
  'UPLOAD_STATUS_CONFIG',
);
@Injectable({
  providedIn: 'root',
})
export class AppFilesService extends BaseHttpService {
  authService = inject(AuthService);
  private config = inject(APP_FILES_CONFIG);
  override setApiConfig(): HttpConfig {
    return {
      microServiceUrl: this.config.uploadUrl,
    };
  }

  constructor(@Inject(UPLOAD_STATUS_CONFIG) protected uploadStatusConfig: UploadStatusConfigMap) {
    super();
  }

  download(
    url: string,
    attachmentIds: string[],
    fileName?: string,
    previewOnly = false,
  ): Observable<Blob> {
    const body = { attachmentIds };
    return this.add<HttpResponse<Blob>>(body, {
      urlPostfix: url,
      responseType: 'blob',
      observe: 'response',
    }).pipe(
      tap((response) => {
        if (response.body && !previewOnly) {
          const headerFileName = this.extractFileNameFromHeaders(response.headers) ?? 'file';
          this.triggerBrowserDownload(response.body, fileName ?? headerFileName);
        }
      }),
      map((response) => response.body!),
    );
  }

  upload<TResponse = unknown>(
    file: File,
    url: string,
  ): Observable<HttpEvent<BaseHttpResponse<TResponse>>> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.add<HttpEvent<BaseHttpResponse<TResponse>>>(formData, {
      context: HttpContextHandler.setLoaderType(false),
      urlPostfix: url,
      reportProgress: true,
      observe: 'events',
    });
  }

  uploadMultiple<TResponse = unknown>(
    files: File[],
    url: string,
    maxConcurrent = 10,
    destroy$?: Subject<void>,
  ): Observable<Attachment> {
    return from(files).pipe(
      mergeMap(
        (file) =>
          this.upload<TResponse>(file, url).pipe(
            map((event) => this.mapHttpEventToAttachment(file, event)),
            catchError(() => of(this.createAttachment(file, UploadStatus.FAILED))),
          ),
        maxConcurrent,
      ),
      destroy$ ? takeUntil(destroy$) : identity,
    );
  }

  export(
    exportFilter: Record<string, string[]> | HttpParams,
    urlPostfix: string,
    fileName: string,
    type: string = 'pdf',
    downloaded = true,
  ): Observable<Blob> {
    return this.getAll<Blob>({
      urlPostfix,
      params: exportFilter,
      responseType: 'blob',
    }).pipe(
      tap((response) => {
        if (downloaded) {
          const blob = new Blob([response], { type: `application/${type}` });
          this.triggerBrowserDownload(blob, fileName);
        }
      }),
    );
  }

  downloadFile(fileData: { content: Blob; type: string; fileName: string }): void {
    const blob = new Blob([fileData.content], { type: fileData.type });
    this.triggerBrowserDownload(blob, fileData.fileName);
  }

  createAttachment(
    file: File,
    uploadStatus: UploadStatus,
    progress: number = 0,
    serverResponse?: unknown,
  ): Attachment {
    return {
      nameFile: file.name,
      size: file.size,
      file,
      uploadStatus,
      status: this.buildStatusDisplay(uploadStatus, progress),
      serverResponse,
    };
  }

  private mapHttpEventToAttachment<TResponse>(
    file: File,
    event: HttpEvent<BaseHttpResponse<TResponse>>,
  ): Attachment {
    switch (event.type) {
      case HttpEventType.UploadProgress: {
        const progress = this.calculateProgress(event.loaded, event.total);
        return this.createAttachment(file, UploadStatus.UPLOADING, progress);
      }

      case HttpEventType.Response: {
        const response = event.body?.payload;
        const serverPayload = response as Record<string, unknown> | undefined;
        const baseAttachment = this.createAttachment(file, UploadStatus.SUCCESS, 100);
        return {
          ...baseAttachment,
          id: serverPayload?.['id'] as string | undefined,
          serverResponse: response,
        };
      }

      default:
        return this.createAttachment(file, UploadStatus.PENDING);
    }
  }

  private calculateProgress(loaded: number, total?: number): number {
    return total ? Math.round((100 * loaded) / total) : 0;
  }

  private buildStatusDisplay(
    uploadStatus: UploadStatus,
    progress?: number,
  ): AttachmentStatusDisplay {
    const config = this.uploadStatusConfig.get(uploadStatus);

    return {
      ...config,
      percentage: progress,
    } as AttachmentStatusDisplay;
  }

  // get filename from response headers
  private extractFileNameFromHeaders(headers: HttpHeaders): string | null {
    const contentDisposition = headers.get('content-disposition');
    if (!contentDisposition) return null;

    const filenamePart = contentDisposition
      .split(';')
      .map((part) => part.trim())
      .find(
        (part) =>
          part.toLowerCase().startsWith('filename=') || part.toLowerCase().startsWith('filename*='),
      );

    if (!filenamePart) return null;

    let filename = filenamePart.split('=')[1]?.trim();
    if (!filename) return null;

    // Handle RFC5987 encoding
    if (filename.toLowerCase().startsWith("utf-8''")) {
      filename = decodeURIComponent(filename.substring(7));
    }

    // Strip quotes
    filename = filename.replace(/^"|"$/g, '');
    return filename;
  }

  triggerBrowserDownload(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }
}
