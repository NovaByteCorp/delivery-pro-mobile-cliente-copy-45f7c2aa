
import React, { useState, useEffect } from 'react';
import { Order } from '@/api/entities';
import { Restaurant } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SlidersHorizontal, Search, Clock, ShoppingCart, X } from 'lucide-react'; // Added ShoppingCart and X icon
import BottomNav from '../components/client/BottomNav';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusColors = {
  pendente: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmado: "bg-blue-100 text-blue-800 border-blue-200",
  em_preparacao: "bg-indigo-100 text-indigo-800 border-indigo-200",
  pronto: "bg-purple-100 text-purple-800 border-purple-200",
  saiu_entrega: "bg-sky-100 text-sky-800 border-sky-200",
  entregue: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelado: "bg-red-100 text-red-800 border-red-200"
};

const statusLabels = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  em_preparacao: "Preparando",
  pronto: "Pronto",
  saiu_entrega: "Saiu p/ Entrega",
  entregue: "Entregue",
  cancelado: "Cancelado"
};

const EmptyState = ({ status }) => (
  <div className="text-center py-20 px-6">
    <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <Clock className="w-12 h-12 text-orange-400" />
    </div>
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Nenhum pedido {status}</h2>
    <p className="text-gray-500">Você não tem pedidos {status} no momento.</p>
  </div>
);

const OrderCard = ({ order, restaurantName }) => (
  <Card className="border-0 shadow-sm">
    <CardContent className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-900">
            {restaurantName || 'Restaurante'}
          </h3>
          <p className="text-xs text-gray-500">
            Pedido #{order.order_number?.slice(-4)} • {format(new Date(order.created_date), "dd MMM, yyyy 'às' HH:mm", { locale: ptBR })}
          </p>
        </div>
        <Badge className={`${statusColors[order.status]} border text-xs font-medium`}>
          {statusLabels[order.status]}
        </Badge>
      </div>
      
      <div className="space-y-2 mb-3">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center text-sm text-gray-700">
            <span className="w-5 text-center mr-2">{item.quantity}x</span>
            <span>{item.product_name}</span>
          </div>
        ))}
        {order.items.length > 2 && (
          <p className="text-xs text-gray-500 ml-7">+ {order.items.length - 2} outros itens</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <Button variant="outline" size="sm" className="h-8">Ver Detalhes</Button>
        <p className="font-bold text-gray-900">
          Total: <span className="text-orange-600">MT {order.total_amount.toFixed(2)}</span>
        </p>
      </div>
    </CardContent>
  </Card>
);

const FloatingCartButton = () => {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    // Simulate fetching cart item count from localStorage or a global state
    try {
      const storedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      setItemCount(storedCart.length);
    } catch (error) {
      console.error("Failed to parse cart items from localStorage", error);
      setItemCount(0);
    }
  }, []);

  if (itemCount === 0) {
    return null;
  }

  return (
    <button
      className="fixed bottom-[80px] right-4 z-50 bg-orange-500 text-white p-3 rounded-full shadow-lg flex items-center justify-center space-x-2 transition-transform transform hover:scale-105"
      aria-label={`View cart with ${itemCount} items`}
      onClick={() => {
        console.log("Navigating to cart page with", itemCount, "items.");
      }}
    >
      <ShoppingCart className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
          {itemCount}
        </span>
      )}
      <span className="font-semibold text-sm">Ver Carrinho</span>
    </button>
  );
};


