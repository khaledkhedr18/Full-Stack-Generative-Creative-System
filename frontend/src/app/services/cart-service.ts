import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CartResponseI, RemoveItemI, UpdateCartItemI } from '../utils/cart-interface';
import { tap } from 'rxjs';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly baseURL = 'http://localhost:3000/api/cart';
  
  cartCount = signal<number>(0);
  isLoaded = signal<boolean>(false);

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
    authService: AuthService,
  ) {
    if (authService.isLoggedIn()) {
      this.getCart().subscribe();
    } else {
      this.isLoaded.set(true);
    }
  }


  private getAuthHeaders() {
    const token = this.cookieService.get('jwt_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getCart() {
    return this.httpClient
      .get<CartResponseI>(this.baseURL, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((response) => {
          this.cartCount.set(response.data.totalItems);
          this.isLoaded.set(true)
        }),
      );
  }

  updateItemQuantity(item: UpdateCartItemI) {
    return this.httpClient.patch(this.baseURL, item, { headers: this.getAuthHeaders() });
  }

  removeItem(item: RemoveItemI) {
    return this.httpClient.delete(`${this.baseURL}/item`, {
      headers: this.getAuthHeaders(),
      body: item,
    });
  }

  clearCart() {
    this.cartCount.set(0);
  }
}
