import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { MusicPlayerService } from '../../../services/music-player.service';

@Component({
  selector: 'app-favorite-song',
  templateUrl: './favorite-song.component.html',
  styleUrls: ['./favorite-song.component.css']  // sửa 'styleUrsl' thành 'styleUrls'
})
export class FavoriteSongComponent implements OnInit {
  // ==== Dữ liệu bài hát ====
  favorite = [
    {
      image: '/assets/images/moloichoem.jpg',
      songName: 'Mở Lối Cho Em',
      artist: 'Lương Huy Tuấn, Hữu Công',
      isLiked: true,
      audioUrl: '/assets/audio/moloichoem.mp3',
      duration: ''
    },
    {
      image: '/assets/images/noinhovohan.jpg',
      songName: 'Nỗi Nhớ Vô Hạn',
      artist: 'Thanh Hưng',
      isLiked: true,
      audioUrl: '/assets/audio/noinhovohan.mp3',
      duration: ''
    },
    {
      image: '/assets/images/moloichoem2.jpg',
      songName: 'Mở Lối Cho Em 2',
      artist: 'Lương Huy Tuấn, An Clock',
      isLiked: true,
      audioUrl: '/assets/audio/moloichoem2.mp3',
      duration: ''
    },
    {
      image: '/assets/images/vansutuyduyen.jpg',
      songName: 'Vạn Sự Tùy Duyên',
      artist: 'Thanh Hưng',
      isLiked: true,
      audioUrl: '/assets/audio/vansutuyduyen.mp3',
      duration: ''
    },
    {
      image: '/assets/images/duoitancaykhohoano.jpg',
      songName: 'Dưới Tán Cây Khô Hoa Nở',
      artist: 'J97',
      isLiked: true,
      audioUrl: '/assets/audio/duoitancaykhohoano.mp3',
      duration: ''
    },
    {
      image: '/assets/images/suotdoikhongxung.jpg',
      songName: 'Suốt Đời Không Xứng',
      artist: 'Khải Đăng, Vương Anh Tú, Ribi Sachi',
      isLiked: true,
      audioUrl: '/assets/audio/suotdoikhongxung.mp3',
      duration: ''
    },
    {
      image: '/assets/images/chanhlongthuongco4.jpg',
      songName: 'Chạnh Lòng Thương Cô 4',
      artist: 'Huy Vạc',
      isLiked: true,
      audioUrl: '/assets/audio/chanhlongthuongco4.mp3',
      duration: ''
    },
    {
      image: '/assets/images/chieuthuhoabongnang.jpg',
      songName: 'Chiều Thu Họa Bóng Nàng',
      artist: 'Đatkka',
      isLiked: true,
      audioUrl: '/assets/audio/chieuthuhoabongnang.mp3',
      duration: ''
    },
    {
      image: '/assets/images/tralaithanhxuanchoem.jpg',
      songName: 'Trả Lại Thanh Xuân Cho Em',
      artist: 'H2K', 
      isLiked: true,
      audioUrl: '/assets/audio/tralaithanhxuanchoem.mp3',
      duration: ''
    }
  ];

  likedSongs: any[] = [];
  currentSong: any = null;
  isPlaying: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private musicplayerService: MusicPlayerService
  ) {}

  ngOnInit() {
    this.favorite.forEach(favoriteSong => {
      const audio = new Audio(favoriteSong.audioUrl);
      audio.addEventListener('loadedmetadata', () => {
        favoriteSong.duration = this.formatTime(audio.duration);
      });
    });

    this.musicplayerService.currentSong$.subscribe(song => this.currentSong = song);
    this.musicplayerService.isPlaying$.subscribe(state => this.isPlaying = state);
  }

  toggleLike(index: number) {
    const favoriteSong = this.favorite[index];

    if (favoriteSong.isLiked) {
      this.likedSongs = this.likedSongs.filter(song => song !== favoriteSong);
      this.notificationService.showMessage(`${favoriteSong.songName} đã xóa khỏi danh sách yêu thích`, 'success');
    } else {
      this.likedSongs.push(favoriteSong);
      this.notificationService.showMessage(`${favoriteSong.songName} đã thêm vào danh sách yêu thích`, 'success');
    }

    favoriteSong.isLiked = !favoriteSong.isLiked;
  }

  playSong(song: any) {
    if (this.currentSong === song) {
      this.musicplayerService.togglePlayPause();
    } else {
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
}
