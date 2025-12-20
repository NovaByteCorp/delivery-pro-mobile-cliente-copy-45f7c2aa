import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FiltersModal({ show, onClose, onApply }) {
  const [priceRange, setPriceRange] = useState('all');
  const [rating, setRating] = useState('all');
  const [prepTime, setPrepTime] = useState('all');

  const handleApply = () => {
    onApply({ priceRange, rating, prepTime });
    onClose();
  };

  const handleClear = () => {
    setPriceRange('all');
    setRating('all');
    setPrepTime('all');
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <SlidersHorizontal className="w-5 h-5 text-orange-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Filtros</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Faixa de Preço</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'all', label: 'Todos' },
                    { value: 'low', label: 'Até MT 50' },
                    { value: 'medium', label: 'MT 50 - MT 100' },
                    { value: 'high', label: 'Acima de MT 100' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setPriceRange(option.value)}
                      className={`px-4 py-3 rounded-2xl border-2 font-semibold transition-all ${
                        priceRange === option.value
                          ? 'bg-orange-500 border-orange-600 text-white'
                          : 'bg-white border-gray-200 text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Avaliação</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'all', label: 'Todas' },
                    { value: '4+', label: '4+ Estrelas' },
                    { value: '4.5+', label: '4.5+ Estrelas' },
                    { value: '5', label: '5 Estrelas' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setRating(option.value)}
                      className={`px-4 py-3 rounded-2xl border-2 font-semibold transition-all ${
                        rating === option.value
                          ? 'bg-orange-500 border-orange-600 text-white'
                          : 'bg-white border-gray-200 text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prep Time */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Tempo de Preparo</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'all', label: 'Qualquer' },
                    { value: 'fast', label: 'Até 20 min' },
                    { value: 'medium', label: '20-40 min' },
                    { value: 'slow', label: 'Acima de 40 min' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setPrepTime(option.value)}
                      className={`px-4 py-3 rounded-2xl border-2 font-semibold transition-all ${
                        prepTime === option.value
                          ? 'bg-orange-500 border-orange-600 text-white'
                          : 'bg-white border-gray-200 text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-2xl border-2"
                  onClick={handleClear}
                >
                  Limpar
                </Button>
                <Button
                  className="flex-1 h-12 bg-orange-500 hover:bg-orange-600 rounded-2xl"
                  onClick={handleApply}
                >
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}