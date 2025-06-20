import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/core/api.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent {
email = '';
  password = '';
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;

  constructor(private backendService: BackendService, private router: Router) {}

  forgot() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.backendService
      .forgot({
        email: this.email
      })
      .subscribe({
        next: (result) => {
          this.loading = false;
          this.successMessage = 'Link Sent to Email';
            

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
