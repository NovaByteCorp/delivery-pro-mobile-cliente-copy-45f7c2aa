import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function FloatingCartButton() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const updateCartItems = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(cart);
    };

    // Initial load
    updateCartItems();

    // Listen for cart updates
    const handleStorageChange = () => {
      updateCartItems();
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-page cart updates
    window.addEventListener('cartUpdate', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdate', handleStorageChange);
    };
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (totalItems === 0) return null;

  const handleCartClick = () => {
    window.location.href = createPageUrl('Cart');
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <Button
        onClick={handleCartClick}
        className="w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-600 shadow-lg border-4 border-white"
        size="icon"
      >
        <div className="relative">
          <ShoppingCart className="w-6 h-6 text-white" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </div>
      </Button>
    </div>
  );
}