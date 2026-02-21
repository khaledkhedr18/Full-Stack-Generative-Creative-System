import { Component } from '@angular/core';
import { CheckoutProductCard } from '../../components/checkout-product-card/checkout-product-card';

@Component({
  selector: 'app-checkout',
  imports: [CheckoutProductCard],
  templateUrl: './checkout.html',
  styles: ``,
})
export class Checkout {}
