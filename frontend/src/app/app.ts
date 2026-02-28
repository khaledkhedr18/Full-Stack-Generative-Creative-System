import { Component, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { filter, map } from 'rxjs';
import { WishlistService } from './services/wishlist-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  showLayout = signal(true);
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private wishlistService: WishlistService,
  ) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
      )
      .subscribe((route) => {
        const hide = route.snapshot.data['hideHeaderFooter'];
        this.showLayout.set(!hide);
      });
  }
  ngOnInit() {
    this.wishlistService.getWishlist().subscribe();
  }
}
