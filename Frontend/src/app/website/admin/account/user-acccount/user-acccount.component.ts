import { Component, OnInit } from '@angular/core';
import { PaginationService } from '../../../../services/pagination.service';
import { NotificationService } from '../../../../services/notification.service';
import { ConfirmdeleteService } from '../../../../services/confirmdelete.service';

@Component({
  selector: 'app-user-acccount',
  templateUrl: './user-acccount.component.html',
  styleUrls: ['./user-acccount.component.css']
})
export class UserAcccountComponent implements OnInit {
  data = [
    { id: '12', fullName: 'Nguyễn Văn A', userName: 'nguyenvana', email: 'a@example.com', status: '' },
    { id: '987', fullName: 'Trần Thị B', userName: 'tranthib', email: 'b@example.com', status: '' },
  ];

  filteredData: any[] = [];
  currentPage = 1;
  paginatedData: any[] = [];

  // Hàm thay đổi trạng thái khóa
  toggleLockStatus(row: any): void {
    if (row.status === 'Đã khóa') {
      row.status = ''; // Nếu đã khóa, thì mở khóa
    } else {
      row.status = 'Đã khóa'; // Nếu chưa khóa, thì khóa
    }
  }

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

  constructor(
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
