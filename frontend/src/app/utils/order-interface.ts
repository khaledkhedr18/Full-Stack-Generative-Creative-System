export interface OrderResponseI {
  success: boolean;
  results: number;
  total: number;
  data: OrderInterface[];
}

export interface OrderInterface {
  _id: string;
  user: string;
  items: OrderItemI[];
  shippingAddress: AddressInterface;
  payment: PaymentInterface;
  itemsTotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  orderNumber: string;
  id: string;
}

export interface OrderItemI {
  product: OrderProductI;
  variantId: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

export interface OrderProductI {
  _id: string;
  name: string;
  category: string;
  brand: string;
  basePrice: number;
  currency: string;
  id: string;
}

export interface AddressInterface {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface PaymentInterface {
  method: string;
  status: string;
}
