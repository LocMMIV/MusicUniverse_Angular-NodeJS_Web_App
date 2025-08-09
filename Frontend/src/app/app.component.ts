import { Component, ViewChild, ElementRef } from '@angular/core';
import { MusicPlayerService } from './services/music-player.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Frontend';
  @ViewChild('globalAudio', { static: true }) audioRef!: ElementRef<HTMLAudioElement>;

  currentSong: any = null;

  constructor(private musicService: MusicPlayerService) {}

  ngOnInit() {
    this.musicService.audio = this.audioRef.nativeElement;

    // Sync current song
    this.musicService.currentSong$.subscribe(song => {
      this.currentSong = song;
    });
  }

  onEnded() {
    this.musicService.onEnded();
  }

  onPlay() {
    this.musicService.setIsPlaying(true);
  }

  onPause() {
    this.musicService.setIsPlaying(false);
  }
}
