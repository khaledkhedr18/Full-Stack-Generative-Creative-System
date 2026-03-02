import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { HotToastService } from '@ngxpert/hot-toast';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(HotToastService);

  if (authService.isLoggedIn()) {
    return true;
  }
  toast.info('Please log in to access this page.');
  return router.createUrlTree(['/login']);
};
