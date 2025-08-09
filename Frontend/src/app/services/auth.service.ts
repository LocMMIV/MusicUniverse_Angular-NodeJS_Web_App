import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn = false;
  private users: any[] = []; // Giả lập danh sách người dùng (dùng cho kiểm tra trùng tài khoản trong đăng ký)

  constructor() {}

  // Đăng nhập
  login(accountName: string, password: string): boolean {
    // Kiểm tra tên tài khoản và mật khẩu giả lập
    const storedUser = JSON.parse(localStorage.getItem('user') as string);

    if (storedUser && storedUser.email === accountName && storedUser.password === password) {
      this.isLoggedIn = true;
      return true;
    }
    return false;
  }

  // Đăng xuất
  logout(): void {
    this.isLoggedIn = false;
    localStorage.clear();
  }

  // Kiểm tra xem người dùng đã đăng nhập chưa
  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }

  // Đăng ký người dùng mới
  register(user: { name: string, email: string, accountName: string, password: string }): boolean {
    // Kiểm tra trùng tài khoản
    const isAccountDuplicate = this.users.some(u => u.accountName === user.accountName);
    if (isAccountDuplicate) {
      return false; // Trả về false nếu tài khoản đã tồn tại
    }

    // Lưu người dùng mới vào danh sách và localStorage
    this.users.push({
      name: user.name,
      email: user.email,
      accountName: user.accountName,
      password: user.password,
    });
    localStorage.setItem('user', JSON.stringify({ 
      email: user.email, 
      password: user.password,
      role: 'user', 
    }));
    return true;
  }

  // Kiểm tra trùng tài khoản khi đăng ký
  checkAccountDuplicate(accountName: string): boolean {
    return this.users.some(u => u.accountName === accountName);
  }
}
