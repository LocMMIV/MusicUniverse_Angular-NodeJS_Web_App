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
  email: string = '';
  accountName: string = '';
  password: string = '';
  confirmPassword: string = '';
  name: string = '';
  isDuplicateAccount: boolean = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  // Đăng nhập
  async login() {
    if (!this.accountName || !this.password) {
      this.notificationService.showMessage('Vui lòng nhập đủ thông tin', 'error');
      return;
    }

    const isLoginSuccessful = await this.authService.login(this.accountName, this.password);
    if (isLoginSuccessful) {
      this.notificationService.showMessage('Đăng nhập thành công!', 'success');
      const user = JSON.parse(localStorage.getItem('user') as string);
      if (user?.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/user']);
      }
    } else {
      this.notificationService.showMessage('Tên đăng nhập hoặc mật khẩu không đúng!', 'error');
    }
  }

  // Đăng ký người dùng mới
  async register() {
    if (!this.name || !this.email || !this.accountName || !this.password || !this.confirmPassword) {
      this.notificationService.showMessage('Vui lòng nhập đầy đủ thông tin', 'error');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.notificationService.showMessage('Mật khẩu không khớp!', 'error');
      return;
    }

    if (this.isDuplicateAccount) {
      this.notificationService.showMessage('Tên tài khoản đã tồn tại!', 'error');
      return;
    }

    const user = {
      name: this.name,
      accountName: this.accountName,
      email: this.email,
      password: this.password,
    };

    const isRegisterSuccessful = await this.authService.register(user);
    if (isRegisterSuccessful) {
      this.notificationService.showMessage('Đăng ký thành công!', 'success');
    } else {
      this.notificationService.showMessage('Đăng ký thất bại!', 'error');
    }
  }

  @ViewChild('container') container!: ElementRef;

  ngAfterViewInit(): void {
    console.log(this.container);
  }

  // Chuyển đến màn hình đăng ký
  onSignUpClick(): void {
    this.container.nativeElement.classList.add('right-panel-active');
    this.resetForm();
  }

  // Chuyển đến màn hình đăng nhập
  onSignInClick(): void {
    this.container.nativeElement.classList.remove('right-panel-active');
    this.resetForm();
  }

  // Reset form
  resetForm(): void {
    this.name = '';
    this.email = '';
    this.accountName = '';
    this.password = '';
    this.confirmPassword = '';
  }
}
