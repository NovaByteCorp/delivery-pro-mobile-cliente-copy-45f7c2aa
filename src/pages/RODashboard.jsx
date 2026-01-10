import React, { useState, useEffect } from 'react';
import { Bell, Settings, DollarSign, Package, Clock, TrendingUp, Star, AlertCircle, ChevronRight } from 'lucide-react';
import BottomNavRO from '../components/restaurants/ROBottomNav';
import { supabase } from '@/supabase';

export default function RestaurantOwnerDashboard() {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [todayStats, setTodayStats] = useState({
    revenue: 0,
    orders: 0,
    avgTicket: 0,
    rating: 0,
    prepTime: 0
  });
  const [pendingOrders, setPendingOrders] = useState([]);
  const [preparingOrders, setPreparingOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    loadDashboardData();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Pegar o usuário logado
      const testUser = JSON.parse(localStorage.getItem('testUser') || '{}');
      
      if (!testUser.id) {
        console.error('Usuário não encontrado');
        setLoading(false);
        return;
      }

      // Buscar restaurante do Supabase
      let userRestaurant = null;
      
      if (testUser.assigned_restaurant_id) {
        const { data, error } = await supabase
          .from('Restaurant')
          .select('*')
          .eq('id', testUser.assigned_restaurant_id)
          .single();
        
        if (!error) userRestaurant = data;
      } else {
        const { data, error } = await supabase
          .from('Restaurant')
          .select('*')
          .eq('owner_id', testUser.id)
          .single();
        
        if (!error) userRestaurant = data;
      }

      if (!userRestaurant) {
        console.error('Restaurante não encontrado para este usuário');
        setLoading(false);
        return;
      }

      setRestaurant(userRestaurant);
      setIsOpen(userRestaurant.is_active !== false);

      // Buscar pedidos do restaurante
      const { data: allOrders, error: ordersError } = await supabase
        .from('Order')
        .select('*')
        .eq('restaurant_id', userRestaurant.id)
        .order('created_date', { ascending: false });

      if (ordersError) {
        console.error('Erro ao buscar pedidos:', ordersError);
        setLoading(false);
        return;
      }

      console.log('📦 Pedidos encontrados:', allOrders?.length || 0);

      const restaurantOrders = allOrders || [];

      // Filtrar pedidos de hoje
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayOrders = restaurantOrders.filter(order => {
        const orderDate = new Date(order.created_date);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
      });

      console.log('📅 Pedidos de hoje:', todayOrders.length);

      // Calcular estatísticas de hoje
      const deliveredToday = todayOrders.filter(o => 
        o.status === 'entregue' || 
        o.status === 'delivered' || 
        o.status === 'concluído' ||
        o.status === 'concluido'
      );
      
      const totalRevenue = deliveredToday.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);
      const avgTicket = deliveredToday.length > 0 ? totalRevenue / deliveredToday.length : 0;

      // Tempo médio de preparo do restaurante
      const avgPrepTime = userRestaurant.avg_preparation_time || userRestaurant.preparation_time || 30;

      setTodayStats({
        revenue: totalRevenue,
        orders: todayOrders.length,
        avgTicket: avgTicket,
        rating: parseFloat(userRestaurant.rating) || 0,
        prepTime: avgPrepTime
      });

      // Buscar itens dos pedidos para contar quantidade
      const ordersWithItems = await Promise.all(
        restaurantOrders.map(async (order) => {
          const { data: items } = await supabase
            .from('OrderItem')
            .select('*')
            .eq('order_id', order.id);
          
          return {
            ...order,
            items_count: items?.length || 0
          };
        })
      );

      // Pedidos pendentes (novos/aguardando confirmação)
      const pending = ordersWithItems
        .filter(o => {
          const status = (o.status || '').toLowerCase();
          return status === 'pendente' || 
                 status === 'pending' || 
                 status === 'novo' || 
                 status === 'new' ||
                 status === 'aguardando';
        })
        .slice(0, 5)
        .map(order => ({
          id: order.id,
          orderId: order.order_number || `#${order.id.slice(0, 6).toUpperCase()}`,
          customer: order.customer_name || 'Cliente',
          items: order.items_count || 1,
          total: parseFloat(order.total_amount) || 0,
          time: getTimeAgo(order.created_date),
          status: 'new'
        }));

      setPendingOrders(pending);
      console.log('⏳ Pedidos pendentes:', pending.length);

      // Pedidos em preparação/confirmados
      const preparing = ordersWithItems
        .filter(o => {
          const status = (o.status || '').toLowerCase();
          return status === 'preparando' || 
                 status === 'preparing' || 
                 status === 'confirmado' || 
                 status === 'confirmed' ||
                 status === 'em preparação' ||
                 status === 'em preparacao';
        })
        .slice(0, 5)
        .map(order => {
          const prepStarted = new Date(order.prep_started_at || order.confirmed_at || order.created_date);
          const now = new Date();
          const timeElapsed = Math.floor((now - prepStarted) / (1000 * 60)); // minutos
          
          return {
            id: order.id,
            orderId: order.order_number || `#${order.id.slice(0, 6).toUpperCase()}`,
            customer: order.customer_name || 'Cliente',
            items: order.items_count || 1,
            total: parseFloat(order.total_amount) || 0,
            timeElapsed: Math.max(0, timeElapsed),
            estimatedTime: order.estimated_prep_time || avgPrepTime
          };
        });

      setPreparingOrders(preparing);
      console.log('🔥 Pedidos em preparação:', preparing.length);

      // Buscar produtos mais vendidos
      const { data: allProducts } = await supabase
        .from('Product')
        .select('*')
        .eq('restaurant_id', userRestaurant.id)
        .eq('is_available', true);

      if (allProducts && allProducts.length > 0) {
        // Buscar itens de pedidos entregues
        const deliveredOrderIds = deliveredToday.map(o => o.id);
        
        if (deliveredOrderIds.length > 0) {
          const { data: soldItems } = await supabase
            .from('OrderItem')
            .select('product_id, product_name, quantity, subtotal')
            .in('order_id', deliveredOrderIds);

          if (soldItems && soldItems.length > 0) {
            // Agrupar vendas por produto
            const productSalesMap = {};
            
            soldItems.forEach(item => {
              const key = item.product_id || item.product_name;
              if (!productSalesMap[key]) {
                productSalesMap[key] = {
                  name: item.product_name,
                  sales: 0,
                  revenue: 0
                };
              }
              productSalesMap[key].sales += item.quantity;
              productSalesMap[key].revenue += parseFloat(item.subtotal) || 0;
            });

            // Converter para array e pegar top 3
            const topThree = Object.values(productSalesMap)
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 3);

            setTopProducts(topThree);
          } else {
            setTopProducts([]);
          }
        } else {
          setTopProducts([]);
        }
      } else {
        setTopProducts([]);
      }

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Agora';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      
      if (diffMins < 1) return 'Agora';
      if (diffMins < 60) return `${diffMins} min atrás`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h atrás`;
      
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d atrás`;
    } catch (error) {
      return 'Agora';
    }
  };

  const handleToggleStatus = async () => {
    if (!restaurant) return;
    
    try {
      const newStatus = !isOpen;
      
      const { error } = await supabase
        .from('Restaurant')
        .update({ is_active: newStatus })
        .eq('id', restaurant.id);

      if (error) throw error;

      setIsOpen(newStatus);
      showToast(`Restaurante ${newStatus ? 'Aberto' : 'Fechado'}!`, 'success');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      showToast('Erro ao atualizar status', 'error');
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      const { error } = await supabase
        .from('Order')
        .update({ 
          status: 'preparando',
          confirmed_at: new Date().toISOString(),
          prep_started_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      await loadDashboardData();
      showToast('Pedido confirmado e em preparação!', 'success');
    } catch (error) {
      console.error('Erro ao confirmar pedido:', error);
      showToast('Erro ao confirmar pedido', 'error');
    }
  };

  const handleMarkAsReady = async (orderId) => {
    try {
      const { error } = await supabase
        .from('Order')
        .update({ 
          status: 'pronto',
          ready_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      await loadDashboardData();
      showToast('Pedido marcado como pronto!', 'success');
    } catch (error) {
      console.error('Erro ao marcar pedido como pronto:', error);
      showToast('Erro ao atualizar pedido', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    const bgColor = type === 'success' ? 'bg-emerald-500' : 'bg-red-500';
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 left-4 right-4 z-[60] flex justify-center';
    toast.innerHTML = `
      <div class="${bgColor} text-white rounded-2xl shadow-2xl p-4 max-w-md w-full">
        <p class="font-bold text-center">${message}</p>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-12 h-12 border-4 border-[#ff4700] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center px-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Restaurante não encontrado</h2>
          <p className="text-gray-600 mb-6">Este usuário não tem um restaurante associado.</p>
          <p className="text-sm text-gray-500">Entre em contato com o suporte para resolver este problema.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen pb-20 bg-gray-100">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
        <div className="relative w-full h-screen bg-white overflow-y-auto pb-8">
          
          {/* Header */}
          <div className="bg-gray-800 px-8 pt-12 pb-8 rounded-b-3xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">Bem-vindo,</p>
                <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'serif' }}>
                  {restaurant.name}
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <button className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center relative">
                  <Bell className="w-6 h-6 text-white" />
                  {pendingOrders.length > 0 && (
                    <span className="absolute top-1 right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-gray-800"></span>
                  )}
                </button>
                <button className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Status Toggle */}
            <div className="bg-gray-700 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-base font-bold text-white">
                  {isOpen ? 'Restaurante Aberto' : 'Restaurante Fechado'}
                </span>
              </div>
              <button
                onClick={handleToggleStatus}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  isOpen ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  isOpen ? 'right-1' : 'left-1'
                }`}></div>
              </button>
            </div>
          </div>

          {/* Today's Stats */}
          <div className="px-8 -mt-6 mb-6">
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h2 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'serif' }}>
                Resumo de Hoje
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mb-3">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs text-gray-400 mb-1">Faturamento</p>
                  <p className="text-2xl font-bold text-gray-800">MT {todayStats.revenue.toFixed(2)}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mb-3">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs text-gray-400 mb-1">Pedidos</p>
                  <p className="text-2xl font-bold text-gray-800">{todayStats.orders}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mb-3">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs text-gray-400 mb-1">Ticket Médio</p>
                  <p className="text-xl font-bold text-gray-800">MT {todayStats.avgTicket.toFixed(2)}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mb-3">
                    <Star className="w-5 h-5 text-white fill-white" />
                  </div>
                  <p className="text-xs text-gray-400 mb-1">Avaliação</p>
                  <p className="text-2xl font-bold text-gray-800">{todayStats.rating > 0 ? todayStats.rating.toFixed(1) : '-'}</p>
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-4 flex items-center space-x-3">
                <Clock className="w-5 h-5 text-orange-500" />
                <div className="flex-1">
                  <p className="text-xs text-gray-600">Tempo Médio de Preparo</p>
                  <p className="text-base font-bold text-gray-800">{todayStats.prepTime} minutos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Orders Alert */}
          {pendingOrders.length > 0 && (
            <div className="px-8 mb-6">
              <div className="bg-orange-500 rounded-3xl p-5 shadow-lg mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-6 h-6 text-white" />
                    <h3 className="text-lg font-bold text-white">Novos Pedidos</h3>
                  </div>
                  <span className="text-2xl font-bold text-white">{pendingOrders.length}</span>
                </div>
                <p className="text-sm text-orange-100 mb-3">Aguardando sua confirmação</p>
              </div>

              {/* Lista de pedidos pendentes */}
              <div className="space-y-3">
                {pendingOrders.map((order) => (
                  <div key={order.id} className="bg-orange-50 border-2 border-orange-200 rounded-3xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-base font-bold text-gray-800">{order.orderId}</h3>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                        <p className="text-xs text-gray-400">{order.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-800">MT {order.total.toFixed(2)}</p>
                        <p className="text-xs text-gray-400">{order.items} items</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleConfirmOrder(order.id)}
                      className="w-full bg-orange-500 text-white font-bold py-3 rounded-2xl hover:bg-orange-600 transition-colors"
                    >
                      Confirmar Pedido
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preparing Orders */}
          {preparingOrders.length > 0 && (
            <div className="px-8 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'serif' }}>
                  Em Preparação
                </h2>
              </div>

              <div className="space-y-3">
                {preparingOrders.map((order) => (
                  <div key={order.id} className="bg-gray-50 rounded-3xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-base font-bold text-gray-800">{order.orderId}</h3>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-800">MT {order.total.toFixed(2)}</p>
                        <p className="text-xs text-gray-400">{order.items} items</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Tempo decorrido</span>
                        <span className="text-xs font-bold text-gray-800">{order.timeElapsed}/{order.estimatedTime} min</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((order.timeElapsed / order.estimatedTime) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleMarkAsReady(order.id)}
                      className="w-full bg-orange-500 text-white font-bold py-3 rounded-2xl hover:bg-orange-600 transition-colors"
                    >
                      Marcar como Pronto
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Products */}
          {topProducts.length > 0 && (
            <div className="px-8 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'serif' }}>
                Produtos Mais Vendidos Hoje
              </h2>
              
              <div className="bg-gray-800 rounded-3xl p-5 shadow-lg">
                <div className="space-y-4">
                  {topProducts.map((product, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold">{idx + 1}</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">{product.name}</h3>
                          <p className="text-xs text-gray-400">{product.sales} vendas</p>
                        </div>
                      </div>
                      <p className="text-base font-bold text-orange-500">MT {product.revenue.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      <BottomNavRO activePage="RestaurantOwnerDashboard" />
    </div>
  );
}