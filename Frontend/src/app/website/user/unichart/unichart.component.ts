import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { MusicPlayerService } from '../../../services/music-player.service';
import { ChartConfiguration, ChartOptions, TooltipItem } from 'chart.js';

@Component({
  selector: 'app-unichart',
  templateUrl: './unichart.component.html',
  styleUrls: ['./unichart.component.css']
})
export class UnichartComponent implements OnInit {
  // ==== Dữ liệu bài hát ====
  unichartSong = [
    { image: '/assets/images/moloichoem.jpg', songName: 'Mở Lối Cho Em', artist: 'Lương Huy Tuấn, Hữu Công', genre: 'V-pop', isLiked: false, audioUrl: '/assets/audio/moloichoem.mp3', duration: '' },
    { image: '/assets/images/noinhovohan.jpg', songName: 'Nỗi Nhớ Vô Hạn', artist: 'Thanh Hưng', genre: 'V-pop', isLiked: false, audioUrl: '/assets/audio/noinhovohan.mp3', duration: '' },
    { image: '/assets/images/moloichoem2.jpg', songName: 'Mở Lối Cho Em 2', artist: 'Lương Huy Tuấn, An Clock', genre: 'V-pop', isLiked: false, audioUrl: '/assets/audio/moloichoem2.mp3', duration: '' },
    { image: '/assets/images/vansutuyduyen.jpg', songName: 'Vạn Sự Tùy Duyên', artist: 'Thanh Hưng', genre: 'V-pop', isLiked: false, audioUrl: '/assets/audio/vansutuyduyen.mp3', duration: '' },
    { image: '/assets/images/duoitancaykhohoano.jpg', songName: 'Dưới Tán Cây Khô Hoa Nở', artist: 'J97', genre: 'V-pop', isLiked: false, audioUrl: '/assets/audio/duoitancaykhohoano.mp3', duration: '' },
    { image: '/assets/images/suotdoikhongxung.jpg', songName: 'Suốt Đời Không Xứng', artist: 'Khải Đăng, Vương Anh Tú, Ribi Sachi', genre: 'V-pop', isLiked: false, audioUrl: '/assets/audio/suotdoikhongxung.mp3', duration: '' },
    { image: '/assets/images/chanhlongthuongco4.jpg', songName: 'Chạnh Lòng Thương Cô 4', artist: 'Huy Vạc', genre: 'V-pop', isLiked: false, audioUrl: '/assets/audio/chanhlongthuongco4.mp3', duration: '' },
    { image: '/assets/images/chieuthuhoabongnang.jpg', songName: 'Chiều Thu Họa Bóng Nàng', artist: 'Đatkka', genre: 'V-pop', isLiked: false, audioUrl: '/assets/audio/chieuthuhoabongnang.mp3', duration: '' },
    { image: '/assets/images/tralaithanhxuanchoem.jpg', songName: 'Trả Lại Thanh Xuân Cho Em', artist: 'H2K', genre: 'V-pop', isLiked: false, audioUrl: '/assets/audio/tralaithanhxuanchoem.mp3', duration: '' },
  ];

  // ==== Biểu đồ unichart ====
  public chartData: ChartConfiguration<'line'>['data'] = {
    labels: ['01:00', '03:00', '05:00', '07:00', '09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00', '23:00'],
    datasets: [
      {
        label: 'Hoa Bất Tử',
        data: [100, 95, 90, 110, 140, 135, 145, 150, 140, 130, 125, 135],
        borderColor: '#ff4d4d',
        backgroundColor: '#ff4d4d',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: 'white',
        pointBorderColor: '#ff4d4d',
      },
      {
        label: 'Yêu Người Có Ước Mơ',
        data: [120, 110, 100, 130, 160, 150, 160, 155, 150, 140, 135, 145],
        borderColor: '#36cfc9',
        backgroundColor: '#36cfc9',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: 'white',
        pointBorderColor: '#36cfc9',
      },
      {
        label: 'Ngày Mai Người Ta Lấy Chồng',
        data: [140, 130, 120, 160, 180, 170, 190, 185, 180, 170, 160, 180],
        borderColor: '#1890ff',
        backgroundColor: '#1890ff',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: 'white',
        pointBorderColor: '#1890ff',
      }
    ]
  };

  public chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#282c34',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: (tooltipItem: TooltipItem<'line'>) => {
            const label = tooltipItem.dataset.label || '';
            const value = tooltipItem.formattedValue;
            return `${label}: ${value}`;
          },
          title: () => ''
        }
      }
    },
    scales: {
      y: {
        ticks: {
          color: '#fff',
          display: false,
          maxTicksLimit: 6
        },
        grid: {
          color: '#333'
        },
        beginAtZero: true
      }
    }
  };

  unichart: any[] = [];
  likedSongs: any[] = [];
  currentSong: any = null;
  isPlaying: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private musicplayerService: MusicPlayerService
  ) {}

  ngOnInit(): void {
    // Gán thời lượng phát cho mỗi bài hát
    this.unichartSong.forEach(unichartSong => {
      const audio = new Audio(unichartSong.audioUrl);
      audio.addEventListener('loadedmetadata', () => {
        unichartSong.duration = this.formatTime(audio.duration);
      });
    });

    // Gán dữ liệu bài hát
    this.unichart = this.unichartSong;

    this.musicplayerService.currentSong$.subscribe(song => this.currentSong = song);
    this.musicplayerService.isPlaying$.subscribe(state => this.isPlaying = state);
  }

  // Phát bài hát hoặc chuyển bài mới
  playSong(song: any): void {
    if (this.currentSong?.songName === song.songName) {
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

  // Like/Unlike bài hát
  toggleLike(index: number): void {
    const song = this.unichart[index];
    if (song.isLiked) {
      this.likedSongs = this.likedSongs.filter(s => s !== song);
      this.notificationService.showMessage(`${song.songName} đã xóa khỏi danh sách yêu thích!`, 'success');
    } else {
      this.likedSongs.push(song);
      this.notificationService.showMessage(`${song.songName} đã thêm vào danh sách yêu thích!`, 'success');
    }
    song.isLiked = !song.isLiked;
  }
}
