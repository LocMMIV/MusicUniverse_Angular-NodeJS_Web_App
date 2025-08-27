import { Component, OnInit } from '@angular/core';
import { MusicPlayerService } from '../../../../services/music-player.service';

@Component({
  selector: 'app-musicsidebar',
  templateUrl: './musicsidebar.component.html',
  styleUrls: ['./musicsidebar.component.css']
})
export class MusicsidebarComponent implements OnInit {
  currentSong: any = null;
  isPlaying = false;

  currentTime: string = '00:00';
  totalTime: string = '00:00';
  progress: number = 0;
  duration: number = 0;
  volume: number = 100;

  constructor(public musicService: MusicPlayerService) {}

  ngOnInit() {
    // Đồng bộ state
    this.musicService.currentSong$.subscribe(song => {
      this.currentSong = song;
      // cập nhật thời lượng khi có metadata
      const a = this.musicService.audio;
      if (a) {
        setTimeout(() => {
          this.duration = a.duration || 0;
          this.totalTime = this.formatTime(a.duration || 0);
        }, 0);
      }
    });
    this.musicService.isPlaying$.subscribe(v => this.isPlaying = v);

    // Bind sự kiện vào audio global
    const audio = this.musicService.audio;
    if (audio) {
      audio.ontimeupdate = () => {
        this.progress = audio.currentTime;
        this.currentTime = this.formatTime(audio.currentTime);
      };
      audio.onloadedmetadata = () => {
        this.duration = audio.duration || 0;
        this.totalTime = this.formatTime(audio.duration || 0);
      };
    }
  }

  togglePlayPause() {
    this.musicService.togglePlayPause();
  }

  seek(event: any) {
    const audio = this.musicService.audio;
    if (!audio) return;
    audio.currentTime = +event.target.value;
  }

  changeVolume(event: any) {
    this.volume = +event.target.value;
    const audio = this.musicService.audio;
    if (!audio) return;
    audio.volume = this.volume / 100;
  }

  getVolumeIcon(): string {
    if (this.volume === 0) return 'bi bi-volume-mute';
    if (this.volume < 50) return 'bi bi-volume-down';
    return 'bi bi-volume-up';
  }

  private formatTime(t: number): string {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${this.pad(m)}:${this.pad(s)}`;
  }
  private pad(v: number) { return v < 10 ? `0${v}` : `${v}`; }
}