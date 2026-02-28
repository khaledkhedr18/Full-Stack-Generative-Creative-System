import { Component, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { UserLoginInterface } from '../../utils/user-interface';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from '../../services/cart-service';
import { WishlistService } from '../../services/wishlist-service';

@Component({
  selector: 'app-login',
  imports: [FontAwesomeModule, RouterLink, ReactiveFormsModule],
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
  ) {}

  faFacebook = faFacebook;
  faEnvelope = faEnvelope;
  faLock = faLock;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  isPasswordVisible = false;

  errorMessage = signal('');

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
          const token = data.token;
          this.cookieService.set('jwt_token', token, undefined, '/', undefined, true, 'Strict');
          this.cartService.getCart().subscribe();
          this.wishlistService.getWishlist().subscribe();
          this.router.navigate(['/home']);
          this.loading.set(false);
        },
        error: (error) => {
          this.errorMessage.set(error.error.message);
          this.loading.set(false);
        },
      });
    } else {
      this.errorMessage.set('Invalid email or password.');
    }
  }

  toggleVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
