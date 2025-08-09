import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isDropdownOpen = false;
  isClicked = false;

  searchQuery = '';
  openSearch = false;

  suggestions = [
    'em xinh say hi',
    'phim ba người',
    'anh vui',
    'phép màu',
    '10 mắt 1 còn không',
    '#zingchart'
  ];
  filteredSuggestions = [...this.suggestions];

  time: string = '';
  is24Hour: boolean = true;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startClock();
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleClick() {
    this.isClicked = !this.isClicked;
  }

  startClock(): void {
    setInterval(() => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = this.padZero(now.getMinutes());
      const seconds = this.padZero(now.getSeconds());

      let ampm = '';
      if (!this.is24Hour) {
        ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
      }

      const hoursStr = this.padZero(hours);
      this.time = `${hoursStr}:${minutes}:${seconds}${!this.is24Hour ? ' ' + ampm : ''}`;
    }, 1000);
  }

  toggleClockFormat(): void {
    this.is24Hour = !this.is24Hour;
  }

  padZero(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  filterSuggestions() {
    const q = this.searchQuery.toLowerCase();
    this.filteredSuggestions = this.suggestions.filter(s =>
      s.toLowerCase().includes(q)
    );
  }

  selectSuggestion(item: string) {
    this.searchQuery = item;
    this.openSearch = false;
  }

  @HostListener('document:click')
  closeSearch() {
    this.openSearch = false;
  }
}
