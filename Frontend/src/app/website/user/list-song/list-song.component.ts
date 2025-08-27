import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../../../services/notification.service';
import { MusicPlayerService } from '../../../services/music-player.service';
import { SongsService } from '../../../services/songs.service';
import { FavoritesService } from '../../../services/favorites.service';
import { AuthService } from '../../../services/auth.service';
import { GenresService } from '../../../services/genres.service';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

type SongVM = {
  id: number;
  image: string;
  songName: string;
  artist: string;
  genre: string;
  genreId?: number | null;
  isLiked: boolean;
  audioUrl: string;
  duration: string;
};

@Component({
  selector: 'app-list-song',
  templateUrl: './list-song.component.html',
  styleUrls: ['./list-song.component.css']
})
export class ListSongComponent implements OnInit {
  list: SongVM[] = [];
  likedSongs: SongVM[] = [];

  genres: Array<{id:number; name:string}> = [];
  selectedGenreId: number | null = null;

  currentSong: SongVM | null = null;
  isPlaying = false;

  searchQuery = '';

  constructor(
    private notificationService: NotificationService,
    private musicplayerService: MusicPlayerService,
    private songsSvc: SongsService,
    private favSvc: FavoritesService,
    private authSvc: AuthService,
    private genresSvc: GenresService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    // theo dõi q trên url
    this.route.queryParamMap.subscribe(async (params) => {
      this.searchQuery = (params.get('q') || '').trim();
      await this.loadSongs(this.searchQuery);
      if (this.authSvc.isLoggedIn) await this.markLikedFromServer();
    });

    // tải thể loại
    const gr: any = await firstValueFrom(this.genresSvc.list());
    this.genres = gr?.data ?? [];

    this.musicplayerService.currentSong$.subscribe(song => (this.currentSong = song as any));
    this.musicplayerService.isPlaying$.subscribe(state => (this.isPlaying = state));
  }

  private async loadSongs(q?: string) {
    const params: any = { page: 1, limit: 100 };
    if (q) params.q = q;

    const res: any = await firstValueFrom(this.songsSvc.list(params));
    const rows = (res?.data ?? []) as any[];

    this.list = rows.map(s => ({
      id: s.id,
      image: s.image_url ? environment.assetsUrl + s.image_url : '/assets/images/default.png',
      songName: s.title,
      artist: s.artist_name,
      genre: s.genre_name || '',
      genreId: s.genre_id ?? null,
      isLiked: false,
      audioUrl: s.audio_url ? environment.assetsUrl + s.audio_url : '',
      duration: ''
    }));

    this.list.forEach(item => {
      if (!item.audioUrl) return;
      const audio = new Audio(item.audioUrl);
      audio.addEventListener('loadedmetadata', () => {
        item.duration = this.formatTime(audio.duration);
      });
    });
  }

  private async markLikedFromServer() {
    try {
      const favRes: any = await firstValueFrom(this.favSvc.myList());
      const likedRows = favRes?.data ?? [];
      const likedIdSet = new Set(likedRows.map((x: any) => x.id ?? x.song_id ?? x.songId));
      this.list.forEach(item => {
        item.isLiked = likedIdSet.has(item.id);
        if (item.isLiked && !this.likedSongs.includes(item)) this.likedSongs.push(item);
      });
    } catch {}
  }

  async toggleLike(index: number) {
    const listSong = this.filteredList[index];
    if (!this.authSvc.isLoggedIn) {
      this.notificationService.showMessage('Vui lòng đăng nhập để dùng yêu thích.', 'error');
      return;
    }
    if (!listSong?.id) {
      this.notificationService.showMessage('Không xác định được bài hát.', 'error');
      return;
    }

    try {
      const res: any = await firstValueFrom(this.favSvc.toggle(listSong.id));
      const liked = typeof res?.liked === 'boolean' ? res.liked : !listSong.isLiked;

      listSong.isLiked = liked;
      if (liked) {
        if (!this.likedSongs.includes(listSong)) this.likedSongs.push(listSong);
        this.notificationService.showMessage(`Đã thêm "${listSong.songName}" vào yêu thích`, 'success');
      } else {
        this.likedSongs = this.likedSongs.filter(s => s !== listSong);
        this.notificationService.showMessage(`Đã bỏ yêu thích "${listSong.songName}"`, 'success');
      }
    } catch (e: any) {
      const msg = e?.status === 401
        ? 'Vui lòng đăng nhập để dùng yêu thích.'
        : 'Không thể cập nhật yêu thích.';
      this.notificationService.showMessage(msg, 'error');
    }
  }

  setGenreId(id: number | null) { this.selectedGenreId = id; }

  get filteredList(): SongVM[] {
    return this.selectedGenreId !== null
      ? this.list.filter(s => s.genreId === this.selectedGenreId)
      : this.list;
  }

  playSong(song: SongVM) {
    if (this.currentSong && this.currentSong.id === song.id) {
      this.musicplayerService.togglePlayPause();
      return;
    }
    this.currentSong = song;
    this.musicplayerService.setCurrentSong(song as any);
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${this.pad(minutes)}:${this.pad(secs)}`;
  }
  private pad(n: number) { return n < 10 ? '0' + n : String(n); }
}
