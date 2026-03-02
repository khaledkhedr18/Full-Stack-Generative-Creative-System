import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {
  CheckoutResponseI,
  OrderResponseI,
  OrderInterface,
  ShippingAddressI,
} from '../utils/order-interface';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly baseURL = 'http://localhost:3000/api/orders';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) {}

  private getAuthHeaders() {
    const token = this.cookieService.get('jwt_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getOrders() {
    return this.http.get<OrderResponseI>(this.baseURL, { headers: this.getAuthHeaders() });
  }

  getOrderById(orderId: string) {
    return this.http.get<{ success: boolean; data: OrderInterface }>(`${this.baseURL}/${orderId}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
