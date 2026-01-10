import React, { useState, useEffect } from 'react';
import { ChevronLeft, Clock, Package, User, MapPin, Phone, CheckCircle, XCircle, ChefHat, Bike, DollarSign, TrendingUp, Settings, Loader2, Star } from 'lucide-react';
import { supabase } from '@/supabase';

// Mock BottomNav component
const BottomNavRO = ({ activePage }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto">
    <div className="flex justify-around py-3">
      <button className={`flex flex-col items-center ${activePage === 'RestaurantOwnerOrders' ? 'text-orange-500' : 'text-gray-400'}`}>
        <Package className="w-6 h-6" />
        <span className="text-xs mt-1">Pedidos</span>
      </button>
    </div>
  </div>
);

export default function RestaurantOwnerOrders() {
  const [selectedTab, setSelectedTab] = useState('new');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
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
    
    // Atualizar a cada 15 segundos
    const interval = setInterval(loadOrdersData, 15000);
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

      // Buscar restaurante
      let userRestaurant = null;
      if (testUser.assigned_restaurant_id) {
        const { data } = await supabase
          .from('Restaurant')
          .select('*')
          .eq('id', testUser.assigned_restaurant_id)
          .single();
        userRestaurant = data;
      } else {
        const { data } = await supabase
          .from('Restaurant')
          .select('*')
          .eq('owner_id', testUser.id)
          .single();
        userRestaurant = data;
      }

      if (!userRestaurant) {
        console.error('Restaurante não encontrado');
        setLoading(false);
        return;
      }

      setRestaurant(userRestaurant);

      // Buscar pedidos do restaurante
      const { data: allOrders, error } = await supabase
        .from('Order')
        .select('*')
        .eq('restaurant_id', userRestaurant.id)
        .order('created_date', { ascending: false });

      if (error) {
        console.error('Erro ao buscar pedidos:', error);
        setLoading(false);
        return;
      }

      console.log('📦 Total de pedidos:', allOrders?.length || 0);

      const categorizedOrders = {
        new: [],
        preparing: [],
        ready: [],
        completed: []
      };

      // Processar cada pedido
      for (const order of allOrders || []) {
        // Buscar itens do pedido
        const { data: items } = await supabase
          .from('OrderItem')
          .select('*')
          .eq('order_id', order.id);

        const status = (order.status || '').toLowerCase();
        const orderData = {
          id: order.id,
          orderId: order.order_number || `#${order.id.slice(0, 8).toUpperCase()}`,
          customer: {
            name: order.customer_name || 'Cliente',
            phone: order.customer_phone || '+258 84 000 0000',
            address: order.delivery_address || 'Endereço não informado'
          },
          items: (items || []).map(item => ({
            name: item.product_name,
            product_name: item.product_name,
            quantity: item.quantity,
            price: parseFloat(item.unit_price),
            unit_price: parseFloat(item.unit_price),
            notes: item.notes
          })),
          itemsCount: items?.length || 0,
          total: parseFloat(order.total_amount) || 0,
          time: getTimeAgo(order.created_date),
          paymentMethod: order.payment_method || 'Dinheiro',
          prepTime: order.prep_started_at ? getMinutesSince(order.prep_started_at) : 0,
          estimatedTime: order.estimated_prep_time || 30,
          acceptedAt: order.confirmed_at ? formatTime(order.confirmed_at) : null,
          readyAt: order.ready_at ? formatTime(order.ready_at) : null,
          driver: null,
          rawOrder: order
        };

        // Categorizar por status
        if (status === 'pendente' || status === 'pending' || status === 'novo' || status === 'new') {
          categorizedOrders.new.push(orderData);
        } else if (status === 'preparando' || status === 'preparing' || status === 'confirmado' || status === 'confirmed') {
          categorizedOrders.preparing.push(orderData);
        } else if (status === 'pronto' || status === 'ready' || status === 'aguardando entregador') {
          categorizedOrders.ready.push(orderData);
        } else if (status === 'entregue' || status === 'delivered' || status === 'concluído' || status === 'concluido' || status === 'cancelado' || status === 'cancelled') {
          categorizedOrders.completed.push(orderData);
        }
      }

      console.log('📊 Pedidos categorizados:', {
        new: categorizedOrders.new.length,
        preparing: categorizedOrders.preparing.length,
        ready: categorizedOrders.ready.length,
        completed: categorizedOrders.completed.length
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

  const handleAcceptOrder = async (order) => {
    try {
      const { error } = await supabase
        .from('Order')
        .update({ 
          status: 'preparando',
          confirmed_at: new Date().toISOString(),
          prep_started_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (error) throw error;

      showToast(`Pedido ${order.orderId} aceito!`, 'success');
      setSelectedOrder(null);
      await loadOrdersData();

    } catch (error) {
      console.error('Erro ao aceitar pedido:', error);
      showToast('Erro ao aceitar pedido', 'error');
    }
  };

  const handleRejectOrder = async () => {
    try {
      const { error } = await supabase
        .from('Order')
        .update({ 
          status: 'cancelado',
          cancelled_at: new Date().toISOString()
        })
        .eq('id', selectedOrder.id);

      if (error) throw error;

      showToast(`Pedido ${selectedOrder.orderId} rejeitado`, 'error');
      setShowRejectModal(false);
      setSelectedOrder(null);
      await loadOrdersData();

    } catch (error) {
      console.error('Erro ao rejeitar pedido:', error);
      showToast('Erro ao rejeitar pedido', 'error');
    }
  };

  const handleMarkReady = async (order) => {
    try {
      const { error } = await supabase
        .from('Order')
        .update({ 
          status: 'pronto',
          ready_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (error) throw error;

      showToast(`Pedido ${order.orderId} marcado como pronto!`, 'success');
      setSelectedOrder(null);
      await loadOrdersData();

    } catch (error) {
      console.error('Erro ao marcar pedido como pronto:', error);
      showToast('Erro ao atualizar pedido', 'error');
    }
  };

  const loadAvailableDrivers = async () => {
    setLoadingDrivers(true);
    try {
      // Buscar drivers disponíveis da tabela DeliveryPerson
      const { data: drivers, error } = await supabase
        .from('DeliveryPerson')
        .select('*')
        .eq('is_available', true)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      const driversData = (drivers || []).map(driver => ({
        id: driver.id,
        userId: driver.user_id,
        name: driver.name || 'Entregador',
        phone: driver.phone || '+258 84 000 0000',
        email: driver.email,
        avatar: driver.profile_image_url,
        rating: driver.rating || 0,
        deliveries: driver.total_deliveries || 0,
        isAvailable: driver.is_available,
        vehicleType: driver.vehicle_type,
        vehiclePlate: driver.vehicle_plate,
        currentLocation: driver.current_location
      }));

      console.log('🚗 Drivers encontrados:', driversData.length);
      setAvailableDrivers(driversData);

    } catch (error) {
      console.error('Erro ao buscar drivers:', error);
      showToast('Erro ao carregar entregadores', 'error');
    } finally {
      setLoadingDrivers(false);
    }
  };

  const handleAssignDriver = async (driver) => {
    try {
      const { error } = await supabase
        .from('Order')
        .update({ 
          driver_id: driver.userId, // Usar user_id do driver
          status: 'em rota',
          picked_up_at: new Date().toISOString()
        })
        .eq('id', selectedOrder.id);

      if (error) throw error;

      showToast(`${driver.name} atribuído ao pedido!`, 'success');
      setShowDriverModal(false);
      setSelectedOrder(null);
      await loadOrdersData();

    } catch (error) {
      console.error('Erro ao atribuir driver:', error);
      showToast('Erro ao atribuir entregador', 'error');
    }
  };

  const handleOpenDriverModal = () => {
    setShowDriverModal(true);
    loadAvailableDrivers();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#ff4700] animate-spin mx-auto mb-4" />
          <p className="text-lg font-bold text-gray-800">Carregando pedidos...</p>
        </div>
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
                  Pedido {selectedOrder.orderId}
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
                  <p className="text-sm font-bold text-white">
                    {selectedOrder.rawOrder.status === 'cancelado' ? 'Pedido Cancelado' : 'Pedido Concluído'}
                  </p>
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

              <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
                Items do Pedido ({selectedOrder.itemsCount})
              </h2>
              
              <div className="bg-gray-50 rounded-3xl p-5 mb-6 shadow-sm">
                <div className="space-y-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-gray-800">{item.quantity}x</span>
                            <span className="text-sm text-gray-800">{item.name}</span>
                          </div>
                          {item.notes && (
                            <div className="mt-2 bg-orange-50 rounded-xl px-3 py-2">
                              <p className="text-xs font-bold text-orange-500">Observação:</p>
                              <p className="text-xs text-gray-800">{item.notes}</p>
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-bold text-gray-800">
                          MT {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      {idx < selectedOrder.items.length - 1 && (
                        <div className="border-t border-gray-200 mt-4"></div>
                      )}
                    </div>
                  ))}
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
                  <button 
                    onClick={handleOpenDriverModal}
                    className="w-full bg-orange-500 text-white font-bold text-base py-5 rounded-3xl shadow-lg hover:bg-orange-600 transition-colors"
                  >
                    Atribuir Entregador
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
                      Tem certeza que deseja rejeitar o pedido {selectedOrder.orderId}?
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

            {showDriverModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
                <div className="bg-white rounded-3xl p-6 w-full max-w-sm max-h-[80vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'serif' }}>
                      Entregadores Disponíveis
                    </h3>
                    <button 
                      onClick={() => setShowDriverModal(false)}
                      className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <XCircle className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {loadingDrivers ? (
                    <div className="py-12 text-center">
                      <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-3" />
                      <p className="text-sm text-gray-600">Carregando entregadores...</p>
                    </div>
                  ) : availableDrivers.length > 0 ? (
                    <div className="space-y-3">
                      {availableDrivers.map((driver) => (
                        <div 
                          key={driver.id}
                          onClick={() => handleAssignDriver(driver)}
                          className="bg-gray-50 rounded-2xl p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {driver.avatar ? (
                                <img src={driver.avatar} alt={driver.name} className="w-full h-full object-cover" />
                              ) : (
                                <Bike className="w-7 h-7 text-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-gray-800 truncate">{driver.name}</h4>
                              <p className="text-xs text-gray-400 truncate">{driver.phone}</p>
                              {driver.vehicleType && (
                                <div className="flex items-center space-x-1 mt-1">
                                  <span className="text-xs text-gray-500 capitalize">{driver.vehicleType}</span>
                                  {driver.vehiclePlate && (
                                    <span className="text-xs text-gray-400">• {driver.vehiclePlate}</span>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="flex items-center space-x-1 mb-1 justify-end">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span className="text-xs font-bold text-gray-800">{driver.rating.toFixed(1)}</span>
                              </div>
                              <p className="text-xs text-gray-400">{Math.floor(driver.deliveries)} entregas</p>
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-xl px-3 py-2 text-center border-2 border-orange-500">
                            <p className="text-xs font-bold text-orange-500">Toque para atribuir</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bike className="w-10 h-10 text-gray-300" />
                      </div>
                      <h4 className="text-base font-bold text-gray-800 mb-2">Nenhum Entregador Disponível</h4>
                      <p className="text-sm text-gray-400 mb-4">
                        Não há entregadores disponíveis no momento
                      </p>
                      <button 
                        onClick={loadAvailableDrivers}
                        className="bg-gray-100 text-gray-800 font-bold px-6 py-3 rounded-2xl hover:bg-gray-200 transition-colors"
                      >
                        Recarregar
                      </button>
                    </div>
                  )}
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
              <button 
                onClick={() => window.history.back()}
                className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center"
              >
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
                          <span className="text-sm font-bold text-white">{order.orderId}</span>
                          {order.time && (
                            <span className="text-sm text-white">{order.time}</span>
                          )}
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="text-base font-bold text-gray-800">{order.customer.name}</h3>
                            <p className="text-xs text-gray-400">{order.itemsCount} items</p>
                          </div>
                          <p className="text-lg font-bold text-gray-800">MT {order.total.toFixed(2)}</p>
                        </div>

                        <div className="bg-white rounded-2xl p-3 mb-3">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <p key={idx} className="text-sm text-gray-600">
                              {item.quantity}x {item.name}
                            </p>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-xs text-gray-400 mt-1">
                              +{order.items.length - 2} mais
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