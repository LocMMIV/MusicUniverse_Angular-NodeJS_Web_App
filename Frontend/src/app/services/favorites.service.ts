import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  constructor(private api: ApiService) {}

  myList() { return this.api.get<{ data: any[] }>('/favorites'); }
  toggle(songId: number) { return this.api.post(`/favorites/${songId}`, {}); }
  isLiked(songId: number) { return this.api.get<{ liked: boolean }>(`/favorites/${songId}`); }
  remove(songId: number) { return this.api.delete(`/favorites/${songId}`); }
}
