import React, { useState, useEffect, useCallback } from "react";
import { Restaurant, Product, Category } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, ArrowLeft, Star, Clock, DollarSign, User, ShoppingBag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import BottomNav from "../components/client/BottomNav";
import FloatingCartButton from '../components/client/FloatingCartButton';
import RestaurantSelector from "../components/menu/RestaurantSelector";
import CategoryGrid from "../components/menu/CategoryGrid";
import ProductGrid from "../components/menu/ProductGrid";
import AddProductModal from "../components/menu/AddProductModal";
import RestaurantSettings from "../components/menu/RestaurantSettings";

export default function Menu() {
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(false);
  const [simulatedRole, setSimulatedRole] = useState(null);
  const [user, setUser] = useState(null);
  const [isClientView, setIsClientView] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
  }, []);

  const loadRestaurantData = useCallback(async (restaurantId) => {
    if (!restaurantId) return;
    
    setMenuLoading(true);
    try {
      const [categoryData, productData] = await Promise.all([
        Category.filter({ restaurant_id: restaurantId }),
        Product.filter({ restaurant_id: restaurantId })
      ]);
      
      setCategories(categoryData || []);
      setProducts(productData || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setCategories([]);
      setProducts([]);
    } finally {
      setMenuLoading(false);
    }
  }, []);

  const loadUserAndRestaurant = useCallback(async () => {
    setLoading(true);
    
    try {
      const storedRole = localStorage.getItem('simulatedRole');
      const testUser = localStorage.getItem('testUser');
      
      setSimulatedRole(storedRole || 'cliente');
      
      const urlParams = new URLSearchParams(window.location.search);
      const restaurantId = urlParams.get('restaurant');
      
      if (restaurantId) {
        // Client View - carregar restaurante específico
        setIsClientView(true);
        
        try {
          const restaurant = await Restaurant.get(restaurantId);
          setSelectedRestaurant(restaurant);
          setRestaurants([restaurant]);
          await loadRestaurantData(restaurantId);
        } catch (error) {
          console.error("Erro ao carregar restaurante:", error);
          setSelectedRestaurant(null);
          setRestaurants([]);
        }
      } else if (testUser) {
        // Admin/Owner View - carregar todos os restaurantes
        const userData = JSON.parse(testUser);
        setUser(userData);
        
        const allRestaurants = await Restaurant.getAll();
        setRestaurants(allRestaurants || []);
        
        if (allRestaurants && allRestaurants.length > 0) {
          setSelectedRestaurant(allRestaurants[0]);
          await loadRestaurantData(allRestaurants[0].id);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }, [loadRestaurantData]);

  useEffect(() => {
    loadUserAndRestaurant();
  }, []);

  const handleProductUpdate = async () => {
    if (selectedRestaurant) {
      await loadRestaurantData(selectedRestaurant.id);
    }
  };

  const handleRestaurantSelect = async (restaurant) => {
    if (restaurant.id === selectedRestaurant?.id) return;
    
    setSelectedRestaurant(restaurant);
    setSelectedCategory("all");
    setSearchQuery("");
    await loadRestaurantData(restaurant.id);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleProductSaved = () => {
    handleProductUpdate();
    setShowAddProduct(false);
  };
  
  const isAdmin = ['super_admin', 'admin'].includes(simulatedRole);
  const isRestaurantOwner = simulatedRole === 'dono_restaurante';

  const addToCart = (product, e) => {
    if (e) {
      e.stopPropagation();
    }
    
    const productWithRestaurant = {
      ...product,
      restaurant_id: product.restaurant_id || selectedRestaurant?.id,
      cartItemId: `${product.id}_${Date.now()}`
    };
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({ ...productWithRestaurant, quantity: 1 });
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartUpdate'));
  };

  const toggleFavorite = (productId, e) => {
    if (e) {
      e.stopPropagation();
    }
    
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;
    
    if (storedFavorites.includes(productId)) {
      newFavorites = storedFavorites.filter(id => id !== productId);
    } else {
      newFavorites = [...storedFavorites, productId];
    }
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Client View Design
  if (isClientView && selectedRestaurant) {
    return (
      <div className="relative w-full min-h-screen bg-white overflow-y-auto">
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Header Image */}
        <div className="relative h-72 bg-[#3c0068]">
          <div className="absolute inset-0 bg-black bg-opacity-40">
            <img 
              src={selectedRestaurant.image_url || "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&h=400&fit=crop"}
              alt="Prato típico"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-12 left-0 right-0 px-8 flex justify-between items-center z-10">
            <button
              onClick={() => window.history.back()}
              className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center"
            >
              <ArrowLeft className="w-6 h-6 text-[#3c0068]" />
            </button>
            <button 
              onClick={() => window.location.href = createPageUrl('Cart')}
              className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center"
            >
              <ShoppingBag className="w-6 h-6 text-[#3c0068]" />
            </button>
          </div>
        </div>

        {/* Restaurant Info Card - Overlapping */}
        <div className="relative px-8 -mt-20">
          <div className="bg-gray-50 rounded-3xl p-6 shadow-lg">
            {/* Profile Image */}
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
              <div className="w-32 h-32 bg-white rounded-full shadow-xl border-4 border-white flex items-center justify-center overflow-hidden">
                <img 
                  src={selectedRestaurant.image_url || "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c86d65c4f51add45f7c2aa/6e6e29b85_MATERIAL_DE_APRESENTAO-08-removebg-preview.png"}
                  alt="Logo"
                  className="w-24 h-24 object-contain"
                />
              </div>
            </div>
            <div className="mt-20">
              <h1 className="text-3xl font-bold text-[#3c0068] text-center mb-4" style={{ fontFamily: 'serif' }}>
                {selectedRestaurant.name}
              </h1>
              <div className="flex justify-center space-x-3">
                <div className="bg-white rounded-2xl px-4 py-3 flex items-center space-x-2">
                  <span className="text-lg">🛵</span>
                  <span className="text-sm font-bold text-[#3c0068]">Grátis</span>
                </div>
                <div className="bg-white rounded-2xl px-5 py-3 flex items-center space-x-2">
                  <span className="text-lg">⏰</span>
                  <span className="text-sm font-bold text-[#3c0068]">10-20min</span>
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-[#ff4700] text-[#ff4700]" />
                  <span className="text-sm font-bold text-[#3c0068]">4.8</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="px-8 mt-6 pb-40">
          <h2 className="text-lg font-bold mb-4 text-[#3c0068]" style={{ fontFamily: 'serif' }}>
            Cardápio
          </h2>
          
          {menuLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#ff4700] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="flex space-x-3 mb-6 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`flex-shrink-0 rounded-2xl px-6 py-3 text-sm font-bold ${
                    selectedCategory === "all"
                      ? 'bg-[#ff4700] text-white shadow-lg'
                      : 'bg-gray-50 text-[#ff4700]'
                  }`}
                >
                  Popular
                </button>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex-shrink-0 rounded-2xl px-6 py-3 text-sm font-bold ${
                      selectedCategory === category.id
                        ? 'bg-[#ff4700] text-white shadow-lg'
                        : 'bg-gray-50 text-[#ff4700]'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Menu Items Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Nenhum produto encontrado</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 pb-32">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => window.location.href = createPageUrl(`ProductDetails?id=${product.id}`)}
                      className="bg-[#3c0068] rounded-3xl overflow-hidden shadow-lg cursor-pointer"
                    >
                      <div className="relative h-36 bg-[#4d0083]">
                        <img
                          src={product.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop'}
                          alt={product.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop';
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-bold text-base mb-1">{product.name}</h3>
                        <p className="text-gray-300 text-xs mb-3 line-clamp-2">
                          {product.description || 'Delicioso e fresco'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[#3c0068] font-bold bg-gray-50 px-3 py-1 rounded-xl text-base">
                            MT {product.price?.toFixed(2) || '0.00'}
                          </span>
                          <button
                            onClick={(e) => addToCart(product, e)}
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
        <FloatingCartButton expanded={true} />
      </div>
    );
  }

  // Admin View 
  return (
    <div className="p-4 md:p-8 space-y-8 bg-gradient-to-br from-slate-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            {!isRestaurantOwner && (
              <Link to={createPageUrl('AllRestaurants')}>
                <Button variant="outline" size="icon">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
            )}
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {isRestaurantOwner ? "Meu Cardápio" : "Cardápio"}
              </h1>
              <p className="text-slate-600">
                {selectedRestaurant 
                  ? `Gerencie o cardápio de ${selectedRestaurant.name}` 
                  : "Gerencie produtos e categorias"}
              </p>
            </div>
          </div>
          
          {isAdmin && selectedRestaurant && (
            <Button 
              onClick={() => setShowAddProduct(true)}
              className="bg-[#ff4700] hover:bg-[#ff6a00]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          )}
        </div>

        {!isRestaurantOwner && (
          <RestaurantSelector 
            restaurants={restaurants}
            selectedRestaurant={selectedRestaurant}
            onSelect={handleRestaurantSelect}
          />
        )}

        {selectedRestaurant && (
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className={`grid w-full ${isRestaurantOwner ? 'grid-cols-3' : 'grid-cols-2'} lg:w-96`}>
              <TabsTrigger value="products">Produtos</TabsTrigger>
              <TabsTrigger value="categories">Categorias</TabsTrigger>
              {isRestaurantOwner && <TabsTrigger value="settings">Configurações</TabsTrigger>}
            </TabsList>

            <TabsContent value="products">
              <ProductGrid 
                products={filteredProducts}
                categories={categories}
                loading={menuLoading}
                onProductUpdate={handleProductUpdate}
                role={simulatedRole}
              />
            </TabsContent>

            <TabsContent value="categories">
              <CategoryGrid 
                categories={categories}
                restaurantId={selectedRestaurant.id}
                onCategoryUpdate={handleProductUpdate}
                role={simulatedRole}
              />
            </TabsContent>

            {isRestaurantOwner && (
              <TabsContent value="settings">
                <RestaurantSettings 
                  restaurant={selectedRestaurant}
                  onUpdate={() => {}}
                />
              </TabsContent>
            )}
          </Tabs>
        )}

        {showAddProduct && selectedRestaurant && isAdmin && (
          <AddProductModal
            restaurantId={selectedRestaurant.id}
            categories={categories}
            onClose={() => setShowAddProduct(false)}
            onSave={handleProductSaved}
          />
        )}
      </div>
    </div>
  );
}