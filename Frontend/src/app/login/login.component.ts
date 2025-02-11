import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service'; // นำเข้า AuthService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        console.log('Login successful', response);
        // Store JWT token in localStorage for authentication purpose
        localStorage.setItem('authToken', response.token);
        // You can also navigate to another page on successful login
      },
      error => {
        console.error('Login failed', error);
        // Handle login failure, show an error message to the user
      }
    );
  }

  onForgotPassword() {
    console.log('Forgot Password clicked');
    // ดำเนินการที่ต้องการเมื่อคลิก "Forgot Password"
  }

  onCreateAccount() {
    console.log('Create New Account clicked');
    // ดำเนินการที่ต้องการเมื่อคลิก "Create New Account"
  }
}
