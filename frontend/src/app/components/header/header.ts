import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHeart, lucideLogOut, lucideMenu, lucideShoppingCart } from '@ng-icons/lucide';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, NgIcon],
  providers: [provideIcons({ lucideHeart, lucideShoppingCart, lucideMenu, lucideLogOut })],
  templateUrl: './header.html',
  styles: ``,
})
export class Header {
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
  ) {}

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  handleLogout() {
    this.cookieService.delete('jwt_token');
    this.router.navigate(['/home']);
  }
}
