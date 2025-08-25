import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { TokenStorage } from '../auth/token.storage';
import { tap, map } from 'rxjs';

export interface LoginResponse {
  token: string;
  user: { id: number; name: string; account_name: string; email: string; role: 'user'|'admin' };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private api: ApiService, private tokens: TokenStorage) {}

  // Đăng nhập: FE chỉ có accountName, ta gửi cả email và account_name (BE dùng cái nào cũng ok)
  login(accountName: string, password: string) {
    const body = { email: accountName, account_name: accountName, password };
    return this.api.post<LoginResponse>('/auth/login', body).pipe(
      tap(res => { this.tokens.setToken(res.token); this.tokens.setUser(res.user); }),
      map(() => true)
    );
  }

  // Đăng ký: BE yêu cầu account_name (snake_case)
  register(payload: { name: string; email: string; accountName: string; password: string }) {
    const body = {
      name: payload.name,
      email: payload.email,
      account_name: payload.accountName, // map đúng BE
      password: payload.password,
    };
    return this.api.post<LoginResponse>('/auth/register', body).pipe(
      tap(res => { this.tokens.setToken(res.token); this.tokens.setUser(res.user); }),
      map(() => true)
    );
  }

  me() { return this.api.get<LoginResponse['user']>('/auth/me'); }

  logout() { this.tokens.clearAll(); }

  get user() { return this.tokens.getUser<LoginResponse['user']>(); }
  get token() { return this.tokens.getToken(); }
  get isLoggedIn() { return !!this.token; }
  get isAdmin() { return this.user?.role === 'admin'; }
}
