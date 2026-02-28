export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductImage {
  url: string;
  view: string;
}

export interface ProductSize {
  size: string;
  sku: string;
  stock: number;
  price: number;
}

export interface ProductVariant {
  variantId: string;
  color: ProductColor;
  images: ProductImage[];
  sizes: ProductSize[];
}

export interface ProductRatings {
  average: number;
  count: number;
}

export interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  tags: string[];
  gender: string;
  variants: ProductVariant[];
  basePrice: number;
  currency: string;
  discountPercent: number;
  material: string;
  careInstructions: string[];
  ratings: ProductRatings;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Product[];
}
