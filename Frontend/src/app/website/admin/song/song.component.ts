import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationService } from '../../../services/pagination.service';
import { NotificationService } from '../../../services/notification.service';
import { ConfirmdeleteService } from '../../../services/confirmdelete.service';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent implements OnInit {
  data = [
    {
      id: 1,
      songName: "Mở Lối Cho Em",
      image: "assets/images/moloichoem.jpg",
      audio: "assets/audio/moloichoem.mp3",
      artist: "Lương Quý Tuấn, Hữu Công",
      genre: "Nhạc trẻ"
    },
    {
      id: 2,
      songName: "Nỗi Nhớ Vô Hạn",
      image: "assets/images/noinhovohan.jpg",
      audio: "assets/audio/noinhovohan.mp3",
      artist: "Thanh Hưng",
      genre: "Nhạc trẻ"
    }, 
  ]

  filteredData: any[] = [];
  currentPage = 1;
  paginatedData: any[] = [];
  private currentlyPlayingAudio: HTMLAudioElement | null = null; // Lưu trữ bài đang phát

  openConfirmDeleteDialog(index: number) {
    this.ConfirmdeleteService.openDialog(index);
  }

  closeConfirmDeleteDialog() {
    this.ConfirmdeleteService.closeDialog();
  }

  deleteConfirmDeleteDialog(action: 'accepted') {
    const customMessage = '{{name}} đã được xóa!';
    this.ConfirmdeleteService.confirmDelete(this.paginatedData, action, 'id', 'songName', customMessage);
  }

  constructor(
    private paginationService: PaginationService,
    private router: Router,
    private notificationService: NotificationService,
    public ConfirmdeleteService: ConfirmdeleteService
  ) {}

  ngOnInit(): void {
    this.filteredData = [...this.data]; // Gán dữ liệu ban đầu vào filteredData
    this.updateTable();
  }

  updateTable(): void {
    // Phân trang dựa trên filteredData thay vì data
    this.paginatedData = this.paginationService.paginate(this.filteredData, this.currentPage);
  }

  playAudio(audioElement: HTMLAudioElement): void {
    if (this.currentlyPlayingAudio && this.currentlyPlayingAudio !== audioElement) {
      this.currentlyPlayingAudio.pause(); // Dừng bài đang phát
      this.currentlyPlayingAudio.currentTime = 0; // Đưa về thời gian ban đầu
    }
    this.currentlyPlayingAudio = audioElement; // Cập nhật bài đang phát
  }

  pauseAudio(audioElement: HTMLAudioElement): void {
    if (this.currentlyPlayingAudio === audioElement) {
      this.currentlyPlayingAudio = null; // Xóa bài đang phát khi tạm dừng
    }
  }


  get visiblePages(): (number | string)[] {
    // Lấy danh sách các trang hiển thị
    return this.paginationService.getVisiblePages(this.currentPage, this.totalPages);
  }

  changePage(page: number | string): void {
    //Nếu trang quá nhiều thì sẽ hiện "..."
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateTable();
    }
  }
  filterBooks(): void {
    this.currentPage = 1; // Reset về trang đầu
    this.updateTable();
  }

  get totalPages(): number {
    // Tính tổng số trang dựa trên filteredData
    return this.paginationService.totalPages(this.filteredData);
  }

  navigateToDetailSong(): void {
    this.router.navigate(['/detail-song']);
  }
}
