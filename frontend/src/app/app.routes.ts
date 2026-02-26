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
import { ResetPassword } from './pages/reset-password/reset-password';
// import { OTP } from './components/otp/otp';
import { Error } from './pages/error/error';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login, data: { hideHeaderFooter: true } },
  { path: 'signup', component: SignUp, data: { hideHeaderFooter: true } },
  { path: 'products', component: Products },
  { path: 'products/:id', component: ProductDetails },
  { path: 'wishlist', component: Wishlist },
  { path: 'cart', component: Cart },
  { path: 'checkout', component: Checkout },
  { path: 'confirmation', component: Confirmation },
  { path: 'orders', component: Orders },
  { path: 'forgetPassword', component: ForgetPassword, data: { hideHeaderFooter: true } },
  { path: 'resetPassword', component: ResetPassword, data: { hideHeaderFooter: true } },
  // { path: 'otp', component: OTP, data: { hideHeaderFooter: true } },
  { path: '**', component: Error },
];

