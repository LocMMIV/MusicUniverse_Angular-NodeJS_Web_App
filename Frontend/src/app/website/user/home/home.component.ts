import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MusicPlayerService } from '../../../services/music-player.service';
import { NotificationService } from '../../../services/notification.service';
import { SongsService } from '../../../services/songs.service';
import { FavoritesService } from '../../../services/favorites.service';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

type HomeSong = {
  id: number;
  image: string;
  songName: string;
  artist: string;
  audioUrl: string;
  isLiked: boolean;
};
type TopSong = HomeSong & { view: number };

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentSong: HomeSong | null = null;
  isPlaying = false;

  suggestRows: HomeSong[][] = [];
  newRows: HomeSong[][] = [];
  private allLatest: HomeSong[] = [];
  readonly chunkSize = 3;

  top: TopSong[] = [];

  constructor(
    private music: MusicPlayerService,
    private notify: NotificationService,
    private songsSvc: SongsService,
    private favSvc: FavoritesService,
    private authSvc: AuthService,
  ) {}

  async ngOnInit() {
    this.music.currentSong$.subscribe(s => this.currentSong = s as any);
    this.music.isPlaying$.subscribe(p => this.isPlaying = p);

    await this.safeLoad(this.loadLatestSongs.bind(this), 'Không tải được danh sách bài hát.');

    if (this.authSvc.isLoggedIn) {
      await this.safeLoad(this.markLikedFromServer.bind(this));
    }
  }

  private async safeLoad(fn: () => Promise<any>, errMsg?: string) {
    try { await fn(); }
    catch (e: any) {
      console.error(fn.name, e);
      if (errMsg) this.notify.showMessage(e?.error?.message || errMsg, 'error');
    }
  }

  private async loadLatestSongs() {
    const res: any = await firstValueFrom(this.songsSvc.list({ page: 1, limit: 60 }));
    const rows = (res?.data ?? []) as any[];

    this.allLatest = rows.map(s => ({
      id: s.id,
      image: s.image_url ? environment.assetsUrl + s.image_url : '/assets/images/default.png',
      songName: s.title,
      artist: s.artist_name,
      audioUrl: s.audio_url ? environment.assetsUrl + s.audio_url : '',
      isLiked: false
    }));

    const newest9 = this.allLatest.slice(0, 9);
    this.newRows = this.chunkArray(newest9, this.chunkSize);

    this.refreshSuggest();
  }

  refreshSuggest() {
    const picked = this.pickRandom(this.allLatest, 9);
    this.suggestRows = this.chunkArray(picked, this.chunkSize);
  }

  private async markLikedFromServer() {
    const favRes: any = await firstValueFrom(this.favSvc.myList());
    const likedRows = favRes?.data ?? [];
    const likedIdSet = new Set<number>(likedRows.map((x: any) => x.id ?? x.song_id ?? x.songId));

    this.allLatest.forEach(s => (s.isLiked = likedIdSet.has(s.id)));
    this.top.forEach(s => (s.isLiked = likedIdSet.has(s.id)));
  }

  playSong(song: HomeSong) {
    if (this.currentSong?.id === song.id) this.music.togglePlayPause();
    else this.music.setCurrentSong(song as any);
  }

  toggleLike(type: 'suggest' | 'new', rowIndex: number, colIndex: number) {
    const rows = type === 'suggest' ? this.suggestRows : this.newRows;
    const song = rows[rowIndex]?.[colIndex];
    if (!song) return;
    this.toggleLikeForSong(song);
  }

  private async toggleLikeForSong(song: HomeSong) {
    if (!this.authSvc.isLoggedIn) {
      this.notify.showMessage('Vui lòng đăng nhập để dùng yêu thích.', 'error');
      return;
    }
    try {
      const res: any = await firstValueFrom(this.favSvc.toggle(song.id));
      const liked = typeof res?.liked === 'boolean' ? res.liked : !song.isLiked;
      this.setLikedAcrossUi(song.id, liked);
      this.notify.showMessage(
        liked ? `Đã thêm "${song.songName}" vào yêu thích` : `Đã bỏ yêu thích "${song.songName}"`,
        'success'
      );
    } catch (e: any) {
      this.notify.showMessage(e?.error?.message || 'Không thể cập nhật yêu thích.', 'error');
    }
  }

  private setLikedAcrossUi(songId: number, liked: boolean) {
    this.allLatest.forEach(s => { if (s.id === songId) s.isLiked = liked; });
    this.top.forEach(s => { if (s.id === songId) s.isLiked = liked; });
  }

  private chunkArray<T>(arr: T[], size: number): T[][] {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out.slice(0, 3);
  }
  private pickRandom<T>(arr: T[], n: number): T[] {
    if (arr.length <= n) return [...arr];
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(0, n);
  }

  formatViews(view: number): string {
    if (view < 1000) return String(view);
    if (view >= 1_000_000_000) {
      const b = Math.floor(view / 1_000_000_000);
      const r = Math.floor((view % 1_000_000_000) / 100_000_000);
      return r === 0 ? `${b}B` : `${b}B${r}`;
    }
    if (view >= 1_000_000) {
      const m = Math.floor(view / 1_000_000);
      const r = Math.floor((view % 1_000_000) / 100_000);
      return r === 0 ? `${m}M` : `${m}M${r}`;
    }
    const k = Math.floor(view / 1000);
    const r = Math.floor((view % 1000) / 100);
    return r === 0 ? `${k}K` : `${k}K${r}`;
  }
}
