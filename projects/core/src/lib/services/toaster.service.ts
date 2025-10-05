import { Injectable } from '@angular/core';
import { MessageService, Message } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  mainKey = 'main-toaster';

  constructor(private messageService: MessageService) {}

  showMessage(options: Message) {
    this.messageService.add({
      key: options?.key ? options?.key : this.mainKey,
      severity: options?.severity,
      summary: options?.summary,
      detail: options?.detail,
      life: options?.life ?? 5000,
    });
  }

  showSuccess(options: Message) {
    this.messageService.add({
      key: this.mainKey,
      severity: 'success',
      summary: options?.summary,
      detail: options?.detail,
      life: options?.life ?? 5000,
    });
  }

  showError(options: Message) {
    this.messageService.add({
      key: this.mainKey,
      severity: 'error',
      summary: options?.summary,
      detail: options?.detail,
      life: options?.life ?? 5000,
    });
  }

  showInfo(options: Message) {
    this.messageService.add({
      key: this.mainKey,
      severity: 'info',
      summary: options?.summary,
      detail: options?.detail,
      life: options?.life ?? 5000,
    });
  }

  showWarning(key: string, summary: string, detail: string, life = 5000) {
    this.messageService.add({
      key: this.mainKey,
      severity: 'warn',
      summary,
      detail,
      life,
    });
  }

  clear() {
    this.messageService.clear(this.mainKey);
  }
}
