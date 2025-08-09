import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SongComponent } from './song/song.component';
import { AdminAccountComponent } from './account/admin-account/admin-account.component';
import { UserAcccountComponent } from './account/user-acccount/user-acccount.component';
import { ContactComponent } from './contact/contact.component';
import { DetailContactComponent } from './contact/detail-contact/detail-contact.component';
import { DetailSongComponent } from './song/detail-song/detail-song.component';
import { GenreComponent } from './genre/genre.component';


@NgModule({
  declarations: [
    AdminComponent,
    SidebarComponent,
    NavbarComponent,
    DashboardComponent,
    SongComponent,
    AdminAccountComponent,
    UserAcccountComponent,
    ContactComponent,
    DetailContactComponent,
    DetailSongComponent,
    GenreComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule
  ]
})
export class AdminModule { }
