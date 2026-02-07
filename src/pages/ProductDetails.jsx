import React, { useState, useEffect } from 'react';
import { Restaurant, Product } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import {
  ArrowLeft,
  Heart,
  Star,
  Clock,
  Flame,
  Plus,
  Minus,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';

export default function ProductDetailsPage() {
  const [product, setProduct] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [quantity, setQuantity] = useState(2);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [removedIngredients, setRemovedIngredients] = useState([]);

  const ingredientIcons = {
    'Beef': '🥩',
    'Lettuce': '🥬',
    'Olive Oil': '🫒',
    'Egg': '🥚',
    'Tomato': '🍅',
    'Cheese': '🧀',
    'Onion': '🧅',
    'Bacon': '🥓'
  };

  const removableIngredients = [
    { name: 'Lettuce', icon: '🥬', isRemovable: true },
    { name: 'Tomato', icon: '🍅', isRemovable: true },
    { name: 'Onion', icon: '🧅', isRemovable: true },
    { name: 'Cheese', icon: '🧀', isRemovable: true },
    { name: 'Bacon', icon: '🥓', isRemovable: true }
  ];

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');
        
        if (!productId) {
          setLoading(false);
          return;
        }

        // Buscar produto do Supabase
        const productData = await Product.get(productId);
        
        if (productData) {
          // Parsear ingredients se vier como string JSON
          if (productData.ingredients && typeof productData.ingredients === 'string') {
            try {
              productData.ingredients = JSON.parse(productData.ingredients);
            } catch (e) {
              productData.ingredients = [];
            }
          }
          
          // Garantir que ingredients seja um array
          if (!Array.isArray(productData.ingredients)) {
            productData.ingredients = [];
          }
          
          setProduct(productData);
          
          // Buscar restaurante se existir restaurant_id
          if (productData.restaurant_id) {
            try {
              const restaurantData = await Restaurant.get(productData.restaurant_id);
              setRestaurant(restaurantData);
            } catch (error) {
              console.error("Erro ao carregar restaurante:", error);
            }
          }
        }

        // Verificar se está nos favoritos
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.includes(productId));
        
      } catch (error) {
        console.error("Erro ao carregar detalhes do produto:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, []);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;
    let isAdding = false;
    
    if (favorites.includes(product.id)) {
      newFavorites = favorites.filter(id => id !== product.id);
      setIsFavorite(false);
      isAdding = false;
    } else {
      newFavorites = [...favorites, product.id];
      setIsFavorite(true);
      isAdding = true;
    }
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    
    // Show feedback message
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-24 left-4 right-4 z-[60] flex justify-center animate-fade-in';
    toast.innerHTML = `
      <div class="bg-[#3c0068] text-white rounded-2xl shadow-2xl p-4 max-w-md w-full">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            ${isAdding 
              ? '<svg class="w-7 h-7 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>'
              : '<svg class="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>'
            }
          </div>
          <div>
            <p class="font-bold">${isAdding ? 'Adicionado aos favoritos!' : 'Removido dos favoritos'}</p>
            <p class="text-sm opacity-90">${product.name}</p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 2000);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const toggleIngredient = (ingredientName) => {
    if (removedIngredients.includes(ingredientName)) {
      setRemovedIngredients(removedIngredients.filter(i => i !== ingredientName));
    } else {
      setRemovedIngredients([...removedIngredients, ingredientName]);
    }
  };

  const addToCart = () => {
    if (!product) return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const productWithQuantity = { 
      ...product, 
      quantity,
      removedIngredients,
      cartItemId: `${product.id}_${Date.now()}`,
      restaurant_id: product.restaurant_id || restaurant?.id
    };

    cart.push(productWithQuantity);
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartUpdate'));
    
    // Show success message
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-24 left-4 right-4 z-[60] flex justify-center animate-fade-in';
    toast.innerHTML = `
      <div class="bg-[#3c0068] text-white rounded-2xl shadow-2xl p-4 max-w-md w-full">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <svg class="w-7 h-7 text-[#3c0068]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div>
            <p class="font-bold">Adicionado!</p>
            <p class="text-sm opacity-90">${quantity}x ${product.name}</p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
      handleGoBack();
    }, 2000);
  };
  
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-[#ff4700] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white gap-4">
        <p className="text-lg font-semibold text-gray-700">Produto não encontrado.</p>
        <Button onClick={handleGoBack}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-white overflow-y-auto">
       {/* Header with Product Image */}
      <div className="relative h-96">
        {/* Background Image - Esticada */}
        <div className="absolute inset-0">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop'}
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop';
            }}
            className="w-full h-full object-cover"
          />
          {/* Overlay roxa com opacidade */}
          <div className="absolute inset-0 bg-[#3c0068] opacity-40"></div>
        </div>

        {/* Header Buttons */}
        <div className="absolute top-12 left-0 right-0 px-8 flex justify-between items-center z-10">
          <button
            onClick={handleGoBack}
            className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg"
          >
            <ArrowLeft className="w-6 h-6 text-[#3c0068]" />
          </button>
          <button
            onClick={toggleFavorite}
            className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg"
          >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-[#3c0068]'}`} />
          </button>
        </div>
      </div>

      {/* Quantity Selector - Overlapping */}
      <div className="relative px-8 -mt-10 mb-6 z-20">
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl px-8 py-4 flex items-center space-x-4 shadow-xl">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center"
            >
              <Minus className="w-5 h-5 text-[#3c0068]" />
            </button>
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-[#3c0068]">{quantity}</span>
            </div>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center"
            >
              <Plus className="w-5 h-5 text-[#3c0068]" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="px-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-[#3c0068] flex-1" style={{ fontFamily: 'serif' }}>
            {product.name}
          </h1>
          <div className="flex items-center gap-1">
            <span className="text-3xl font-bold text-[#3c0068]">
              MT {product.price?.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-400 mb-6">{product.description}</p>

        {/* Features */}
        <div className="flex space-x-3 mb-6">
          <div className="bg-gray-50 rounded-2xl px-4 py-3 flex items-center space-x-2">
            <span className="text-lg">🛵</span>
            <span className="text-sm font-bold text-[#3c0068]">Grátis</span>
          </div>
          <div className="bg-gray-50 rounded-2xl px-4 py-3 flex items-center space-x-2">
            <span className="text-lg">⏰</span>
            <span className="text-sm font-bold text-[#3c0068]">{product.preparation_time || 10}-{(product.preparation_time || 10) + 10}min</span>
          </div>
          <div className="bg-gray-50 rounded-2xl px-4 py-3 flex items-center space-x-1">
            <Star className="w-3 h-3 fill-[#ff4700] text-[#ff4700]" />
            <span className="text-sm font-bold text-[#3c0068]">{product.rating?.toFixed(1) || '4.8'}</span>
          </div>
        </div>

        {/* Ingredients */}
        {product.ingredients && product.ingredients.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
                Ingredientes
              </h2>
              <button
                onClick={() => setShowCustomization(!showCustomization)}
                className="bg-[#ff4700] text-white px-4 py-2 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg"
              >
                Personalizar
                {showCustomization ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {!showCustomization ? (
              <div className="flex space-x-3 mb-6 overflow-x-auto pb-2">
                {product.ingredients.slice(0, 5).map((ingredient, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 bg-gray-50 rounded-2xl w-17 h-20 flex flex-col items-center justify-center"
                  >
                    <span className="text-2xl mb-2">
                      {ingredientIcons[ingredient.name] || '🍽️'}
                    </span>
                    <span className="text-xs font-bold text-[#3c0068]">{ingredient.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-3xl p-6 mb-6 shadow-lg">
                <h3 className="text-base font-bold text-[#3c0068] mb-4">Remover Ingredientes</h3>
                <div className="space-y-3">
                  {removableIngredients.map((ingredient, idx) => {
                    const isRemoved = removedIngredients.includes(ingredient.name);
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleIngredient(ingredient.name)}
                        className={`w-full rounded-2xl p-4 flex items-center justify-between transition-all ${
                          isRemoved 
                            ? 'bg-red-50 border-2 border-red-200' 
                            : 'bg-white border-2 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{ingredient.icon}</span>
                          <span className={`font-bold ${isRemoved ? 'text-red-500 line-through' : 'text-[#3c0068]'}`}>
                            {ingredient.name}
                          </span>
                        </div>
                        {isRemoved && (
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <X className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {removedIngredients.length > 0 && (
                  <div className="mt-4 p-3 bg-orange-50 rounded-2xl">
                    <p className="text-sm text-[#ff4700] font-bold text-center">
                      {removedIngredients.length} ingrediente(s) removido(s)
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* About */}
        <h2 className="text-lg font-bold mb-3 text-[#3c0068]" style={{ fontFamily: 'serif' }}>
          Sobre
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed mb-32">
          {product.description || 'Este hambúrguer especial usa carne de qualidade premium com tomates fatiados, pepinos, vegetais, folhas de alface, azeite e muito mais'}
        </p>
      </div>

      {/* Add to Cart Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg px-8 py-6 z-30">
        <button
          onClick={addToCart}
          className="w-full bg-[#ff4700] text-white font-bold text-lg py-5 rounded-3xl shadow-lg hover:bg-[#e63f00] transition-colors"
        >
          Adicionar ao Carrinho (MT {(product.price * quantity).toFixed(2)})
        </button>
      </div>
    </div>
  );
}