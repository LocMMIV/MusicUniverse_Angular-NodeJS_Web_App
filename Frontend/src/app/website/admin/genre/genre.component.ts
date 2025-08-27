import { Component, OnInit } from '@angular/core';
import { PaginationService } from '../../../services/pagination.service';
import { NotificationService } from '../../../services/notification.service';
import { ConfirmdeleteService } from '../../../services/confirmdelete.service';
import { GenresService } from '../../../services/genres.service';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.css']
})
export class GenreComponent implements OnInit {
  // dữ liệu hiển thị (map name -> genreName để giữ HTML)
  data: Array<{ id: number; genreName: string }> = [];

  isAddGenreFormVisible: boolean = false;
  newGenre: { genreName: string } = { genreName: '' };

  // kiểm tra trùng lặp
  isDuplicateGenreName: boolean = false;

  constructor(
    private paginationService: PaginationService,
    private notificationService: NotificationService,
    public ConfirmdeleteService: ConfirmdeleteService,
    private genresSvc: GenresService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadFromApi();
    this.filteredData = [...this.data];
    this.updateTable();
  }

  private async loadFromApi() {
    const res = await this.genresSvc.list().toPromise();
    const rows = res?.data || [];
    this.data = rows.map((g: any) => ({ id: g.id, genreName: g.name }));
  }

  // Kiểm tra tên thể loại có trùng không
  checkGenreNameDuplicate(genreName: string): void {
    const normalized = (genreName || '').trim().toLowerCase();
    this.isDuplicateGenreName = !!normalized && this.data.some(g => g.genreName.toLowerCase() === normalized);
  }

  // Toggle form
  toggleAddGenreForm(): void {
    this.isAddGenreFormVisible = !this.isAddGenreFormVisible;
    if (!this.isAddGenreFormVisible) this.newGenre = { genreName: '' };
  }

  // Submit thêm thể loại
  async submitAddGenreForm(): Promise<void> {
    const { genreName } = this.newGenre;
    const name = (genreName || '').trim();
    if (!name) return;
    if (this.isDuplicateGenreName) return;

    try {
      await this.genresSvc.create(name).toPromise();
      this.notificationService.showMessage('Thêm thể loại thành công!', 'success');
      await this.loadFromApi();
      this.filteredData = [...this.data];
      this.updateTable();
      this.toggleAddGenreForm();
    } catch (e: any) {
      this.notificationService.showMessage(e?.error?.message || 'Thêm thể loại thất bại', 'error');
    }
  }

  // ====== phần phân trang cũ giữ nguyên ======
  filteredData: any[] = [];
  currentPage = 1;
  paginatedData: any[] = [];

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

  // Xoá thể loại
  openConfirmDeleteDialog(index: number) { this.ConfirmdeleteService.openDialog(index); }
  closeConfirmDeleteDialog() { this.ConfirmdeleteService.closeDialog(); }
  async deleteConfirmDeleteDialog(action: 'accepted') {
    const idx = this.ConfirmdeleteService.getSelectedIndex();
    if (action === 'accepted' && idx !== null) {
      const row = this.paginatedData[idx];
      try {
        await this.genresSvc.delete(row.id).toPromise();
        this.notificationService.showMessage(`Đã xoá thể loại: ${row.genreName}`, 'success');
        await this.loadFromApi();
        this.filteredData = [...this.data];
        this.updateTable();
      } catch (e: any) {
        this.notificationService.showMessage(e?.error?.message || 'Xóa thất bại', 'error');
      }
    }
    this.ConfirmdeleteService.closeDialog();
  }
}
