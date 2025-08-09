import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ConfirmdeleteService {
  private selectedIndex: number | null = null;
  private confirmSubject = new Subject<boolean>();

  constructor(private notificationService: NotificationService) {}

  // Mở dialog
  openDialog(index: number) {
    this.selectedIndex = index;
  }

  // Đóng dialog
  closeDialog() {
    this.selectedIndex = null;
  }

  // Lấy chỉ mục hiện tại
  getSelectedIndex(): number | null {
    return this.selectedIndex;
  }

  // Xử lý xác nhận
  confirmDelete(data: any[], action: 'accepted', idKey: string, nameKey: string, customMessage: string) {
    if (this.selectedIndex !== null) {
      const selectedItem = data[this.selectedIndex];
      if (action === 'accepted') {
        selectedItem.status = action;
        const itemName = selectedItem[nameKey];

        this.notificationService.showMessage(customMessage.replace('{{name}}', itemName), 'success');
      }

      this.closeDialog();
    }
  }
}
