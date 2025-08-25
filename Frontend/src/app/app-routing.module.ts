import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'user', pathMatch: 'full' }, // Điều hướng mặc định
  { path: 'admin', loadChildren: () => import('./website/admin/admin.module').then(m => m.AdminModule) },
  { path: 'user', loadChildren: () => import('./website/user/user.module').then(m => m.UserModule) },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: '**', redirectTo: 'user' } // Điều hướng đến trang người dùng nếu không tìm thấy đường dẫn
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
