import React, { useState, useEffect } from 'react';
import { ChevronLeft, DollarSign, TrendingUp, Calendar, Download, ChevronRight, Package, Clock, Star, Loader2 } from 'lucide-react';
import BottomNavDriver from '../components/driver/DriverBottomNav';
import { supabase } from '@/supabase';

export default function DriverEarningsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [loading, setLoading] = useState(true);
  const [driver, setDriver] = useState(null);
  const [earnings, setEarnings] = useState({
    today: { total: 0, deliveries: 0, hours: 0, tips: 0, base: 0 },
    week: { total: 0, deliveries: 0, hours: 0, tips: 0, base: 0 },
    month: { total: 0, deliveries: 0, hours: 0, tips: 0, base: 0 }
  });
  const [recentDeliveries, setRecentDeliveries] = useState([]);

  useEffect(() => {
    loadEarningsData();
  }, []);

  const loadEarningsData = async () => {
    setLoading(true);
    try {
      const testUser = JSON.parse(localStorage.getItem('testUser') || '{}');
      
      if (!testUser.id) {
        console.error('Usuário não encontrado');
        setLoading(false);
        return;
      }

      setDriver(testUser);

      // Datas de referência
      const now = new Date();
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);
      
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - 7);
      weekStart.setHours(0, 0, 0, 0);
      
      const monthStart = new Date(now);
      monthStart.setMonth(monthStart.getMonth() - 1);
      monthStart.setHours(0, 0, 0, 0);

      // Buscar entregas concluídas do entregador
      const { data: allDeliveries, error } = await supabase
        .from('Order')
        .select('*, Restaurant(name)')
        .eq('driver_id', testUser.id)
        .eq('status', 'entregue')
        .order('delivered_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar entregas:', error);
        setLoading(false);
        return;
      }

      console.log('📦 Total de entregas:', allDeliveries?.length || 0);

      // Filtrar por período
      const todayDeliveries = (allDeliveries || []).filter(d => 
        new Date(d.delivered_at) >= today
      );
      
      const weekDeliveries = (allDeliveries || []).filter(d => 
        new Date(d.delivered_at) >= weekStart
      );
      
      const monthDeliveries = (allDeliveries || []).filter(d => 
        new Date(d.delivered_at) >= monthStart
      );

      // Calcular ganhos por período
      const calculateEarnings = (deliveries) => {
        const total = deliveries.reduce((sum, d) => 
          sum + parseFloat(d.delivery_fee || 0), 0
        );
        const tips = deliveries.reduce((sum, d) => 
          sum + parseFloat(d.tip || 0), 0
        );
        const base = total - tips;
        const hours = deliveries.length * 0.5; // Estimativa: 30min por entrega

        return {
          total,
          deliveries: deliveries.length,
          hours: parseFloat(hours.toFixed(1)),
          tips,
          base
        };
      };

      setEarnings({
        today: calculateEarnings(todayDeliveries),
        week: calculateEarnings(weekDeliveries),
        month: calculateEarnings(monthDeliveries)
      });

      // Processar entregas recentes (últimas 10)
      const recent = await Promise.all(
        (allDeliveries || []).slice(0, 10).map(async (delivery) => {
          return {
            id: delivery.id,
            orderId: delivery.order_number || `#${delivery.id.slice(0, 8).toUpperCase()}`,
            restaurant: delivery.Restaurant?.name || 'Restaurante',
            emoji: '🍔',
            date: formatDeliveryDate(delivery.delivered_at),
            amount: parseFloat(delivery.delivery_fee || 0),
            tip: parseFloat(delivery.tip || 0),
            distance: '2.5 km', // Calcular distância real futuramente
            rating: delivery.driver_rating || 5
          };
        })
      );

      setRecentDeliveries(recent);

    } catch (error) {
      console.error('Erro ao carregar ganhos:', error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-lg font-bold text-gray-800">Carregando ganhos...</p>
        </div>
      </div>
    );
  }

  const currentEarnings = earnings[selectedPeriod];

  return (
    <div className="flex items-center justify-center min-h-screen pb-20 bg-gray-100">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
        <div className="relative w-full h-screen bg-white overflow-y-auto pb-8">
          
          {/* Header */}
          <div className="bg-gray-800 px-8 pt-12 pb-32 rounded-b-3xl">
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => window.history.back()}
                className="w-14 h-14 bg-gray-700 rounded-2xl flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'serif' }}>
                Meus Ganhos
              </h1>
              
              <button className="w-14 h-14 bg-gray-700 rounded-2xl flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Period Selector */}
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedPeriod('today')}
                className={`flex-1 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                  selectedPeriod === 'today'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                Hoje
              </button>
              <button
                onClick={() => setSelectedPeriod('week')}
                className={`flex-1 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                  selectedPeriod === 'week'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                7 Dias
              </button>
              <button
                onClick={() => setSelectedPeriod('month')}
                className={`flex-1 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                  selectedPeriod === 'month'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                30 Dias
              </button>
            </div>
          </div>

          {/* Total Card - Overlapping */}
          <div className="relative px-8 -mt-20 mb-6">
            <div className="bg-white rounded-3xl p-6 shadow-2xl">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-400 mb-2">Total Ganho</p>
                <h2 className="text-5xl font-bold text-gray-800 mb-1" style={{ fontFamily: 'serif' }}>
                  MT {currentEarnings.total.toFixed(2)}
                </h2>
                {currentEarnings.deliveries > 0 && (
                  <div className="flex items-center justify-center space-x-2 text-green-500">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-bold">{currentEarnings.deliveries} entregas realizadas</span>
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-2xl p-3 text-center">
                  <Package className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800 mb-1">{currentEarnings.deliveries}</p>
                  <p className="text-xs text-gray-400">Entregas</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-3 text-center">
                  <Clock className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800 mb-1">{currentEarnings.hours}h</p>
                  <p className="text-xs text-gray-400">Online</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-3 text-center">
                  <DollarSign className="w-5 h-5 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800 mb-1">
                    {currentEarnings.deliveries > 0 
                      ? (currentEarnings.total / currentEarnings.deliveries).toFixed(0) 
                      : '0'}
                  </p>
                  <p className="text-xs text-gray-400">Média</p>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="px-8 mb-6">
            <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
              Detalhamento
            </h2>
            
            <div className="bg-gray-50 rounded-3xl p-5 shadow-sm">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-bold text-gray-800">Entregas Base</span>
                  </div>
                  <span className="text-base font-bold text-gray-800">MT {currentEarnings.base.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-bold text-gray-800">Gorjetas</span>
                  </div>
                  <span className="text-base font-bold text-green-500">
                    {currentEarnings.tips > 0 ? '+' : ''}MT {currentEarnings.tips.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-gray-800">MT {currentEarnings.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Withdraw Button */}
          <div className="px-8 mb-6">
            <button className="w-full bg-orange-500 text-white font-bold text-base py-5 rounded-3xl shadow-lg flex items-center justify-center space-x-2 hover:bg-orange-600 transition-colors">
              <DollarSign className="w-5 h-5" />
              <span>Solicitar Saque</span>
            </button>
          </div>

          {/* Recent Deliveries */}
          {recentDeliveries.length > 0 && (
            <div className="px-8 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'serif' }}>
                  Entregas Recentes
                </h2>
                <span className="text-sm font-bold text-orange-500">{recentDeliveries.length} entregas</span>
              </div>

              <div className="space-y-3">
                {recentDeliveries.map((delivery) => (
                  <div key={delivery.id} className="bg-gray-50 rounded-3xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                          <span className="text-xl">{delivery.emoji}</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-800">{delivery.restaurant}</h3>
                          <p className="text-xs text-gray-400">{delivery.orderId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold text-gray-800">MT {delivery.amount.toFixed(2)}</p>
                        {delivery.tip > 0 && (
                          <p className="text-xs font-bold text-green-500">+MT {delivery.tip.toFixed(2)} gorjeta</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white rounded-2xl px-4 py-2">
                      <div className="flex items-center space-x-4">
                        <span className="text-xs text-gray-400">{delivery.date}</span>
                        <span className="text-xs text-gray-400">{delivery.distance}</span>
                      </div>
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {recentDeliveries.length === 0 && (
            <div className="px-8 mb-6">
              <div className="bg-gray-50 rounded-3xl p-10 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Nenhuma Entrega Ainda</h3>
                <p className="text-sm text-gray-400">
                  Comece a fazer entregas para ver seus ganhos aqui
                </p>
              </div>
            </div>
          )}

          {/* Payment Methods */}
          <div className="px-8 mb-6">
            <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
              Método de Recebimento
            </h2>
            
            <button className="w-full bg-gray-50 rounded-3xl p-5 shadow-sm flex items-center justify-between hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🏦</span>
                </div>
                <div className="text-left">
                  <h3 className="text-base font-bold text-gray-800">
                    {driver?.bank_name || 'Banco BCI'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {driver?.bank_account ? `•••• ${driver.bank_account.slice(-4)}` : '•••• •••• •••• 4567'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <BottomNavDriver activePage="DriverEarnings" />

        </div>
      </div>
    </div>
  );
}