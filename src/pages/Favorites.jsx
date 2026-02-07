import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, Heart, Plus, Loader2 } from 'lucide-react';
import { Restaurant, Product } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import BottomNav from "../components/client/BottomNav";
import FloatingCartButton from '../components/client/FloatingCartButton';

export default function FavoritesScreen() {
  const [favoriteTab, setFavoriteTab] = useState('restaurants');
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [favoriteDishes, setFavoriteDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    loadFavorites();
  }, [favoriteTab]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const restaurantFavorites = JSON.parse(localStorage.getItem('restaurantFavorites') || '[]');

      if (favoriteTab === 'restaurants') {
        // Carregar restaurantes favoritos
        if (restaurantFavorites.length > 0) {
          const restaurantsData = await Promise.all(
            restaurantFavorites.map(async (id) => {
              try {
                return await Restaurant.get(id);
              } catch (error) {
                console.error(`Erro ao carregar restaurante ${id}:`, error);
                return null;
              }
            })
          );
          setFavoriteRestaurants(restaurantsData.filter(r => r !== null));
        } else {
          setFavoriteRestaurants([]);
        }
      } else {
        // Carregar pratos favoritos
        if (favorites.length > 0) {
          const dishesData = await Promise.all(
            favorites.map(async (id) => {
              try {
                const product = await Product.get(id);
                // Buscar informações do restaurante se existir
                if (product && product.restaurant_id) {
                  try {
                    const restaurant = await Restaurant.get(product.restaurant_id);
                    product.restaurantName = restaurant?.name || 'Restaurante';
                  } catch (error) {
                    product.restaurantName = 'Restaurante';
                  }
                }
                return product;
              } catch (error) {
                console.error(`Erro ao carregar produto ${id}:`, error);
                return null;
              }
            })
          );
          setFavoriteDishes(dishesData.filter(d => d !== null));
        } else {
          setFavoriteDishes([]);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRestaurantFavorite = (restaurantId) => {
    const restaurantFavorites = JSON.parse(localStorage.getItem('restaurantFavorites') || '[]');
    let newFavorites;
    
    if (restaurantFavorites.includes(restaurantId)) {
      newFavorites = restaurantFavorites.filter(id => id !== restaurantId);
    } else {
      newFavorites = [...restaurantFavorites, restaurantId];
    }
    
    localStorage.setItem('restaurantFavorites', JSON.stringify(newFavorites));
    loadFavorites(); // Recarregar lista
  };

  const toggleDishFavorite = (dishId) => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;
    
    if (favorites.includes(dishId)) {
      newFavorites = favorites.filter(id => id !== dishId);
    } else {
      newFavorites = [...favorites, dishId];
    }
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    loadFavorites(); // Recarregar lista
  };

  const addDishToCart = (dish) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const productWithQuantity = { 
      ...dish, 
      quantity: 1,
      removedIngredients: [],
      cartItemId: `${dish.id}_${Date.now()}`,
      restaurant_id: dish.restaurant_id
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
            <p class="text-sm opacity-90">1x ${dish.name}</p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 2000);
  };

  const navigate = (url) => {
    window.location.href = url;
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#ff4700] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-base font-medium text-gray-600">{t('loading') || 'Carregando...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
        <div className="relative w-full h-screen bg-white overflow-y-auto pb-24">
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 bg-white z-20 px-8 pt-12 pb-4 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => window.history.back()}
                className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6 text-[#3c0068]" />
              </button>

              <h1 className="text-2xl font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
                Favoritos
              </h1>

              <div className="w-14 h-14" />
            </div>

            {/* Tabs */}
            <div className="flex space-x-3">
              <button
                onClick={() => setFavoriteTab('restaurants')}
                className={`flex-1 rounded-2xl px-4 py-4 text-sm font-bold transition-all ${
                  favoriteTab === 'restaurants'
                    ? 'bg-[#ff4700] text-white shadow-lg'
                    : 'bg-gray-50 text-[#3c0068]'
                }`}
              >
                Restaurantes
              </button>
              <button
                onClick={() => setFavoriteTab('dishes')}
                className={`flex-1 rounded-2xl px-4 py-4 text-sm font-bold transition-all ${
                  favoriteTab === 'dishes'
                    ? 'bg-[#ff4700] text-white shadow-lg'
                    : 'bg-gray-50 text-[#3c0068]'
                }`}
              >
                Pratos
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="mt-52 px-8">
            {favoriteTab === 'restaurants' ? (
              <>
                {favoriteRestaurants.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <Heart className="w-12 h-12 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-[#3c0068] mb-2">Nenhum favorito ainda</h3>
                    <p className="text-gray-400 text-center text-sm px-8">
                      Adicione restaurantes aos favoritos para vê-los aqui
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {favoriteRestaurants.map((restaurant) => (
                      <div 
                        key={restaurant.id} 
                        className="cursor-pointer"
                        onClick={() => navigate(createPageUrl(`Menu?restaurant=${restaurant.id}`))}
                      >
                        <div className="relative rounded-3xl overflow-hidden shadow-lg">
                          <div className="w-full h-56 bg-gray-200 relative">
                            <img
                              src={restaurant.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop'}
                              alt={restaurant.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop';
                              }}
                              className="w-full h-full object-cover"
                            />
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRestaurantFavorite(restaurant.id);
                              }}
                              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg z-10"
                            >
                              <Heart className="w-5 h-5 fill-[#ff4700] text-[#ff4700]" />
                            </button>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-b-2xl">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-lg font-bold text-[#3c0068]">{restaurant.name}</h3>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-xs text-gray-400 capitalize">
                                    {restaurant.cuisine_type || 'Fast Food'}
                                  </span>
                                  <div className="w-1 h-1 bg-gray-400 rounded-full" />
                                  <span className="text-xs text-gray-400">
                                    {restaurant.category || 'Fast Food'}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 fill-[#ff4700] text-[#ff4700]" />
                                  <span className="text-xs text-gray-400">
                                    {restaurant.rating?.toFixed(1) || '4.8'}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-400 mt-1 block">
                                  {restaurant.delivery_time || '10-20min'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                {favoriteDishes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <Heart className="w-12 h-12 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-[#3c0068] mb-2">Nenhum favorito ainda</h3>
                    <p className="text-gray-400 text-center text-sm px-8">
                      Adicione pratos aos favoritos para vê-los aqui
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 pb-6">
                    {favoriteDishes.map((dish) => (
                      <div
                        key={dish.id}
                        className="bg-[#3c0068] rounded-3xl overflow-hidden shadow-lg cursor-pointer"
                        onClick={() => navigate(createPageUrl(`ProductDetails?id=${dish.id}`))}
                      >
                        <div className="relative h-36 bg-[#4d0083]">
                          <img
                            src={dish.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop'}
                            alt={dish.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop';
                            }}
                            className="w-full h-full object-cover"
                          />
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDishFavorite(dish.id);
                            }}
                            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg z-10"
                          >
                            <Heart className="w-4 h-4 fill-[#ff4700] text-[#ff4700]" />
                          </button>
                        </div>
                        <div className="p-4">
                          <h3 className="text-white font-bold text-base mb-1">{dish.name}</h3>
                          <p className="text-gray-300 text-xs mb-2">{dish.restaurantName || 'Restaurante'}</p>
                          <p className="text-gray-300 text-xs mb-3 line-clamp-2">
                            {dish.description || 'Delicioso prato'}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-[#3c0068] font-bold bg-gray-50 px-3 py-1 rounded-xl text-base">
                              MT {dish.price?.toFixed(2) || '0.00'}
                            </span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                addDishToCart(dish);
                              }}
                              className="w-8 h-8 bg-[#4d0083] rounded-lg flex items-center justify-center hover:bg-[#ff4700] transition-colors"
                            >
                              <Plus className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <FloatingCartButton expanded={false} />
          <BottomNav activePage="Favorites" />
        </div>
      </div>
    </div>
  );
}