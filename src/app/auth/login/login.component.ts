import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/core/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;

  constructor(private backendService: BackendService, private router: Router) {}

  login() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.backendService
      .login({
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: (result) => {
          this.loading = false;
          this.successMessage = 'Login successful!';
          localStorage.setItem('authToken', result.token);
          localStorage.setItem('userId',result.data.userId);
          localStorage.setItem('name',result.data.fullName)
          if (result.data.role == 'admin')
            this.router.navigateByUrl('/admin/dashboard');
          else this.router.navigateByUrl('/student/dashboard');

          // redirect or other logic here
        },
        error: (error: any) => {
          this.loading = false;
          this.errorMessage =
            error?.error?.message || 'Login failed. Please try again.';
        },
      });
  }
}
