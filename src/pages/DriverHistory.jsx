import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, MapPin, Clock, DollarSign, Calendar, Filter, Search, Loader2, Package } from 'lucide-react';
import BottomNavDriver from '../components/driver/DriverBottomNav';
import { supabase } from '@/supabase';

export default function DriverHistoryScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveries, setDeliveries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    all: { count: 0, total: 0 },
    today: { count: 0, total: 0 },
    week: { count: 0, total: 0 },
    month: { count: 0, total: 0 }
  });

  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = async () => {
    setLoading(true);
    try {
      const testUser = JSON.parse(localStorage.getItem('testUser') || '{}');
      
      if (!testUser.id) {
        console.error('Usuário não encontrado');
        setLoading(false);
        return;
      }

      // Buscar todas as entregas concluídas do entregador
      const { data: allDeliveries, error } = await supabase
        .from('Order')
        .select('*, Restaurant(name, address)')
        .eq('driver_id', testUser.id)
        .eq('status', 'entregue')
        .order('delivered_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar histórico:', error);
        setLoading(false);
        return;
      }

      console.log('📦 Total de entregas:', allDeliveries?.length || 0);

      // Processar entregas
      const processed = await Promise.all(
        (allDeliveries || []).map(async (delivery) => {
          // Buscar itens do pedido
          const { data: items } = await supabase
            .from('OrderItem')
            .select('product_name, quantity')
            .eq('order_id', delivery.id);

          // Calcular duração estimada
          const pickupTime = delivery.picked_up_at ? new Date(delivery.picked_up_at) : null;
          const deliveredTime = new Date(delivery.delivered_at);
          const duration = pickupTime 
            ? Math.round((deliveredTime - pickupTime) / 60000) // minutos
            : 20; // padrão

          return {
            id: delivery.id,
            orderId: delivery.order_number || `#${delivery.id.slice(0, 8).toUpperCase()}`,
            date: formatDeliveryDate(delivery.delivered_at),
            fullDate: formatFullDate(delivery.delivered_at),
            restaurant: {
              name: delivery.Restaurant?.name || 'Restaurante',
              emoji: '🍔',
              address: delivery.Restaurant?.address || 'Endereço não informado'
            },
            customer: {
              name: delivery.customer_name || 'Cliente',
              address: delivery.delivery_address || 'Endereço não informado'
            },
            distance: '2.5 km', // Calcular distância real futuramente
            duration: `${duration} min`,
            earnings: parseFloat(delivery.delivery_fee || 0),
            tip: parseFloat(delivery.tip || 0),
            rating: delivery.driver_rating || 5,
            items: (items || []).map(item => 
              `${item.product_name} x${item.quantity}`
            ),
            deliveredAt: new Date(delivery.delivered_at)
          };
        })
      );

      setDeliveries(processed);

      // Calcular estatísticas por período
      const now = new Date();
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);
      
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      const todayDeliveries = processed.filter(d => d.deliveredAt >= today);
      const weekDeliveries = processed.filter(d => d.deliveredAt >= weekAgo);
      const monthDeliveries = processed.filter(d => d.deliveredAt >= monthAgo);

      const calculateTotal = (delivs) => 
        delivs.reduce((sum, d) => sum + d.earnings + d.tip, 0);

      setStats({
        all: { 
          count: processed.length, 
          total: calculateTotal(processed) 
        },
        today: { 
          count: todayDeliveries.length, 
          total: calculateTotal(todayDeliveries) 
        },
        week: { 
          count: weekDeliveries.length, 
          total: calculateTotal(weekDeliveries) 
        },
        month: { 
          count: monthDeliveries.length, 
          total: calculateTotal(monthDeliveries) 
        }
      });

    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDeliveryDate = (dateString) => {
    if (!dateString) return 'Data desconhecida';
    
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    const deliveryDate = new Date(date);
    deliveryDate.setHours(0, 0, 0, 0);
    
    const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    if (deliveryDate.getTime() === today.getTime()) {
      return `Hoje, ${time}`;
    } else if (deliveryDate.getTime() === today.getTime() - 86400000) {
      return `Ontem, ${time}`;
    } else {
      const day = date.getDate();
      const month = date.toLocaleDateString('pt-BR', { month: 'short' });
      return `${day} ${month}, ${time}`;
    }
  };

  const formatFullDate = (dateString) => {
    if (!dateString) return 'Data desconhecida';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilteredDeliveries = () => {
    let filtered = deliveries;

    // Filtrar por período
    if (selectedFilter !== 'all') {
      const now = new Date();
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);
      
      if (selectedFilter === 'today') {
        filtered = filtered.filter(d => d.deliveredAt >= today);
      } else if (selectedFilter === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(d => d.deliveredAt >= weekAgo);
      } else if (selectedFilter === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filtered = filtered.filter(d => d.deliveredAt >= monthAgo);
      }
    }

    // Filtrar por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d => 
        d.orderId.toLowerCase().includes(query) ||
        d.restaurant.name.toLowerCase().includes(query) ||
        d.customer.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#ff4700] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-base font-medium text-gray-600">A carregar histórico...</p>
        </div>
      </div>
    );
  }

  const filteredDeliveries = getFilteredDeliveries();

  // Detail View - Design Limpo
  if (selectedDelivery) {
    return (
      <div className="relative w-full min-h-screen bg-white overflow-y-auto pb-24">
        
        {/* Header Limpo */}
        <div className="bg-white px-8 pt-12 pb-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => setSelectedDelivery(null)}
              className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center active:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#3c0068]" />
            </button>
            
            <h1 className="text-xl font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
              Detalhes
            </h1>
            
            <div className="w-12 h-12" />
          </div>

          {/* Order ID */}
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Pedido</p>
            <p className="text-lg font-bold text-[#3c0068]">{selectedDelivery.orderId}</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 mt-6">
          
          {/* Earnings - Destaque */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-400 mb-2">Ganho Total</p>
            <p className="text-5xl font-bold text-[#3c0068] mb-3" style={{ fontFamily: 'serif' }}>
              MT {(selectedDelivery.earnings + selectedDelivery.tip).toFixed(2)}
            </p>
            <div className="flex justify-center space-x-6">
              <div>
                <p className="text-xs text-gray-400">Base</p>
                <p className="text-sm font-bold text-[#3c0068]">MT {selectedDelivery.earnings.toFixed(2)}</p>
              </div>
              {selectedDelivery.tip > 0 && (
                <div>
                  <p className="text-xs text-gray-400">Gorjeta</p>
                  <p className="text-sm font-bold text-green-500">MT {selectedDelivery.tip.toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-center">
            <div className="flex justify-center space-x-1 mb-2">
              {[...Array(5)].map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-6 h-6 ${
                    idx < selectedDelivery.rating
                      ? 'fill-[#ff4700] text-[#ff4700]'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-xl font-bold text-[#3c0068]">{selectedDelivery.rating}.0</p>
            <p className="text-xs text-gray-400 mt-1">Avaliação do Cliente</p>
          </div>

          {/* Restaurant */}
          <div className="mb-6">
            <h2 className="text-base font-bold mb-3 text-[#3c0068]">
              Restaurante
            </h2>
            
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#3c0068] rounded-xl flex items-center justify-center">
                  <span className="text-2xl">{selectedDelivery.restaurant.emoji}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-[#3c0068] mb-1">{selectedDelivery.restaurant.name}</h3>
                  <p className="text-xs text-gray-400">{selectedDelivery.restaurant.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="mb-6">
            <h2 className="text-base font-bold mb-3 text-[#3c0068]">
              Cliente
            </h2>
            
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-[#ff4700] rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-[#3c0068] mb-1">{selectedDelivery.customer.name}</h3>
                  <p className="text-xs text-gray-400">{selectedDelivery.customer.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          {selectedDelivery.items.length > 0 && (
            <div className="mb-6">
              <h2 className="text-base font-bold mb-3 text-[#3c0068]">
                Items Entregues
              </h2>
              
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="space-y-2">
                  {selectedDelivery.items.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-[#ff4700] rounded-full"></div>
                      <p className="text-sm text-[#3c0068]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <MapPin className="w-5 h-5 text-[#ff4700] mx-auto mb-2" />
              <p className="text-xs text-gray-400 mb-1">Distância</p>
              <p className="text-sm font-bold text-[#3c0068]">{selectedDelivery.distance}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <Clock className="w-5 h-5 text-[#3c0068] mx-auto mb-2" />
              <p className="text-xs text-gray-400 mb-1">Duração</p>
              <p className="text-sm font-bold text-[#3c0068]">{selectedDelivery.duration}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <Calendar className="w-5 h-5 text-[#3c0068] mx-auto mb-2" />
              <p className="text-xs text-gray-400 mb-1">Data</p>
              <p className="text-xs font-bold text-[#3c0068]">{selectedDelivery.date}</p>
            </div>
          </div>

        </div>

        <BottomNavDriver activePage="DriverHistory" />
      </div>
    );
  }

  // List View - Design Limpo
  return (
    <div className="relative w-full min-h-screen bg-white overflow-y-auto pb-24">
      
      {/* Header Limpo e Fixo */}
      <div className="sticky top-0 bg-white z-10 px-8 pt-12 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => window.history.back()}
            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center active:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#3c0068]" />
          </button>
          
          <h1 className="text-xl font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
            Histórico
          </h1>
          
          <div className="w-12 h-12" />
        </div>

        {/* Search Bar */}
        <div className="relative bg-gray-50 rounded-2xl px-4 py-3 flex items-center mb-4">
          <Search className="w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar pedido ou restaurante" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent w-full pl-3 text-sm text-[#3c0068] outline-none placeholder-gray-400"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`flex-shrink-0 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
              selectedFilter === 'all'
                ? 'bg-[#ff4700] text-white'
                : 'bg-gray-50 text-gray-400'
            }`}
          >
            Todas ({stats.all.count})
          </button>
          <button
            onClick={() => setSelectedFilter('today')}
            className={`flex-shrink-0 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
              selectedFilter === 'today'
                ? 'bg-[#ff4700] text-white'
                : 'bg-gray-50 text-gray-400'
            }`}
          >
            Hoje ({stats.today.count})
          </button>
          <button
            onClick={() => setSelectedFilter('week')}
            className={`flex-shrink-0 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
              selectedFilter === 'week'
                ? 'bg-[#ff4700] text-white'
                : 'bg-gray-50 text-gray-400'
            }`}
          >
            7 Dias ({stats.week.count})
          </button>
          <button
            onClick={() => setSelectedFilter('month')}
            className={`flex-shrink-0 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
              selectedFilter === 'month'
                ? 'bg-[#ff4700] text-white'
                : 'bg-gray-50 text-gray-400'
            }`}
          >
            30 Dias ({stats.month.count})
          </button>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Content */}
      <div className="px-8 mt-6">
        
        {/* Summary - Simples */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-400 mb-2">Total do Período</p>
          <p className="text-4xl font-bold text-[#3c0068] mb-2" style={{ fontFamily: 'serif' }}>
            MT {stats[selectedFilter].total.toFixed(2)}
          </p>
          <p className="text-sm text-gray-400">{stats[selectedFilter].count} entregas</p>
        </div>

        {/* Deliveries List */}
        {filteredDeliveries.length > 0 ? (
          <div className="space-y-3 mb-8">
            {filteredDeliveries.map((delivery) => (
              <div 
                key={delivery.id}
                onClick={() => setSelectedDelivery(delivery)}
                className="bg-gray-50 rounded-2xl p-4 active:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                      <span className="text-lg">{delivery.restaurant.emoji}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#3c0068]">{delivery.restaurant.name}</h3>
                      <p className="text-xs text-gray-400">{delivery.orderId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#3c0068]">MT {(delivery.earnings + delivery.tip).toFixed(2)}</p>
                    {delivery.tip > 0 && (
                      <p className="text-xs font-bold text-green-500">+{delivery.tip.toFixed(2)}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-xs text-gray-400">
                    <span>{delivery.date}</span>
                    <span>•</span>
                    <span>{delivery.distance}</span>
                    <span>•</span>
                    <span>{delivery.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-3 h-3 ${
                          idx < delivery.rating
                            ? 'fill-[#ff4700] text-[#ff4700]'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-lg font-bold text-[#3c0068] mb-2">
              Nenhuma Entrega
            </h2>
            <p className="text-sm text-gray-400 text-center">
              {searchQuery 
                ? 'Nenhuma entrega encontrada'
                : 'Não há entregas neste período'
              }
            </p>
          </div>
        )}

      </div>

      <BottomNavDriver activePage="DriverHistory" />
    </div>
  );
}
