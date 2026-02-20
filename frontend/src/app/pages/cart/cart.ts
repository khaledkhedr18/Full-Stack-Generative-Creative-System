import { Component } from '@angular/core';
import { CartProductCard } from '../../components/cart-product-card/cart-product-card';

@Component({
  selector: 'app-cart',
  imports: [CartProductCard],
  templateUrl: './cart.html',
  styles: ``,
})
export class Cart {}
