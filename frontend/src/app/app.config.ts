import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { provideNgxStripe } from 'ngx-stripe';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withViewTransitions(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      }),
    ),
    provideHotToastConfig({
      visibleToasts: 5,
      stacking: 'vertical',
      position: 'top-center',
      dismissible: false,
      duration: 1500,
      style: {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px) saturate(180%)',
        WebkitBackdropFilter: 'blur(10px) saturate(180%)', // For Safari support
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '16px',
        fontSize: '15px',
        fontWeight: '500',
        maxWidth: '400px',
      },
    }),
    provideNgxStripe(
      'pk_test_51T58Xd2Q7fSnx4k7YkYVVmbuRbVTP4fr2a8rVn7E4QgNtz6eBAild5mXBHvASogDVhb4CFglmHXs35g9lOJVHlgY00v8v5UUqO',
    ),
  ],
};
