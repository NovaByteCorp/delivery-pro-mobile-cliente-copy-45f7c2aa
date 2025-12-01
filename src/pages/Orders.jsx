
import React, { useState, useEffect } from "react";
import { Restaurant } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { 
  MapPin, 
  Bell, 
  Search, 
  Star,
  Clock,
  Home, 
  ListOrdered, 
  ShoppingCart, 
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RestaurantMenuModal from "../components/client/RestaurantMenuModal";
import BottomNav from "../components/client/BottomNav";
import FloatingCartButton from "../components/client/FloatingCartButton";

export default function OrdersPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const allRestaurants = await Restaurant.list();
      setRestaurants(allRestaurants.filter(r => r.is_active));
    } catch (error) {
      console.error("Erro ao carregar restaurantes:", error);
    } finally {
      setLoading(false);
    }
  };

  const navigate = (url) => {
    window.location.href = url;
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-base font-medium text-gray-600">Carregando restaurantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Status Bar */}
      <div className="bg-white px-4 pt-3 pb-1 text-center flex justify-center items-center h-10">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c86d65c4f51add45f7c2aa/6e6e29b85_MATERIAL_DE_APRESENTAO-08-removebg-preview.png"
          alt="ChegouDelivery Logo"
          className="h-8"
        />
      </div>

      <div className="bg-white pb-4">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Rua da Resistência, Beira</p>
              <p className="text-xs text-gray-500">Entregar aqui</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="relative p-2">
            <Bell className="w-6 h-6 text-gray-700" />
            <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar restaurantes..."
              className="w-full h-12 pl-10 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 text-base"
            />
          </div>
        </div>
      </div>

      {/* Restaurants List */}
      <div className="px-4 pt-4 pb-24">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Restaurantes Disponíveis</h2>
        <div className="space-y-4">
          {restaurants.map((restaurant) => (
            <div 
              key={restaurant.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer"
              onClick={() => setSelectedRestaurant(restaurant)}
            >
              <div className="relative h-32">
                <img 
                  src={restaurant.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop'} 
                  alt={restaurant.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-600" />
                    <span className="text-xs font-medium text-gray-700">25-35 min</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{restaurant.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-700">
                      {restaurant.rating?.toFixed(1) || '4.8'}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{restaurant.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="capitalize">{restaurant.cuisine_type}</span>
                  <span>Taxa MT {restaurant.delivery_fee?.toFixed(2) || '0.00'}</span>
                  <span>Min MT {restaurant.minimum_order?.toFixed(2) || '50.00'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Restaurant Menu Modal */}
      {selectedRestaurant && (
        <RestaurantMenuModal
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav activePage="Orders" />
      
      {/* Floating Cart Button */}
      <FloatingCartButton />
    </div>
  );
}
