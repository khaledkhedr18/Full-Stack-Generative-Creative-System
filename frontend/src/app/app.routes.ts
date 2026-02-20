import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { SignUp } from './pages/sign-up/sign-up';
import { Home } from './pages/home/home';
import { Products } from './pages/products/products';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login, data: { hideHeaderFooter: true } },
  { path: 'signup', component: SignUp, data: { hideHeaderFooter: true } },
  { path: 'products', component: Products },
];
