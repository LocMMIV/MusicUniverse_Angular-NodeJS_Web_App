import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../../../services/notification.service';
import { MusicPlayerService } from '../../../services/music-player.service';
import { SongsService } from '../../../services/songs.service';
import { GenresService } from '../../../services/genres.service';
import { environment } from '../../../../environments/environment';

type SongVM = {
  id?: number;
  image: string;
  songName: string;
  artist: string;
  genre: string;
  audioUrl: string;
  duration: string;
};

@Component({
  selector: 'app-upload-song',
  templateUrl: './upload-song.component.html',
  styleUrls: ['./upload-song.component.css']
})
export class UploadSongComponent implements OnInit {
  isUploadFormVisible = false;

  uploadedSongs: SongVM[] = [];
  currentSong: SongVM | null = null;
  isPlaying = false;

  genres: Array<{ id: number; name: string }> = [];

  newSong = {
    songName: '',
    artist: '',
    genreId: null as number | null,
    audioFile: null as File | null,
    imageFile: null as File | null
  };

  constructor(
    private notificationService: NotificationService,
    public musicplayerService: MusicPlayerService,
    private songsSvc: SongsService,
    private genresSvc: GenresService
  ) {}

  async ngOnInit() {
  // đồng bộ với sidebar
  this.musicplayerService.currentSong$.subscribe(s => {
    this.currentSong = s as any; // hoặc: as SongVM | null
  });
  this.musicplayerService.isPlaying$.subscribe(p => (this.isPlaying = p));

  await this.loadGenres();
  await this.loadUploadedFromApi();
}


  // ===== UI =====
  toggleUploadForm(): void {
    this.isUploadFormVisible = !this.isUploadFormVisible;
    if (!this.isUploadFormVisible) this.resetForm();
  }
  onAudioSelected(e: any) { const f = e.target?.files?.[0]; if (f) this.newSong.audioFile = f; }
  onImageSelected(e: any) { const f = e.target?.files?.[0]; if (f) this.newSong.imageFile = f; }

  // ===== Submit =====
  async submitSongForm(): Promise<void> {
    const { songName, artist, genreId, audioFile, imageFile } = this.newSong;
    if (!songName || !artist || !audioFile || !genreId) {
      this.notificationService.showMessage('Vui lòng điền đủ Tên bài, Nghệ sĩ, Thể loại, File nhạc!', 'error');
      return;
    }

    try {
      const fd = new FormData();
      fd.append('title', songName);
      fd.append('artist_name', artist);
      fd.append('genre_id', String(genreId));
      if (imageFile) fd.append('image', imageFile);
      fd.append('audio', audioFile);

      const created = await firstValueFrom(this.songsSvc.create(fd)) as any;

      const ui: SongVM = {
        id: created.id,
        songName: created.title,
        artist: created.artist_name,
        genre: created.genre_name || (this.genres.find(g => g.id === genreId)?.name ?? ''),
        audioUrl: created.audio_url ? environment.assetsUrl + created.audio_url : '',
        image: created.image_url ? environment.assetsUrl + created.image_url : '/assets/images/default-song.png',
        duration: ''
      };

      if (ui.audioUrl) {
        const audio = new Audio(ui.audioUrl);
        audio.addEventListener('loadedmetadata', () => ui.duration = this.formatTime(audio.duration));
      }

      this.uploadedSongs.unshift(ui);
      this.notificationService.showMessage('Tải bài hát thành công!', 'success');
      this.toggleUploadForm();
    } catch (e: any) {
      this.notificationService.showMessage(e?.error?.message || 'Tải bài hát thất bại', 'error');
    }
  }

  // ===== Play/ Pause đồng bộ Sidebar =====
  playSong(song: SongVM) {
    const queue = this.uploadedSongs;
    if (this.currentSong?.id === song.id) {
      this.musicplayerService.togglePlayPause();
    } else {
      this.musicplayerService.playFrom(queue as any[], song as any);
    }
  }

  // ===== Data =====
  private async loadGenres() {
    try {
      const res: any = await firstValueFrom(this.genresSvc.list());
      this.genres = res?.data ?? [];
    } catch { this.genres = []; }
  }

  private async loadUploadedFromApi() {
  try {
    const res: any = await firstValueFrom(this.songsSvc.list({ page: 1, limit: 30, mine: 1 }));
    const rows = res?.data || [];
    this.uploadedSongs = rows.map((s: any) => ({
      id: s.id,
      songName: s.title,
      artist: s.artist_name,
      genre: s.genre_name || '',
      audioUrl: s.audio_url ? environment.assetsUrl + s.audio_url : '',
      image: s.image_url ? environment.assetsUrl + s.image_url : '/assets/images/default-song.png',
      duration: ''
    }));

    this.uploadedSongs.forEach(item => {
      if (!item.audioUrl) return;
      const audio = new Audio(item.audioUrl);
      audio.addEventListener('loadedmetadata', () => {
        item.duration = this.formatTime(audio.duration);
      });
    });
  } catch {}
}


  // ===== Utils =====
  private formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${this.pad(m)}:${this.pad(s)}`;
  }
  private pad(n: number) { return n < 10 ? '0' + n : String(n); }

  private resetForm() {
    this.newSong = { songName: '', artist: '', genreId: null, audioFile: null, imageFile: null };
  }
}
