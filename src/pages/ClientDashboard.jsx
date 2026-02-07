import React, { useState, useEffect } from "react";
import * as entities from "@/api/entities";
import { createPageUrl } from "@/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import {
  MapPin,
  Bell,
  Search,
  SlidersHorizontal,
  Star,
  ShoppingBag,
  Heart,
} from "lucide-react";
import FloatingCartButton from '../components/client/FloatingCartButton';
import BottomNav from "../components/client/BottomNav";
import FiltersModal from "../components/client/FiltersModal";

export default function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: "all",
    rating: "all",
    prepTime: "all",
  });
  const [selectedCategory, setSelectedCategory] = useState("burger");
  const [restaurantFavorites, setRestaurantFavorites] = useState([]);

  const { t } = useLanguage();

  // categorias fixas de fallback
  const defaultCategoryList = [
    { id: "burger", emoji: "🍔", name: "Burger" },
    { id: "pizza", emoji: "🍕", name: "Pizza" },
    { id: "salad", emoji: "🥙", name: "Salad" },
    { id: "chicken", emoji: "🍗", name: "Chicken" },
    { id: "sushi", emoji: "🍣", name: "Sushi" },
  ];

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const testUser = localStorage.getItem("testUser");
        if (testUser) {
          setUser(JSON.parse(testUser));
        }

        // Carregar favoritos de restaurantes
        const favorites = JSON.parse(localStorage.getItem('restaurantFavorites') || '[]');
        setRestaurantFavorites(favorites);

        // Buscar restaurantes
        const allRestaurantsData = await entities.Restaurant.getAll({
          orderBy: "rating",
          ascending: false,
          limit: 20,
        });

        // Buscar categorias
        const categoryData = await entities.Category.getAll().catch(() => []);
        setCategories(categoryData.length > 0 ? categoryData : defaultCategoryList);

        setAllRestaurants(allRestaurantsData);
        setRestaurants(allRestaurantsData.slice(0, 5));
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const navigate = (url) => {
    window.location.href = url;
  };

  const toggleRestaurantFavorite = (e, restaurantId, restaurantName) => {
    e.stopPropagation(); // Prevenir navegação
    
    const favorites = JSON.parse(localStorage.getItem('restaurantFavorites') || '[]');
    let newFavorites;
    let isAdding = false;
    
    if (favorites.includes(restaurantId)) {
      newFavorites = favorites.filter(id => id !== restaurantId);
      setRestaurantFavorites(newFavorites);
      isAdding = false;
    } else {
      newFavorites = [...favorites, restaurantId];
      setRestaurantFavorites(newFavorites);
      isAdding = true;
    }
    
    localStorage.setItem('restaurantFavorites', JSON.stringify(newFavorites));
    
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
            <p class="text-sm opacity-90">${restaurantName}</p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 2000);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);

    let filtered = [...allRestaurants];

    if (newFilters.rating !== "all") {
      filtered = filtered.filter((r) => {
        const rating = r.rating || 4.8;
        if (newFilters.rating === "4+") return rating >= 4;
        if (newFilters.rating === "4.5+") return rating >= 4.5;
        if (newFilters.rating === "5") return rating === 5;
        return true;
      });
    }

    setRestaurants(filtered.slice(0, 5));
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#ff4700] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-base font-medium text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-white overflow-y-auto pb-24">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10 px-8 pt-12 pb-4">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setShowFilters(true)}
            className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center"
          >
            <SlidersHorizontal className="w-6 h-6 text-[#3c0068]" />
          </button>

          <div className="flex items-center justify-center">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c86d65c4f51add45f7c2aa/6e6e29b85_MATERIAL_DE_APRESENTAO-08-removebg-preview.png"
              alt="ChegouDelivery Logo"
              className="h-12"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <LanguageSelector position="relative" />
            </div>
            
            <button
              onClick={() => setShowNotifications(true)}
              className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center relative"
            >
              <Bell className="w-6 h-6 text-[#3c0068]" />
              <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>
          </div>
        </div>

        <h1
          className="text-2xl font-bold text-center mb-6"
          style={{ fontFamily: "serif" }}
        >
          <span className="block text-[#ff4700]">{t('alwaysClose')}</span>
          <span className="block text-[#3c0068]">{t('alwaysOnTime')}</span>
        </h1>

        {/* Search Bar */}
        <div className="relative bg-gray-50 rounded-3xl px-6 py-5 flex items-center">
          <Search className="w-5 h-5 text-gray-400 absolute left-6" />
          <input
            type="text"
            placeholder={t('searchFood')}
            className="bg-transparent w-full pl-10 text-sm text-gray-400 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                navigate(createPageUrl(`Search?q=${searchQuery}`));
              }
            }}
          />
          <button className="ml-auto">
            <div className="w-6 h-6 border-2 border-[#ff4700] rounded-full" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-80 px-8">
        {/* Categorias */}
        <h2
          className="text-2xl font-bold mb-6 text-[#3c0068]"
          style={{ fontFamily: "serif" }}
        >
          {t('categories')}
        </h2>
        <div className="flex space-x-3 overflow-x-auto mb-8 pb-2 no-scrollbar">
          {(categories.length > 0 ? categories : defaultCategoryList).map(
            (cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 rounded-2xl px-4 py-4 flex items-center space-x-2 transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[#ff4700] shadow-lg"
                    : "bg-gray-50"
                }`}
              >
                {selectedCategory === cat.id ? (
                  <div className="w-7 h-7 bg-white rounded-xl flex items-center justify-center text-lg">
                    {cat.emoji || "🍴"}
                  </div>
                ) : (
                  <span className="text-lg">{cat.emoji || "🍴"}</span>
                )}
                <span
                  className={`text-sm font-bold ${
                    selectedCategory === cat.id
                      ? "text-white"
                      : "text-[#3c0068]"
                  }`}
                >
                  {cat.name || cat.category_name}
                </span>
              </button>
            )
          )}
        </div>

        {/* Restaurantes Populares */}
        <h2
          className="text-lg font-bold mb-4 text-[#3c0068]"
          style={{ fontFamily: "serif" }}
        >
          {t('popular')}
        </h2>

        <div className="space-y-5">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              onClick={() =>
                navigate(createPageUrl(`Menu?restaurant=${restaurant.id}`))
              }
              className="cursor-pointer"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-lg">
                <div className="relative w-full h-56 bg-gray-200">
                  <img
                    src={
                      restaurant.image_url ||
                      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop"
                    }
                    alt={restaurant.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop";
                    }}
                    className="w-full h-full object-cover"
                  />
                  {/* Botão de Favorito */}
                  <button 
                    onClick={(e) => toggleRestaurantFavorite(e, restaurant.id, restaurant.name)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Heart 
                      className={`w-5 h-5 ${
                        restaurantFavorites.includes(restaurant.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-[#3c0068]'
                      }`} 
                    />
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-b-2xl">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-[#3c0068]">
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-400 capitalize">
                          {restaurant.cuisine_type || t('fastFood')}
                        </span>
                        <div className="w-1 h-1 bg-gray-400 rounded-full" />
                        <span className="text-xs text-gray-400">
                          {restaurant.category || "Fast Food"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-[#ff4700] text-[#ff4700]" />
                        <span className="text-xs text-gray-400">
                          {restaurant.rating?.toFixed(1) || "4.8"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 mt-1 block">
                        {restaurant.delivery_time || "10-20min"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FloatingCartButton expanded={false} />
      <BottomNav activePage="ClientDashboard" />
      <FiltersModal
        show={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
      />
    </div>
  );
}