import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { role: 'admin' } },// 🛑 admin เท่านั้น
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },// ✅ user และ admin เข้าได้
  { path: 'login', component: LoginComponent },
  { path: 'home',component:HomeComponent  },
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
