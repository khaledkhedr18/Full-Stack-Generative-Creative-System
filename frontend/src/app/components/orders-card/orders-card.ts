import { Component } from '@angular/core';
import { OrdersItem } from '../orders-item/orders-item';

@Component({
  selector: 'app-orders-card',
  imports: [OrdersItem],
  templateUrl: './orders-card.html',
  styles: ``,
})
export class OrdersCard {}
