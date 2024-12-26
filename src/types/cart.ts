export interface CartItemDTO {
    id: number;
    cartId: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
  }
  
  export interface CartDTO {
    id: number;
    userId: number;
    cartItems: CartItemDTO[];
    createdAt: string;
    updatedAt: string;
  }