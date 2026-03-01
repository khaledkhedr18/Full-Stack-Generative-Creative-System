import { Component, signal } from '@angular/core';
import { WishlistCard } from '../../components/wishlist-card/wishlist-card';
import { WishlistItem } from '../../utils/wishlist-interface';
import { WishlistService } from '../../services/wishlist-service';
import { RouterLink } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideSparkles, lucideTrash2, lucideX } from '@ng-icons/lucide';

@Component({
  selector: 'app-wishlist',
  imports: [WishlistCard, RouterLink, NgIcon],
  providers: [provideIcons({ lucideEye, lucideTrash2, lucideX, lucideSparkles })],
  templateUrl: './wishlist.html',
  styles: ``,
})
export class Wishlist {
  wishlistItems = signal<WishlistItem[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private wishlistService: WishlistService,
    private toast: HotToastService,
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.wishlistItems.set(res.data.items);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading wishlist:', error);
        this.errorMessage.set('Failed to load wishlist. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  onRemoveItem = (productId: string): void => {
    this.wishlistService
      .removeFromWishlist(productId)
      .pipe(
        this.toast.observe({
          loading: 'Removing item...',
          success: 'Item removed from wishlist.',
          error: 'Could not remove item.',
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.wishlistItems.update((items) =>
              items.filter((item) => item.product._id !== productId),
            );
          }
          console.log('Item removed from wishlist');
        },
        error: (error) => {
          this.errorMessage.set('Failed to remove item. Please try again.');
          console.error('Error removing item:', error);
        },
      });
  };

  clearAllWishlist(): void {
    if (this.wishlistItems().length === 0) {
      return;
    }

    this.wishlistService
      .clearWishlist()
      .pipe(
        this.toast.observe({
          loading: 'Clearing wishlist...',
          success: 'Your wishlist is now empty!',
          error: 'Failed to clear wishlist. Please try again.',
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.wishlistItems.set([]);
            console.log('Wishlist cleared successfully');
          }
        },
        error: (error) => {
          console.error('Error clearing wishlist:', error);
          this.errorMessage.set('Failed to clear wishlist. Please try again.');
        },
      });
  }
}
