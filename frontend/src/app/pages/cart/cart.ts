import { Component, OnInit, signal } from '@angular/core';
import { CartProductCard } from '../../components/cart-product-card/cart-product-card';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart-service';
import { CartInterface, CartItemI, CartResponseI } from '../../utils/cart-interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CartProductCard, RouterLink, CurrencyPipe],
  templateUrl: './cart.html',
  styles: ``,
})
export class Cart implements OnInit {
  cartData = signal<CartInterface>({
    _id: '',
    user: '',
    items: [],
    totalItems: 0,
    totalPrice: 0,
    createdAt: '',
    updatedAt: '',
    __V: 0,
    id: '',
  });

  isLoading = signal(true);

  constructor(private cartService: CartService) {}

  getCart() {
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cartData.set(data.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        console.log(error);
      },
    });
  }

  ngOnInit(): void {
    this.getCart();
  }

  reRender() {
    this.getCart();
  }
}
