import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const paymentSuccessGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const currentNavigation = router.getCurrentNavigation();

  const isOrderCompleted = currentNavigation?.extras?.state?.['orderCompleted'];
  const hasSessionId = route.queryParams['session_id'];

  if (isOrderCompleted || hasSessionId) {
    return true;
  }
  return router.createUrlTree(['/home']);
};
