import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { MusicPlayerService } from '../../../services/music-player.service';
import { FavoritesService } from '../../../services/favorites.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-favorite-song',
  templateUrl: './favorite-song.component.html',
  styleUrls: ['./favorite-song.component.css']
})
export class FavoriteSongComponent implements OnInit {
  favorite: Array<any> = [];  // map về field cũ để giữ nguyên HTML
  likedSongs: any[] = [];
  currentSong: any = null;
  isPlaying: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private musicplayerService: MusicPlayerService,
    private favSvc: FavoritesService
  ) {}

  async ngOnInit() {
    await this.loadFavorites();

    this.musicplayerService.currentSong$.subscribe(song => this.currentSong = song);
    this.musicplayerService.isPlaying$.subscribe(state => this.isPlaying = state);
  }

  private async loadFavorites() {
    const res = await this.favSvc.myList().toPromise();
    const rows = res?.data || [];
    this.favorite = rows.map((s: any) => ({
      id: s.id,
      image: s.image_url ? environment.assetsUrl + s.image_url : '/assets/images/default.png',
      songName: s.title,
      artist: s.artist_name,
      isLiked: true,
      audioUrl: s.audio_url ? environment.assetsUrl + s.audio_url : '',
      duration: ''
    }));

    this.favorite.forEach(item => {
      if (!item.audioUrl) return;
      const audio = new Audio(item.audioUrl);
      audio.addEventListener('loadedmetadata', () => {
        item.duration = this.formatTime(audio.duration);
      });
    });
  }

  async toggleLike(index: number) {
    const favoriteSong = this.favorite[index];
    try {
      await this.favSvc.toggle(favoriteSong.id).toPromise();
      favoriteSong.isLiked = !favoriteSong.isLiked;
      if (favoriteSong.isLiked) {
        this.likedSongs.push(favoriteSong);
        this.notificationService.showMessage(`${favoriteSong.songName} đã thêm vào danh sách yêu thích`, 'success');
      } else {
        this.likedSongs = this.likedSongs.filter(song => song !== favoriteSong);
        this.notificationService.showMessage(`${favoriteSong.songName} đã xóa khỏi danh sách yêu thích`, 'success');
      }
    } catch (e: any) {
      this.notificationService.showMessage(e?.error?.message || 'Không thể cập nhật yêu thích', 'error');
    }
  }

  playSong(song: any) {
    if (this.currentSong === song) {
      this.musicplayerService.togglePlayPause();
    } else {
      this.musicplayerService.setCurrentSong(song);
      const audioPlayer = document.querySelector('audio') as HTMLAudioElement;
      if (audioPlayer) { audioPlayer.src = song.audioUrl; audioPlayer.play(); }
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${this.pad(minutes)}:${this.pad(secs)}`;
  }
  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
