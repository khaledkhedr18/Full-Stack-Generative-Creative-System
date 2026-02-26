import {
  Component,
  QueryList,
  ViewChildren,
  ElementRef,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, RouterLink],
  templateUrl: './forget-password.html',
})
export class ForgetPassword implements OnDestroy {

  email = '';
  codeArray: string[] = ['', '', '', '', '', ''];

  otpSent = false;
  isSendingOtp = false;
  isVerifying = false;
  isResending = false;

  alertMessage = '';
  alertType: 'success' | 'error' = 'error';

  resendTimer = 0;
  private resendInterval: ReturnType<typeof setInterval> | null = null;

  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnDestroy(): void {
    this.clearResendTimer();
  }

  toggleTheme(): void {
    document.documentElement.classList.toggle('dark');
  }

  private showAlert(message: string, type: 'success' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type;
  }

  private clearAlert(): void {
    this.alertMessage = '';
  }

  private startResendTimer(seconds = 60): void {
    this.resendTimer = seconds;
    this.clearResendTimer();
    this.resendInterval = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) this.clearResendTimer();
      this.cdr.detectChanges();
    }, 1000);
  }

  private clearResendTimer(): void {
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
      this.resendInterval = null;
    }
  }

  editEmail(): void {
    this.otpSent = false;
    this.codeArray = ['', '', '', '', '', ''];
    this.clearAlert();
    this.clearResendTimer();
    this.cdr.detectChanges();
  }

  // ── Step 1: Send OTP ───────────────────────────────────────────────────────

  sendOtp(): void {
    if (!this.email || this.isSendingOtp) return;

    this.isSendingOtp = true;
    this.clearAlert();

    this.authService.forgetPassword(this.email).subscribe({
      next: (res) => {
        console.log('✅ OTP Response:', res);
        this.isSendingOtp = false;
        this.otpSent = true;
        this.startResendTimer(60);
        this.showAlert(`Verification code sent to ${this.email}`, 'success');
        this.cdr.detectChanges();
        setTimeout(() => this.codeInputs?.first?.nativeElement?.focus(), 100);
      },
      error: (err) => {
        console.log('❌ OTP Error:', err);
        this.isSendingOtp = false;
        this.showAlert(err?.error?.message ?? 'Failed to send OTP. Please try again.', 'error');
        this.cdr.detectChanges();
      },
    });
  }

  // ── OTP Input Handling ─────────────────────────────────────────────────────

  onCodeInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;

    // فقط أرقام
    const digit = input.value.replace(/\D/g, '').slice(-1);

    // حدّث الـ array والـ DOM
    this.codeArray[index] = digit;
    input.value = digit;
    this.cdr.detectChanges();

    if (!digit) return;

    // انتقل للخانة التالية فقط لو فيه رقم
    if (index < 5) {
      setTimeout(() => {
        this.codeInputs.toArray()[index + 1].nativeElement.focus();
      }, 0);
    }

    // auto-submit لما يكتمل الـ 6 أرقام
    const fullCode = this.codeArray.join('');
    if (fullCode.length === 6 && !fullCode.includes('')) {
      setTimeout(() => this.onSubmit(), 100);
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (this.codeArray[index]) {
        this.codeArray[index] = '';
        const input = this.codeInputs.toArray()[index].nativeElement;
        input.value = '';
        this.cdr.detectChanges();
      } else if (index > 0) {
        this.codeArray[index - 1] = '';
        const prevInput = this.codeInputs.toArray()[index - 1].nativeElement;
        prevInput.value = '';
        prevInput.focus();
        this.cdr.detectChanges();
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

    // امسح الكل الأول
    this.codeArray = ['', '', '', '', '', ''];
    this.codeInputs.toArray().forEach(input => input.nativeElement.value = '');

    // حط الأرقام
    digits.forEach((d, i) => {
      if (i < 6) {
        this.codeArray[i] = d;
        this.codeInputs.toArray()[i].nativeElement.value = d;
      }
    });

    this.cdr.detectChanges();

    const focusIndex = Math.min(digits.length, 5);
    setTimeout(() => this.codeInputs.toArray()[focusIndex]?.nativeElement?.focus());

    if (digits.length === 6) {
      setTimeout(() => this.onSubmit(), 100);
    }
  }

  // ── Resend ─────────────────────────────────────────────────────────────────

  resendCode(): void {
    if (this.resendTimer > 0 || this.isResending) return;

    this.isResending = true;
    this.codeArray = ['', '', '', '', '', ''];
    this.codeInputs?.toArray().forEach(input => input.nativeElement.value = '');
    this.clearAlert();

    this.authService.forgetPassword(this.email).subscribe({
      next: (res) => {
        console.log('✅ Resend Response:', res);
        this.isResending = false;
        this.startResendTimer(60);
        this.showAlert('A new verification code has been sent.', 'success');
        this.cdr.detectChanges();
        setTimeout(() => this.codeInputs?.first?.nativeElement?.focus(), 100);
      },
      error: (err) => {
        console.log('❌ Resend Error:', err);
        this.isResending = false;
        this.showAlert(err?.error?.message ?? 'Failed to resend. Please try again.', 'error');
        this.cdr.detectChanges();
      },
    });
  }

  // ── Step 2: Verify OTP ─────────────────────────────────────────────────────

  onSubmit(): void {
    const code = this.codeArray.join('');
    if (code.length < 6 || this.isVerifying) return;

    this.isVerifying = true;
    this.clearAlert();

    this.authService.verifyOtp(this.email, code).subscribe({
      next: (res: any) => {
        console.log('✅ Verify Response:', res);
        this.isVerifying = false;
        this.showAlert('Code verified! Redirecting…', 'success');
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate([`/resetPassword/${this.email}`])
        } ,800);
      },
      error: (err) => {
        console.log('❌ Verify Error:', err);
        this.isVerifying = false;
        this.showAlert(err?.error?.message ?? 'Invalid or expired code. Try again.', 'error');
        
        this.codeArray = ['', '', '', '', '', ''];
        this.codeInputs?.toArray().forEach(input => input.nativeElement.value = '');
        this.cdr.detectChanges();
        setTimeout(() => this.codeInputs?.first?.nativeElement?.focus(), 100);
      },
    });
  }
}
