import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationService } from '../../../services/pagination.service';
import { NotificationService } from '../../../services/notification.service';
import { ConfirmdeleteService } from '../../../services/confirmdelete.service';
import { SongsService } from '../../../services/songs.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent implements OnInit {
  // dữ liệu hiển thị (đã map về field cũ để giữ nguyên HTML)
  data: Array<{
    id: number;
    songName: string;
    image: string | null;
    audio: string | null;
    artist: string;
    genre: string;
  }> = [];

  filteredData: any[] = [];
  currentPage = 1;
  paginatedData: any[] = [];
  private currentlyPlayingAudio: HTMLAudioElement | null = null;

  constructor(
    private paginationService: PaginationService,
    private router: Router,
    private notificationService: NotificationService,
    public ConfirmdeleteService: ConfirmdeleteService,
    private songsSvc: SongsService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadFromApi();
    this.filteredData = [...this.data];
    this.updateTable();
  }

  private async loadFromApi() {
    // lấy nhiều 1 chút để phân trang client (giữ nguyên UI)
    const res = await this.songsSvc.list({ page: 1, limit: 500 }).toPromise();
    const rows = res?.data || [];
    this.data = rows.map((s: any) => ({
      id: s.id,
      songName: s.title,
      image: s.image_url ? environment.assetsUrl + s.image_url : '/assets/images/default.png',
      audio: s.audio_url ? environment.assetsUrl + s.audio_url : null,
      artist: s.artist_name,
      genre: s.genre_name || ''
    }));
  }

  updateTable(): void {
    this.paginatedData = this.paginationService.paginate(this.filteredData, this.currentPage);
  }

  playAudio(audioElement: HTMLAudioElement): void {
    if (this.currentlyPlayingAudio && this.currentlyPlayingAudio !== audioElement) {
      this.currentlyPlayingAudio.pause();
      this.currentlyPlayingAudio.currentTime = 0;
    }
    this.currentlyPlayingAudio = audioElement;
  }

  pauseAudio(audioElement: HTMLAudioElement): void {
    if (this.currentlyPlayingAudio === audioElement) {
      this.currentlyPlayingAudio = null;
    }
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

  navigateToDetailSong(): void {
    // HTML hiện tại không truyền id — giữ nguyên điều hướng cũ
    this.router.navigate(['/detail-song']);
  }

  // ==== Confirm delete ====
  openConfirmDeleteDialog(index: number) {
    this.ConfirmdeleteService.openDialog(index);
  }
  closeConfirmDeleteDialog() {
    this.ConfirmdeleteService.closeDialog();
  }
  async deleteConfirmDeleteDialog(action: 'accepted') {
    const idx = this.ConfirmdeleteService.getSelectedIndex();
    if (action === 'accepted' && idx !== null) {
      const row = this.paginatedData[idx];
      try {
        await this.songsSvc.delete(row.id).toPromise();
        this.notificationService.showMessage(`Đã xoá: ${row.songName}`, 'success');
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
