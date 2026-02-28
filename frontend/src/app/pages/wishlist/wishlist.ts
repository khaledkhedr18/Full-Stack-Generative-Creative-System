import { Component, signal } from '@angular/core';
import { WishlistCard } from '../../components/wishlist-card/wishlist-card';
import { WishlistItem } from '../../utils/wishlist-interface';
import { WishlistService } from '../../services/wishlist-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  imports: [WishlistCard, RouterLink],
  templateUrl: './wishlist.html',
  styles: ``,
})
export class Wishlist {
  wishlistItems = signal<WishlistItem[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  constructor(private wishlistService: WishlistService) {}

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
    this.wishlistService.removeFromWishlist(productId).subscribe({
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

    this.wishlistService.clearWishlist().subscribe({
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
