import { Component } from '@angular/core';
import { MusicPlayerService } from '../../../../services/music-player.service';

@Component({
  selector: 'app-musicsidebar',
  templateUrl: './musicsidebar.component.html',
  styleUrls: ['./musicsidebar.component.css']
})
export class MusicsidebarComponent {
    currentSong: any = null;
    isPlaying = false;
    audio!: HTMLAudioElement;
  
    currentTime: string = '00:00';
    totalTime: string = '00:00';
    progress: number = 0;
    duration: number = 100;
    volume: number = 100;
  
    constructor(public musicService: MusicPlayerService) {}
  
    ngOnInit() {
      this.audio = document.querySelector('audio') as HTMLAudioElement;
  
      this.musicService.currentSong$.subscribe(song => {
        this.currentSong = song;
  
        if (song) {
          // Cập nhật khi đổi bài hát
          setTimeout(() => {
            this.duration = this.audio.duration || 0;
            this.totalTime = this.formatTime(this.audio.duration);
          }, 500);
        }
      });
  
      this.audio.ontimeupdate = () => {
        this.progress = this.audio.currentTime;
        this.currentTime = this.formatTime(this.audio.currentTime);
      };
  
      this.audio.onplay = () => this.isPlaying = true;
      this.audio.onpause = () => this.isPlaying = false;
    }
  
    formatTime(time: number): string {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${this.pad(minutes)}:${this.pad(seconds)}`;
    }
  
    pad(value: number): string {
      return value < 10 ? `0${value}` : `${value}`;
    }
  
    togglePlayPause() {
      if (this.audio.paused) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    }
  
    seek(event: any) {
      this.audio.currentTime = event.target.value;
    }
  
    changeVolume(event: any) {
  this.volume = +event.target.value; // ép kiểu string -> number
  this.audio.volume = this.volume / 100;
  }

  getVolumeIcon(): string {
    if (this.volume === 0) return 'bi bi-volume-mute';
    else if (this.volume > 0 && this.volume < 50) return 'bi bi-volume-down';
    else return 'bi bi-volume-up';
  }
}
