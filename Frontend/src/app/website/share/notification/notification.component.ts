import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  messageList: { message: string; type: 'success' | 'error' | 'warning'; }[] = [];

  constructor(private notificationService: NotificationService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.notificationService.message$.subscribe((msg) => {
      if (this.messageList.length < 3) {
        this.messageList.push({ message: msg.message, type: msg.type });
      } else {
        this.messageList.shift();
        this.messageList.push({ message: msg.message, type: msg.type });
      }
  
      this.messageList.forEach((_, index) => {
        setTimeout(() => {
          const notificationElement = document.querySelectorAll('.notification')[index];
          if (notificationElement) {
            notificationElement.classList.add('fadeOut');
          }
  
          const notifications = document.querySelectorAll('.notification');
          notifications.forEach((notification, idx) => {
            if (idx > index) {
              notification.classList.add('slideUp');
            }
          });

          setTimeout(() => {
            this.messageList.shift();
            this.cdr.detectChanges();
          }, 500);
        }, (3000 + index * 2000));
      });
    });
  }
  
}
