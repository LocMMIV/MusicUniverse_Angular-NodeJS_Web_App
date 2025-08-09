import { Component } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { MusicPlayerService } from '../../../services/music-player.service';

@Component({
  selector: 'app-upload-song',
  templateUrl: './upload-song.component.html',
  styleUrls: ['./upload-song.component.css']
})

export class UploadSongComponent {
  isUploadFormVisible = false;
  uploadedSongs: any[] = [];
  currentSong: any = null;

  newSong = {
    songName: '',
    artist: '',
    genre: '',
    audioFile: null as File | null,
    imageFile: null as File | null
  };

  constructor(
    private notificationService: NotificationService,
    private musicplayerService: MusicPlayerService
  ) {}

  toggleUploadForm(): void {
    this.isUploadFormVisible = !this.isUploadFormVisible;
    if (!this.isUploadFormVisible) this.resetForm();
  }

  onAudioSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) this.newSong.audioFile = file;
  }

  onImageSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) this.newSong.imageFile = file;
  }

  submitSongForm(): void {
    const { songName, artist, genre, audioFile, imageFile } = this.newSong;

    if (!songName || !artist || !genre || !audioFile) {
      this.notificationService.showMessage('Vui lòng điền đầy đủ thông tin!', 'error');
      return;
    }

    const audioUrl = URL.createObjectURL(audioFile);
    const image = imageFile ? URL.createObjectURL(imageFile) : 'assets/images/default-song.png';

    const song = {
      songName,
      artist,
      genre,
      audioUrl,
      image,
      duration: '',
      isLiked: false
    };

    const audio = new Audio(audioUrl);
    audio.addEventListener('loadedmetadata', () => {
      song.duration = this.formatTime(audio.duration);
    });

    this.uploadedSongs.push(song);
    this.notificationService.showMessage('Tải bài hát thành công!', 'success');
    this.toggleUploadForm();
  }

  playSong(song: any): void {
    const audioPlayer = document.querySelector('audio') as HTMLAudioElement;
    if (this.currentSong === song) {
      audioPlayer.pause();
      this.currentSong = null;
    } else {
      this.currentSong = song;
      audioPlayer.src = song.audioUrl;
      audioPlayer.play();
      this.musicplayerService.setCurrentSong(song);
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

  resetForm(): void {
    this.newSong = {
      songName: '',
      artist: '',
      genre: '',
      audioFile: null,
      imageFile: null
    };
  }
}
