export enum LocalStorageKeys {
  LANGUAGE = "LANGUAGE",
  TOKEN = "TOKEN"
}

export enum SessionStorageKeys {}
export type StorageEnum = SessionStorageKeys | LocalStorageKeys | CookiesStorageKeys;

export enum CookiesStorageKeys {
  LANGUAGE = "LANGUAGE",
  TOKEN = "TOKEN",
  AUTHORIZATION = "Authorization"
}