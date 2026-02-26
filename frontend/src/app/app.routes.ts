import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { SignUp } from './pages/sign-up/sign-up';
import { Home } from './pages/home/home';
import { Products } from './pages/products/products';
import { Wishlist } from './pages/wishlist/wishlist';
import { Cart } from './pages/cart/cart';
import { Checkout } from './pages/checkout/checkout';
import { Confirmation } from './pages/confirmation/confirmation';
import { Orders } from './pages/orders/orders';
import { ProductDetails } from './pages/product-details/product-details';
import { ForgetPassword } from './pages/forget-password/forget-password';
import { Error } from './pages/error/error';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';
import { paymentSuccessGuard } from './guards/payment-success-guard';
import { checkoutGuard } from './guards/checkout-guard';
import { unsavedChangesGuard } from './guards/unsaved-changes-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login, data: { hideHeaderFooter: true }, canActivate: [guestGuard] },
  {
    path: 'signup',
    component: SignUp,
    data: { hideHeaderFooter: true },
    canActivate: [guestGuard],
  },
  { path: 'products', component: Products },
  { path: 'products/:id', component: ProductDetails },
  { path: 'wishlist', component: Wishlist, canActivate: [authGuard] },
  { path: 'cart', component: Cart, canActivate: [authGuard] },
  {
    path: 'checkout',
    component: Checkout,
    canActivate: [authGuard, checkoutGuard],
    canDeactivate: [unsavedChangesGuard],
  },
  { path: 'confirmation', component: Confirmation, canActivate: [authGuard, paymentSuccessGuard] },
  { path: 'orders', component: Orders, canActivate: [authGuard] },
  { path: 'forgetPassword', component: ForgetPassword, canActivate: [guestGuard] },
  { path: '**', component: Error },
  
];
