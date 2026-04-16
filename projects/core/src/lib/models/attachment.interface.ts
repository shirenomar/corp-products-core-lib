import { UploadStatus } from '../enums/upload-status.enum';
export interface AttachmentStatusDisplay {
  icon: string;
  label: string;
  labelClass?: string;
  percentage?: number;
  success?: boolean;
}

export type UploadStatusConfigMap = Map<UploadStatus, AttachmentStatusDisplay>;

export interface Attachment {
  id?: string;
  nameFile: string;
  size: number;
  url?: string | ArrayBuffer | null;
  file?: File;
  isCanceled?: boolean;
  uploadStatus?: UploadStatus;
  status?: AttachmentStatusDisplay;
  serverResponse?: unknown;
  errorMessage?: string;
}

export type ControlValue = Pick<Attachment, 'id' | 'nameFile' | 'size'>;
