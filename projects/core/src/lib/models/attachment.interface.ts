export interface Attachment {
  id: string;
  nameFile: string;
  size: number;
  url: string | ArrayBuffer | null;
  file: File;
  isCanceled?: boolean;
  status?: {
    icon: string;
    label: string;
    labelClass?: string;
    percentage?: number;
    success?: boolean;
  };
}

export type ControlValue = Pick<Attachment, "id" | "nameFile" | "size">;
