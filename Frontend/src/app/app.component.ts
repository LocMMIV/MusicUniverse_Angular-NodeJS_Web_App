import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MusicPlayerService } from './services/music-player.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Frontend';

  @ViewChild('globalAudio', { static: true })
  audioRef!: ElementRef<HTMLAudioElement>;

  currentSong: any = null;

  constructor(public musicService: MusicPlayerService) {}

  ngOnInit(): void {
    // Gắn thẻ audio global cho service (chỉ 1 lần, toàn app dùng chung)
    this.musicService.audio = this.audioRef.nativeElement;

    // (tuỳ chọn) nếu muốn hiển thị/currentSong ở App
    this.musicService.currentSong$.subscribe(song => {
      this.currentSong = song;
    });
  }

  // Các handler đồng bộ service theo event thực tế của <audio>
  onEnded()  { this.musicService.onEnded(); }
  onPlay()   { this.musicService.setIsPlaying(true); }
  onPause()  { this.musicService.setIsPlaying(false); }
}
