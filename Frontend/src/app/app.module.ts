import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // นำเข้า FormsModule ให้ถูกต้อง
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { OwnerPageComponent } from './owner-page/owner-page.component';
import { EmployeePageComponent } from './employee-page/employee-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { RouterModule } from '@angular/router'; 
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    OwnerPageComponent,
    EmployeePageComponent,
    UserPageComponent,
    UnauthorizedComponent,
    NavbarComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,  // เพิ่ม FormsModule ที่นี่
    HttpClientModule,
    AppRoutingModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [LoginComponent]
})
export class AppModule { }
