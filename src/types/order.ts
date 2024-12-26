import { AddressDTO } from './common';
import { CartDTO } from './cart';

export interface OrderItemDTO {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface OrderDTO {
  id: number;
  userId: number;
  orderItems: OrderItemDTO[];
  totalPrice: number;
  shippingAddress: AddressDTO;
  paymentMethod: string;
  paymentTransactionId: string;
  orderDate: string;
  orderStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderCreationRequest {
  shippingAddress: AddressDTO;
  paymentMethod: string;
  cart: CartDTO;
}

export interface StatusUpdateRequest {
  newStatus: string;
}