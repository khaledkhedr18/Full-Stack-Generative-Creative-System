import { Component } from '@angular/core';
import { CartProductCard } from '../../components/cart-product-card/cart-product-card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CartProductCard, RouterLink],
  templateUrl: './cart.html',
  styles: ``,
})
export class Cart {}
