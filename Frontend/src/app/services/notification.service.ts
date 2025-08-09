import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messageSource = new Subject<{ message: string, type: 'success' | 'error' | 'warning' }>();
  message$ = this.messageSource.asObservable();

  showMessage(message: string, type: 'success' | 'error' | 'warning') {
    this.messageSource.next({ message, type });
  }
}
