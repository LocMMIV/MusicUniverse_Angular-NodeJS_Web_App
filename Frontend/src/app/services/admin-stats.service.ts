import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
@Injectable({ providedIn: 'root' })
export class AdminStatsService {
  constructor(private api: ApiService) {}
  get() { return this.api.get('/admin/stats'); }
}
