import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { NotificationService } from '../../../../services/notification.service';
import { SongsService } from '../../../../services/songs.service';
import { AuthService } from '../../../../services/auth.service';
import { environment } from '../../../../../environments/environment';

type Me = {
  id: number;
  name: string;
  account_name: string;
  email: string;
  // BE /auth/me hiện không bắt buộc trả 2 field này, để optional
  avatar_url?: string | null;
  created_at?: string | null;
};

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  // ---- account dropdown ----
  isDropdownOpen = false;
  isClicked = false;

  // ---- search ----
  searchQuery = '';
  openSearch = false;
  suggestions: string[] = [];
  filteredSuggestions: string[] = [];

  // ---- clock ----
  time: string = '';
  is24Hour = true;

  // ---- user/me ----
  me: Me | null = null;

  // ---- account form (fill từ me) ----
  isInformationFormVisible = false;
  errorMessage = '';

  accountInformation = {
    avatarUrl: 'assets/default-avatar.png',
    id: '',
    fullName: '',
    email: '',
    username: '',
    createdAt: new Date(),
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private notify: NotificationService,
    private songsSvc: SongsService,
    private authSvc: AuthService,
    private router: Router,
  ) {}

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) this.startClock();

    if (this.authSvc.isLoggedIn) {
      await this.loadMe();
    }
  }

  // ========== LOAD ME ==========
  private async loadMe() {
    try {
      const u = await firstValueFrom(this.authSvc.me());
      this.me = u as any;
      this.patchAccountInfoFromMe();
    } catch (e) {
      console.warn('loadMe failed', e);
    }
  }

  private patchAccountInfoFromMe() {
    if (!this.me) return;
    this.accountInformation.id       = this.me.account_name || '';
    this.accountInformation.fullName = this.me.name || '';
    this.accountInformation.email    = this.me.email || '';
    this.accountInformation.username = this.me.account_name || '';

    const raw = (this.me.avatar_url || '').trim();
    this.accountInformation.avatarUrl =
      raw
        ? (raw.startsWith('http') ? raw : environment.assetsUrl + raw)
        : 'assets/default-avatar.png';

    this.accountInformation.createdAt =
      this.me.created_at ? new Date(this.me.created_at) : new Date();
  }

  // ========== CLOCK ==========
  startClock(): void {
    setInterval(() => {
      const now = new Date();
      let h = now.getHours();
      const m = this.padZero(now.getMinutes());
      const s = this.padZero(now.getSeconds());
      let ampm = '';
      if (!this.is24Hour) {
        ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
      }
      this.time = `${this.padZero(h)}:${m}:${s}${!this.is24Hour ? ' ' + ampm : ''}`;
    }, 1000);
  }
  toggleClockFormat() { this.is24Hour = !this.is24Hour; }
  padZero(n: number) { return n < 10 ? '0' + n : '' + n; }

  // ========== SEARCH ==========
  async filterSuggestions() {
    const q = (this.searchQuery || '').trim();
    if (!q) { this.filteredSuggestions = []; return; }
    try {
      const res: any = await firstValueFrom(this.songsSvc.list({ q, page: 1, limit: 6 }));
      const rows = res?.data ?? [];
      this.suggestions = rows.map((s: any) => s.title);
      this.filteredSuggestions = this.suggestions;
    } catch {
      this.filteredSuggestions = [];
    }
  }

  selectSuggestion(item: string) {
    this.searchQuery = item;
    this.openSearch = false;
    this.submitSearch();
  }

  submitSearch() {
    const q = (this.searchQuery || '').trim();
    if (!q) {
      this.notify.showMessage('Nhập từ khóa để tìm bài hát.', 'warning');
      return;
    }
    this.openSearch = false;
    this.router.navigate(['/list-song'], { queryParams: { q } });
  }

  @HostListener('document:click') closeSearch() { this.openSearch = false; }

  // ========== DROPDOWN ==========
  toggleDropdown() { this.isDropdownOpen = !this.isDropdownOpen; }
  toggleClick()    { this.isClicked = !this.isClicked; }

  // ========== ACCOUNT FORM ==========
  toggleInformationForm() {
    this.isInformationFormVisible = !this.isInformationFormVisible;
    if (this.isInformationFormVisible && this.me) this.patchAccountInfoFromMe();
    if (!this.isInformationFormVisible) this.errorMessage = '';
  }

  validateForm(): boolean {
    const { fullName, email, id } = this.accountInformation;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!fullName?.trim()) { this.notify.showMessage('Họ tên không được để trống!', 'warning'); return false; }
    if (!email || !emailPattern.test(email)) { this.notify.showMessage('Email không hợp lệ!', 'error'); return false; }
    if (!id?.trim()) { this.notify.showMessage('Uni ID không được để trống!', 'warning'); return false; }
    this.notify.showMessage('Sửa hồ sơ thành công!', 'success');
    return true;
  }

  canEditFullName(): boolean { return this.getDaysSinceCreation(this.accountInformation.createdAt) >= 7; }
  canEditId(): boolean       { return this.getDaysSinceCreation(this.accountInformation.createdAt) >= 30; }

  getDaysSinceCreation(date: Date): number {
    const diff = Date.now() - new Date(date).getTime();
    return Math.floor(diff / (1000 * 3600 * 24));
  }

  submitInformationForm() {
    if (this.validateForm()) {
      console.log('Thông tin tài khoản đã được cập nhật:', this.accountInformation);
      this.toggleInformationForm();
    }
  }

  onAvatarChange(event: any) {
    const file = event?.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e: any) => this.accountInformation.avatarUrl = e.target.result;
    reader.readAsDataURL(file);
  }
}
