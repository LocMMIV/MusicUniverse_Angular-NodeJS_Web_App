import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-account-access',
  templateUrl: './account-access.component.html',
  styleUrls: ['./account-access.component.css']
})
export class AccountAccessComponent implements AfterViewInit {
  email = '';
  accountName = '';
  password = '';
  confirmPassword = '';
  name = '';

  @ViewChild('container') container!: ElementRef<HTMLDivElement>;

  constructor(
    private auth: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngAfterViewInit(): void { }

  // Đăng nhập
  async login() {
    if (!this.accountName || !this.password) {
      this.notificationService.showMessage('Vui lòng nhập đủ thông tin', 'error');
      return;
    }
    try {
      const ok = await this.auth.login(this.accountName, this.password).toPromise();
      if (ok) {
        this.notificationService.showMessage('Đăng nhập thành công!', 'success');
        // điều hướng theo role
        if (this.auth.isAdmin) this.router.navigateByUrl('/admin');
        else this.router.navigateByUrl('/user');
      }
    } catch (e: any) {
      const msg = e?.error?.message || 'Đăng nhập thất bại';
      this.notificationService.showMessage(msg, 'error');
    }
  }

  // Đăng ký
  async register() {
    if (!this.name || !this.email || !this.accountName || !this.password || !this.confirmPassword) {
      this.notificationService.showMessage('Vui lòng nhập đủ thông tin', 'error');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.notificationService.showMessage('Mật khẩu xác nhận không khớp', 'error');
      return;
    }
    try {
      const ok = await this.auth.register({
        name: this.name,
        email: this.email,
        accountName: this.accountName, // 👈 FE camelCase, service map sang account_name
        password: this.password
      }).toPromise();

      if (ok) {
        this.notificationService.showMessage('Đăng ký thành công!', 'success');
        if (this.auth.isAdmin) this.router.navigateByUrl('/admin');
        else this.router.navigateByUrl('/user');
      }
    } catch (e: any) {
      const msg = e?.error?.message || 'Đăng ký thất bại';
      this.notificationService.showMessage(msg, 'error');
    }
  }

  onSignUpClick(): void {
    this.container.nativeElement.classList.add('right-panel-active');
    this.resetForm();
  }

  onSignInClick(): void {
    this.container.nativeElement.classList.remove('right-panel-active');
    this.resetForm();
  }

  resetForm(): void {
    this.name = '';
    this.email = '';
    this.accountName = '';
    this.password = '';
    this.confirmPassword = '';
  }
}
