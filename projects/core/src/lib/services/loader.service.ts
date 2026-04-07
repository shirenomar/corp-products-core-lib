import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LoaderState {
  show: boolean;
  isSystemLoader?: boolean;
}

@Injectable({
  providedIn: "root"
})
export class LoaderService {
  isLoading$ = new BehaviorSubject<LoaderState>({ show: false });
  private loadingMap: Map<string, boolean> = new Map<string, boolean>();

  setLoading(loading: boolean, isSystemLoader = true, url: string): void {
    if (!url) {
      throw new Error("The request URL must be provided to the LoaderService.setLoading function");
    }

    if (loading) {
      this.loadingMap.set(url, loading);
      this.isLoading$.next({ show: true, isSystemLoader });
    } else if (!loading && this.loadingMap.has(url)) {
      this.loadingMap.delete(url);
    }

    if (!this.loadingMap.size) {
      this.isLoading$.next({ show: false });
    }
  }
}
