import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class SongsService {
  constructor(private api: ApiService) {}

  list(params?: { q?: string; genre_id?: number; page?: number; limit?: number }) {
    return this.api.get<{ data: any[]; pagination: any }>('/songs', params);
  }
  get(id: number) {
    return this.api.get(`/songs/${id}`);
  }

  // Admin: form-data upload
  create(form: FormData) {
    return this.api.post('/songs', form);
  }
  update(id: number, form: FormData) {
    return this.api.put(`/songs/${id}`, form);
  }
  delete(id: number) {
    return this.api.delete(`/songs/${id}`);
  }
}
