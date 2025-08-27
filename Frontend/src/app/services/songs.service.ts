import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export type SongListQuery = {
  q?: string;
  genre_id?: number;
  page?: number;
  limit?: number;
  // thêm mine để lấy bài do chính user upload
  mine?: 0 | 1 | boolean;
};

@Injectable({ providedIn: 'root' })
export class SongsService {
  constructor(private api: ApiService) {}

  list(params: SongListQuery = {}) {
    return this.api.get<{ data: any[]; pagination?: any }>('/songs', params as any);
  }

  // tiện: wrapper cho mine=1
  myUploads(page = 1, limit = 30) {
    return this.list({ page, limit, mine: 1 });
  }

  getById(id: number) {
    return this.api.get<any>(`/songs/${id}`);
  }

  create(formData: FormData) {
    return this.api.post<any>('/songs', formData);
  }

  update(id: number, formData: FormData) {
    return this.api.put<any>(`/songs/${id}`, formData);
  }

  delete(id: number) {
    return this.api.delete<any>(`/songs/${id}`);
  }
}
