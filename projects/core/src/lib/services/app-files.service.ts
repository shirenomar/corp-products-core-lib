import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpParams } from '@angular/common/http';
import { HttpContextHandler } from '../handlers/http-context-handler';
import { Observable, tap } from 'rxjs';
import { BaseHttpResponse, BaseHttpService, HttpConfig } from './base-http-service';
import { AuthService } from './auth.service';
import { Attachment } from '../models/attachment.interface';

export const API_URLS = {
  UPLOAD_FILE: 'attachment',
  DOWNLOAD_FILE: (id: string) => `attachment/${id}`,
};

@Injectable({
  providedIn: 'root',
})
export class AppFilesService extends BaseHttpService {
  authService = inject(AuthService);
  override setApiConfig(): HttpConfig {
    return {
      microServiceUrl: API_URLS.UPLOAD_FILE,
    };
  }

  download(url: string, fileName: string): Observable<Blob> {
    return this.getAll<Blob>({ urlRewrite: url, responseType: 'blob' }).pipe(
      tap((blob) => {
        const objectURL = URL.createObjectURL(blob);
        const anchorTag = document.createElement('a');
        anchorTag.href = objectURL;
        anchorTag.download = fileName;
        document.body.appendChild(anchorTag);
        anchorTag.click();
        document.body.removeChild(anchorTag);
      })
    );
  }

  uploadFile(formData: FormData) {
    return this.add<HttpEvent<BaseHttpResponse<Attachment>>>(formData, {
      context: HttpContextHandler.setLoaderType(false),
      reportProgress: true,
      observe: 'events',
    });
  }

  export(
    exportFilter: { [key: string]: string[] } | HttpParams,
    urlRewrite: string,
    fileName: string,
    type: string = 'pdf'
  ) {
    return this.getAll<Blob>({
      urlRewrite,
      params: exportFilter,
      responseType: 'blob',
    }).pipe(
      tap((response) => {
        const blob = new Blob([response], { type: `application/${type}` });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      })
    );
  }

  downloadFile(fileData: { content: Blob; type: string; fileName: string }) {
    const blob = new Blob([fileData.content], { type: fileData.type });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileData.fileName;
    link.click();
  }
}
