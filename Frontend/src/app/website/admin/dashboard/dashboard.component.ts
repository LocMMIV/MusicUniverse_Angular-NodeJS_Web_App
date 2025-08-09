import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  daysOfWeek: string[] = [];
  daysLabels: string[] = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  currentDate: string = '';
  currentWeekStart: Date = new Date();
  selectedDate: Date | null = null; // Biến lưu trữ ngày được chọn

  constructor() { }

  ngOnInit(): void {
    this.setWeekStart();
    this.getDaysOfWeek();
    this.getCurrentDate();
  }

  // Đặt ngày đầu tuần (Thứ Hai)
  setWeekStart(): void {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Chủ nhật = 0, Thứ hai = 1, ...
    const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Nếu là Chủ nhật thì về Thứ Hai tuần trước
    this.currentWeekStart = new Date(today);
    this.currentWeekStart.setDate(today.getDate() + offset); // Lùi/gia hạn để về đầu tuần
  }

  getDaysOfWeek(): void {
    this.daysOfWeek = []; // Đặt lại mảng để tránh trùng lặp khi thay đổi tuần
    const firstDayOfWeek = new Date(this.currentWeekStart);
    
    // Tạo mảng các ngày trong tuần
    for (let i = 0; i < 7; i++) {
      const day = new Date(firstDayOfWeek);
      day.setDate(firstDayOfWeek.getDate() + i);
      this.daysOfWeek.push(day.getDate().toString()); // Lấy ngày trong tháng
    }
  }

  getCurrentDate(): void {
    const today = new Date();
    
    // Lấy ngày, tháng, năm từ đối tượng Date
    const day = today.getDate();
    const month = today.getMonth() + 1;  // Lưu ý tháng bắt đầu từ 0, nên cộng thêm 1
    const year = today.getFullYear();
  
    // Định dạng lại theo kiểu "Ngày 6 Tháng 1 Năm 2025"
    this.currentDate = `Ngày ${day} Tháng ${month} Năm ${year}`;
  }
  

  isToday(index: number): boolean {
    const today = new Date();
    const selectedDay = new Date(this.currentWeekStart);
    selectedDay.setDate(this.currentWeekStart.getDate() + index);

    return (
      today.getDate() === selectedDay.getDate() &&
      today.getMonth() === selectedDay.getMonth() &&
      today.getFullYear() === selectedDay.getFullYear()
    );
  }

  isSelected(index: number): boolean {
    const selectedDay = new Date(this.currentWeekStart);
    selectedDay.setDate(this.currentWeekStart.getDate() + index);

    return this.selectedDate !== null &&
      this.selectedDate.getDate() === selectedDay.getDate() &&
      this.selectedDate.getMonth() === selectedDay.getMonth() &&
      this.selectedDate.getFullYear() === selectedDay.getFullYear();
  }

  selectDate(index: number): void {
    const selectedDay = new Date(this.currentWeekStart);
    selectedDay.setDate(this.currentWeekStart.getDate() + index);
    this.selectedDate = selectedDay;
  
    this.currentDate = `Ngày ${selectedDay.getDate()} Tháng ${selectedDay.getMonth() + 1} Năm ${selectedDay.getFullYear()}`;
  }
  

  resetDate(): void {
    this.selectedDate = null; // Đặt lại ngày đã chọn
    this.setWeekStart();

    // Cập nhật lại danh sách các ngày trong tuần
    this.getDaysOfWeek();
    this.getCurrentDate(); // Quay lại ngày hiện tại
  }

  previousWeek(): void {
    // Lùi về tuần trước
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.getDaysOfWeek();
    this.getCurrentDate();
  }

  nextWeek(): void {
    // Tiến tới tuần sau
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.getDaysOfWeek();
    this.getCurrentDate();
  }
}
