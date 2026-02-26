import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, RouterLink],
  templateUrl: './reset-password.html',
})
export class ResetPassword implements OnInit {

  // ── Form State ─────────────────────────────────────────────────────────────

  newPassword = '';
  confirmPassword = '';

  // ── UI State ───────────────────────────────────────────────────────────────

  showNewPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  alertMessage = '';
  alertType: 'success' | 'error' = 'error';

  // ── Data from previous page (forgot-password) ──────────────────────────────

  private email = '';
  private resetToken = '';

  // ── Constructor ────────────────────────────────────────────────────────────

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {}

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  ngOnInit(): void {
    // Get email & token passed from the forgot-password page via queryParams
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] ?? '';
      this.resetToken = params['token'] ?? '';

      // If user lands here without a token → redirect back to forgot-password
      if (!this.email || !this.resetToken) {
        this.router.navigate(['/resetPassword']);
      }
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  get passwordsMatch(): boolean {
    return this.newPassword === this.confirmPassword && this.confirmPassword.length > 0;
  }

  // Password strength: 0 = empty, 1 = weak, 2 = fair, 3 = good, 4 = strong
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
    if (s === 0) return 'bg-slate-200 dark:bg-slate-700';
    if (bar > s)  return 'bg-slate-200 dark:bg-slate-700';
    if (s === 1)  return 'bg-red-400';
    if (s === 2)  return 'bg-orange-400';
    if (s === 3)  return 'bg-yellow-400';
    return 'bg-green-400';
  }

  getStrengthLabel(): string {
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    return labels[this.passwordStrength] ?? '';
  }

  getStrengthTextClass(): string {
    const classes = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-green-400'];
    return classes[this.passwordStrength] ?? '';
  }

  private showAlert(message: string, type: 'success' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type;
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  onSubmit(): void {
    if (!this.passwordsMatch || this.isLoading || this.newPassword.length < 8) return;

    this.isLoading = true;
    this.alertMessage = '';

    // 🔁 Replace with your real API endpoint
    this.http.post('/api/auth/reset-password', {
      email: this.email,
      token: this.resetToken,
      newPassword: this.newPassword,
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.showAlert('Password updated successfully! Redirecting to login…', 'success');

        // Redirect to login after short delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.showAlert(
          err?.error?.message ?? 'Failed to reset password. Please try again.',
          'error'
        );
      },
    });
  }
}
