import { Component } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { BackendService } from 'src/app/core/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  fullName = '';
  email = '';
  phoneNumber = '';
  password = '';
  acceptTerms = false;

  otp = '';
  otpSent = false;
  otpVerified = false;

  loading = false;
  errorMessage = '';
  successMessage = '';

  otpExpiresIn = 0;
  otpTimerSub: Subscription | null = null;

  constructor(private backendService: BackendService) {}

  register() {
    this.resetMessages();
    if (!this.acceptTerms) {
      this.errorMessage = 'Please accept the terms and privacy policy.';
      return;
    }
    
    const errors = this.validateRegistration()
    console.log(errors);
    if(errors.length > 0){
      this.errorMessage = errors.map(msg => `• ${msg}`).join('<br>');
      return;
    }

    this.loading = true;

    const payload = {
      fullName: this.fullName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      password: this.password,
      role: 'student',
    };

    this.backendService.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'OTP sent to your email. Please verify.';
        this.otpSent = true;
        this.startOtpTimer(120); // 2 min expiry
      },
      error: (err) => {
        this.loading = false;
        console.log(err);

        this.errorMessage = err?.error.errors[0]?.msg || 'Registration failed.';
      },
    });
  }

  verifyOtp() {
    this.resetMessages();
    if (!this.otp) {
      this.errorMessage = 'Please enter the OTP.';
      return;
    }

    this.loading = true;

    this.backendService
      .verifyOtp({ email: this.email, otp: this.otp })
      .subscribe({
        next: () => {
          this.loading = false;
          this.otpVerified = true;
          this.successMessage = 'OTP verified! Registration complete.';
          this.clearOtpTimer();
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage =
            err?.error.message || 'OTP verification failed.';
        },
      });
  }

  resendOtp() {
    this.resetMessages();
    this.backendService.resendOtp({ email: this.email }).subscribe({
      next: () => {
        this.successMessage = 'New OTP sent.';
        this.startOtpTimer(120); // restart timer
      },
      error: (err) => {
        this.errorMessage =
          err?.error.errors[0]?.msg || 'Failed to resend OTP.';
      },
    });
  }

  startOtpTimer(seconds: number) {
    this.otpExpiresIn = seconds;
    this.clearOtpTimer();

    this.otpTimerSub = interval(1000).subscribe(() => {
      this.otpExpiresIn--;
      if (this.otpExpiresIn <= 0) {
        this.clearOtpTimer();
      }
    });
  }

  clearOtpTimer() {
    if (this.otpTimerSub) {
      this.otpTimerSub.unsubscribe();
      this.otpTimerSub = null;
    }
  }

  resetMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  validateRegistration(): string[] {
    const errors: string[] = [];

    // Full Name
    if (!this.fullName || !this.fullName.trim()) {
      errors.push('Full name is required');
    } else if (this.fullName.length > 100) {
      errors.push('Full name cannot exceed 100 characters');
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email || !this.email.trim()) {
      errors.push('Email is required');
    } else if (!emailRegex.test(this.email)) {
      errors.push('Please provide a valid email');
    }

    // Phone Number
    const phoneRegex =
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{3,6}$/;
    if (!this.phoneNumber || !this.phoneNumber.trim()) {
      errors.push('Phone number is required');
    } else if (!phoneRegex.test(this.phoneNumber)) {
      errors.push('Please provide a valid phone number');
    }

    // Password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!this.password) {
      errors.push('Password is required');
    } else if (this.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    } else if (!passwordRegex.test(this.password)) {
      errors.push(
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      );
    }

    return errors;
  }
}
