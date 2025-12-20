import React, { useState, useEffect } from 'react';
import { ChevronLeft, Clock, Package, User, MapPin, Phone, CheckCircle, XCircle, ChefHat, Bike, DollarSign, TrendingUp, Settings } from 'lucide-react';
import BottomNavRO from '../components/restaurants/ROBottomNav';
import { Order, Restaurant, Product, User as SystemUser } from '@/api/entities';

export default function RestaurantOwnerOrders() {
  const [selectedTab, setSelectedTab] = useState('new');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState({
    new: [],
    preparing: [],
    ready: [],
    completed: []
  });

  useEffect(() => {
    loadOrdersData();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(loadOrdersData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadOrdersData = async () => {
    setLoading(true);
    try {
      const testUser = JSON.parse(localStorage.getItem('testUser') || '{}');
      
      if (!testUser.id) {
        console.error('Usuário não encontrado');
        setLoading(false);
        return;
      }

      let userRestaurant = null;
      if (testUser.assigned_restaurant_id) {
        userRestaurant = await Restaurant.get(testUser.assigned_restaurant_id);
      } else {
        const allRestaurants = await Restaurant.list();
        userRestaurant = allRestaurants.find(r => r.owner_id === testUser.id);
      }

      if (!userRestaurant) {
        console.error('Restaurante não encontrado');
        setLoading(false);
        return;
      }

      setRestaurant(userRestaurant);

      const allOrders = await Order.list();
      const restaurantOrders = allOrders.filter(o => o.restaurant_id === userRestaurant.id);

      const categorizedOrders = {
        new: [],
        preparing: [],
        ready: [],
        completed: []
      };

      restaurantOrders.forEach(order => {
        const status = (order.status || '').toLowerCase();
        const orderData = {
          id: order.id,
          orderId: order.order_number || `ORD-${order.id.slice(0, 4).toUpperCase()}`,
          customer: {
            name: order.customer_name || 'Cliente',
            phone: order.customer_phone || order.delivery_phone || '+258 84 000 0000',
            address: order.delivery_address || 'Endereço não informado'
          },
          items: order.items || [],
          itemsCount: order.items_count || 0,
          total: parseFloat(order.total_amount) || 0,
          time: getTimeAgo(order.created_date || order.created_at),
          paymentMethod: order.payment_method || 'Não informado',
          prepTime: order.prep_started_at ? getMinutesSince(order.prep_started_at) : 0,
          estimatedTime: order.estimated_prep_time || 20,
          acceptedAt: order.confirmed_at ? formatTime(order.confirmed_at) : null,
          readyAt: order.ready_at ? formatTime(order.ready_at) : null,
          driver: order.deliverer_name ? {
            name: order.deliverer_name,
            phone: order.deliverer_phone,
            eta: '5 min'
          } : null,
          rawOrder: order
        };

        if (status === 'pendente' || status === 'pending' || status === 'novo' || status === 'new') {
          categorizedOrders.new.push(orderData);
        } else if (status === 'preparando' || status === 'preparing' || status === 'confirmado' || status === 'confirmed') {
          categorizedOrders.preparing.push(orderData);
        } else if (status === 'pronto' || status === 'ready' || status === 'aguardando entregador') {
          categorizedOrders.ready.push(orderData);
        } else if (status === 'entregue' || status === 'delivered' || status === 'concluído' || status === 'concluido' || status === 'cancelado' || status === 'cancelled') {
          categorizedOrders.completed.push(orderData);
        }
      });

      Object.keys(categorizedOrders).forEach(key => {
        categorizedOrders[key].sort((a, b) => {
          const dateA = new Date(a.rawOrder.created_date || a.rawOrder.created_at);
          const dateB = new Date(b.rawOrder.created_date || b.rawOrder.created_at);
          return dateB - dateA;
        });
      });

      setOrders(categorizedOrders);

    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
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

  const getMinutesSince = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      return Math.max(0, Math.floor((now - date) / (1000 * 60)));
    } catch (error) {
      return 0;
    }
  };

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return '';
    }
  };

  const getTabLabel = (tab) => {
    const labels = {
      new: 'Novos',
      preparing: 'Preparando',
      ready: 'Prontos',
      completed: 'Concluídos'
    };
    return labels[tab];
  };

  const getTabCount = (tab) => {
    return orders[tab].length;
  };

  const handleAcceptOrder = async (order) => {
    try {
      await Order.update(order.id, { 
        status: 'preparando',
        confirmed_at: new Date().toISOString(),
        prep_started_at: new Date().toISOString()
      });

      const toast = document.createElement('div');
      toast.className = 'fixed top-20 left-4 right-4 z-[60] flex justify-center';
      toast.innerHTML = `
        <div class="bg-emerald-500 text-white rounded-2xl shadow-2xl p-4 max-w-md w-full">
          <p class="font-bold text-center">Pedido ${order.orderId} aceito!</p>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);

      setSelectedOrder(null);
      await loadOrdersData();

    } catch (error) {
      console.error('Erro ao aceitar pedido:', error);
      alert('Erro ao aceitar pedido. Tente novamente.');
    }
  };

  const handleRejectOrder = async () => {
    try {
      await Order.update(selectedOrder.id, { 
        status: 'cancelado',
        cancelled_at: new Date().toISOString()
      });

      const toast = document.createElement('div');
      toast.className = 'fixed top-20 left-4 right-4 z-[60] flex justify-center';
      toast.innerHTML = `
        <div class="bg-red-500 text-white rounded-2xl shadow-2xl p-4 max-w-md w-full">
          <p class="font-bold text-center">Pedido ${selectedOrder.orderId} rejeitado</p>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);

      setShowRejectModal(false);
      setSelectedOrder(null);
      await loadOrdersData();

    } catch (error) {
      console.error('Erro ao rejeitar pedido:', error);
      alert('Erro ao rejeitar pedido. Tente novamente.');
    }
  };

  const handleMarkReady = async (order) => {
    try {
      await Order.update(order.id, { 
        status: 'pronto',
        ready_at: new Date().toISOString()
      });

      const toast = document.createElement('div');
      toast.className = 'fixed top-20 left-4 right-4 z-[60] flex justify-center';
      toast.innerHTML = `
        <div class="bg-emerald-500 text-white rounded-2xl shadow-2xl p-4 max-w-md w-full">
          <p class="font-bold text-center">Pedido ${order.orderId} marcado como pronto!</p>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);

      setSelectedOrder(null);
      await loadOrdersData();

    } catch (error) {
      console.error('Erro ao marcar pedido como pronto:', error);
      alert('Erro ao atualizar pedido. Tente novamente.');
    }
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
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Restaurante não encontrado</h2>
          <p className="text-gray-600">Entre em contato com o suporte.</p>
        </div>
      </div>
    );
  }

  if (selectedOrder) {
    const isNew = selectedTab === 'new';
    const isPreparing = selectedTab === 'preparing';
    const isReady = selectedTab === 'ready';
    const isCompleted = selectedTab === 'completed';

    return (
      <div className="flex items-center justify-center min-h-screen pb-24 bg-gray-100">
        <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
          <div className="relative w-full h-screen bg-white overflow-y-auto pb-32">
            
            <div className="bg-gray-800 px-8 pt-12 pb-8 rounded-b-3xl">
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-14 h-14 bg-gray-700 rounded-2xl flex items-center justify-center"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                
                <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'serif' }}>
                  Pedido #{selectedOrder.orderId}
                </h1>
                
                <div className="w-14 h-14" />
              </div>

              {isNew && (
                <div className="bg-orange-500 rounded-2xl px-4 py-3 text-center">
                  <p className="text-sm font-bold text-white">Aguardando Confirmação</p>
                  <p className="text-xs text-orange-100 mt-1">{selectedOrder.time}</p>
                </div>
              )}

              {isPreparing && (
                <div className="bg-blue-500 rounded-2xl px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-white">Em Preparação</p>
                    <p className="text-sm font-bold text-white">{selectedOrder.prepTime}/{selectedOrder.estimatedTime} min</p>
                  </div>
                  <div className="w-full bg-blue-400 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((selectedOrder.prepTime / selectedOrder.estimatedTime) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {isReady && (
                <div className="bg-green-500 rounded-2xl px-4 py-3 text-center">
                  <p className="text-sm font-bold text-white">Pronto para Entrega</p>
                  <p className="text-xs text-green-100 mt-1">Aguardando entregador</p>
                </div>
              )}

              {isCompleted && (
                <div className="bg-gray-700 rounded-2xl px-4 py-3 text-center">
                  <p className="text-sm font-bold text-white">Pedido Concluído</p>
                </div>
              )}
            </div>

            <div className="px-8 -mt-6 mb-6">
              
              <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                <h2 className="text-base font-bold text-gray-800 mb-4">Cliente</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800">{selectedOrder.customer.name}</p>
                      <p className="text-xs text-gray-400">Cliente</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{selectedOrder.customer.address}</p>
                      <p className="text-xs text-gray-400 mt-1">Endereço de entrega</p>
                    </div>
                  </div>

                  <a 
                    href={`tel:${selectedOrder.customer.phone}`}
                    className="w-full bg-gray-50 rounded-2xl py-3 flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-gray-800" />
                    <span className="text-sm font-bold text-gray-800">{selectedOrder.customer.phone}</span>
                  </a>
                </div>
              </div>

              {isReady && selectedOrder.driver && (
                <div className="bg-gray-800 rounded-3xl p-5 mb-6 shadow-lg">
                  <h2 className="text-base font-bold text-white mb-4">Entregador</h2>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🏍️</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{selectedOrder.driver.name}</p>
                      <p className="text-xs text-gray-400">Chegará em {selectedOrder.driver.eta}</p>
                    </div>
                    <a 
                      href={`tel:${selectedOrder.driver.phone}`}
                      className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center hover:bg-gray-600 transition-colors"
                    >
                      <Phone className="w-5 h-5 text-white" />
                    </a>
                  </div>
                </div>
              )}

              <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
                Items do Pedido ({selectedOrder.itemsCount || selectedOrder.items.length})
              </h2>
              
              <div className="bg-gray-50 rounded-3xl p-5 mb-6 shadow-sm">
                <div className="space-y-4">
                  {selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-bold text-gray-800">{item.quantity}x</span>
                              <span className="text-sm text-gray-800">{item.name || item.product_name}</span>
                            </div>
                            {item.notes && (
                              <div className="mt-2 bg-orange-50 rounded-xl px-3 py-2">
                                <p className="text-xs font-bold text-orange-500">Observação:</p>
                                <p className="text-xs text-gray-800">{item.notes}</p>
                              </div>
                            )}
                          </div>
                          <span className="text-sm font-bold text-gray-800">
                            MT {((item.price || item.unit_price || 0) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        {idx < selectedOrder.items.length - 1 && (
                          <div className="border-t border-gray-200 mt-4"></div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">
                      {selectedOrder.itemsCount} item(s) - Detalhes não disponíveis
                    </p>
                  )}
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-orange-500">MT {selectedOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400">Pagamento</span>
                    <span className="text-xs font-bold text-gray-800">{selectedOrder.paymentMethod}</span>
                  </div>
                </div>
              </div>

            </div>

            {!isCompleted && (
              <div className="fixed bottom-0 left-0 right-0 bg-white px-8 py-6 shadow-2xl max-w-md mx-auto">
                {isNew && (
                  <div className="space-y-3">
                    <button 
                      onClick={() => handleAcceptOrder(selectedOrder)}
                      className="w-full bg-green-500 text-white font-bold text-base py-5 rounded-3xl shadow-lg hover:bg-green-600 transition-colors"
                    >
                      Aceitar Pedido
                    </button>
                    <button 
                      onClick={() => setShowRejectModal(true)}
                      className="w-full bg-gray-50 text-gray-800 font-bold text-base py-4 rounded-3xl hover:bg-gray-100 transition-colors"
                    >
                      Rejeitar
                    </button>
                  </div>
                )}

                {isPreparing && (
                  <button 
                    onClick={() => handleMarkReady(selectedOrder)}
                    className="w-full bg-green-500 text-white font-bold text-base py-5 rounded-3xl shadow-lg hover:bg-green-600 transition-colors"
                  >
                    Marcar como Pronto
                  </button>
                )}

                {isReady && (
                  <button className="w-full bg-gray-50 text-gray-800 font-bold text-base py-5 rounded-3xl cursor-default">
                    Aguardando Coleta
                  </button>
                )}
              </div>
            )}

            {showRejectModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
                <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center" style={{ fontFamily: 'serif' }}>
                    Rejeitar Pedido
                  </h3>
                  
                  <div className="bg-red-50 rounded-2xl p-4 mb-6 text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">
                      Tem certeza que deseja rejeitar o pedido #{selectedOrder.orderId}?
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button 
                      onClick={() => setShowRejectModal(false)}
                      className="flex-1 bg-gray-200 text-gray-800 font-bold py-4 rounded-2xl hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleRejectOrder}
                      className="flex-1 bg-red-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-red-600 transition-colors"
                    >
                      Rejeitar
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
        <div className="relative w-full h-screen bg-white overflow-y-auto pb-8">
          
          <div className="fixed top-0 left-0 right-0 bg-white z-10 px-8 pt-12 pb-4 shadow-sm max-w-md mx-auto">
            <div className="flex items-center justify-between mb-6">
              <button className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              
              <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'serif' }}>
                Pedidos
              </h1>
              
              <button 
                onClick={loadOrdersData}
                className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Settings className="w-6 h-6 text-gray-800" />
              </button>
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2">
              {['new', 'preparing', 'ready', 'completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`flex-shrink-0 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                    selectedTab === tab
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-gray-50 text-gray-800'
                  }`}
                >
                  {getTabLabel(tab)} ({getTabCount(tab)})
                </button>
              ))}
            </div>
          </div>

          <div className="mt-52 px-8 mb-24">
            
            {orders[selectedTab].length > 0 ? (
              <div className="space-y-4">
                {orders[selectedTab].map((order) => (
                  <div 
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="cursor-pointer"
                  >
                    <div className="bg-gray-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                      
                      <div className={`p-4 ${
                        selectedTab === 'new' ? 'bg-orange-500' :
                        selectedTab === 'preparing' ? 'bg-blue-500' :
                        selectedTab === 'ready' ? 'bg-green-500' :
                        'bg-gray-800'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">#{order.orderId}</span>
                          {order.time && (
                            <span className="text-sm text-white">{order.time}</span>
                          )}
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="text-base font-bold text-gray-800">{order.customer.name}</h3>
                            <p className="text-xs text-gray-400">{order.itemsCount || order.items.length} items</p>
                          </div>
                          <p className="text-lg font-bold text-gray-800">MT {order.total.toFixed(2)}</p>
                        </div>

                        <div className="bg-white rounded-2xl p-3 mb-3">
                          {order.items.length > 0 ? (
                            <>
                              {order.items.slice(0, 2).map((item, idx) => (
                                <p key={idx} className="text-sm text-gray-600">
                                  {item.quantity}x {item.name || item.product_name}
                                </p>
                              ))}
                              {order.items.length > 2 && (
                                <p className="text-xs text-gray-400 mt-1">
                                  +{order.items.length - 2} mais
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-xs text-gray-400">
                              {order.itemsCount} item(s)
                            </p>
                          )}
                        </div>

                        {selectedTab === 'preparing' && order.prepTime !== undefined && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-400">Tempo</span>
                              <span className="text-xs font-bold text-gray-800">
                                {order.prepTime}/{order.estimatedTime} min
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-orange-500 h-2 rounded-full transition-all"
                                style={{ width: `${Math.min((order.prepTime / order.estimatedTime) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        <div className="text-center">
                          <span className="text-xs text-gray-400">Toque para ver detalhes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Package className="w-16 h-16 text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'serif' }}>
                  Nenhum Pedido
                </h2>
                <p className="text-sm text-gray-400 text-center">
                  Não há pedidos nesta categoria no momento
                </p>
              </div>
            )}

          </div>

        </div>
      </div>
      <BottomNavRO activePage="RestaurantOwnerOrders" />
    </div>
  );
}