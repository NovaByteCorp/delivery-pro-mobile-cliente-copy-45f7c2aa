import React, { useState, useEffect } from "react";
import { Product, Category } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Search, 
  Star, 
  Clock,
  Heart,
  Share,
  ShoppingCart,
  Plus
} from "lucide-react";

export default function RestaurantMenuModal({ restaurant, onClose }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [cartItems, setCartItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const loadMenuData = async () => {
      setLoading(true);
      try {
        // Puxar dados reais do Supabase
        const [productsData, categoriesData] = await Promise.all([
          Product.filter({ restaurant_id: restaurant.id }),
          Category.filter({ restaurant_id: restaurant.id })
        ]);

        setProducts(productsData.filter(p => p.is_available));
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erro ao carregar cardápio:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMenuData();
  }, [restaurant.id]);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1, restaurant_id: restaurant.id });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    const existingCartItem = cartItems.find(item => item.id === product.id);
    if (existingCartItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const getTotalCart = () => cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const getTotalItems = () => cartItems.reduce((total, item) => total + item.quantity, 0);

  const filteredProducts = products.filter(product => {
    // Filtro por categoria
    const matchesCategory = activeCategory === "all" || product.category_id === activeCategory;

    // Filtro adicional
    if (activeFilter === "all") return matchesCategory;
    if (activeFilter === "popular") return product.is_featured && matchesCategory;
    if (activeFilter === "exclusive") return product.price < 30 && matchesCategory;
    return matchesCategory;
  });

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="relative h-48">
        <img 
          src={restaurant.image_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop'} 
          alt={restaurant.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <Button onClick={onClose} size="icon" className="w-10 h-10 bg-white/90 rounded-full shadow-lg"><ArrowLeft className="w-5 h-5" /></Button>
          <div className="flex gap-2">
            <Button size="icon" className="w-10 h-10 bg-white/90 rounded-full shadow-lg"><Share className="w-5 h-5" /></Button>
            <Button size="icon" className="w-10 h-10 bg-white/90 rounded-full shadow-lg"><Heart className="w-5 h-5" /></Button>
          </div>
        </div>

        <div className="absolute top-16 left-4 right-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input type="text" placeholder={`Buscar em ${restaurant.name}`} className="w-full h-11 pl-10 bg-white rounded-xl border-0 shadow-lg text-base"/>
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">{restaurant.name}</h1>
          <Button className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500 text-xs px-3 py-1 rounded-full font-semibold">Ver avaliações</Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="font-semibold text-gray-700">{restaurant.rating?.toFixed(1) || '4.8'}</span>
            <span className="text-sm text-gray-500">(335+)</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 sticky top-0 z-10 flex gap-2 overflow-x-auto">
        <Button size="sm" onClick={() => setActiveCategory("all")} className={`rounded-full ${activeCategory === "all" ? "bg-gray-900 text-white" : "bg-white text-gray-700 border border-gray-300"}`}>Todos</Button>
        {categories.map(cat => (
          <Button key={cat.id} size="sm" onClick={() => setActiveCategory(cat.id)} className={`rounded-full ${activeCategory === cat.id ? "bg-gray-900 text-white" : "bg-white text-gray-700 border border-gray-300"}`}>{cat.name}</Button>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 sticky top-12 z-10 flex gap-2">
        {["all","popular","exclusive"].map(filter => (
          <Button key={filter} size="sm" onClick={() => setActiveFilter(filter)} className={`rounded-full ${activeFilter === filter ? "bg-gray-900 text-white" : "bg-white text-gray-700 border border-gray-300"}`}>
            {filter === "all" ? "Todos os Itens" : filter === "popular" ? "Popular" : "Ofertas Exclusivas"}
          </Button>
        ))}
      </div>

      {/* Products */}
      <div className="px-4 pt-4 pb-24">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="relative">
                  <img src={product.image_url} alt={product.name} className="h-24 w-full object-cover"/>
                  <Button size="icon" variant="secondary" className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 hover:bg-white shadow-sm">
                    <Heart className="w-3 h-3 text-gray-600" />
                  </Button>
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-gray-900/80 px-1.5 py-0.5 rounded">
                    <Clock className="w-2.5 h-2.5 text-white"/>
                    <span className="text-white text-xs font-medium">{product.preparation_time || 31} min</span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-sm text-gray-900 mb-1">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 text-yellow-400 fill-current"/>
                    <span className="text-xs font-semibold text-gray-700">{product.rating || 4.1}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black text-gray-900">MT {product.price?.toFixed(2)}</p>
                    <Button onClick={() => addToCart(product)} size="sm" className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-8 h-8 p-0">
                      <Plus className="w-4 h-4"/>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4">
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl h-14 flex items-center justify-between px-6" onClick={() => window.location.href = '/Cart'}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"><ShoppingCart className="w-4 h-4"/></div>
              <span className="font-semibold">Ver seu carrinho</span>
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"><span className="text-xs font-bold">{getTotalItems()}</span></div>
            </div>
            <span className="font-bold text-lg">MT {getTotalCart().toFixed(2)}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
