import { Component, Input } from '@angular/core';
import { OrderInterface, OrderItemI } from '../../utils/order-interface';

@Component({
  selector: 'app-orders-item',
  imports: [],
  templateUrl: './orders-item.html',
  styles: ``,
})
export class OrdersItem {
  @Input() item: OrderItemI = {
    product: {
      _id: '',
      name: '',
      category: '',
      brand: '',
      basePrice: 0,
      currency: '',
      id: '',
    },
    variantId: '',
    color: '',
    size: '',
    quantity: 0,
    price: 0,
  };
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
