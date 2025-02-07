import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/user']); // เปลี่ยนเส้นทางหลัง login สำเร็จ
      },
      error: (err) => {
        this.errorMessage = 'Login failed. Please try again.';
      }
    });
  }
}
