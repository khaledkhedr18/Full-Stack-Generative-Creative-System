import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { SignUp } from './pages/sign-up/sign-up';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: SignUp },
];
