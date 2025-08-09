import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';


import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { UnichartComponent } from './unichart/unichart.component';
import { MusicsidebarComponent } from './components/musicsidebar/musicsidebar.component';
import { ListSongComponent } from './list-song/list-song.component';
import { FavoriteSongComponent } from './favorite-song/favorite-song.component';
import { UploadSongComponent } from './upload-song/upload-song.component';

@NgModule({
  declarations: [
    UserComponent,
    SidebarComponent,
    NavbarComponent,
    MusicsidebarComponent,
    HomeComponent,
    UnichartComponent,
    ListSongComponent,
    FavoriteSongComponent,
    UploadSongComponent,
  ],
  imports: [CommonModule, UserRoutingModule, FormsModule, NgChartsModule],
  exports: [UnichartComponent]
})
export class UserModule {}
