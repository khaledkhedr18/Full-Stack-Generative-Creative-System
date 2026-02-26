import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, RouterLink],
  templateUrl: './reset-password.html',
})
export class ResetPassword {

  // ── Regex ──────────────────────────────────────────────────────────────────

  readonly passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

  // ── Form State ─────────────────────────────────────────────────────────────

  newPassword = '';
  confirmPassword = '';

  // ── UI State ───────────────────────────────────────────────────────────────

  showNewPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  alertMessage = '';
  alertType: 'success' | 'error' = 'error';

  // ── Data from forgot-password page ─────────────────────────────────────────

  private email = '';

  // ── Constructor ────────────────────────────────────────────────────────────

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {
    this.email = route.snapshot.params["email"];
    console.log(this.email);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  get passwordsMatch(): boolean {
    return this.newPassword === this.confirmPassword && this.confirmPassword.length > 0;
  }

  get passwordStrength(): number {
    const p = this.newPassword;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8)  score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return Math.min(4, score);
  }

  getStrengthBarClass(bar: number): string {
    const s = this.passwordStrength;
    if (s === 0 || bar > s) return 'bg-slate-200 dark:bg-slate-700';
    if (s === 1) return 'bg-red-400';
    if (s === 2) return 'bg-orange-400';
    if (s === 3) return 'bg-yellow-400';
    return 'bg-green-400';
  }

  getStrengthLabel(): string {
    return ['', 'Weak', 'Fair', 'Good', 'Strong'][this.passwordStrength] ?? '';
  }

  getStrengthTextClass(): string {
    return ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-green-400'][this.passwordStrength] ?? '';
  }

  private showAlert(message: string, type: 'success' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type;
    this.cdr.detectChanges();
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  onSubmit(): void {
    if (!this.passwordsMatch || this.isLoading || this.newPassword.length < 8) return;

    // ✅ Regex validation
    if (!this.passwordRegex.test(this.newPassword)) {
      this.showAlert(
        'Password must contain uppercase, lowercase, number and special character (@$!%*?&).',
        'error'
      );
      return;
    }

    this.isLoading = true;
    this.alertMessage = '';

    this.authService.resetPassword(this.email, this.newPassword)
      .subscribe({
        next: (res) => {
          console.log('✅ Reset Password Response:', res);
          this.isLoading = false;
          this.showAlert('Password updated successfully! Redirecting to login…', 'success');

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (err) => {
          console.log('❌ Reset Password Error:', err);
          this.isLoading = false;
          this.showAlert(
            err?.error?.message ?? 'Failed to reset password. Please try again.',
            'error'
          );
        },
      });
  }
}
