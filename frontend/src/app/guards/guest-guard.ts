import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { HotToastService } from '@ngxpert/hot-toast';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(HotToastService);

  if (authService.isLoggedIn()) {
    toast.info('You are already logged in.');
    return router.createUrlTree(['/home']);
  }
  return true;
};
