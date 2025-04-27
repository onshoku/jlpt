// src/app/core/services/auth.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router
  ) {}

  // Save JWT token after login
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Remove token on logout
  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/auth/login']);
  }

  // Decode token to get user role (simple example)
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    const payload = JSON.parse(atob(token.split('.')[1])); // decode JWT
    return payload.role || null;
  }

  // Check if student is logged in
  isStudentLoggedIn(): boolean {
    const role = this.getUserRole();
    return role === 'student';
  }

  // Check if admin is logged in
  isAdminLoggedIn(): boolean {
    const role = this.getUserRole();
    return role === 'admin';
  }
}
