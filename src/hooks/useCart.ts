import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import cartService from '../services/cartService';
import { CartDTO } from '../types/cart';

export const useCart = () => {
  const [cart, setCart] = useState<CartDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCart = async () => {
    try {
      if (!user?.id) {
        setCart(null);
        return;
      }
      const cartData = await cartService.getCart(user.id);
      setCart(cartData);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user?.id]);

  const getItemCount = () => {
    if (!cart?.cartItems) return 0;
    return cart.cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cart,
    loading,
    fetchCart,
    getItemCount,
  };
};

export default useCart;
