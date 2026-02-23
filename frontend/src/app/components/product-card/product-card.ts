import { Component, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product, ProductVariant } from '../../utils/product-interface';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.html',
  styles: ``,
})
export class ProductCard {
  @Input() data: Product = {} as Product;
  selectedVariant = signal<ProductVariant | null>(null);

  selectVariant(variant: ProductVariant) {
    this.selectedVariant.set(variant);
  }
}
