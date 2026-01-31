import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function FloatingCartButton({ expanded = false }) {
  const [cart, setCart] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Carregar carrinho inicial
    updateCart();

    // Listener para mudanças no carrinho
    const handleCartUpdate = () => {
      updateCart();
    };

    window.addEventListener('cartUpdate', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdate', handleCartUpdate);
    };
  }, []);

  const updateCart = () => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(cartData);
    setIsVisible(cartData.length > 0);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (item.quantity || 1), 0);
  };

  const handleClick = () => {
    window.location.href = createPageUrl('Cart');
  };

  if (!isVisible) return null;

  return (
    <>
      {expanded ? (
        // Botão expandido (tela de restaurante)
        <button
          onClick={handleClick}
          className="fixed bottom-24 left-4 right-4 z-50 bg-[#ff4700] text-white rounded-3xl shadow-2xl px-6 py-5 flex items-center justify-between hover:bg-[#e63f00] transition-all transform hover:scale-105 animate-slide-up"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold">Ver Carrinho</p>
              <p className="text-xs opacity-90">{getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold">MT {getTotalPrice().toFixed(2)}</p>
          </div>
        </button>
      ) : (
        // Botão colapsado (outras telas)
        <button
          onClick={handleClick}
          className="fixed bottom-24 right-6 z-50 w-16 h-16 bg-[#ff4700] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#e63f00] transition-all transform hover:scale-110 animate-bounce-subtle"
        >
          <ShoppingBag className="w-7 h-7" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 w-7 h-7 bg-[#3c0068] text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-lg">
              {getTotalItems()}
            </span>
          )}
        </button>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}