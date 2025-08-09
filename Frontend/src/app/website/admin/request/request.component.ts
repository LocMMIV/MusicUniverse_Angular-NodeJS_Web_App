import { Component, OnInit } from '@angular/core';
import { PaginationService } from '../../../services/pagination.service';
import { NotificationService } from '../../../services/notification.service';
import { ConfirmdeleteService } from '../../../services/confirmdelete.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  data = [
    { id: '12', fullName: 'Nguyễn Văn A', userName: 'nguyenvana', email: 'a@example.com' },
    { id: '987', fullName: 'Trần Thị B', userName: 'tranthib', email: 'b@example.com', },
  ];

  selectedRequestIndex: number | null = null;

  openForm(index: number) {
    this.selectedRequestIndex = index;
  }
  
  closeForm() {
      this.selectedRequestIndex = null;
  }

  processRequest(action: 'accepted' | 'rejected') {
      if (this.selectedRequestIndex !== null) {
          this.paginatedData[this.selectedRequestIndex].status = action;

          const fullName = this.paginatedData[this.selectedRequestIndex].fullName;

          if (action === 'accepted') {
              this.notificationService.showMessage(`Yêu cầu của ${fullName} đã được chấp nhận.`, 'success');
          } else if (action === 'rejected') {
              this.notificationService.showMessage(`Yêu cầu của ${fullName} đã bị từ chối.`, 'error');
          }

          this.closeForm();
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
