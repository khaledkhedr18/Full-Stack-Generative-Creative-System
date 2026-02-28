import { Component, OnInit, signal } from '@angular/core';
import { OrdersCard } from '../../components/orders-card/orders-card';
import { OrdersService } from '../../services/orders-service';
import { OrderInterface } from '../../utils/order-interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [OrdersCard, RouterLink],
  templateUrl: './orders.html',
  styles: ``,
})
export class Orders implements OnInit {
  orders = signal<OrderInterface[]>([]);
  isLoading = signal<boolean>(true);

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.ordersService.getOrders().subscribe({
      next: (data) => {
        this.isLoading.set(false);
        this.orders.set(data.data);
      },
      error: (error) => {
        this.isLoading.set(false);
        console.log(error);
      },
    });
  }
}
