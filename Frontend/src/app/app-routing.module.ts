import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { OwnerPageComponent } from './owner-page/owner-page.component';
import { EmployeePageComponent } from './employee-page/employee-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
const routes: Routes = [
  { path: 'home',component:HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'owner', component: OwnerPageComponent },
  { path: 'employee', component: EmployeePageComponent },
  { path: 'user', component: UserPageComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'navbar',component:NavbarComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // ใช้ forRoot เพื่อกำหนดเส้นทาง
  exports: [RouterModule]
})
export class AppRoutingModule { }
