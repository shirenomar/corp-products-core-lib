import { Injectable } from "@angular/core";
//import { DeviceDetectorService } from "ngx-device-detector";
import { debounceTime, distinctUntilChanged, fromEvent, Observable, startWith, Subject, tap } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DetectDeviceService {
  currentWidth: number = window.innerWidth;
  private _width$: Subject<number> = new Subject();
  private _agent: string;
  constructor() {
    fromEvent(window, "resize")
      .pipe(distinctUntilChanged(), debounceTime(200))
      .subscribe((event) => this._handelResize(event));
  }

  private _handelResize(event: any) {
    this._width$.next(event.target.innerWidth);
    this.currentWidth = event.target.innerWidth;
  }

  get onResize$(): Observable<number> {
    return this._width$.asObservable().pipe(
      debounceTime(100), // Debounce to avoid too many events
      startWith(window.innerWidth), // Trigger initial check
      distinctUntilChanged(), // Avoid duplication
      tap(() => this._detect())
    );
  }

  get agent(): string | undefined {
    // Optimize getter performance
    if (this._agent) {
      return this._agent;
    }

    const value = localStorage.getItem("User-Agent");
    this._agent = value!;

    return value!;
  }

  private _detect(): void {
    const body = document.getElementsByTagName("body")[0];

    this.isMobile() ? body?.setAttribute("view", "mobile") : body?.setAttribute("view", "web");

    switch (true) {
      case this.isBrowser():
        body?.setAttribute("device", "browser");
        break;
      case this.isIOS():
        body?.setAttribute("device", "ios");
        break;
      case this.isAndroid():
        body?.setAttribute("device", "android");
        break;
      default:
        body?.removeAttribute("device");
    }
  }

  public isMobile() {
    // return this.deviceService.isMobile();
    return false;
  }

  public isBrowser() {
    return !this.agent;
  }

  public isIOS() {
    return this.agent && (this.agent.toLocaleLowerCase().includes("iphone") || this.agent.toLocaleLowerCase().includes("ios"));
  }

  public isAndroid() {
    return this.agent && this.agent.toLocaleLowerCase().includes("android");
  }
}
