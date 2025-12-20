
import React, { useState } from 'react';
import { ChevronLeft, Star, Heart, Plus, Home, ShoppingBag, User } from 'lucide-react';
import BottomNav from "../components/client/BottomNav";

export default function FavoritesScreen() {
  const [favoriteTab, setFavoriteTab] = useState('restaurants');

  const favoriteRestaurants = [
    {
      id: 1,
      name: 'Chillox Burger',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
      category: 'Burgers',
      type: 'Fast Food',
      rating: 4.8,
      time: '10min'
    },
    {
      id: 2,
      name: "McDonald's",
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
      category: 'Burgers',
      type: 'Fast Food',
      rating: 4.9,
      time: '30min'
    },
    {
      id: 3,
      name: 'Madchef',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
      category: 'Burgers',
      type: 'Fast Food',
      rating: 4.4,
      time: '40min'
    }
  ];

  const favoriteDishes = [
    {
      name: 'Beef Burger',
      desc: 'Beef Patty and special sauce',
      price: 7.99,
      restaurant: 'Chillox Burger',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop'
    },
    {
      name: 'XL Burger',
      desc: 'Cheese & beef pastrami perfectly paired',
      price: 11.00,
      restaurant: 'Madchef',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&h=200&fit=crop'
    },
    {
      name: 'Naga Drums',
      desc: 'Cripsy fired chicken drum',
      price: 9.99,
      restaurant: 'Chillox Burger',
      image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=300&h=200&fit=crop'
    },
    {
      name: 'Chicken Burger',
      desc: 'Chicken Patty and special sauce',
      price: 4.99,
      restaurant: "McDonald's",
      image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300&h=200&fit=crop'
    },
    {
      name: 'French Fries',
      desc: 'cut deep fried potatos',
      price: 3.99,
      restaurant: 'Chillox Burger',
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop'
    },
    {
      name: 'Chicken Fried',
      desc: 'Delicious cripsy fried breaded chicken',
      price: 7.99,
      restaurant: 'Madchef',
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300&h=200&fit=crop'
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
        <div className="relative w-full h-screen bg-white overflow-y-auto pb-24">
         {/* Header */}
          <div className="fixed top-0 left-0 right-0 bg-white z-20 px-8 pt-12 pb-4">
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
                className={`flex-1 rounded-2xl px-4 py-4 text-sm font-bold transition-all ${favoriteTab === 'restaurants'
                    ? 'bg-[#ff4700] text-white shadow-lg'
                    : 'bg-gray-50 text-[#3c0068]'
                  }`}
              >
                Restaurantes
              </button>
              <button
                onClick={() => setFavoriteTab('dishes')}
                className={`flex-1 rounded-2xl px-4 py-4 text-sm font-bold transition-all ${favoriteTab === 'dishes'
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
              <div className="space-y-5">
                {favoriteRestaurants.map((restaurant) => (
                  <div key={restaurant.id} className="cursor-pointer">
                    <div className="relative rounded-3xl overflow-hidden shadow-lg">
                      <div className="w-full h-56 bg-gray-200 relative">
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                        <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg z-10">
                          <Heart className="w-5 h-5 fill-[#ff4700] text-[#ff4700]" />
                        </button>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-b-2xl">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-[#3c0068]">{restaurant.name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-400">{restaurant.category}</span>
                              <div className="w-1 h-1 bg-gray-400 rounded-full" />
                              <span className="text-xs text-gray-400">{restaurant.type}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-[#ff4700] text-[#ff4700]" />
                              <span className="text-xs text-gray-400">{restaurant.rating}</span>
                            </div>
                            <span className="text-xs text-gray-400 mt-1 block">{restaurant.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 pb-6">
                {favoriteDishes.map((dish, idx) => (
                  <div
                    key={idx}
                    className="bg-[#3c0068] rounded-3xl overflow-hidden shadow-lg cursor-pointer"
                  >
                    <div className="relative h-36 bg-[#4d0083]">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                      />
                      <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg z-10">
                        <Heart className="w-4 h-4 fill-[#ff4700] text-[#ff4700]" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-bold text-base mb-1">{dish.name}</h3>
                      <p className="text-gray-300 text-xs mb-2">{dish.restaurant}</p>
                      <p className="text-gray-300 text-xs mb-3 line-clamp-2">{dish.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[#3c0068] font-bold bg-gray-50 px-3 py-1 rounded-xl text-base">
                          MT {dish.price.toFixed(2)}
                        </span>
                        <button className="w-8 h-8 bg-[#4d0083] rounded-lg flex items-center justify-center hover:bg-[#ff4700] transition-colors">
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <BottomNav activePage="Favorites" />
        </div>
      </div>
    </div>
  );
}
