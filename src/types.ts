export interface Customer {
  id: string;
  name: string;
  billingAddress: Address;
  shippingAddress: Address;
  email: string;
  createdAt: number;
  lastModifiedAt: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  createdAt: number;
  lastModifiedAt: number;
}

export interface Shipment {
  id: string;
  shippingAddress: Address;
  products: { sku: string, quantity: number }[];
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
}

export interface Purchase {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  createdAt: number;
  coupon_code: string;
  product_name: string;
}

export interface CreditTransaction {
  id: string;
  customerId: string;
  amount: number;
  purchaseId?: string;
  reason: 'Purchase' | 'Refund' | 'Add credit';
  createdAt: number;
}
