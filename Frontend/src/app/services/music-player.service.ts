import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MusicPlayerService {
  // Sẽ được gán trong AppComponent.ngOnInit
  audio!: HTMLAudioElement;

  private _isPlayerVisible = new BehaviorSubject<boolean>(true);
  isPlayerVisible$ = this._isPlayerVisible.asObservable();

  private _currentSong = new BehaviorSubject<any>(null);
  currentSong$ = this._currentSong.asObservable();

  private _isPlaying = new BehaviorSubject<boolean>(false);
  isPlaying$ = this._isPlaying.asObservable();

  /** Đổi bài hát (mọi nơi trong app chỉ gọi hàm này) */
  setCurrentSong(song: any) {
    if (!this.audio) return;

    // Nếu null => tắt
    if (!song) {
      this.audio.pause();
      this.audio.src = '';
      this._currentSong.next(null);
      this._isPlaying.next(false);
      this._isPlayerVisible.next(false);
      return;
    }

    // Phát bài mới
    this._currentSong.next(song);
    this.audio.src = song.audioUrl || '';
    this.audio.currentTime = 0;
    this.audio.play()
      .then(() => {
        this._isPlaying.next(true);
        this._isPlayerVisible.next(true);
      })
      .catch(() => this._isPlaying.next(false));
  }

  /** Toggle play/pause hiện tại */
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

  setIsPlaying(v: boolean) {
    this._isPlaying.next(v);
  }

  onEnded() {
    this._isPlaying.next(false);
    // có thể auto-next ở đây nếu bạn có queue/playlist
  }
}
