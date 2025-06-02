import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-student',
  templateUrl: './header-student.component.html',
  styleUrls: ['./header-student.component.scss']
})
export class HeaderStudentComponent {
  dropdownOpen = false;
  mobileMenuOpen = false;
  isMobileView = false;
  userName = 'Student'; // This would come from your auth service

  constructor(private router:Router){}
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkMobileView();
  }

  ngOnInit(): void {
    this.checkMobileView();
    // Initialize user data from service
  }

  checkMobileView(): void {
    this.isMobileView = window.innerWidth <= 768;
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  logout(): void {
    // Implement logout functionality
    console.log('Logging out...');
    localStorage.removeItem('authToken');
    this.router.navigateByUrl("/auth/login")
    this.dropdownOpen = false;
    this.mobileMenuOpen = false;
  }
}
