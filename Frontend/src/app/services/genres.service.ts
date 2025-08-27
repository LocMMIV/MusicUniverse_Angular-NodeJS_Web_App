import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class GenresService {
  constructor(private api: ApiService) {}

  list() { return this.api.get<{ data: any[] }>('/genres'); }
  create(name: string) { return this.api.post('/genres', { name }); }
  update(id: number, name: string) { return this.api.put(`/genres/${id}`, { name }); }
  delete(id: number) { return this.api.delete(`/genres/${id}`); }
}