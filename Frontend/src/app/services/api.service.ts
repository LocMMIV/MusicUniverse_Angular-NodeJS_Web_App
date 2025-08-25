import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient) {}

  get<T>(url: string, params?: Record<string, any>) {
    const hp = new HttpParams({ fromObject: params || {} });
    return this.http.get<T>(`${this.base}${url}`, { params: hp });
  }
  post<T>(url: string, body: any) { return this.http.post<T>(`${this.base}${url}`, body); }
  put<T>(url: string, body: any)  { return this.http.put<T>(`${this.base}${url}`, body); }
  patch<T>(url: string, body: any){ return this.http.patch<T>(`${this.base}${url}`, body); }
  delete<T>(url: string)          { return this.http.delete<T>(`${this.base}${url}`); }
}
