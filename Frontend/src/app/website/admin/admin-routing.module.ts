import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SongComponent } from './song/song.component';
import { AdminAccountComponent } from './account/admin-account/admin-account.component';
import { UserAcccountComponent } from './account/user-acccount/user-acccount.component';
import { ContactComponent } from './contact/contact.component';
import { GenreComponent } from './genre/genre.component';
import { DetailContactComponent } from './contact/detail-contact/detail-contact.component';
import { DetailSongComponent } from './song/detail-song/detail-song.component';


const routes: Routes = [
  {
      path: '', component: AdminComponent, children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: DashboardComponent }, 
        { path: 'song', component: SongComponent },
        { path: 'admin-account', component: AdminAccountComponent },
        { path: 'user-account', component: UserAcccountComponent },
        { path: 'contact', component: ContactComponent },  
        { path: 'genre', component: GenreComponent },
        { path: 'detail-contact', component: DetailContactComponent},
        { path: 'detail-song', component: DetailSongComponent},
        { path: 'logout', redirectTo: '/auth/logout', pathMatch: 'full' },
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
