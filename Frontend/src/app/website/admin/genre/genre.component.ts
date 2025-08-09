import { Component, OnInit } from '@angular/core';
import { PaginationService } from '../../../services/pagination.service';
import { NotificationService } from '../../../services/notification.service';
import { ConfirmdeleteService } from '../../../services/confirmdelete.service';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.css']
})
export class GenreComponent implements OnInit {
  data = [
    { id: 1, genreName: 'Thể loại 1' },
    { id: 2, genreName: 'Thể loại 2' },
    { id: 3, genreName: 'Thể loại 3' },
  ];
  
  isAddGenreFormVisible: boolean = false;
  newGenre: { genreName: string } = { genreName: '' };
  
  // Kiểm tra trùng lặp
  isDuplicateGenreName: boolean = false;
  
  // Hàm kiểm tra tên thể loại có trùng không
  checkGenreNameDuplicate(genreName: string): void {
    this.isDuplicateGenreName = this.data.some(genre => genre.genreName.toLowerCase() === genreName.toLowerCase());
  }
  
  // Toggle form thêm thể loại
  toggleAddGenreForm(): void {
    this.isAddGenreFormVisible = !this.isAddGenreFormVisible;
    if (!this.isAddGenreFormVisible) {
      this.newGenre = {
        genreName: '',
      };
    }
  }
  
  // Xử lý khi gửi form
  submitAddGenreForm(): void {
    const { genreName } = this.newGenre;

    // Kiểm tra dữ liệu đầu vào
    if (this.isDuplicateGenreName) {
      return;
    } else if (!genreName.trim()) {
      return;
    } else {
      // Thêm thể loại vào danh sách
      this.data.push({
        id: Date.now(),
        genreName: genreName
    });

    this.notificationService.showMessage('Thêm thể loại thành công!', 'success');

    this.newGenre = { genreName: '' };
    this.toggleAddGenreForm();
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
    this.ConfirmdeleteService.confirmDelete(this.paginatedData, action, 'id', 'genreName', customMessage);
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
