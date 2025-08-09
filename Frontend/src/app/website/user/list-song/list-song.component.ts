import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { MusicPlayerService } from '../../../services/music-player.service';

@Component({
  selector: 'app-list-song',
  templateUrl: './list-song.component.html',
  styleUrls: ['./list-song.component.css']
})
export class ListSongComponent implements OnInit {
  list = [
    { image: 'assets/images/moloichoem.jpg', songName: 'Mở Lối Cho Em', artist: 'Lương Huy Tuấn, Hữu Công', genre: 'V-pop',
      isLiked: false, audioUrl: 'assets/audio/moloichoem.mp3', duration: '' },
    { image: 'assets/images/noinhovohan.jpg',songName: 'Nỗi Nhớ Vô Hạn', artist: 'Thanh Hưng', genre: 'V-pop',
      isLiked: false, audioUrl: 'assets/audio/noinhovohan.mp3', duration: '' },
    { image: 'assets/images/moloichoem2.jpg',songName: 'Mở Lối Cho Em 2', artist: 'Lương Huy Tuấn, An Clock', genre: 'V-pop',
      isLiked: false, audioUrl: 'assets/audio/moloichoem2.mp3', duration: '' },
    { image: 'assets/images/vansutuyduyen.jpg',songName: 'Vạn Sự Tùy Duyên', artist: 'Thanh Hưng', genre: 'V-pop',
      isLiked: false, audioUrl: 'assets/audio/vansutuyduyen.mp3', duration: '' },
    { image: 'assets/images/duoitancaykhohoano.jpg',songName: 'Dưới Tán Cây Khô Hoa Nở', artist: 'J97', genre: 'V-pop',
      isLiked: false, audioUrl: 'assets/audio/duoitancaykhohoano.mp3', duration: '' },
    { image: 'assets/images/suotdoikhongxung.jpg',songName: 'Suốt Đời Không Xứng', artist: 'Khải Đăng, Vương Anh Tú, Ribi Sachi', genre: 'V-pop',
      isLiked: false, audioUrl: 'assets/audio/suotdoikhongxung.mp3', duration: '' },
    { image: 'assets/images/chanhlongthuongco4.jpg',songName: 'Chạnh Lòng Thương Cô 4', artist: 'Huy Vạc', genre: 'V-pop',
      isLiked: false, audioUrl: 'assets/audio/chanhlongthuongco4.mp3', duration: '' },
    { image: 'assets/images/chieuthuhoabongnang.jpg',songName: 'Chiều Thu Họa Bóng Nàng', artist: 'Đatkka', genre: 'V-pop',
      isLiked: false, audioUrl: 'assets/audio/chieuthuhoabongnang.mp3', duration: '' },
    { image: 'assets/images/tralaithanhxuanchoem.jpg',songName: 'Trả Lại Thanh Xuân Cho Em', artist: 'H2K', genre: 'V-pop',
      isLiked: false, audioUrl: 'assets/audio/tralaithanhxuanchoem.mp3', duration: '' },
  ];

  likedSongs: any[] = [];
  selectedGenre: string = '';
  currentSong: any = null;
  isPlaying: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private musicplayerService: MusicPlayerService
  ) {}

  ngOnInit() {
    // Lấy thời lượng mỗi bài
    this.list.forEach(listSong => {
      const audio = new Audio(listSong.audioUrl);
      audio.addEventListener('loadedmetadata', () => {
        listSong.duration = this.formatTime(audio.duration);
      });
    });

    // Lắng nghe trạng thái play/pause & bài hát hiện tại
    this.musicplayerService.currentSong$.subscribe(song => this.currentSong = song);
    this.musicplayerService.isPlaying$.subscribe(state => this.isPlaying = state);
  }

  toggleLike(index: number) {
    const listSong = this.filteredList[index];

    if (listSong.isLiked) {
      this.likedSongs = this.likedSongs.filter(item => item !== listSong);
      this.notificationService.showMessage(`${listSong.songName} đã xóa khỏi yêu thích!`, 'success');
    } else {
      this.likedSongs.push(listSong);
      this.notificationService.showMessage(`${listSong.songName} đã thêm vào yêu thích!`, 'success');
    }

    listSong.isLiked = !listSong.isLiked;
  }

  setGenre(genre: string) {
    this.selectedGenre = this.selectedGenre === genre ? '' : genre;
  }

  get filteredList() {
    return this.selectedGenre
      ? this.list.filter(listSong => listSong.genre === this.selectedGenre)
      : this.list;
  }

  playSong(song: any) {
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

  // Format giây thành mm:ss
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${this.pad(minutes)}:${this.pad(secs)}`;
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
