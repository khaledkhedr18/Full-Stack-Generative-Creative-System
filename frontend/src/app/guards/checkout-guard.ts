import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../services/cart-service';
import { HotToastService } from '@ngxpert/hot-toast';

export const checkoutGuard: CanActivateFn = (route, state) => {
  const cartService = inject(CartService);
  const router = inject(Router);
  const toast = inject(HotToastService);

  if (cartService.cartCount()) {
    return true;
  }
  toast.info('Your cart is empty. Add some items to start checking out!');
  return router.createUrlTree(['/products']);
};
