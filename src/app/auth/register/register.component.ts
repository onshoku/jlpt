import { Component } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { BackendService } from 'src/app/core/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
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

    this.loading = true;

    const payload = {
      fullName: this.fullName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      password: this.password
    };

    this.backendService.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'OTP sent to your email. Please verify.';
        this.otpSent = true;
        this.startOtpTimer(600); // 2 min expiry
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Registration failed.';
      }
    });
  }

  verifyOtp() {
    this.resetMessages();
    if (!this.otp) {
      this.errorMessage = 'Please enter the OTP.';
      return;
    }

    this.loading = true;

    this.backendService.verifyOtp({ email: this.email, otp: this.otp }).subscribe({
      next: () => {
        this.loading = false;
        this.otpVerified = true;
        this.successMessage = 'OTP verified! Registration complete.';
        this.clearOtpTimer();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'OTP verification failed.';
      }
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
        this.errorMessage = err?.error?.message || 'Failed to resend OTP.';
      }
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
}
