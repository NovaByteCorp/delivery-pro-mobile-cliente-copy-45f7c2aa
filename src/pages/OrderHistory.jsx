import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, Clock, CheckCircle, XCircle, Loader2, Package, Truck, MapPin } from 'lucide-react';
import BottomNav from '../components/client/BottomNav';
import { supabase } from '@/supabase';
import { createPageUrl } from '@/utils';

export default function OrderHistoryScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = (url) => {
    window.location.href = url;
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      
      // Pega o usuário logado
      const testUser = JSON.parse(localStorage.getItem('testUser') || '{}');
      
      if (!testUser.id) {
        setError('Você precisa estar logado para ver seus pedidos.');
        setLoading(false);
        return;
      }

      console.log('👤 Buscando pedidos do usuário:', testUser.id);

      // Busca pedidos do usuário
      const { data: userOrders, error: ordersError } = await supabase
        .from('Order')
        .select('*')
        .eq('user_id', testUser.id)
        .order('created_date', { ascending: false });

      if (ordersError) {
        console.error('❌ Erro ao buscar pedidos:', ordersError);
        throw new Error('Erro ao carregar pedidos');
      }

      console.log('📦 Pedidos encontrados:', userOrders?.length || 0);

      // Para cada pedido, busca os itens e restaurante
      const ordersWithDetails = await Promise.all(
        (userOrders || []).map(async (order) => {
          // Busca itens do pedido
          const { data: items } = await supabase
            .from('OrderItem')
            .select('*')
            .eq('order_id', order.id);

          // Busca restaurante
          const { data: restaurant } = await supabase
            .from('Restaurant')
            .select('name')
            .eq('id', order.restaurant_id)
            .single();

          return {
            id: order.id,
            orderId: order.order_number || `#${order.id.slice(0, 8).toUpperCase()}`,
            restaurant: restaurant?.name || 'Restaurante',
            restaurantEmoji: '🍔',
            items: (items || []).map(item => 
              `${item.product_name} x${item.quantity}`
            ),
            total: parseFloat(order.total_amount) || 0,
            date: formatDate(order.created_date),
            time: formatTime(order.created_date),
            status: normalizeStatus(order.status),
            rawStatus: order.status,
            rating: order.rating || null,
            deliveryAddress: order.delivery_address,
            estimatedTime: order.estimated_prep_time
          };
        })
      );

      setOrders(ordersWithDetails);
    } catch (err) {
      console.error('❌ Erro ao carregar pedidos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const normalizeStatus = (status) => {
    const statusLower = (status || '').toLowerCase();
    
    if (statusLower === 'entregue' || statusLower === 'delivered' || 
        statusLower === 'concluído' || statusLower === 'concluido') {
      return 'completed';
    }
    
    if (statusLower === 'cancelado' || statusLower === 'cancelled') {
      return 'cancelled';
    }
    
    return 'pending';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data desconhecida';
    
    const date = new Date(dateString);
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  const getStatusIcon = (status) => {
    if (status === 'completed') return CheckCircle;
    if (status === 'cancelled') return XCircle;
    return Clock;
  };

  const getStatusColor = (status) => {
    if (status === 'completed') return 'text-green-500';
    if (status === 'cancelled') return 'text-red-500';
    return 'text-[#ff4700]';
  };

  const getStatusBg = (status) => {
    if (status === 'completed') return 'bg-green-50';
    if (status === 'cancelled') return 'bg-red-50';
    return 'bg-orange-50';
  };

  const getStatusText = (rawStatus) => {
    const statusMap = {
      'pending': 'Pendente',
      'pendente': 'Pendente',
      'novo': 'Novo',
      'confirmado': 'Confirmado',
      'confirmed': 'Confirmado',
      'preparando': 'Em Preparação',
      'preparing': 'Em Preparação',
      'pronto': 'Pronto para Retirada',
      'ready': 'Pronto',
      'em_entrega': 'Em Entrega',
      'delivering': 'Em Entrega',
      'entregue': 'Entregue',
      'delivered': 'Entregue',
      'concluido': 'Concluído',
      'concluído': 'Concluído',
      'cancelado': 'Cancelado',
      'cancelled': 'Cancelado'
    };
    
    return statusMap[rawStatus?.toLowerCase()] || rawStatus || 'Desconhecido';
  };

  const handleReorder = async (orderId) => {
    try {
      // Busca os itens do pedido original
      const { data: items } = await supabase
        .from('OrderItem')
        .select('*')
        .eq('order_id', orderId);

      if (!items || items.length === 0) {
        alert('Não foi possível carregar os itens do pedido.');
        return;
      }

      // Busca detalhes dos produtos
      const cart = await Promise.all(
        items.map(async (item) => {
          const { data: product } = await supabase
            .from('Product')
            .select('*')
            .eq('id', item.product_id)
            .single();

          return {
            cartItemId: Date.now() + Math.random(),
            id: item.product_id,
            name: item.product_name,
            price: parseFloat(item.unit_price),
            quantity: item.quantity,
            image_url: product?.image_url,
            description: product?.description,
            restaurant_id: product?.restaurant_id
          };
        })
      );

      // Adiciona ao carrinho
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent('cartUpdate'));

      // Navega para o carrinho
      navigate(createPageUrl('Cart'));
    } catch (err) {
      console.error('Erro ao reordenar:', err);
      alert('Erro ao adicionar itens ao carrinho.');
    }
  };

  const handleTrackOrder = (orderId) => {
    navigate(createPageUrl('OrderTracking') + `?order_id=${orderId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#3c0068] animate-spin mx-auto mb-4" />
          <p className="text-lg font-bold text-[#3c0068]">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center px-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#3c0068] mb-4">Erro ao Carregar</h2>
          <p className="text-sm text-gray-400 mb-8">{error}</p>
          <button 
            onClick={loadOrders}
            className="bg-[#ff4700] text-white font-bold px-8 py-4 rounded-2xl"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
        <div className="relative w-full h-screen bg-white overflow-y-auto pb-24">
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 bg-white z-10 px-8 pt-12 pb-4 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => window.history.back()}
                className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6 text-[#3c0068]" />
              </button>
              
              <h1 className="text-2xl font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
                Meus Pedidos
              </h1>
              
              <div className="w-14 h-14" />
            </div>

            {/* Tabs */}
            <div className="flex space-x-3">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 rounded-2xl px-4 py-4 text-sm font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-[#ff4700] text-white shadow-lg'
                    : 'bg-gray-50 text-[#3c0068]'
                }`}
              >
                Todos ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex-1 rounded-2xl px-4 py-4 text-sm font-bold transition-all ${
                  activeTab === 'pending'
                    ? 'bg-[#ff4700] text-white shadow-lg'
                    : 'bg-gray-50 text-[#3c0068]'
                }`}
              >
                Ativos ({orders.filter(o => o.status === 'pending').length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`flex-1 rounded-2xl px-4 py-4 text-sm font-bold transition-all ${
                  activeTab === 'completed'
                    ? 'bg-[#ff4700] text-white shadow-lg'
                    : 'bg-gray-50 text-[#3c0068]'
                }`}
              >
                Concluídos ({orders.filter(o => o.status === 'completed').length})
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="mt-52 px-8">
            {filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  
                  return (
                    <div key={order.id} className="bg-gray-50 rounded-3xl p-5 shadow-lg">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-[#3c0068] rounded-xl flex items-center justify-center">
                            <span className="text-2xl">{order.restaurantEmoji}</span>
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-[#3c0068]">{order.restaurant}</h3>
                            <p className="text-xs text-gray-400">{order.date} • {order.time}</p>
                          </div>
                        </div>
                        
                        <div className={`${getStatusBg(order.status)} rounded-xl px-3 py-2 flex items-center space-x-1`}>
                          <StatusIcon className={`w-4 h-4 ${getStatusColor(order.status)}`} />
                          <span className={`text-xs font-bold ${getStatusColor(order.status)}`}>
                            {getStatusText(order.rawStatus)}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="bg-white rounded-2xl p-4 mb-4">
                        <p className="text-xs text-gray-400 mb-2">Pedido {order.orderId}</p>
                        <div className="space-y-1 mb-3">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <p key={idx} className="text-sm text-[#3c0068]">{item}</p>
                          ))}
                          {order.items.length > 3 && (
                            <p className="text-xs text-gray-400">+{order.items.length - 3} itens</p>
                          )}
                        </div>
                        
                        {order.deliveryAddress && (
                          <div className="flex items-start space-x-2 pt-3 border-t border-gray-100">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                            <p className="text-xs text-gray-500 line-clamp-2">{order.deliveryAddress}</p>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Valor Total</p>
                          <p className="text-lg font-bold text-[#3c0068]">MT {order.total.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          {order.status === 'pending' && (
                            <button 
                              onClick={() => handleTrackOrder(order.id)}
                              className="bg-[#ff4700] rounded-2xl px-5 py-3 flex items-center space-x-2 shadow-lg"
                            >
                              <Truck className="w-4 h-4 text-white" />
                              <span className="text-sm font-bold text-white">Rastrear</span>
                            </button>
                          )}
                          
                          {order.status === 'completed' && (
                            <>
                              <button 
                                onClick={() => handleReorder(order.id)}
                                className="bg-[#ff4700] rounded-2xl px-5 py-3 flex items-center space-x-2 shadow-lg"
                              >
                                <Package className="w-4 h-4 text-white" />
                                <span className="text-sm font-bold text-white">Repetir</span>
                              </button>
                              {order.rating && (
                                <button className="bg-[#3c0068] rounded-2xl px-4 py-3 flex items-center space-x-1">
                                  <Star className="w-4 h-4 fill-[#ff4700] text-[#ff4700]" />
                                  <span className="text-sm font-bold text-white">{order.rating}</span>
                                </button>
                              )}
                            </>
                          )}
                          
                          {order.status === 'cancelled' && (
                            <button 
                              onClick={() => handleTrackOrder(order.id)}
                              className="bg-[#3c0068] rounded-2xl px-5 py-3"
                            >
                              <span className="text-sm font-bold text-white">Ver Detalhes</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Clock className="w-16 h-16 text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold text-[#3c0068] mb-2" style={{ fontFamily: 'serif' }}>
                  Nenhum Pedido {activeTab !== 'all' ? `${activeTab === 'completed' ? 'Concluído' : 'Ativo'}` : ''}
                </h2>
                <p className="text-sm text-gray-400 text-center mb-8">
                  {activeTab === 'all' 
                    ? 'Você ainda não fez nenhum pedido'
                    : `Você não tem pedidos ${activeTab === 'completed' ? 'concluídos' : 'ativos'}`
                  }
                </p>
                <button 
                  onClick={() => navigate(createPageUrl('ClientDashboard'))}
                  className="bg-[#ff4700] text-white font-bold px-8 py-4 rounded-2xl shadow-lg"
                >
                  Explorar Restaurantes
                </button>
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <BottomNav activePage="MyOrders" />
        </div>
      </div>
    </div>
  );
}