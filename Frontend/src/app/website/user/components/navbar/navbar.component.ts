import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isDropdownOpen = false;
  isClicked = false;

  searchQuery = '';
  openSearch = false;

  suggestions = [
    'em xinh say hi',
    'phim ba người',
    'anh vui',
    'phép màu',
    '10 mắt 1 còn không',
    '#zingchart'
  ];
  filteredSuggestions = [...this.suggestions];

  time: string = '';
  is24Hour: boolean = true;

  constructor(
    @Inject(PLATFORM_ID) 
    private platformId: Object,
    private notificationService: NotificationService,

  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startClock();
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleClick() {
    this.isClicked = !this.isClicked;
  }

  startClock(): void {
    setInterval(() => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = this.padZero(now.getMinutes());
      const seconds = this.padZero(now.getSeconds());

      let ampm = '';
      if (!this.is24Hour) {
        ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
      }

      const hoursStr = this.padZero(hours);
      this.time = `${hoursStr}:${minutes}:${seconds}${!this.is24Hour ? ' ' + ampm : ''}`;
    }, 1000);
  }

  toggleClockFormat(): void {
    this.is24Hour = !this.is24Hour;
  }

  padZero(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  filterSuggestions() {
    const q = this.searchQuery.toLowerCase();
    this.filteredSuggestions = this.suggestions.filter(s =>
      s.toLowerCase().includes(q)
    );
  }

  selectSuggestion(item: string) {
    this.searchQuery = item;
    this.openSearch = false;
  }

  @HostListener('document:click')
  closeSearch() {
    this.openSearch = false;
  }

  isInformationFormVisible: boolean = false;

  // Biến lưu thông báo lỗi
  errorMessage: string = '';

  // Dữ liệu thông tin tài khoản ban đầu
  accountInformation = {
    avatarUrl: 'assets/default-avatar.png',
    id: '123456789',
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    username: 'nguyenvana',
    createdAt: new Date('2024-01-01'),  // Ngày tạo tài khoản (ví dụ: 1 tháng trước)
  };

  // Toggle form thêm thể loại
  toggleInformationForm(): void {
    this.isInformationFormVisible = !this.isInformationFormVisible;
    if (!this.isInformationFormVisible) {
      this.errorMessage = '';  // Xóa lỗi khi đóng form
    }
  }

  // Kiểm tra dữ liệu đầu vào trước khi gửi form
  validateForm(): boolean {
    const { fullName, email, id } = this.accountInformation;
    
    // Kiểm tra Họ tên (không được để trống)
    if (!fullName || fullName.trim().length === 0) {
      this.notificationService.showMessage('Họ tên không được để trống!', 'warning');
      return false;
    }

    // Kiểm tra Email hợp lệ
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email || !emailPattern.test(email)) {
      this.notificationService.showMessage('Email không hợp lệ!', 'error');
      return false;
    }

    // Kiểm tra ID (không được để trống)
    if (!id || id.trim().length === 0) {
      this.notificationService.showMessage('Uni ID không được để trống!', 'warning');
      return false;
    }

    // Nếu không có lỗi, trả về true
    this.notificationService.showMessage('Sửa hồ sơ thành công!', 'success');
    return true;
  }

  // Kiểm tra điều kiện thay đổi thông tin
  canEditFullName(): boolean {
    const daysSinceCreation = this.getDaysSinceCreation(this.accountInformation.createdAt);
    return daysSinceCreation >= 7;  // Cho phép thay đổi họ tên sau 7 ngày
  }

  canEditId(): boolean {
    const daysSinceCreation = this.getDaysSinceCreation(this.accountInformation.createdAt);
    return daysSinceCreation >= 30;  // Cho phép thay đổi ID sau 30 ngày
  }

  // Tính số ngày từ ngày tạo tài khoản đến hiện tại
  getDaysSinceCreation(date: Date): number {
    const currentDate = new Date();
    const diffTime = currentDate.getTime() - new Date(date).getTime();
    return Math.floor(diffTime / (1000 * 3600 * 24));  // Số ngày chênh lệch
  }

  // Xử lý khi gửi form
  submitInformationForm(): void {
    // Kiểm tra dữ liệu đầu vào
    if (this.validateForm()) {
      console.log('Thông tin tài khoản đã được cập nhật:', this.accountInformation);
      this.toggleInformationForm();  // Đóng form khi gửi thành công
    } else {
      // Hiển thị thông báo lỗi nếu có
      console.log(this.errorMessage);
    }
  }

  // Thay đổi avatar
  onAvatarChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.accountInformation.avatarUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
