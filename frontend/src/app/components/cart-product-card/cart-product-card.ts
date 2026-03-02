import { Component, model, output } from '@angular/core';
import { CartItemI, RemoveItemI, UpdateCartItemI } from '../../utils/cart-interface';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart-service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-cart-product-card',
  imports: [CurrencyPipe],
  templateUrl: './cart-product-card.html',
  styles: ``,
})
export class CartProductCard {
  item = model.required<CartItemI>();

  itemsChange = output<void>();

  constructor(
    private cartService: CartService,
    private toast: HotToastService,
  ) {}

  getVariant() {
    return this.item().product.variants.find(
      (variant) => variant.variantId === this.item().variantId,
    );
  }

  getVariantImage() {
    const variant = this.getVariant();
    return variant ? variant.images[0].url : '';
  }

  getVariantColor() {
    const variant = this.getVariant();
    return variant ? variant.color.name : '';
  }

  updateItemQuantity(updatedQuantity: number) {
    let updatedItem: UpdateCartItemI = {
      productId: this.item().product._id,
      variantId: this.item().variantId,
      size: this.item().size,
      quantity: updatedQuantity,
    };
    this.cartService.updateItemQuantity(updatedItem).subscribe({
      next: () => {
        this.item.set({ ...this.item(), quantity: updatedQuantity });
        this.itemsChange.emit();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  handleMinus() {
    let updatedQuantity = this.item().quantity - 1;
    this.updateItemQuantity(updatedQuantity);
  }

  handlePlus() {
    let updatedQuantity = this.item().quantity + 1;
    this.updateItemQuantity(updatedQuantity);
  }

  handleRemove() {
    let removedItem: RemoveItemI = {
      productId: this.item().product._id,
      variantId: this.item().variantId,
      size: this.item().size,
    };
    this.cartService.removeItem(removedItem).subscribe({
      next: () => {
        this.toast.success('Item removed from cart');
        this.itemsChange.emit();
      },
      error: (error) => {
        this.toast.error(error.error.message);
      },
    });
  }
}
