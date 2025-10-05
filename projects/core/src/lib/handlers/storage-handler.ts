// Important for global context
import { LocalStorageKeys, SessionStorageKeys, StorageEnum } from "./stortage";

const setLocalStorage = (key: string, value: string) => localStorage.setItem(key, value);
const getLocalStorage = (key: string) => localStorage.getItem(key);
const clearLocalStorage = () => localStorage.clear();
const setSessionStorage = (key: string, value: string) => sessionStorage.setItem(key, value);
const getSessionStorage = (key: string) => sessionStorage.getItem(key);
const clearSessionStorage = () => sessionStorage.clear();

export class StorageHandler {
  public static local = {
    set: (key: LocalStorageKeys, value: unknown) => this.setItem(key, value, setLocalStorage),
    get: <T>(key: LocalStorageKeys) => this.getItem<T>(key, getLocalStorage),
    clear: () => this.clearStorage(clearLocalStorage)
  };
  public static session = {
    set: (key: SessionStorageKeys, value: unknown) => this.setItem(key, value, setSessionStorage),
    get: <T>(key: SessionStorageKeys) => this.getItem<T>(key, getSessionStorage),
    clear: () => this.clearStorage(clearSessionStorage)
  };

  private static setItem(key: StorageEnum, value: unknown, set: (key: string, value: string) => void): void {
    if (!key) return;
    set(key as string, typeof value === "string" ? value : JSON.stringify(value));
  }

  private static getItem<T>(key: StorageEnum, get: (key: string) => string | null, withParsing = false): T | null {
    const data: string | null = get(key as string) ?? null;
    if (data) return withParsing ? JSON.parse(data) as T : data as T;
    return null;
  }

  private static clearStorage(clear: () => void): void {
    clear();
  }
}
