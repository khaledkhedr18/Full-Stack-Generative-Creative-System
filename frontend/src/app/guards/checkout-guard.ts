import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../services/cart-service';
import { HotToastService } from '@ngxpert/hot-toast';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

export const checkoutGuard: CanActivateFn = (route, state) => {
  const cartService = inject(CartService);
  const router = inject(Router);
  const toast = inject(HotToastService);

  return toObservable(cartService.isLoaded).pipe(
    filter((loaded) => loaded === true),
    take(1),
    map(() => {
      if (cartService.cartCount()) {
        return true;
      }
      toast.info('Your cart is empty. Add some items to start checking out!');
      return router.createUrlTree(['/products']);
    }),
  );
};
