import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const paymentSuccessGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const currentNavigation = router.getCurrentNavigation();
  return true;

  // const isOrderCompleted = currentNavigation?.extras?.state?.['orderCompleted'];

  // if (isOrderCompleted) {
  //   return true;
  // }
  // return router.createUrlTree(['/home']);
};
