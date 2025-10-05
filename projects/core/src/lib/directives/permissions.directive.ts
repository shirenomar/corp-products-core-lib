import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { PermissionsService } from '../services';
import { PermissionsActions, UserPermissionsEnum } from '../enums';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[hasPermissions]',
  standalone: true
})
export class HasPermissionsDirective implements OnInit, OnDestroy {
  private _actions: string[];
  private _key: string;
  private _newPermissions: string[];
  private _isDomain: boolean;

  private isViewCreated = false;
  private subscription: Subscription;

  constructor(
    private permissionsService: PermissionsService,
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<unknown>
  ) {}

  /**
   *  make sure that the key value looks like the UserPermissionsEnum enum
   *  usage: *permissions="[PermissionsActions.EDIT]; key: LOOKUPS
   */

  @Input({ required: true }) set hasPermissions(actions: string[]) {
    if (this.arraysChanged(this._actions, actions)) {
      this._actions = actions;
      this.updateView();
    }
  }

  @Input({ required: true }) set hasPermissionsKey(key: string) {
    if (this._key !== key) {
      this._key = key;
      this.updateView();
    }
  }

  @Input() set hasPermissionsNewPermissions(newPermissions: string[]) {
    if (this.arraysChanged(this._newPermissions, newPermissions)) {
      this._newPermissions = newPermissions;
      this.updateView();
    }
  }

  @Input() set hasPermissionsIsDomain(isDomain: boolean) {
    if (this._isDomain !== isDomain) {
      this._isDomain = isDomain;
      this.updateView();
    }
  }

  ngOnInit(): void {
    this.subscription = this.permissionsService.domainPermissions$.subscribe(() => {
      if (this._isDomain) {
        this.updateView();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private updateView() {
    const canShow = this._actions.some(action => this.hasPermission(action));

    if (canShow && !this.isViewCreated) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.isViewCreated = true;
    } else if (!canShow && this.isViewCreated) {
      this.clearView();
    }
  }

  private hasPermission(action: string): boolean {
    if (this._isDomain) {
      return this.permissionsService.checkDomainHasPermission(
        this._key as UserPermissionsEnum,
        action as PermissionsActions
      );
    }

    return this.permissionsService.checkKeyHasPermission(
      this._key as UserPermissionsEnum,
      action as PermissionsActions,
      this._newPermissions
    );
  }

  private clearView() {
    this.viewContainer.clear();
    this.isViewCreated = false;
  }

  private arraysChanged(a?: string[], b?: string[]): boolean {
    if (a === b) return false;
    if (!a || !b) return true;
    if (a.length !== b.length) return true;
    return a.some((v, i) => v !== b[i]);
  }
}
