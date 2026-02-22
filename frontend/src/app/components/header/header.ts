import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHeart, lucideLogOut, lucideMenu, lucideShoppingCart } from '@ng-icons/lucide';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, NgIcon],
  providers: [provideIcons({ lucideHeart, lucideShoppingCart, lucideMenu, lucideLogOut })],
  templateUrl: './header.html',
  styles: ``,
})
export class Header {
  isLoggedIn = false;
}
