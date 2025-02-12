import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRole = this.authService.getUserRole(); // ดึง role จาก AuthService

    if (!userRole) {
      this.router.navigate(['/login']); // ถ้าไม่ได้ล็อกอิน ให้กลับไปหน้า login
      return false;
    }

    // 🔹 ถ้าหน้า admin และ user ไม่มีสิทธิ์
    if (route.data['role'] === 'admin' && userRole !== 'admin') {
      this.router.navigate(['/']); // กลับไปหน้าหลัก
      return false;
    }

    return true; // ✅ ให้ผ่านได้
  }
}
