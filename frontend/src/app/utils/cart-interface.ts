import { ProductVariant } from './product-interface';

export interface CartResponseI {
  success: boolean;
  data: CartInterface;
}

export interface CartProductI {
  _id: string;
  name: string;
  variants: ProductVariant[];
  basePrice: number;
  currency: string;
  id: string;
}

export interface CartItemI {
  product: CartProductI;
  variantId: string;
  size: string;
  quantity: number;
  price: number;
}

export interface UpdateCartItemI {
  productId: string;
  variantId: string;
  size: string;
  quantity: number;
}

export interface CartInterface {
  _id: string;
  user: string;
  items: CartItemI[];
  totalItems: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  __V: number;
  id: string;
}

export interface RemoveItemI {
  productId: string;
  variantId: string;
  size: string;
}
