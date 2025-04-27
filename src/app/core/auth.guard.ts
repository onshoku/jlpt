// src/app/core/guards/auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const role = this.authService.getUserRole();
    // const role = 'student';

    if (role === 'student') {
      this.router.navigate(['/student/dashboard']);
      return false;
    } else if (role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
      return false;
    }

    return true; // allow if not logged in
  }
}
