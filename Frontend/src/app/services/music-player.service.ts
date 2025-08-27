import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type RepeatMode = 'off' | 'one' | 'all';
export type Song = {
  id?: number;
  songName: string;
  artist: string;
  image?: string;
  audioUrl: string;
  [k: string]: any;
};

@Injectable({ providedIn: 'root' })
export class MusicPlayerService {
  /** AppComponent gán thẻ audio vào đây */
  audio!: HTMLAudioElement;

  private _isPlayerVisible = new BehaviorSubject<boolean>(true);
  isPlayerVisible$ = this._isPlayerVisible.asObservable();

  private _currentSong = new BehaviorSubject<Song | null>(null);
  currentSong$ = this._currentSong.asObservable();

  private _isPlaying = new BehaviorSubject<boolean>(false);
  isPlaying$ = this._isPlaying.asObservable();

  // ===== Queue / Trạng thái phát =====
  private _queue = new BehaviorSubject<Song[]>([]);
  queue$ = this._queue.asObservable();
  private _index = -1;

  private _shuffle = new BehaviorSubject<boolean>(false);
  shuffle$ = this._shuffle.asObservable();

  private _repeatMode = new BehaviorSubject<RepeatMode>('off');
  repeatMode$ = this._repeatMode.asObservable();

  /** Lịch sử index để quay lại khi đang shuffle */
  private history: number[] = [];

  // ================== Public API ==================

  /** Phát từ 1 danh sách (queue) tại bài cụ thể (song or index) */
  playFrom(list: Song[], songOrIndex: Song | number) {
    const queue = [...(list || [])];
    this._queue.next(queue);

    const idx = typeof songOrIndex === 'number'
      ? songOrIndex
      : Math.max(0, queue.findIndex(s => s === songOrIndex || s.id === (songOrIndex as any).id));

    this._index = idx >= 0 ? idx : 0;
    this._playIndex(this._index);
  }

  /** Đặt queue (không phát ngay) */
  setQueue(list: Song[]) {
    this._queue.next([...(list || [])]);
    this._index = -1;
  }

  /** Tương thích cũ: phát 1 bài lẻ (nếu queue trống thì tự tạo queue 1 phần tử) */
  setCurrentSong(song: Song | null) {
    if (!song) return this.stop();

    const q = this._queue.getValue();
    const idxInQ = q.findIndex(s => s === song || s.id === (song as any).id);
    if (idxInQ === -1) this.setQueue(q.length ? q : [song]);

    this._index = idxInQ !== -1 ? idxInQ : 0;
    this._playIndex(this._index);
  }

  togglePlayPause() {
    if (!this.audio) return;
    if (this.audio.paused) { this.audio.play(); this._isPlaying.next(true); }
    else { this.audio.pause(); this._isPlaying.next(false); }
  }

  next() {
    const q = this._queue.getValue();
    if (!q.length) return;

    if (this._shuffle.getValue()) {
      if (this._index >= 0) this.history.push(this._index);
      let nextIdx = this._index;
      if (q.length > 1) {
        while (nextIdx === this._index) nextIdx = Math.floor(Math.random() * q.length);
      }
      this._index = nextIdx;
      this._playIndex(this._index);
      return;
    }

    if (this._index < q.length - 1) {
      this._index++;
      this._playIndex(this._index);
    } else if (this._repeatMode.getValue() === 'all') {
      this._index = 0;
      this._playIndex(this._index);
    } else {
      this.audio.pause();
      this._isPlaying.next(false);
    }
  }

  prev() {
    const q = this._queue.getValue();
    if (!q.length) return;

    // Nếu đã chạy quá 2s thì tua về đầu
    if (this.audio && this.audio.currentTime > 2) {
      this.audio.currentTime = 0;
      return;
    }

    if (this._shuffle.getValue() && this.history.length) {
      this._index = this.history.pop()!;
      this._playIndex(this._index);
      return;
    }

    if (this._index > 0) {
      this._index--;
      this._playIndex(this._index);
    } else if (this._repeatMode.getValue() === 'all') {
      this._index = q.length - 1;
      this._playIndex(this._index);
    } else {
      this.audio.currentTime = 0;
    }
  }

  toggleShuffle() {
    const v = !this._shuffle.getValue();
    this._shuffle.next(v);
    if (!v) this.history = [];
  }

  /** off -> all -> one -> off */
  toggleRepeatMode() {
    const cur = this._repeatMode.getValue();
    const next: RepeatMode = cur === 'off' ? 'all' : cur === 'all' ? 'one' : 'off';
    this._repeatMode.next(next);
  }

  /** Được AppComponent gọi khi audio kết thúc */
  onEnded() {
    const mode = this._repeatMode.getValue();
    if (mode === 'one') {
      this.audio.currentTime = 0;
      this.audio.play();
      return;
    }
    this.next();
  }

  setIsPlaying(v: boolean) { this._isPlaying.next(v); }

  stop() {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.src = '';
    this._currentSong.next(null);
    this._isPlaying.next(false);
    this._isPlayerVisible.next(false);
    this._index = -1;
    this.history = [];
  }

  // ================== Internal ==================
  private _playIndex(i: number) {
    const q = this._queue.getValue();
    if (!this.audio || !q.length) return;
    const s = q[i];
    if (!s) return;

    this._currentSong.next(s);
    this._isPlayerVisible.next(true);

    this.audio.src = s.audioUrl || '';
    this.audio.currentTime = 0;
    this.audio.play()
      .then(() => this._isPlaying.next(true))
      .catch(() => this._isPlaying.next(false));
  }
}