export default function MyOrdersPage() {
  const [allOrders, setAllOrders] = useState([]);
  const [restaurants, setRestaurants] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const testUser = JSON.parse(localStorage.getItem('testUser') || '{}');
        const userOrders = await Order.filter({ customer_id: testUser.id || "cliente_teste" }, '-created_date');
        
        const restaurantIds = [...new Set(userOrders.map(o => o.restaurant_id))];
        const restaurantData = await Promise.all(
          restaurantIds.map(id => Restaurant.get(id).catch(() => null))
        );
        const restaurantMap = restaurantData.filter(Boolean).reduce((acc, r) => {
          acc[r.id] = r;
          return acc;
        }, {});

        setAllOrders(userOrders);
        setRestaurants(restaurantMap);
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getFilteredOrders = (statuses) => {
    let orders = allOrders.filter(order => statuses.includes(order.status));
    
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      orders = orders.filter(order =>
        (restaurants[order.restaurant_id]?.name || '').toLowerCase().includes(lowerCaseQuery) ||
        (order.order_number || '').toLowerCase().includes(lowerCaseQuery) ||
        order.items.some(item => item.product_name.toLowerCase().includes(lowerCaseQuery))
      );
    }
    return orders;
  };

  const pendingOrders = getFilteredOrders(['pendente']);
  const confirmedOrders = getFilteredOrders(['confirmado', 'em_preparacao', 'pronto', 'saiu_entrega', 'entregue']);
  const canceledOrders = getFilteredOrders(['cancelado']);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pb-24">
        <header className="bg-orange-500 text-white p-4 pt-6 sticky top-0 z-10 shadow-md">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" className="hover:bg-white/10">
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
            <div className="text-center flex-grow mx-4">
              {showSearchBar ? (
                <input
                  type="text"
                  placeholder="Buscar pedidos..."
                  className="bg-white/20 text-white placeholder-white/70 rounded-full py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300 ease-in-out"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              ) : (
                <>
                  <h1 className="text-xl font-bold">Histórico</h1>
                  <p className="text-sm opacity-80">{allOrders.length} pedidos realizados</p>
                </>
              )}
            </div>
            <Button variant="ghost" size="icon" className="hover:bg-white/10" onClick={() => {
              setShowSearchBar(!showSearchBar);
              if (showSearchBar) { // If closing search bar, clear query
                setSearchQuery('');
              }
            }}>
              {showSearchBar ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </Button>
          </div>
        </header>
        
        <Tabs defaultValue="pendentes" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white rounded-none h-auto p-0 border-b border-gray-200">
            <TabsTrigger value="pendentes" className="text-gray-500 rounded-none data-[state=active]:bg-white data-[state=active]:text-orange-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none py-3 font-semibold">Pendentes</TabsTrigger>
            <TabsTrigger value="confirmados" className="text-gray-500 rounded-none data-[state=active]:bg-white data-[state=active]:text-orange-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none py-3 font-semibold">Confirmados</TabsTrigger>
            <TabsTrigger value="cancelados" className="text-gray-500 rounded-none data-[state=active]:bg-white data-[state=active]:text-orange-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none py-3 font-semibold">Cancelados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pendentes" className="p-0">
            {loading ? <div className="text-center p-8">Carregando...</div> :
             pendingOrders.length > 0 ? (
              <div className="space-y-4 p-4">
                {pendingOrders.map(order => <OrderCard key={order.id} order={order} restaurantName={restaurants[order.restaurant_id]?.name} />)}
              </div>
            ) : (
              <EmptyState status="pendentes" />
            )}
          </TabsContent>
          <TabsContent value="confirmados" className="p-0">
            {loading ? <div className="text-center p-8">Carregando...</div> :
             confirmedOrders.length > 0 ? (
              <div className="space-y-4 p-4">
                {confirmedOrders.map(order => <OrderCard key={order.id} order={order} restaurantName={restaurants[order.restaurant_id]?.name} />)}
              </div>
            ) : (
              <EmptyState status="confirmados" />
            )}
          </TabsContent>
          <TabsContent value="cancelados" className="p-0">
            {loading ? <div className="text-center p-8">Carregando...</div> :
             canceledOrders.length > 0 ? (
              <div className="space-y-4 p-4">
                {canceledOrders.map(order => <OrderCard key={order.id} order={order} restaurantName={restaurants[order.restaurant_id]?.name} />)}
              </div>
            ) : (
              <EmptyState status="cancelados" />
            )}
          </TabsContent>
        </Tabs>
      </div>
      <BottomNav activePage="MyOrders" />
      
      {/* Floating Cart Button */}
      <FloatingCartButton />
    </div>
  );
}
