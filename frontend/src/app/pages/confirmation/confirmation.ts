import { Component, OnInit, signal } from '@angular/core';
import { CheckoutProductCard } from '../../components/checkout-product-card/checkout-product-card';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideMapPin } from '@ng-icons/lucide';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirmation',
  imports: [CheckoutProductCard, NgIcon],
  providers: [provideIcons({ lucideMapPin, lucideCheck })],
  templateUrl: './confirmation.html',
  styles: ``,
})
export class Confirmation implements OnInit{
  sessionId = signal("")

  constructor(private route:ActivatedRoute){}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe
  }
}
