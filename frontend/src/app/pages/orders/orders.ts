import { Component } from '@angular/core';
import { OrdersCard } from '../../components/orders-card/orders-card';

@Component({
  selector: 'app-orders',
  imports: [OrdersCard],
  templateUrl: './orders.html',
  styles: ``,
})
export class Orders {}
