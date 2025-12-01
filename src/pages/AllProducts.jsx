
import React, { useState, useEffect } from "react";
import { Product } from "@/api/entities";
import { Restaurant } from "@/api/entities";
import { Category } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Star,
  ArrowLeft,
  ShoppingCart,
  Filter
} from "lucide-react";
import { createPageUrl } from "@/utils";
import BottomNav from "../components/client/BottomNav";
import FloatingCartButton from "../components/client/FloatingCartButton";

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [allProducts, allCategories, allRestaurants] = await Promise.all([
          Product.list("-rating"),
          Category.list(),
          Restaurant.list()
        ]);

        setProducts(allProducts);
        setCategories(allCategories);

        const restaurantMap = allRestaurants.reduce((acc, r) => {
          acc[r.id] = r;
          return acc;
        }, {});
        setRestaurants(restaurantMap);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const navigate = (url) => {
    window.location.href = url;
  };

  const addToCart = (product, quantity = 1, e) => {
    if (e) {
      e.stopPropagation();
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartUpdate'));

    // Show toast
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-24 left-4 right-4 z-[60] flex justify-center animate-fade-in';
    toast.innerHTML = `
      <div class="bg-emerald-500 text-white rounded-2xl shadow-2xl p-4 max-w-md w-full border-2 border-emerald-400">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-bold text-base">Adicionado ao carrinho!</p>
            <p class="text-sm opacity-90">${quantity}x ${product.name}</p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 2000);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="pb-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4">
          <div className="flex items-center gap-3 mb-4">
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-white">Todos os Produtos</h1>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar produtos..."
              className="w-full h-12 pl-10 bg-white rounded-xl border-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Filter */}
        <div className="bg-white p-4 border-b">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">Filtrar por categoria:</span>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            <Badge
              variant={selectedCategory === "all" ? "default" : "outline"}
              className={`cursor-pointer whitespace-nowrap ${selectedCategory === "all" ? 'bg-orange-500' : ''}`}
              onClick={() => setSelectedCategory("all")}
            >
              Todas
            </Badge>
            {categories.map(cat => (
              <Badge
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                className={`cursor-pointer whitespace-nowrap ${selectedCategory === cat.id ? 'bg-orange-500' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="p-4">
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum produto encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 cursor-pointer relative"
                  onClick={() => navigate(createPageUrl(`ProductDetails?id=${product.id}`))}
                >
                  <div className="relative">
                    <img
                      src={product.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'}
                      alt={product.name}
                      onError={(e) => {
                        e.target.onerror = null; // Prevents infinite loop in case placeholder also fails
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
                      }}
                      className="h-32 w-full object-cover"
                    />
                    {/* Rating Badge - Canto superior direito da imagem */}
                    <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs font-bold text-gray-800">{product.rating?.toFixed(1) || '4.8'}</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-sm text-gray-900 truncate mb-1">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2 truncate">
                      {restaurants[product.restaurant_id]?.name || 'Restaurante'}
                    </p>
                    <div className="flex items-center justify-between">
                      {/* Add to Cart Button - Agora do lado esquerdo */}
                      <button
                        onClick={(e) => addToCart(product, 1, e)}
                        className="w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                      <p className="text-base font-black text-gray-900">
                        MT {product.price?.toFixed(2) || '25.00'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav activePage="AllProducts" />
      <FloatingCartButton />
    </div>
  );
}
