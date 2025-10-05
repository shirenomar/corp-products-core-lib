import { Injectable, inject } from "@angular/core";
import { JwtDecoderService } from "./jwt-decoder.service";
import { PermissionsActions, UserPermissionsEnum } from "../enums";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class PermissionsService {
  private jwtDecoderService = inject(JwtDecoderService);
  private decodedToken = this.jwtDecoderService.decodedToken;
  private tokenPermissions = this.decodedToken ? this.decodedToken.permissions as [] : [];
  private domainPermissionsSubject = new BehaviorSubject<string[]>([]);
  domainPermissions$ = this.domainPermissionsSubject.asObservable();

  private getKeyName(action: string) {
    const actionsArr = action.split("_");
    return actionsArr.splice(1, actionsArr.length - 1).join("_");
  }

  getActionName(action: string) {
    return action.split("_")[0];
  }

  getAllowedActionsByKey(key: UserPermissionsEnum, newPermissions?: string[]) {
    const permissionsNeeded = newPermissions || this.tokenPermissions;
    if (!permissionsNeeded) {
      console.error("There are no permissions available");
      return [];
    }
    return permissionsNeeded
      .filter((p) => {
        return key === this.getKeyName(p);
      })
      .map((t) => {
        return this.getActionName(t);
      });
  }

  checkKeyHasPermission(key: UserPermissionsEnum, action: PermissionsActions, newPermissions?: string[]) {
    return this.getAllowedActionsByKey(key, newPermissions).some((p) => p === action);
  }

  checkDomainHasPermission(key: UserPermissionsEnum, action: PermissionsActions) {
    return this.getAllowedActionsByKey(key, this.getDomainPermissions()).some((p) => p === action);
  }

  routeGuardChecker(key: UserPermissionsEnum, action: PermissionsActions) {
   if(!this.checkKeyHasPermission(key, action)){
      return this.checkKeyHasPermission(key, action,this.getDomainPermissions());
    }
    return true;
  }

  clearDomainPermissions() {
    this.domainPermissionsSubject.next([]);
  }

  setDomainPermissions(permissions: string[]) {
    this.domainPermissionsSubject.next(permissions);
  }

  getDomainPermissions(): string[] {
    return this.domainPermissionsSubject.getValue();
  }
}
