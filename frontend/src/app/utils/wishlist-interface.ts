import { Product } from './product-interface';

export interface WishlistItem {
  product: Product;
  _id?: string;
  // addedAt?: string
}

export interface Wishlist {
  user: string;
  items: WishlistItem[];
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

export interface WishlistResponse {
  success: boolean;
  count: number;
  data: Wishlist;
}

export interface AddToWishlistRequest {
  productId: string;
}

export interface RemoveFromWishlistResponse {
  success: boolean;
  message: string;
  count: number;
  data: Wishlist;
}
