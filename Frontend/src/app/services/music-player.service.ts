import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MusicPlayerService {
  audio!: HTMLAudioElement;

  private _isPlayerVisible = new BehaviorSubject<boolean>(true);
  isPlayerVisible$ = this._isPlayerVisible.asObservable();

  private _currentSong = new BehaviorSubject<any>(null);
  currentSong$ = this._currentSong.asObservable();

  private _isPlaying = new BehaviorSubject<boolean>(false);
  isPlaying$ = this._isPlaying.asObservable();

  // Gọi khi muốn thay bài hát
  setCurrentSong(song: any) {
    this._currentSong.next(song);

    if (song && this.audio) {
      this.audio.src = song.audioUrl;
      this.audio.play();
      this._isPlaying.next(true);
      this._isPlayerVisible.next(true);
    } else {
      this.audio.pause();
      this.audio.src = '';
      this._isPlaying.next(false);
      this._isPlayerVisible.next(false);
    }
  }

  // Gọi khi người dùng toggle play
  togglePlayPause() {
    if (!this.audio) return;

    if (this.audio.paused) {
      this.audio.play();
      this._isPlaying.next(true);
    } else {
      this.audio.pause();
      this._isPlaying.next(false);
    }
  }

  setIsPlaying(value: boolean) {
    this._isPlaying.next(value);
  }

  onEnded() {
    this._isPlaying.next(false);
  }
}