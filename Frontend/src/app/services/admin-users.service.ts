import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  constructor(private api: ApiService) {}

  list(params?: { q?: string; page?: number; limit?: number }) {
    return this.api.get<{ data: any[]; pagination: any }>('/users', params);
  }
  detail(id: number) { return this.api.get(`/users/${id}`); }
  setLock(id: number, lock: boolean, reason?: string) {
    return this.api.patch(`/users/${id}/lock`, { lock, reason });
  }
  setRole(id: number, role: 'user' | 'admin') {
    return this.api.patch(`/users/${id}/role`, { role });
  }
}
