import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {
  CheckoutResponseI,
  ShippingAddressI,
  VerifySessionResponseI,
} from '../utils/order-interface';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly baseURL = 'http://localhost:3000/api/payments';

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

  checkout(shippingAddress: ShippingAddressI, notes?: string) {
    return this.http.post<CheckoutResponseI>(
      `${this.baseURL}/create-checkout-session`,
      { shippingAddress, notes },
      { headers: this.getAuthHeaders() },
    );
  }

  verifySession(sessionId: string) {
    return this.http.get<VerifySessionResponseI>(`${this.baseURL}/verify-session/${sessionId}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
