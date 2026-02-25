import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserLoginInterface, UserRegisterInterface } from '../utils/user-interface';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseURL = 'http://localhost:3000/api/auth';

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
  ) {}

  register(newUser: UserRegisterInterface) {
    return this.httpClient.post(`${this.baseURL}/register`, newUser);
  }
  login(user: UserLoginInterface) {
    return this.httpClient.post(`${this.baseURL}/login`, user);
  }

  isLoggedIn(): boolean {
    return !!this.cookieService.get('jwt_token');
  }
}
