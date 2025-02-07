import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    const expectedRole = route.data['role']; // role ที่กำหนดใน routing
    const userRole = this.authService.getRole(); // ดึง role ของ user จาก token

    if (!isAuthenticated) {
      this.router.navigate(['/login']); // ถ้ายังไม่ได้ login ให้ไปหน้า login
      return false;
    }

    if (expectedRole && !expectedRole.includes(userRole)) {
      this.router.navigate(['/unauthorized']); // ถ้า role ไม่ตรงให้ไปหน้า Unauthorized
      return false;
    }

    return true;
  }
}
