import { Component, OnInit } from '@angular/core';
import { PaginationService } from '../../../../services/pagination.service';
import { NotificationService } from '../../../../services/notification.service';
import { ConfirmdeleteService } from '../../../../services/confirmdelete.service';

@Component({
  selector: 'app-admin-account',
  templateUrl: './admin-account.component.html',
  styleUrls: ['./admin-account.component.css']
})
export class AdminAccountComponent implements OnInit {
  data = [
    { id: '12', fullName: 'Nguyễn Văn A', adminName: 'nguyenvana', email: 'a@example.com', status: '' },
    { id: '987', fullName: 'Trần Thị B', adminName: 'tranthib', email: 'b@example.com', status: '' },
  ];

  isAddAdminAccountFormVisible: boolean = false;
  newAdmin: {
    fullName: string;
    email: string;
    adminName: string;
    password: string;
    confirmPassword: string;
  } = {
    fullName: '',
    email: '',
    adminName: '',
    password: '',
    confirmPassword: ''
  };

  // Kiểm tra trùng lặp
  isDuplicateAdminName: boolean = false;

  // Hàm kiểm tra tên tài khoản có trùng không
  checkAdminNameDuplicate(adminName: string): void {
    this.isDuplicateAdminName = this.data.some(admin => admin.adminName.toLowerCase() === adminName.toLowerCase());
  }

  // Toggle form thêm quản trị viên
  toggleAddAdminAccountForm(): void {
    this.isAddAdminAccountFormVisible = !this.isAddAdminAccountFormVisible;
    if (!this.isAddAdminAccountFormVisible) {
      this.newAdmin = {
        fullName: '',
        email: '',
        adminName: '',
        password: '',
        confirmPassword: ''
      };
    }
  }

  // Xử lý khi gửi form
  submitAddAdminAccountForm(): void {
    const { fullName, email, adminName, password, confirmPassword } = this.newAdmin;

    // Kiểm tra dữ liệu đầu vào
    if (!fullName.trim() || !email.trim() || !adminName.trim() || !password.trim() || !confirmPassword.trim()) {
      return;
    } else if (password !== confirmPassword) {
      this.notificationService.showMessage('Mật khẩu và xác nhận mật khẩu không khớp!', 'error');
    } else if (this.isDuplicateAdminName) {
      return;
    } else {
      // Thêm quản trị viên vào danh sách
      this.data.push({
        id: Date.now().toString(),
        fullName,
        email,
        adminName,
        status: 'active'
      });

      this.notificationService.showMessage('Thêm quản trị viên thành công!', 'success');

      this.newAdmin = {
        fullName: '',
        email: '',
        adminName: '',
        password: '',
        confirmPassword: ''
      };
      this.toggleAddAdminAccountForm();
    }
  }

  // Hàm thay đổi trạng thái khóa
  toggleLockStatus(row: any): void {
    if (row.status === 'Đã khóa') {
      row.status = ''; // Nếu đã khóa, thì mở khóa
    } else {
      row.status = 'Đã khóa'; // Nếu chưa khóa, thì khóa
    }
  }

  filteredData: any[] = [];
  currentPage = 1;
  paginatedData: any[] = [];

  openConfirmDeleteDialog(index: number) {
    this.ConfirmdeleteService.openDialog(index);
  }

  closeConfirmDeleteDialog() {
    this.ConfirmdeleteService.closeDialog();
  }

  deleteConfirmDeleteDialog(action: 'accepted') {
    const customMessage = '{{name}} đã được xóa!';
    this.ConfirmdeleteService.confirmDelete(this.paginatedData, action, 'id', 'email', customMessage);
  }

  constructor (
    private paginationService: PaginationService,
    private notificationService: NotificationService,
    public ConfirmdeleteService: ConfirmdeleteService
  ) {}

  ngOnInit(): void {
    this.filteredData = [...this.data];
    this.updateTable();
  }

  updateTable(): void {
    this.paginatedData = this.paginationService.paginate(this.filteredData, this.currentPage);
  }

  get visiblePages(): (number | string)[] {
    return this.paginationService.getVisiblePages(this.currentPage, this.totalPages);
  }

  changePage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateTable();
    }
  }

  filterBooks(): void {
    this.currentPage = 1;
    this.updateTable();
  }

  get totalPages(): number {
    return this.paginationService.totalPages(this.filteredData);
  }
}
