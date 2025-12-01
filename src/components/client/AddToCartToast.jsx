import React, { useEffect } from 'react';
import { CheckCircle, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddToCartToast({ show, product, quantity, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-24 left-4 right-4 z-[60] flex justify-center"
        >
          <div className="bg-emerald-500 text-white rounded-2xl shadow-2xl p-4 max-w-md w-full border-2 border-emerald-400">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-7 h-7 text-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base">Adicionado ao carrinho!</p>
                <p className="text-sm opacity-90 truncate">
                  {quantity}x {product?.name}
                </p>
              </div>
              <ShoppingCart className="w-6 h-6 flex-shrink-0" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}