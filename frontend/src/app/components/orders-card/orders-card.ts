import { Component, Input } from '@angular/core';
import { OrdersItem } from '../orders-item/orders-item';
import { OrderInterface } from '../../utils/order-interface';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-orders-card',
  imports: [OrdersItem, DatePipe, CurrencyPipe],
  templateUrl: './orders-card.html',
  styles: ``,
})
export class OrdersCard {
  @Input() order: OrderInterface = {
    _id: '',
    user: '',
    items: [],
    shippingAddress: {
      fullName: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      phone: '',
    },
    payment: {
      method: '',
      status: '',
    },
    itemsTotal: 0,
    shippingCost: 0,
    tax: 0,
    totalAmount: 0,
    status: '',
    createdAt: '',
    updatedAt: '',
    orderNumber: '',
    id: '',
  };
}
