import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class SupportService {
  constructor(private api: ApiService) {}

  create(payload: {
    full_name: string;
    account_name?: string;
    email: string;
    topic: 'ky_thuat' | 'tai_khoan' | 'thanh_toan' | 'khac';
    subject: string;
    content: string;
  }) {
    return this.api.post('/support', payload);
  }

  // admin
  adminList(params?: { status?: string; q?: string; page?: number; limit?: number }) {
    return this.api.get<{ data: any[]; pagination: any }>('/requests', params);
  }
  adminDetail(id: number) { return this.api.get(`/requests/${id}`); }
  adminResolve(id: number, note?: string) {
    return this.api.patch(`/requests/${id}/resolve`, { note });
  }
}
