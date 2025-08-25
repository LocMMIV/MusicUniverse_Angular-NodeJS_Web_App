import { Injectable } from '@angular/core';

const KEY_TOKEN = 'auth_token';
const KEY_USER  = 'auth_user';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
  getToken(): string | null { return localStorage.getItem(KEY_TOKEN); }
  setToken(t: string)       { localStorage.setItem(KEY_TOKEN, t); }
  clearToken()              { localStorage.removeItem(KEY_TOKEN); }

  getUser<T = any>(): T | null {
    const raw = localStorage.getItem(KEY_USER);
    return raw ? JSON.parse(raw) as T : null;
  }
  setUser(u: any) {
    localStorage.setItem(KEY_USER, JSON.stringify(u));
  }
  clearUser() { localStorage.removeItem(KEY_USER); }

  clearAll() { this.clearToken(); this.clearUser(); }
}
