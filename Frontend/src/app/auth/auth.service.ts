import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router'; // เพิ่มการนำเข้า Router

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/API/auth'; // แก้ URL ตาม Backend จริง

  constructor(private http: HttpClient, private router: Router) {} // เพิ่มการใช้งาน Router

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string; role: string; user_id: number }>(
      `${this.apiUrl}/login`, 
      { email, password }
    ).pipe(
      tap(response => {
        if (response.token) {
          this.storeToken(response.token, response.role, response.user_id);
        }
      })
    );
  }
  
  private storeToken(token: string, role: string, user_id: number): void {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('user_id', user_id.toString());
    this.router.navigate(['/home']); // หรือเปลี่ยนเส้นทางตาม role
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  resetPassword(email: string, phone: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, { email, phone, newPassword });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserRole(): string | null {
    return localStorage.getItem('role'); // ดึง role จาก localStorage
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    this.router.navigate(['/home']);
  }
}
