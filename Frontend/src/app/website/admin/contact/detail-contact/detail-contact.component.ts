import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-detail-contact',
  templateUrl: './detail-contact.component.html',
  styleUrls: ['./detail-contact.component.css']
})
export class DetailContactComponent {
  contact = {
    id: '123',
    fullName: 'Nguyễn Văn A',
    userName: 'nguyenvana',
    email: 'nguyenvana@gmail.com',
    request: 'Hỗ trợ kỹ thuật',
    content: 'Tôi gặp vấn đề khi sử dụng tính năng đăng nhập.'
  };

  constructor (
    private notificationService: NotificationService,
    private router: Router
  ) {}

  onResolve() {
    this.notificationService.showMessage('Giải quyết thành công!', 'success');
    this.router.navigate(['/contact']);
  }

  onGoBack() {
    this.router.navigate(['/contact']);
  }
}
