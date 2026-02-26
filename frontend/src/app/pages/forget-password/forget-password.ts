import {
  Component,
  QueryList,
  ViewChildren,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, RouterLink],
  templateUrl: './forget-password.html',
})
export class ForgetPassword implements OnDestroy {

  // ── Form State ─────────────────────────────────────────────────────────────

  email = '';
  codeArray: string[] = ['', '', '', '', '', ''];

  // ── UI State ───────────────────────────────────────────────────────────────

  otpSent = false;
  isSendingOtp = false;
  isVerifying = false;
  isResending = false;

  alertMessage = '';
  alertType: 'success' | 'error' = 'error';

  resendTimer = 0;
  private resendInterval: ReturnType<typeof setInterval> | null = null;

  // ── DOM Refs ───────────────────────────────────────────────────────────────

  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnDestroy(): void {
    this.clearResendTimer();
  }

  // ── Theme ──────────────────────────────────────────────────────────────────

  toggleTheme(): void {
    document.documentElement.classList.toggle('dark');
  }

  // ── Alerts ─────────────────────────────────────────────────────────────────

  private showAlert(message: string, type: 'success' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type;
  }

  private clearAlert(): void {
    this.alertMessage = '';
  }

  // ── Resend Timer ───────────────────────────────────────────────────────────

  private startResendTimer(seconds = 60): void {
    this.resendTimer = seconds;
    this.clearResendTimer();
    this.resendInterval = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) this.clearResendTimer();
    }, 1000);
  }

  private clearResendTimer(): void {
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
      this.resendInterval = null;
    }
  }

  // ── Edit Email ─────────────────────────────────────────────────────────────

  editEmail(): void {
    this.otpSent = false;
    this.codeArray = ['', '', '', '', '', ''];
    this.clearAlert();
    this.clearResendTimer();
  }

  // ── Step 1: Send OTP ───────────────────────────────────────────────────────

  sendOtp(): void {
    if (!this.email || this.isSendingOtp) return;

    this.isSendingOtp = true;
    this.clearAlert();

    // 🔁 Replace with your real API endpoint
    this.http.post('/api/auth/forgot-password/send-otp', { email: this.email })
      .subscribe({
        next: () => {
          this.isSendingOtp = false;
          this.otpSent = true;
          this.startResendTimer(60);
          this.showAlert(`Verification code sent to ${this.email}`, 'success');
          setTimeout(() => this.codeInputs?.first?.nativeElement?.focus(), 100);
        },
        error: (err) => {
          this.isSendingOtp = false;
          this.showAlert(err?.error?.message ?? 'Failed to send OTP. Please try again.', 'error');
        },
      });
  }

  // ── OTP Input Handling ─────────────────────────────────────────────────────

  onCodeInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const digit = input.value.replace(/\D/g, '').slice(-1);

    this.codeArray[index] = digit;
    input.value = digit; // keep DOM in sync

    if (!digit) return;

    // Auto-advance
    if (index < 5) {
      this.codeInputs.toArray()[index + 1].nativeElement.focus();
    }

    // Auto-submit when all filled
    if (this.codeArray.every(d => d !== '')) {
      this.onSubmit();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (this.codeArray[index]) {
        this.codeArray[index] = '';
      } else if (index > 0) {
        this.codeArray[index - 1] = '';
        this.codeInputs.toArray()[index - 1].nativeElement.focus();
      }
    }
    if (event.key === 'ArrowLeft' && index > 0) {
      this.codeInputs.toArray()[index - 1].nativeElement.focus();
    }
    if (event.key === 'ArrowRight' && index < 5) {
      this.codeInputs.toArray()[index + 1].nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const digits = (event.clipboardData?.getData('text') ?? '')
      .replace(/\D/g, '')
      .slice(0, 6)
      .split('');

    digits.forEach((d, i) => {
      if (i < 6) this.codeArray[i] = d;
    });

    const focusIndex = Math.min(digits.length, 5);
    setTimeout(() => this.codeInputs.toArray()[focusIndex]?.nativeElement?.focus());

    if (digits.length === 6) this.onSubmit();
  }

  // ── Resend ─────────────────────────────────────────────────────────────────

  resendCode(): void {
    if (this.resendTimer > 0 || this.isResending) return;

    this.isResending = true;
    this.codeArray = ['', '', '', '', '', ''];
    this.clearAlert();

    // 🔁 Replace with your real API endpoint
    this.http.post('/api/auth/forgot-password/send-otp', { email: this.email })
      .subscribe({
        next: () => {
          this.isResending = false;
          this.startResendTimer(60);
          this.showAlert('A new verification code has been sent.', 'success');
          setTimeout(() => this.codeInputs?.first?.nativeElement?.focus(), 100);
        },
        error: (err) => {
          this.isResending = false;
          this.showAlert(err?.error?.message ?? 'Failed to resend. Please try again.', 'error');
        },
      });
  }

  // ── Step 2: Verify OTP ─────────────────────────────────────────────────────

  onSubmit(): void {
    const code = this.codeArray.join('');
    if (code.length < 6 || this.isVerifying) return;

    this.isVerifying = true;
    this.clearAlert();

    // 🔁 Replace with your real API endpoint
    this.http.post('/api/auth/forgot-password/verify-otp', {
      email: this.email,
      otp: code,
    }).subscribe({
      next: (res: any) => {
        this.isVerifying = false;
        this.showAlert('Code verified! Redirecting…', 'success');

        // Pass resetToken to the Change Password page
        setTimeout(() => {
          this.router.navigate(['/change-password'], {
            queryParams: { email: this.email, token: res?.resetToken ?? '' },
          });
        }, 800);
      },
      error: (err) => {
        this.isVerifying = false;
        this.showAlert(err?.error?.message ?? 'Invalid or expired code. Try again.', 'error');

        // Clear OTP boxes and refocus
        this.codeArray = ['', '', '', '', '', ''];
        setTimeout(() => this.codeInputs?.first?.nativeElement?.focus(), 100);
      },
    });
  }
}
