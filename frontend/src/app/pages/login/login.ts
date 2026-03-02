import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { UserLoginInterface } from '../../utils/user-interface';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from '../../services/cart-service';
import { WishlistService } from '../../services/wishlist-service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideEyeOff, lucideLock, lucideMail, lucideSparkles } from '@ng-icons/lucide';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-login',
  imports: [FontAwesomeModule, RouterLink, ReactiveFormsModule, NgIcon],
  providers: [provideIcons({ lucideMail, lucideLock, lucideEye, lucideEyeOff, lucideSparkles })],
  templateUrl: './login.html',
  styles: ``,
})
export class Login {
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toast: HotToastService,
  ) {}
  faFacebook = faFacebook;

  isPasswordVisible = false;

  loading = signal(false);

  readonly passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(this.passwordRegex),
    ]),
  });

  handleSubmit() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      const user: UserLoginInterface = { ...this.loginForm.value };
      this.authService.login(user).subscribe({
        next: (data: any) => {
          this.loading.set(false);
          const token = data.token;
          this.cookieService.set('jwt_token', token, undefined, '/', undefined, true, 'Strict');
          this.cartService.getCart().subscribe();
          this.wishlistService.getWishlist().subscribe();
          this.toast.success(`Welcome back ${data.data.firstName + ' ' + data.data.lastName}`);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.loading.set(false);
          this.toast.error(error.error.message);
        },
      });
    } else {
      this.toast.error('Invalid email or password.');
    }
  }

  toggleVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
