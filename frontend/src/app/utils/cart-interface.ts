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

// Populated design object returned by GET /api/cart
export interface PopulatedDesignI {
  _id: string;
  prompt: string;
  originalImageUrl: string;
  generatedImageUrl: string | null;
  fee: number;
  status: string;
}

export interface CartItemI {
  product: CartProductI;
  variantId: string;
  size: string;
  quantity: number;
  price: number;
  customDesignIds?: PopulatedDesignI[];
  customDesignFee?: number;
}

export interface AddToCartI {
  productId: string;
  variantId: string;
  size: string;
  quantity: number;
  customDesignIds?: string[];
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
