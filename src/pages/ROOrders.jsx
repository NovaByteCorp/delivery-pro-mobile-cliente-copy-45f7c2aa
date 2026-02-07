import React, { useState, useEffect } from 'react';
import { ChevronLeft, Clock, Package, User, MapPin, Phone, CheckCircle, XCircle, ChefHat, Bike, DollarSign, TrendingUp, Settings, Loader2, Star, Radio, UserCheck } from 'lucide-react';
import { supabase } from '@/supabase';
import BottomNavRO from '../components/restaurants/ROBottomNav';

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
  const [now, setNow] = useState(new Date());
  const BROADCAST_TIMEOUT_MINUTES = 5;

  useEffect(() => {
    loadOrdersData();
    
    const interval = setInterval(loadOrdersData, 15000);
    return () => clearInterval(interval);
  }, []);

  // Timer para atualizar countdown da rede
  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
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

      const categorizedOrders = {
        new: [],
        preparing: [],
        ready: [],
        completed: []
      };

      for (const order of allOrders || []) {
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
          readyAtRaw: order.ready_at,
          driverId: order.driver_id || null,
          driver: null,
          rawOrder: order
        };

        if (status === 'pendente' || status === 'pending' || status === 'novo' || status === 'new') {
          categorizedOrders.new.push(orderData);
        } else if (status === 'preparando' || status === 'preparing' || status === 'confirmado' || status === 'confirmed') {
          categorizedOrders.preparing.push(orderData);
        } else if (status === 'pronto' || status === 'ready' || status === 'aguardando entregador' || status === 'aguardando_confirmacao') {
          categorizedOrders.ready.push(orderData);
        } else if (status === 'entregue' || status === 'delivered' || status === 'concluído' || status === 'concluido' || status === 'cancelado' || status === 'cancelled') {
          categorizedOrders.completed.push(orderData);
        }
      }

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
      // Lançar na rede: status 'pronto' com ready_at = agora (serve como timestamp de broadcast)
      const { error } = await supabase
        .from('Order')
        .update({ 
          status: 'pronto',
          ready_at: new Date().toISOString(),
          driver_id: null // Garantir que não tem driver (fica na rede)
        })
        .eq('id', order.id);

      if (error) throw error;

      showToast(`Pedido ${order.orderId} lançado na rede!`, 'success');
      setSelectedOrder(null);
      await loadOrdersData();

    } catch (error) {
      console.error('Erro ao marcar pedido como pronto:', error);
      showToast('Erro ao atualizar pedido', 'error');
    }
  };

  // Calcula quanto tempo falta para expirar o broadcast (em segundos)
  const getBroadcastRemaining = (readyAtRaw) => {
    if (!readyAtRaw) return 0;
    const readyAt = new Date(readyAtRaw);
    const expiresAt = new Date(readyAt.getTime() + BROADCAST_TIMEOUT_MINUTES * 60 * 1000);
    const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
    return remaining;
  };

  // Verifica se o broadcast expirou
  const isBroadcastExpired = (readyAtRaw) => {
    return getBroadcastRemaining(readyAtRaw) <= 0;
  };

  // Formata segundos em MM:SS
  const formatCountdown = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Verifica o estado do pedido na rede
  const getReadyOrderState = (order) => {
    const status = (order.rawOrder.status || '').toLowerCase();
    if (status === 'aguardando_confirmacao' && order.driverId) {
      return 'driver_accepted'; // Um entregador aceitou, aguardando confirmação dele
    }
    if (order.driverId) {
      return 'driver_assigned'; // Driver atribuído manualmente
    }
    if (isBroadcastExpired(order.readyAtRaw)) {
      return 'expired'; // Ninguém aceitou em 5 min
    }
    return 'broadcasting'; // Na rede, aguardando entregador
  };

  const loadAvailableDrivers = async () => {
    setLoadingDrivers(true);
    try {
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
          driver_id: driver.userId,
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

  // ─── Loading State ───
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#ff4700] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-base font-medium text-gray-600">A carregar pedidos...</p>
        </div>
      </div>
    );
  }

  // ─── No Restaurant State ───
  if (!restaurant) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="text-center px-8">
          <h2 className="text-2xl font-bold text-[#3c0068] mb-4" style={{ fontFamily: 'serif' }}>
            Restaurante não encontrado
          </h2>
          <p className="text-gray-400">Entre em contato com o suporte.</p>
        </div>
      </div>
    );
  }

  // ─── Order Detail View ───
  if (selectedOrder) {
    const isNew = selectedTab === 'new';
    const isPreparing = selectedTab === 'preparing';
    const isReady = selectedTab === 'ready';
    const isCompleted = selectedTab === 'completed';

    return (
      <div className="relative w-full min-h-screen bg-white overflow-y-auto pb-32">

        {/* Header */}
        <div className="bg-white px-8 pt-12 pb-6">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => setSelectedOrder(null)}
              className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6 text-[#3c0068]" />
            </button>
            
            <h1 className="text-xl font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
              Pedido {selectedOrder.orderId}
            </h1>
            
            <div className="w-14 h-14" />
          </div>

          {/* Status Badge */}
          {isNew && (
            <div className="bg-[#ff4700] rounded-2xl px-4 py-3 text-center">
              <p className="text-sm font-bold text-white">Aguardando Confirmação</p>
              <p className="text-xs text-white/70 mt-1">{selectedOrder.time}</p>
            </div>
          )}

          {isPreparing && (
            <div className="bg-[#3c0068] rounded-2xl px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-white">Em Preparação</p>
                <p className="text-sm font-bold text-white">{selectedOrder.prepTime}/{selectedOrder.estimatedTime} min</p>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-[#ff4700] h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((selectedOrder.prepTime / selectedOrder.estimatedTime) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}

          {isReady && (() => {
            const readyState = getReadyOrderState(selectedOrder);
            return (
              <>
                {readyState === 'broadcasting' && (
                  <div className="bg-[#3c0068] rounded-2xl px-4 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <Radio className="w-4 h-4 text-white animate-pulse" />
                        <p className="text-sm font-bold text-white">Na Rede</p>
                      </div>
                      <p className="text-sm font-bold text-[#ff4700]">
                        {formatCountdown(getBroadcastRemaining(selectedOrder.readyAtRaw))}
                      </p>
                    </div>
                    <p className="text-xs text-white/70">Aguardando um entregador aceitar</p>
                  </div>
                )}
                {readyState === 'driver_accepted' && (
                  <div className="bg-green-500 rounded-2xl px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-4 h-4 text-white" />
                      <p className="text-sm font-bold text-white">Entregador Aceitou</p>
                    </div>
                    <p className="text-xs text-white/70 mt-1">Aguardando confirmação do entregador</p>
                  </div>
                )}
                {readyState === 'expired' && (
                  <div className="bg-[#ff4700] rounded-2xl px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-white" />
                      <p className="text-sm font-bold text-white">Tempo Expirado</p>
                    </div>
                    <p className="text-xs text-white/70 mt-1">Nenhum entregador aceitou — atribua manualmente</p>
                  </div>
                )}
              </>
            );
          })()}

          {isCompleted && (
            <div className="bg-gray-50 rounded-2xl px-4 py-3 text-center">
              <p className="text-sm font-bold text-[#3c0068]">
                {selectedOrder.rawOrder.status === 'cancelado' ? 'Pedido Cancelado' : 'Pedido Concluído'}
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-8">
          
          {/* Customer Info */}
          <div className="bg-gray-50 rounded-3xl p-5 mb-6">
            <h2 className="text-base font-bold text-[#3c0068] mb-4" style={{ fontFamily: 'serif' }}>Cliente</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#3c0068] rounded-2xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#3c0068]">{selectedOrder.customer.name}</p>
                  <p className="text-xs text-gray-400">Cliente</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-[#3c0068] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[#3c0068]">{selectedOrder.customer.address}</p>
                  <p className="text-xs text-gray-400 mt-1">Endereço de entrega</p>
                </div>
              </div>

              <a 
                href={`tel:${selectedOrder.customer.phone}`}
                className="w-full bg-white rounded-2xl py-3 flex items-center justify-center space-x-2 active:bg-gray-100 transition-colors"
              >
                <Phone className="w-5 h-5 text-[#3c0068]" />
                <span className="text-sm font-bold text-[#3c0068]">{selectedOrder.customer.phone}</span>
              </a>
            </div>
          </div>

          {/* Order Items */}
          <h2 className="text-lg font-bold mb-4 text-[#3c0068]" style={{ fontFamily: 'serif' }}>
            Items do Pedido ({selectedOrder.itemsCount})
          </h2>
          
          <div className="bg-gray-50 rounded-3xl p-5 mb-6">
            <div className="space-y-4">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-[#3c0068]">{item.quantity}x</span>
                        <span className="text-sm text-[#3c0068]">{item.name}</span>
                      </div>
                      {item.notes && (
                        <div className="mt-2 bg-white rounded-xl px-3 py-2">
                          <p className="text-xs font-bold text-[#ff4700]">Observação:</p>
                          <p className="text-xs text-gray-400">{item.notes}</p>
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-bold text-[#3c0068]">
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
                <span className="text-base font-bold text-[#3c0068]">Total</span>
                <span className="text-xl font-bold text-[#ff4700]">MT {selectedOrder.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400">Pagamento</span>
                <span className="text-xs font-bold text-[#3c0068]">{selectedOrder.paymentMethod}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Action Buttons */}
        {!isCompleted && (
          <div className="fixed bottom-0 left-0 right-0 bg-white px-8 py-6 shadow-lg">
            {isNew && (
              <div className="space-y-3">
                <button 
                  onClick={() => handleAcceptOrder(selectedOrder)}
                  className="w-full bg-[#ff4700] text-white font-bold text-base py-5 rounded-3xl shadow-lg active:opacity-80 transition-opacity"
                >
                  Aceitar Pedido
                </button>
                <button 
                  onClick={() => setShowRejectModal(true)}
                  className="w-full bg-gray-50 text-[#3c0068] font-bold text-base py-4 rounded-3xl active:bg-gray-100 transition-colors"
                >
                  Rejeitar
                </button>
              </div>
            )}

            {isPreparing && (
              <button 
                onClick={() => handleMarkReady(selectedOrder)}
                className="w-full bg-[#3c0068] text-white font-bold text-base py-5 rounded-3xl shadow-lg active:opacity-80 transition-opacity"
              >
                Pronto — Lançar na Rede
              </button>
            )}

            {isReady && (() => {
              const readyState = getReadyOrderState(selectedOrder);
              return (
                <div className="space-y-3">
                  {readyState === 'broadcasting' && (
                    <div className="bg-gray-50 rounded-2xl p-4 text-center">
                      <Radio className="w-6 h-6 text-[#3c0068] mx-auto mb-2 animate-pulse" />
                      <p className="text-sm font-bold text-[#3c0068]">Pedido na rede</p>
                      <p className="text-xs text-gray-400">Entregadores disponíveis podem aceitar</p>
                    </div>
                  )}
                  {readyState === 'driver_accepted' && (
                    <div className="bg-green-50 rounded-2xl p-4 text-center">
                      <UserCheck className="w-6 h-6 text-green-500 mx-auto mb-2" />
                      <p className="text-sm font-bold text-green-600">Um entregador aceitou!</p>
                      <p className="text-xs text-gray-400">Aguardando confirmação final</p>
                    </div>
                  )}
                  {readyState === 'expired' && (
                    <button 
                      onClick={handleOpenDriverModal}
                      className="w-full bg-[#ff4700] text-white font-bold text-base py-5 rounded-3xl shadow-lg active:opacity-80 transition-opacity"
                    >
                      Atribuir Entregador Manualmente
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
              <h3 className="text-xl font-bold text-[#3c0068] mb-4 text-center" style={{ fontFamily: 'serif' }}>
                Rejeitar Pedido
              </h3>
              
              <div className="bg-red-50 rounded-2xl p-4 mb-6 text-center">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-3" />
                <p className="text-sm text-gray-400">
                  Tem certeza que deseja rejeitar o pedido {selectedOrder.orderId}?
                </p>
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 bg-gray-50 text-[#3c0068] font-bold py-4 rounded-2xl active:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleRejectOrder}
                  className="flex-1 bg-red-500 text-white font-bold py-4 rounded-2xl shadow-lg active:opacity-80 transition-opacity"
                >
                  Rejeitar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Driver Assignment Modal */}
        {showDriverModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
                  Entregadores Disponíveis
                </h3>
                <button 
                  onClick={() => setShowDriverModal(false)}
                  className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center active:bg-gray-100 transition-colors"
                >
                  <XCircle className="w-5 h-5 text-[#3c0068]" />
                </button>
              </div>

              {loadingDrivers ? (
                <div className="py-12 text-center">
                  <div className="w-10 h-10 border-4 border-[#ff4700] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-sm text-gray-400">Carregando entregadores...</p>
                </div>
              ) : availableDrivers.length > 0 ? (
                <div className="space-y-3">
                  {availableDrivers.map((driver) => (
                    <div 
                      key={driver.id}
                      onClick={() => handleAssignDriver(driver)}
                      className="bg-gray-50 rounded-3xl p-4 cursor-pointer active:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-14 h-14 bg-[#ff4700] rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {driver.avatar ? (
                            <img src={driver.avatar} alt={driver.name} className="w-full h-full object-cover" />
                          ) : (
                            <Bike className="w-7 h-7 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-[#3c0068] truncate">{driver.name}</h4>
                          <p className="text-xs text-gray-400 truncate">{driver.phone}</p>
                          {driver.vehicleType && (
                            <div className="flex items-center space-x-1 mt-1">
                              <span className="text-xs text-gray-400 capitalize">{driver.vehicleType}</span>
                              {driver.vehiclePlate && (
                                <span className="text-xs text-gray-400">• {driver.vehiclePlate}</span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="flex items-center space-x-1 mb-1 justify-end">
                            <Star className="w-3 h-3 fill-[#ff4700] text-[#ff4700]" />
                            <span className="text-xs font-bold text-[#3c0068]">{driver.rating.toFixed(1)}</span>
                          </div>
                          <p className="text-xs text-gray-400">{Math.floor(driver.deliveries)} entregas</p>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-2xl px-3 py-2 text-center border-2 border-[#ff4700]">
                        <p className="text-xs font-bold text-[#ff4700]">Toque para atribuir</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bike className="w-10 h-10 text-gray-200" />
                  </div>
                  <h4 className="text-base font-bold text-[#3c0068] mb-2">Nenhum Entregador Disponível</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Não há entregadores disponíveis no momento
                  </p>
                  <button 
                    onClick={loadAvailableDrivers}
                    className="bg-gray-50 text-[#3c0068] font-bold px-6 py-3 rounded-2xl active:bg-gray-100 transition-colors"
                  >
                    Recarregar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    );
  }

  // ─── Main Orders List ───
  return (
    <div className="relative w-full min-h-screen bg-white overflow-y-auto pb-24">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ═══ Fixed Header ═══ */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10 px-8 pt-12 pb-4">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => window.history.back()}
            className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6 text-[#3c0068]" />
          </button>
          
          <h1 className="text-2xl font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
            Pedidos
          </h1>
          
          <button 
            onClick={loadOrdersData}
            className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center active:bg-gray-100 transition-colors"
          >
            <Settings className="w-6 h-6 text-[#3c0068]" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
          {['new', 'preparing', 'ready', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`flex-shrink-0 rounded-2xl px-4 py-4 text-sm font-bold transition-all ${
                selectedTab === tab
                  ? 'bg-[#ff4700] text-white shadow-lg'
                  : 'bg-gray-50 text-[#3c0068]'
              }`}
            >
              {getTabLabel(tab)} ({getTabCount(tab)})
            </button>
          ))}
        </div>
      </div>

      {/* ═══ Content ═══ */}
      <div className="mt-48 px-8">
        
        {orders[selectedTab].length > 0 ? (
          <div className="space-y-5">
            {orders[selectedTab].map((order) => (
              <div 
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="cursor-pointer"
              >
                <div className="rounded-3xl overflow-hidden shadow-lg">
                  
                  {/* Card Header Strip */}
                  <div className={`p-4 ${
                    selectedTab === 'new' ? 'bg-[#ff4700]' :
                    selectedTab === 'preparing' ? 'bg-[#3c0068]' :
                    selectedTab === 'ready' ? (() => {
                      const state = getReadyOrderState(order);
                      if (state === 'driver_accepted') return 'bg-green-500';
                      if (state === 'expired') return 'bg-[#ff4700]';
                      return 'bg-[#3c0068]';
                    })() :
                    'bg-gray-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{order.orderId}</span>
                      {selectedTab === 'ready' ? (() => {
                        const state = getReadyOrderState(order);
                        if (state === 'broadcasting') return (
                          <div className="flex items-center space-x-2">
                            <Radio className="w-3 h-3 text-white animate-pulse" />
                            <span className="text-sm text-white">{formatCountdown(getBroadcastRemaining(order.readyAtRaw))}</span>
                          </div>
                        );
                        if (state === 'driver_accepted') return (
                          <div className="flex items-center space-x-1">
                            <UserCheck className="w-3 h-3 text-white" />
                            <span className="text-sm text-white">Entregador aceitou</span>
                          </div>
                        );
                        if (state === 'expired') return (
                          <span className="text-sm text-white">Atribuir manual</span>
                        );
                        return null;
                      })() : (
                        order.time && <span className="text-sm text-white/70">{order.time}</span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="bg-gray-50 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-base font-bold text-[#3c0068]">{order.customer.name}</h3>
                        <p className="text-xs text-gray-400">{order.itemsCount} items</p>
                      </div>
                      <p className="text-lg font-bold text-[#3c0068]">MT {order.total.toFixed(2)}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-3 mb-3">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <p key={idx} className="text-sm text-gray-400">
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
                          <span className="text-xs font-bold text-[#3c0068]">
                            {order.prepTime}/{order.estimatedTime} min
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-[#ff4700] h-2 rounded-full transition-all"
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
              <Package className="w-16 h-16 text-gray-200" />
            </div>
            <h2 className="text-2xl font-bold text-[#3c0068] mb-2" style={{ fontFamily: 'serif' }}>
              Nenhum Pedido
            </h2>
            <p className="text-sm text-gray-400 text-center">
              Não há pedidos nesta categoria no momento
            </p>
          </div>
        )}

      </div>

      <BottomNavRO activePage="RestaurantOwnerOrders" />
    </div>
  );
}
