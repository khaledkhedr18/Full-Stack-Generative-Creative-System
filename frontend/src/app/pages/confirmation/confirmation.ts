import { Component } from '@angular/core';
import { CheckoutProductCard } from '../../components/checkout-product-card/checkout-product-card';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideMapPin } from '@ng-icons/lucide';

@Component({
  selector: 'app-confirmation',
  imports: [CheckoutProductCard, NgIcon],
  providers: [provideIcons({ lucideMapPin, lucideCheck })],
  templateUrl: './confirmation.html',
  styles: ``,
})
export class Confirmation {}
