import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { TOASTER_SERVICE, ToasterInterface } from "../core-config";

@Injectable({
  providedIn: "root"
})
export class ErrorHandlerService implements ErrorHandler {
  constructor(
    private injector: Injector,
    private translateService: TranslateService
  ) {}

  private get toasterService(): ToasterInterface {
    return this.injector.get<ToasterInterface>(TOASTER_SERVICE);
  }

  handleError(error: unknown): void {
    console.log("ErrorHandlerService", error);
    if (error instanceof Error && !(error instanceof HttpErrorResponse)) {
      console.error(error);
      return;
    }

    if (error instanceof HttpErrorResponse) {
      console.error("HTTP Error:", error);

      switch (error.status) {
        case 400:
           this.showError(`network_errors.${error.error.message}`);
           break
        case 401:
          this.showError(`network_errors.${error.error.message}`);
          break;
        case 404:
          this.showError(`network_errors.${error.error?.message}`);
          break;
        case 403:
          this.showError("error.forbidden.message");
          break;
        case 500:
          this.showError("validation_error.server");
          break;
        default:
          this.showError("validation_error.random");
          break;
      }
    }
  }

  private showError(messageKey: string): void {
    this.toasterService.error({
      title: this.translateService.instant("error"),
      message: this.translateService.instant(messageKey),
    });
  }
}
