import { Component, inject, OnChanges, OnInit, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHeart, lucideLogOut, lucideMenu, lucideShoppingCart } from '@ng-icons/lucide';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from '../../services/cart-service';
import { WishlistService } from '../../services/wishlist-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, NgIcon],
  providers: [provideIcons({ lucideHeart, lucideShoppingCart, lucideMenu, lucideLogOut })],
  templateUrl: './header.html',
  styles: ``,
})
export class Header {
  private wishlistService = inject(WishlistService);
  wishlistCount = toSignal(this.wishlistService.wishlistCount$, { initialValue: 0 });

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private toast: HotToastService,
  ) {}
  private cartService = inject(CartService);

  cartCount = this.cartService.cartCount;

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  handleLogout() {
    this.toast.success('Logged out successfully');
    this.cookieService.delete('jwt_token');
    this.cartService.clearCart();
    this.router.navigate(['/home']);
    this.wishlistService.updateWishlistCount(0);
  }
}
