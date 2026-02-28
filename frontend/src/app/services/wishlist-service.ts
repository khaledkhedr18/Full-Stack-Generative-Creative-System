import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  WishlistResponse,
  AddToWishlistRequest,
  RemoveFromWishlistResponse,
} from '../utils/wishlist-interface';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly baseURL = 'http://localhost:3000/api/wishlist';
  private userToken: string = '';

  private wishlistCountSubject = new BehaviorSubject<number>(0);
  public wishlistCount$ = this.wishlistCountSubject.asObservable();

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
  ) {
    this.userToken = this.cookieService.get('jwt_token');
  }

  private getHeaders(): HttpHeaders {
    this.userToken = this.cookieService.get('jwt_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.userToken}`,
    });
  }

  getWishlist(): Observable<WishlistResponse> {
    return this.http
      .get<WishlistResponse>(this.baseURL, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.wishlistCountSubject.next(response.data.items.length);
          }
        }),
      );
  }

  removeFromWishlist(productId: string): Observable<RemoveFromWishlistResponse> {
    return this.http
      .delete<RemoveFromWishlistResponse>(`${this.baseURL}/${productId}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap(() => {
          // Decrement count on successful removal
          const currentCount = this.wishlistCountSubject.value;
          this.wishlistCountSubject.next(Math.max(0, currentCount - 1));
        }),
      );
  }

  addToWishlist(productId: string): Observable<WishlistResponse> {
    const body: AddToWishlistRequest = { productId };
    return this.http
      .post<WishlistResponse>(this.baseURL, body, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.wishlistCountSubject.next(response.data.items.length);
          }
        }),
      );
  }

  clearWishlist(): Observable<RemoveFromWishlistResponse> {
    return this.http
      .delete<RemoveFromWishlistResponse>(this.baseURL, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap(() => {
          this.wishlistCountSubject.next(0);
        }),
      );
  }

  getWishlistCount(): number {
    return this.wishlistCountSubject.value;
  }

  updateWishlistCount(count: number): void {
    this.wishlistCountSubject.next(count);
  }
}
