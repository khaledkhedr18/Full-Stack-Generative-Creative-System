import { Component, OnInit, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideMapPin } from '@ng-icons/lucide';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaymentService } from '../../services/payment-service';
import { OrdersService } from '../../services/orders-service';
import { OrderInterface } from '../../utils/order-interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-confirmation',
  imports: [NgIcon, CurrencyPipe, RouterLink],
  providers: [provideIcons({ lucideMapPin, lucideCheck })],
  templateUrl: './confirmation.html',
  styles: ``,
})
export class Confirmation implements OnInit {
  sessionId = signal('');
  orderNumber = signal<string | null>(null);
  orderId = signal<string | null>(null);
  paymentStatus = signal<string | null>(null);
  order = signal<OrderInterface | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private ordersService: OrdersService,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const sid = params.get('session_id');
      if (!sid) {
        this.error.set('No session ID found.');
        this.isLoading.set(false);
        return;
      }
      this.sessionId.set(sid);
      this.paymentService.verifySession(sid).subscribe({
        next: (res) => {
          this.paymentStatus.set(res.data.paymentStatus);
          this.orderNumber.set(res.data.orderNumber);
          this.orderId.set(res.data.orderId);

          if (res.data.orderId) {
            this.ordersService.getOrderById(res.data.orderId).subscribe({
              next: (orderRes) => {
                this.order.set(orderRes.data);
                this.isLoading.set(false);
              },
              error: () => {
                this.isLoading.set(false);
              },
            });
          } else {
            this.isLoading.set(false);
          }
        },
        error: (err) => {
          console.error('Failed to verify session:', err);
          this.error.set('Failed to verify payment. Please contact support.');
          this.isLoading.set(false);
        },
      });
    });
  }
}
