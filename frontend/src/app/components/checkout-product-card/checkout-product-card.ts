import { Component, Input } from '@angular/core';
import { CartItemI } from '../../utils/cart-interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-checkout-product-card',
  imports: [CurrencyPipe],
  templateUrl: './checkout-product-card.html',
  styles: ``,
})
export class CheckoutProductCard {
  @Input() item: CartItemI = {
    product: {
      _id: '',
      name: '',
      variants: [],
      basePrice: 0,
      currency: '',
      id: '',
    },
    variantId: '',
    size: '',
    quantity: 0,
    price: 0,
  };

  getVariant() {
    const variant = this.item.product.variants.find(
      (variant) => variant.variantId === this.item.variantId,
    );
    return variant;
  }

  getVariantImage() {
    // If there are resolved custom design images, show the first one
    const resolvedImages = this.item._resolvedDesignImages;
    if (resolvedImages && resolvedImages.length > 0) {
      return resolvedImages[0];
    }
    const variant = this.getVariant();
    return variant ? variant.images[0].url : '';
  }

  getVariantColor() {
    const variant = this.getVariant();
    return variant ? variant.color.name : '';
  }

  hasCustomDesign(): boolean {
    return !!(this.item.customDesignIds && this.item.customDesignIds.length > 0);
  }

  getItemTotalPrice(): number {
    return this.item.price + (this.item.customDesignFee || 0);
  }
}
