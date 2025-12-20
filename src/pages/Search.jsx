
import React, { useState, useEffect } from 'react';
import { Product } from '@/api/entities';
import { Restaurant } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Star, Search as SearchIcon, Building, Utensils } from 'lucide-react';
import { createPageUrl } from '@/utils';
import BottomNav from '../components/client/BottomNav';
import FloatingCartButton from '../components/client/FloatingCartButton';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [initialQuery, setInitialQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') || '';
    setSearchQuery(query);
    setInitialQuery(query);
  }, []);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    } else {
      setLoading(false);
    }
  }, [initialQuery]);

  const performSearch = async (query) => {
    setLoading(true);
    try {
      const [allProducts, allRestaurants] = await Promise.all([
        Product.list(),
        Restaurant.list()
      ]);
      
      const lowerCaseQuery = query.toLowerCase();
      
      const filteredProducts = allProducts.filter(p => 
        p.name.toLowerCase().includes(lowerCaseQuery) ||
        p.description.toLowerCase().includes(lowerCaseQuery)
      );

      const filteredRestaurants = allRestaurants.filter(r => 
        r.name.toLowerCase().includes(lowerCaseQuery) ||
        r.cuisine_type.toLowerCase().includes(lowerCaseQuery)
      );

      setProducts(filteredProducts);
      setRestaurants(filteredRestaurants);
    } catch (error) {
      console.error("Erro na busca:", error);
    } finally {
      setLoading(false);
    }
  };

  const navigate = (url) => {
    window.location.href = url;
  };
  
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setInitialQuery(searchQuery); // Trigger search
    }
  };
  
  const addToCart = (product, quantity = 1) => {
    // ... (logic from other pages) ...
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) existingItem.quantity += quantity;
    else cart.push({ ...product, quantity });
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartUpdate'));
    alert(`${quantity}x ${product.name} adicionado ao carrinho!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white p-4 flex items-center gap-2 shadow-sm sticky top-0 z-10">
        <Button size="icon" variant="ghost" onClick={() => navigate(createPageUrl('ClientDashboard'))}>
          <ArrowLeft />
        </Button>
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar..."
            className="w-full h-10 pl-10 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-orange-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="p-4 space-y-6">
          {/* Restaurants Results */}
          {restaurants.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2"><Building /> Restaurantes</h2>
              {restaurants.map(r => (
                <div key={r.id} className="bg-white p-3 rounded-lg shadow-sm" onClick={() => navigate(createPageUrl(`Orders`))}>
                  <h3 className="font-semibold">{r.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{r.cuisine_type}</p>
                </div>
              ))}
            </div>
          )}

          {/* Products Results */}
          {products.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2"><Utensils /> Produtos</h2>
              <div className="grid grid-cols-2 gap-4">
                {products.map(p => (
                  <div key={p.id} className="bg-white rounded-lg shadow-sm overflow-hidden" onClick={() => navigate(createPageUrl(`ProductDetails?id=${p.id}`))} >
                     <img src={p.image_url || ''} alt={p.name} className="h-24 w-full object-cover"/>
                     <div className="p-2">
                       <h4 className="font-semibold text-sm truncate">{p.name}</h4>
                       <p className="text-xs text-gray-600">MT {p.price.toFixed(2)}</p>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {restaurants.length === 0 && products.length === 0 && !loading && (
             <div className="text-center py-16">
               <SearchIcon className="mx-auto w-12 h-12 text-gray-400 mb-4" />
               <h3 className="text-lg font-semibold">Nenhum resultado encontrado</h3>
               <p className="text-gray-500">Tente uma busca diferente.</p>
             </div>
          )}
        </div>
      )}

      <BottomNav activePage="Search" />
      <FloatingCartButton />
    </div>
  );
}
