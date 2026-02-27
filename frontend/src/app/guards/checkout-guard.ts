import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../services/cart-service';

export const checkoutGuard: CanActivateFn = (route, state) => {
  const cartService = inject(CartService);
  const router = inject(Router);

  if (cartService.cartCount()) {
    return true;
  }
  return router.createUrlTree(['/products']);
};
