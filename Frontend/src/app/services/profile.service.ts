import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private api: ApiService) {}
  me() { return this.api.get<{ user: any }>('/users/me'); }
  update(form: FormData) { return this.api.put('/users/me', form); }
  changePassword(old_password: string, new_password: string) {
    return this.api.patch('/users/me/password', { old_password, new_password });
  }
}
