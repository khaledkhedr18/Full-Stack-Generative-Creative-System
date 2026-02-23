import { Component, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faUser, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { UserRegisterInterface } from '../../utils/user-interface';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-sign-up',
  imports: [FontAwesomeModule, RouterLink, ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styles: ``,
})
export class SignUp {
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
  ) {}

  faFacebook = faFacebook;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faLock = faLock;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  isPasswordVisible = false;

  loading = signal(false);

  readonly nameRegex = /^[\p{L}]+$/u;
  readonly passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

  registrationForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(this.nameRegex),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(this.nameRegex),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(this.passwordRegex),
    ]),
  });

  handleSubmit() {
    if (this.registrationForm.valid) {
      this.loading.set(true);
      const newUser: UserRegisterInterface = { ...this.registrationForm.value };
      this.authService.register(newUser).subscribe({
        next: (data: any) => {
          const token = data.token;
          this.cookieService.set('jwt_token', token, undefined, '/', undefined, true, 'Strict');
          this.router.navigate(['/home']);
          this.loading.set(false);
        },
        error: (error) => {
          console.log(error);
          this.loading.set(false);
        },
      });
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }

  toggleVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
