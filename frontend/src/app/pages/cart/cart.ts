import { Component, OnInit, signal } from '@angular/core';
import { CartProductCard } from '../../components/cart-product-card/cart-product-card';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart-service';
import { CartInterface, CartItemI, CartResponseI } from '../../utils/cart-interface';
import { CurrencyPipe } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideLockKeyhole } from '@ng-icons/lucide';
import { AiService } from '../../services/ai-service';
import { MyDesign } from '../../utils/ai-interface';

@Component({
  selector: 'app-cart',
  imports: [CartProductCard, RouterLink, CurrencyPipe, NgIcon],
  providers: [provideIcons({ lucideArrowRight, lucideLockKeyhole })],
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

  constructor(
    private cartService: CartService,
    private aiService: AiService,
  ) {}

  getCart() {
    this.cartService.getCart().subscribe({
      next: (data) => {
        const cartData = data.data;
        // Check if any items have custom designs that need resolving
        const hasCustomDesigns = cartData.items.some(
          (item) => item.customDesignIds && item.customDesignIds.length > 0,
        );

        if (hasCustomDesigns) {
          // Fetch all user designs to resolve image URLs
          this.aiService.getMyDesigns().subscribe({
            next: (designsRes) => {
              const designsMap = new Map<string, MyDesign>();
              for (const d of designsRes.data) {
                designsMap.set(d._id, d);
              }

              // Enrich cart items with resolved design image URLs
              cartData.items = cartData.items.map((item) => {
                if (item.customDesignIds && item.customDesignIds.length > 0) {
                  const resolvedImages: string[] = [];
                  for (const designId of item.customDesignIds) {
                    const design = designsMap.get(designId);
                    if (design && design.generatedImageUrl) {
                      resolvedImages.push(design.generatedImageUrl);
                    }
                  }
                  return { ...item, _resolvedDesignImages: resolvedImages };
                }
                return item;
              });

              this.cartData.set(cartData);
              this.isLoading.set(false);
            },
            error: () => {
              // Fall back to showing cart without design images
              this.cartData.set(cartData);
              this.isLoading.set(false);
            },
          });
        } else {
          this.cartData.set(cartData);
          this.isLoading.set(false);
        }
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
