import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";
import { Subscription } from "rxjs";
import { DetectDeviceService } from "../services/detect-device.service";
import { DisplayTypesEnum } from "../enums/display-types.enum";

/*
 * Usage:
 * <div *responsiveElement="DisplayTypes.WEB_ONLY">Web</div>
 * <div *responsiveElement="DisplayTypes.MOBILE_ONLY">Mobile</div>
 * */

@Directive({
  selector: "[responsiveElement]",
  standalone: true
})
export class ResponsiveElementDirective implements OnInit, OnDestroy {
  @Input("responsiveElement") displayFor: DisplayTypesEnum.WEB_ONLY | DisplayTypesEnum.MOBILE_ONLY;

  private resizeSubscription: Subscription = new Subscription();

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private detectDeviceServiceService: DetectDeviceService
  ) {}

  ngOnInit() {
    this.resizeSubscription.add(this.detectDeviceServiceService.onResize$.subscribe(this.checkWidth.bind(this)));
  }

  ngOnDestroy() {
    this.resizeSubscription.unsubscribe();
  }

  private checkWidth() {
    const shouldDisplay =
      (this.displayFor === DisplayTypesEnum.WEB_ONLY && !this.detectDeviceServiceService.isMobile()) ||
      (this.displayFor === DisplayTypesEnum.MOBILE_ONLY && this.detectDeviceServiceService.isMobile());
    if (shouldDisplay) {
      this.viewContainer.length === 0 && this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
