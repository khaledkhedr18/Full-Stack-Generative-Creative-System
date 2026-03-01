import { Component } from '@angular/core';
import { CheckoutProductCard } from '../../components/checkout-product-card/checkout-product-card';
import { CheckDeactivate } from '../../utils/check-deactivate';
import { Observable } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideVan, lucideWalletCards } from '@ng-icons/lucide';

@Component({
  selector: 'app-checkout',
  imports: [CheckoutProductCard, NgIcon],
  providers: [provideIcons({ lucideVan, lucideWalletCards, lucideCheck })],
  templateUrl: './checkout.html',
  styles: ``,
})
export class Checkout implements CheckDeactivate {
  isFormDirty = false;

  canDeactivate(): boolean {
    if (this.isFormDirty) {
      return confirm('You have unsaved changes! Are you sure you want to leave the checkout?');
    }
    return true;
  }
}
