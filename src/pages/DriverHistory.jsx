import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, MapPin, Clock, DollarSign, Calendar, Filter, Search, Loader2 } from 'lucide-react';
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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-lg font-bold text-gray-800">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  const filteredDeliveries = getFilteredDeliveries();

  if (selectedDelivery) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md min-h-screen bg-white shadow-2xl">
          <div className="relative w-full bg-white pb-24 overflow-y-auto">
            
            {/* Header */}
            <div className="bg-gray-800 px-8 pt-12 pb-8 rounded-b-3xl">
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={() => setSelectedDelivery(null)}
                  className="w-14 h-14 bg-gray-700 rounded-2xl flex items-center justify-center"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                
                <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'serif' }}>
                  Detalhes da Entrega
                </h1>
                
                <div className="w-14 h-14" />
              </div>

              {/* Order ID */}
              <div className="bg-gray-700 rounded-2xl px-4 py-3 text-center">
                <p className="text-xs text-gray-400 mb-1">Pedido</p>
                <p className="text-lg font-bold text-white">{selectedDelivery.orderId}</p>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 -mt-6 mb-6">
              
              {/* Earnings Card */}
              <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">Ganho Total</p>
                  <p className="text-4xl font-bold text-green-500 mb-1" style={{ fontFamily: 'serif' }}>
                    MT {(selectedDelivery.earnings + selectedDelivery.tip).toFixed(2)}
                  </p>
                  <div className="flex justify-center space-x-4 mt-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Base</p>
                      <p className="text-sm font-bold text-gray-800">MT {selectedDelivery.earnings.toFixed(2)}</p>
                    </div>
                    {selectedDelivery.tip > 0 && (
                      <>
                        <div className="w-px h-10 bg-gray-200" />
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Gorjeta</p>
                          <p className="text-sm font-bold text-green-500">MT {selectedDelivery.tip.toFixed(2)}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
                Avaliação do Cliente
              </h2>
              
              <div className="bg-gray-50 rounded-3xl p-6 mb-6 shadow-sm text-center">
                <div className="flex justify-center space-x-1 mb-2">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-8 h-8 ${
                        idx < selectedDelivery.rating
                          ? 'fill-orange-500 text-orange-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-2xl font-bold text-gray-800">{selectedDelivery.rating}.0</p>
              </div>

              {/* Restaurant */}
              <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
                Restaurante
              </h2>
              
              <div className="bg-gray-800 rounded-3xl p-5 mb-6 shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gray-700 rounded-xl flex items-center justify-center">
                    <span className="text-3xl">{selectedDelivery.restaurant.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">{selectedDelivery.restaurant.name}</h3>
                    <p className="text-sm text-gray-400">{selectedDelivery.restaurant.address}</p>
                  </div>
                </div>
              </div>

              {/* Customer */}
              <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
                Cliente
              </h2>
              
              <div className="bg-gray-50 rounded-3xl p-5 mb-6 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-800 mb-1">{selectedDelivery.customer.name}</h3>
                    <p className="text-sm text-gray-600">{selectedDelivery.customer.address}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              {selectedDelivery.items.length > 0 && (
                <>
                  <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
                    Items Entregues
                  </h2>
                  
                  <div className="bg-gray-50 rounded-3xl p-5 mb-6 shadow-sm">
                    <div className="space-y-2">
                      {selectedDelivery.items.map((item, idx) => (
                        <p key={idx} className="text-sm text-gray-800">{item}</p>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                  <MapPin className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-400 mb-1">Distância</p>
                  <p className="text-base font-bold text-gray-800">{selectedDelivery.distance}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                  <Clock className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-400 mb-1">Duração</p>
                  <p className="text-base font-bold text-gray-800">{selectedDelivery.duration}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                  <Calendar className="w-5 h-5 text-gray-800 mx-auto mb-2" />
                  <p className="text-xs text-gray-400 mb-1">Data</p>
                  <p className="text-xs font-bold text-gray-800">{selectedDelivery.date}</p>
                </div>
              </div>

            </div>

          </div>
          <BottomNavDriver activePage="DriverHistory" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md min-h-screen bg-white shadow-2xl">
        <div className="relative w-full bg-white pb-24">
          
          {/* Header */}
          <div className="sticky top-0 bg-white z-10 px-8 pt-12 pb-4 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => window.history.back()}
                className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              
              <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'serif' }}>
                Histórico
              </h1>
              
              <button className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                <Filter className="w-6 h-6 text-gray-800" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative bg-gray-50 rounded-2xl px-4 py-3 flex items-center mb-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar por pedido ou restaurante" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent w-full pl-3 text-sm text-gray-800 outline-none placeholder-gray-400"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-3 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`flex-shrink-0 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                  selectedFilter === 'all'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-gray-50 text-gray-800'
                }`}
              >
                Todas ({stats.all.count})
              </button>
              <button
                onClick={() => setSelectedFilter('today')}
                className={`flex-shrink-0 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                  selectedFilter === 'today'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-gray-50 text-gray-800'
                }`}
              >
                Hoje ({stats.today.count})
              </button>
              <button
                onClick={() => setSelectedFilter('week')}
                className={`flex-shrink-0 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                  selectedFilter === 'week'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-gray-50 text-gray-800'
                }`}
              >
                7 Dias ({stats.week.count})
              </button>
              <button
                onClick={() => setSelectedFilter('month')}
                className={`flex-shrink-0 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                  selectedFilter === 'month'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-gray-50 text-gray-800'
                }`}
              >
                30 Dias ({stats.month.count})
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 mt-6">
            
            {/* Summary Card */}
            <div className="bg-gray-800 rounded-3xl p-6 mb-6 shadow-lg">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">Total do Período</p>
                <p className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'serif' }}>
                  MT {stats[selectedFilter].total.toFixed(2)}
                </p>
                <p className="text-sm text-gray-400">{stats[selectedFilter].count} entregas completadas</p>
              </div>
            </div>

            {/* Deliveries List */}
            {filteredDeliveries.length > 0 ? (
              <div className="space-y-4 mb-8">
                {filteredDeliveries.map((delivery) => (
                  <div 
                    key={delivery.id}
                    onClick={() => setSelectedDelivery(delivery)}
                    className="bg-gray-50 rounded-3xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                          <span className="text-xl">{delivery.restaurant.emoji}</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-800">{delivery.restaurant.name}</h3>
                          <p className="text-xs text-gray-400">{delivery.orderId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold text-gray-800">MT {(delivery.earnings + delivery.tip).toFixed(2)}</p>
                        {delivery.tip > 0 && (
                          <p className="text-xs font-bold text-green-500">+{delivery.tip.toFixed(2)} gorjeta</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-3 mb-3">
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{delivery.date}</span>
                        <span>{delivery.distance}</span>
                        <span>{delivery.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3 h-3 ${
                              idx < delivery.rating
                                ? 'fill-orange-500 text-orange-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">{delivery.customer.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Clock className="w-16 h-16 text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'serif' }}>
                  Nenhuma Entrega
                </h2>
                <p className="text-sm text-gray-400 text-center">
                  {searchQuery 
                    ? 'Nenhuma entrega encontrada com essa busca'
                    : 'Não há entregas neste período'
                  }
                </p>
              </div>
            )}

          </div>

        </div>
        <BottomNavDriver activePage="DriverHistory" />
      </div>     
    </div>
  );
}