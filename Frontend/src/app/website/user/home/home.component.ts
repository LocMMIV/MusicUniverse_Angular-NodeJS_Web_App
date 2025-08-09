import { Component, OnInit } from '@angular/core';
import { MusicPlayerService } from '../../../services/music-player.service';
import { NotificationService } from '../../../services/notification.service';
import { ChartConfiguration, ChartOptions, TooltipItem } from 'chart.js';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentSong: any = null;
  isPlaying: boolean = false;

  // ==== Danh sách gợi ý & Mới phát hành ====
  suggestSong = [
    { image: 'assets/images/moloichoem.jpg', songName: 'Mở Lối Cho Em', artist: 'Lương Huy Tuấn, Hữu Công', isLiked: false, audioUrl: 'assets/audio/moloichoem.mp3' },
    { image: 'assets/images/noinhovohan.jpg', songName: 'Nỗi Nhớ Vô Hạn', artist: 'Thanh Hưng', isLiked: false, audioUrl: 'assets/audio/noinhovohan.mp3' },
    { image: 'assets/images/moloichoem2.jpg', songName: 'Mở Lối Cho Em 2', artist: 'Lương Huy Tuấn, An Clock', isLiked: false, audioUrl: 'assets/audio/moloichoem2.mp3' },
    { image: 'assets/images/vansutuyduyen.jpg', songName: 'Vạn Sự Tùy Duyên', artist: 'Thanh Hưng', isLiked: false, audioUrl: 'assets/audio/vansutuyduyen.mp3' },
    { image: 'assets/images/duoitancaykhohoano.jpg', songName: 'Dưới Tán Cây Khô Hoa Nở', artist: 'J97', isLiked: false, audioUrl: 'assets/audio/duoitancaykhohoano.mp3' },
    { image: 'assets/images/suotdoikhongxung.jpg', songName: 'Suốt Đời Không Xứng', artist: 'Khải Đăng, Vương Anh Tú, Ribi Sachi', isLiked: false, audioUrl: 'assets/audio/suotdoikhongxung.mp3' },
    { image: 'assets/images/chanhlongthuongco4.jpg', songName: 'Chạnh Lòng Thương Cô 4', artist: 'Huy Vạc', isLiked: false, audioUrl: 'assets/audio/chanhlongthuongco4.mp3' },
    { image: 'assets/images/chieuthuhoabongnang.jpg', songName: 'Chiều Thu Họa Bóng Nàng', artist: 'Đatkka', isLiked: false, audioUrl: 'assets/audio/chieuthuhoabongnang.mp3' },
    { image: 'assets/images/tralaithanhxuanchoem.jpg', songName: 'Trả Lại Thanh Xuân Cho Em', artist: 'H2K', isLiked: false, audioUrl: 'assets/audio/tralaithanhxuanchoem.mp3' },
  ];

  newSong = [
    { image: 'assets/images/moloichoem.jpg', songName: 'Mở Lối Cho Em', artist: 'Lương Huy Tuấn, Hữu Công', isLiked: false, audioUrl: 'assets/audio/moloichoem.mp3' },
    { image: 'assets/images/noinhovohan.jpg', songName: 'Nỗi Nhớ Vô Hạn', artist: 'Thanh Hưng', isLiked: false, audioUrl: 'assets/audio/noinhovohan.mp3' },
    { image: 'assets/images/moloichoem2.jpg', songName: 'Mở Lối Cho Em 2', artist: 'Lương Huy Tuấn, An Clock', isLiked: false, audioUrl: 'assets/audio/moloichoem2.mp3' },
    { image: 'assets/images/vansutuyduyen.jpg', songName: 'Vạn Sự Tùy Duyên', artist: 'Thanh Hưng', isLiked: false, audioUrl: 'assets/audio/vansutuyduyen.mp3' },
    { image: 'assets/images/duoitancaykhohoano.jpg', songName: 'Dưới Tán Cây Khô Hoa Nở', artist: 'J97', isLiked: false, audioUrl: 'assets/audio/duoitancaykhohoano.mp3' },
    { image: 'assets/images/suotdoikhongxung.jpg', songName: 'Suốt Đời Không Xứng', artist: 'Khải Đăng, Vương Anh Tú, Ribi Sachi', isLiked: false, audioUrl: 'assets/audio/suotdoikhongxung.mp3' },
    { image: 'assets/images/chanhlongthuongco4.jpg', songName: 'Chạnh Lòng Thương Cô 4', artist: 'Huy Vạc', isLiked: false, audioUrl: 'assets/audio/chanhlongthuongco4.mp3' },
    { image: 'assets/images/chieuthuhoabongnang.jpg', songName: 'Chiều Thu Họa Bóng Nàng', artist: 'Đatkka', isLiked: false, audioUrl: 'assets/audio/chieuthuhoabongnang.mp3' },
    { image: 'assets/images/tralaithanhxuanchoem.jpg', songName: 'Trả Lại Thanh Xuân Cho Em', artist: 'H2K', isLiked: false, audioUrl: 'assets/audio/tralaithanhxuanchoem.mp3' },
  ];

  // Danh sách đã chia nhóm (3 cột/row)
  suggestRows: any[] = [];
  newRows: any[] = [];
  chunkSize = 3;

  // ==== Danh sách unichart ====
  top = [
    { image: 'assets/images/moloichoem.jpg', songName: 'Mở Lối Cho Em', artist: 'Lương Huy Tuấn, Hữu Công', audioUrl: 'assets/audio/moloichoem.mp3', view: 1000 },
    { image: 'assets/images/noinhovohan.jpg', songName: 'Nỗi Nhớ Vô Hạn', artist: 'Thanh Hưng', audioUrl: 'assets/audio/noinhovohan.mp3', view: 1000 },
    { image: 'assets/images/moloichoem2.jpg', songName: 'Mở Lối Cho Em 2', artist: 'Lương Huy Tuấn, An Clock', audioUrl: 'assets/audio/moloichoem2.mp3', view: 1000 },
  ];

  // ==== Biểu đồ unichart (Dữ liệu + Config) ====
  public chartData: ChartConfiguration<'line'>['data'] = {
    labels: ['01:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
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

  constructor(
    private notificationService: NotificationService,
    private musicplayerService: MusicPlayerService
  ) {}

  ngOnInit() {
    this.suggestRows = this.chunkArray(this.suggestSong, this.chunkSize);
    this.newRows = this.chunkArray(this.newSong, this.chunkSize);

    this.musicplayerService.currentSong$.subscribe(song => this.currentSong = song);
    this.musicplayerService.isPlaying$.subscribe(state => this.isPlaying = state);
  }

  // Chia array thành các nhóm con
  chunkArray(array: any[], chunkSize: number): any[] {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result.slice(0, 3);
  }

  // Phát hoặc dừng bài hát
  playSong(song: any) {
    if (this.currentSong?.songName === song.songName) {
      this.musicplayerService.togglePlayPause();
    } else {
      this.musicplayerService.setCurrentSong(song);
    }
  }

  // Like/Unlike bài hát
  toggleLike(type: 'suggest' | 'new', rowIndex: number, columnIndex: number): void {
    const globalIndex = rowIndex * this.chunkSize + columnIndex;
    const song = type === 'suggest' ? this.suggestSong[globalIndex] : this.newSong[globalIndex];
    if (!song) return;

    song.isLiked = !song.isLiked;
    const action = song.isLiked ? 'thêm vào' : 'xóa khỏi';
    this.notificationService.showMessage(`${song.songName} đã ${action} danh sách yêu thích!`, 'success');
  }

  // Định dạng lượt xem theo K, M, B
  formatViews(view: number): string {
    if (view < 1000) return view.toString();
    if (view >= 1_000_000_000) {
      const billions = Math.floor(view / 1_000_000_000);
      const remainder = Math.floor((view % 1_000_000_000) / 100_000_000);
      return remainder === 0 ? `${billions}B` : `${billions}B${remainder}`;
    }
    if (view >= 1_000_000) {
      const millions = Math.floor(view / 1_000_000);
      const remainder = Math.floor((view % 1_000_000) / 100_000);
      return remainder === 0 ? `${millions}M` : `${millions}M${remainder}`;
    }
    const thousands = Math.floor(view / 1000);
    const remainder = Math.floor((view % 1000) / 100);
    return remainder === 0 ? `${thousands}K` : `${thousands}K${remainder}`;
  }
}