import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail-song',
  templateUrl: './detail-song.component.html',
  styleUrl: './detail-song.component.css'
})
export class DetailSongComponent implements OnInit {
  song = {
    songName: 'Mở Lối Cho Em',
    image: 'assets/images/moloichoem.jpg',
    audio: 'assets/audio/moloichoem.mp3',
    artist: 'Lương Quý Tuấn, Hữu Công',
    genre: 'Nhạc trẻ',
    lyric: `[Verse 1]

Cạn lòng vì nhau như thế
Nhận về thị phi cười chê
Anh chẳng được chút thoải mái
Vô tư hả hê
Bỏ qua mọi chuyện anh cố
Cho dù biết sẽ sụp đổ
Khát khao lập lờ
Nhưng anh vẫn luôn đứng chờ
Đậm sâu rồi cũng rẽ hai
Anh ngỡ rằng tình sẽ không phai
Quan tâm đến nỗi sơ sài
Nên anh cũng chẳng biết trách ai
Nhiều bi hài phủ xuống vai
Anh hứng trọn bầu trời tê tái
Đành phải mở lối tiễn bước em đi
Mong được hòa giải

[Chorus 1]

Từ ngày em đi
Anh trằn trọc từng dòng suy nghĩ
Đau buốt cõi lòng
Không thấy đâu yên bình thong dong
Từ ngày em xa
Anh gục ngã chiều mưa tầm tã
Năm tháng đậm đà
Tan biến theo chiều tà lạnh giá
Hụt hẫng đêm khuya
Anh lặng thắp vài giọt dầu dư
Tim lan cháy lụi
Anh phải ôm sầu tư một mình
Cuộc tình chông chênh
Chia hai đứa mỗi người một nhánh
Tai ương bất hạnh
Sao chính anh lại là người gánh

[Verse 2]

Đậm sâu rồi cũng rẽ hai
Anh ngỡ rằng tình sẽ không phai
Quan tâm đến nỗi sơ sài
Nên anh cũng chẳng biết trách ai
Nhiều bi hài phủ xuống vai
Anh hứng trọn bầu trời tê tái
Đành phải mở lối tiễn bước em đi
Mong được hòa giải

[Chorus 2]

Từ ngày em đi
Anh trằn trọc từng dòng suy nghĩ
Đau buốt cõi lòng
Không thấy đâu yên bình thong dong
Từ ngày em xa
Anh gục ngã chiều mưa tầm tã
Năm tháng đậm đà
Tan biến theo chiều tà lạnh giá
Hụt hẫng đêm khuya
Anh lặng thắp vài giọt dầu dư
Tim lan cháy lụi
Anh phải ôm sầu tư một mình
Cuộc tình chông chênh
Chia hai đứa mỗi người một nhánh
Tai ương bất hạnh
Sao chính anh lại là người gánh

[Chorus 3]

Từ ngày em đi
Anh trằn trọc từng dòng suy nghĩ
Đau buốt cõi lòng
Không thấy đâu yên bình thong dong
Từ ngày em xa
Anh gục ngã chiều mưa tầm tã
Năm tháng đậm đà
Tan biến theo chiều tà lạnh giá
Hụt hẫng đêm khuya
Anh lặng thắp vài giọt dầu dư
Tim lan cháy lụi
Anh phải ôm sầu tư một mình
Cuộc tình chông chênh
Chia hai đứa mỗi người một nhánh
Tai ương bất hạnh
Sao chính anh lại là người gánh`
  };

  constructor(
    private router: Router
  ) {
    // Thay thế ký tự xuống dòng bằng <br>
    this.song.lyric = this.song.lyric.replace(/\n/g, '<br>');
  }
  
  isPlaying: boolean = false;
  currentTime: number = 0;
  audioDuration: number = 0;
  audio!: HTMLAudioElement;
  seekbarGradient: string = 'linear-gradient(to right, deepskyblue 0%, gray 0%)';

  ngOnInit() {
    // Khởi tạo đối tượng Audio với song.audio
    this.audio = new Audio(this.song.audio);

    this.audio.onloadedmetadata = () => {
      this.audioDuration = this.audio.duration;
      this.updateSeekbarGradient();
    };

    this.audio.ontimeupdate = () => {
      this.currentTime = this.audio.currentTime;
      this.updateSeekbarGradient();
    };
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  onTimeUpdate() {
    this.audio.currentTime = this.currentTime;
    this.updateSeekbarGradient();
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  updateSeekbarGradient() {
    const percentage = (this.currentTime / this.audioDuration) * 100;
    this.seekbarGradient = `linear-gradient(to right, deepskyblue ${percentage}%, gray ${percentage}%)`;
  }

  // Phương thức xử lý khi người dùng nhấn "Giải quyết"
  onResolve() {
    
  }

  // Phương thức quay lại (giả lập quay lại trang trước)
  onGoBack() {
    this.router.navigate(['/song']);
  }
}
