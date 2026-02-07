import React, { useState, useEffect } from "react";
import { createPageUrl } from "@/utils";
import { 
  MapPin, DollarSign, Clock, Star, Package, Navigation, Bell, Loader2, Phone, X, Check, Radio
} from 'lucide-react';
import BottomNavDriver from '../components/driver/DriverBottomNav';
import { supabase } from '@/supabase';

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);
  const [driver, setDriver] = useState(null);
  const [todayStats, setTodayStats] = useState({
    deliveries: 0,
    earnings: 0,
    hours: 0,
    rating: 0
  });
  const [availableOrders, setAvailableOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [orderToReject, setOrderToReject] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('simulatedRole');
    
    if (storedRole !== 'entregador') {
      if (storedRole === 'cliente') {
        window.location.href = createPageUrl('ClientDashboard');
      } else if (storedRole === 'dono_restaurante') {
        window.location.href = createPageUrl('RestaurantOwnerDashboard');
      } else if (storedRole === 'super_admin' || storedRole === 'admin') {
        window.location.href = createPageUrl('Dashboard');
      }
      return;
    }

    loadDriverData();
    
    const interval = setInterval(loadDriverData, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadDriverData = async () => {
    setLoading(true);
    try {
      const testUser = JSON.parse(localStorage.getItem('testUser') || '{}');
      
      if (!testUser.id) {
        console.error('Usuário não encontrado');
        setLoading(false);
        return;
      }

      setDriver(testUser);

      // ─── Pedidos disponíveis na rede (pronto + sem driver) ───
      const { data: readyOrders, error: readyError } = await supabase
        .from('Order')
        .select('*, Restaurant(name)')
        .eq('status', 'pronto')
        .is('driver_id', null)
        .order('ready_at', { ascending: true });

      if (readyError) {
        console.error('Erro ao buscar pedidos disponíveis:', readyError);
      }

      const available = await Promise.all(
        (readyOrders || []).map(async (order) => {
          const { data: items } = await supabase
            .from('OrderItem')
            .select('*')
            .eq('order_id', order.id);

          return {
            id: order.id,
            orderId: order.order_number || `#${order.id.slice(0, 8).toUpperCase()}`,
            restaurant: order.Restaurant?.name || 'Restaurante',
            pickupAddress: 'Restaurante - Coleta necessária',
            deliveryAddress: order.delivery_address || 'Endereço não informado',
            distance: '2.5 km',
            estimatedTime: '15 min',
            payment: parseFloat(order.delivery_fee || 0),
            total: parseFloat(order.total_amount || 0),
            items: items?.length || 0,
            customerName: order.customer_name || 'Cliente',
            customerPhone: order.customer_phone || '',
            readyAtRaw: order.ready_at,
            rawOrder: order
          };
        })
      );

      setAvailableOrders(available);

      // ─── Pedidos pendentes de confirmação (driver aceitou mas ainda não confirmou) ───
      const { data: pendingOrdersData, error: pendingError } = await supabase
        .from('Order')
        .select('*, Restaurant(name)')
        .eq('driver_id', testUser.id)
        .in('status', ['aguardando_confirmacao', 'em rota', 'pronto'])
        .order('created_date', { ascending: false });

      if (pendingError) {
        console.error('Erro ao buscar pedidos pendentes:', pendingError);
      }

      const pending = await Promise.all(
        (pendingOrdersData || []).map(async (order) => {
          const { data: items } = await supabase
            .from('OrderItem')
            .select('*')
            .eq('order_id', order.id);

          return {
            id: order.id,
            orderId: order.order_number || `#${order.id.slice(0, 8).toUpperCase()}`,
            restaurant: order.Restaurant?.name || 'Restaurante',
            pickupAddress: 'Restaurante - Coleta necessária',
            deliveryAddress: order.delivery_address || 'Endereço não informado',
            distance: '2.5 km',
            estimatedTime: '15 min',
            payment: parseFloat(order.delivery_fee || 0),
            total: parseFloat(order.total_amount || 0),
            items: items?.length || 0,
            customerName: order.customer_name || 'Cliente',
            customerPhone: order.customer_phone || '',
            rawOrder: order
          };
        })
      );

      setPendingOrders(pending);

      // ─── Entregas ativas (confirmadas pelo driver) ───
      const { data: assignedOrders, error: assignedError } = await supabase
        .from('Order')
        .select('*, Restaurant(name)')
        .eq('driver_id', testUser.id)
        .in('status', [
          'coletado',
          'confirmado',
          'em_entrega',
          'saiu_para_entrega'
        ])
        .order('created_date', { ascending: false });

      if (assignedError) {
        console.error('Erro ao buscar entregas ativas:', assignedError);
      }

      const active = await Promise.all(
        (assignedOrders || []).map(async (order) => {
          const status = (order.status || '').toLowerCase();
          
          let mappedStatus = 'picked_up';
          if (status === 'em_entrega' || status === 'saiu_para_entrega') {
            mappedStatus = 'delivering';
          } else if (status === 'coletado' || status === 'confirmado') {
            mappedStatus = 'picked_up';
          }
          
          return {
            id: order.id,
            orderId: order.order_number || `#${order.id.slice(0, 8).toUpperCase()}`,
            restaurant: order.Restaurant?.name || 'Restaurante',
            customerName: order.customer_name || 'Cliente',
            customerPhone: order.customer_phone || '',
            deliveryAddress: order.delivery_address || 'Endereço não informado',
            status: mappedStatus,
            estimatedTime: '8 min',
            payment: parseFloat(order.delivery_fee || 0),
            total: parseFloat(order.total_amount || 0),
            rawOrder: order
          };
        })
      );

      setActiveDeliveries(active);

      // ─── Estatísticas de hoje ───
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: todayDeliveries } = await supabase
        .from('Order')
        .select('*')
        .eq('driver_id', testUser.id)
        .eq('status', 'entregue')
        .gte('delivered_at', today.toISOString());

      const deliveriesCount = todayDeliveries?.length || 0;
      const earnings = todayDeliveries?.reduce((sum, o) => 
        sum + parseFloat(o.delivery_fee || 0), 0) || 0;
      const onlineHours = deliveriesCount > 0 ? deliveriesCount * 0.5 : 0;

      setTodayStats({
        deliveries: deliveriesCount,
        earnings: earnings,
        hours: onlineHours,
        rating: testUser.rating || 4.9
      });

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // ─── Aceitar pedido da rede ───
  const handleAcceptOrder = async (order) => {
    try {
      // Verificar se o pedido ainda está disponível (race condition)
      const { data: freshOrder, error: checkError } = await supabase
        .from('Order')
        .select('driver_id, status')
        .eq('id', order.id)
        .single();

      if (checkError) throw checkError;

      if (freshOrder.driver_id) {
        showToast('Este pedido já foi aceite por outro entregador.', 'error');
        await loadDriverData();
        return;
      }
      
      const { error } = await supabase
        .from('Order')
        .update({
          driver_id: driver.id,
          status: 'aguardando_confirmacao',
          picked_up_at: new Date().toISOString()
        })
        .eq('id', order.id)
        .is('driver_id', null); // Double-check: só atualiza se driver_id ainda é null

      if (error) throw error;

      showToast('Pedido aceite! Confirme para continuar.', 'success');
      setTimeout(() => loadDriverData(), 1000);

    } catch (error) {
      console.error('Erro ao aceitar pedido:', error);
      showToast('Erro ao aceitar pedido', 'error');
    }
  };

  // ─── Confirmar pedido (aceitar definitivamente) ───
  const handleConfirmOrder = async (order) => {
    try {
      const { error } = await supabase
        .from('Order')
        .update({
          status: 'coletado',
          confirmed_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (error) throw error;

      showToast('Pedido confirmado! Dirija-se ao restaurante.', 'success');
      await loadDriverData();

    } catch (error) {
      console.error('Erro ao confirmar pedido:', error);
      showToast('Erro ao confirmar pedido', 'error');
    }
  };

  // ─── Rejeitar pedido (devolver à rede) ───
  const handleRejectOrder = async (order, reason = '') => {
    try {
      const { error } = await supabase
        .from('Order')
        .update({
          driver_id: null,
          status: 'pronto',
          notes: `Pedido rejeitado pelo entregador. Motivo: ${reason || 'Não informado'}`,
          picked_up_at: null
        })
        .eq('id', order.id);

      if (error) throw error;

      showToast('Pedido devolvido à rede.', 'success');
      setShowRejectModal(false);
      setOrderToReject(null);
      setRejectReason('');
      await loadDriverData();

    } catch (error) {
      console.error('Erro ao rejeitar pedido:', error);
      showToast('Erro ao rejeitar pedido', 'error');
    }
  };

  const openRejectModal = (order) => {
    setOrderToReject(order);
    setShowRejectModal(true);
  };

  // ─── Iniciar entrega ───
  const handleStartDelivery = async (order) => {
    try {
      const { error } = await supabase
        .from('Order')
        .update({ status: 'em_entrega' })
        .eq('id', order.id);

      if (error) throw error;

      showToast('Entrega iniciada!', 'success');
      await loadDriverData();

    } catch (error) {
      console.error('Erro ao iniciar entrega:', error);
      showToast('Erro ao atualizar status', 'error');
    }
  };

  // ─── Marcar como entregue ───
  const handleMarkDelivered = async (order) => {
    try {
      const { error } = await supabase
        .from('Order')
        .update({
          status: 'entregue',
          delivered_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (error) throw error;

      showToast('Entrega concluída! Parabéns!', 'success');
      await loadDriverData();

    } catch (error) {
      console.error('Erro ao marcar como entregue:', error);
      showToast('Erro ao atualizar status', 'error');
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
    setTimeout(() => toast.remove(), 3000);
  };

  // ─── Loading State ───
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#ff4700] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-base font-medium text-gray-600">A carregar...</p>
        </div>
      </div>
    );
  }

  // ─── Main Render ───
  return (
    <div className="relative w-full min-h-screen bg-white overflow-y-auto pb-24">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ═══ Reject Modal ═══ */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-8">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
                  Rejeitar Pedido
                </h3>
                <button 
                  onClick={() => {
                    setShowRejectModal(false);
                    setOrderToReject(null);
                    setRejectReason('');
                  }}
                  className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center active:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-[#3c0068]" />
                </button>
              </div>

              <p className="text-sm text-gray-400 mb-4">
                Pedido: <span className="font-bold text-[#3c0068]">{orderToReject?.orderId}</span>
              </p>

              <div className="mb-4">
                <label className="text-xs font-bold text-gray-400 mb-2 block">MOTIVO DA REJEIÇÃO (opcional)</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Ex: Distância muito longa, problema com veículo..."
                  className="w-full bg-gray-50 rounded-2xl px-4 py-4 text-sm text-[#3c0068] outline-none border-2 border-gray-100 focus:border-[#ff4700] resize-none transition-colors"
                  rows={3}
                />
              </div>

              <div className="bg-gray-50 rounded-2xl p-3 mb-6">
                <p className="text-xs text-gray-400 text-center">
                  O pedido será devolvido à rede e ficará disponível para outros entregadores.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setOrderToReject(null);
                    setRejectReason('');
                  }}
                  className="flex-1 bg-gray-50 text-[#3c0068] py-4 rounded-2xl font-bold active:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleRejectOrder(orderToReject, rejectReason)}
                  className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold shadow-lg active:opacity-80 transition-opacity"
                >
                  Rejeitar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Header ═══ */}
      <div className="bg-white px-8 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-400 mb-1">Bem-vindo de volta,</p>
            <h1 className="text-2xl font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
              {driver?.full_name || 'Entregador'}
            </h1>
          </div>

          <button className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center relative">
            <Bell className="w-6 h-6 text-[#3c0068]" />
            {(availableOrders.length > 0 || pendingOrders.length > 0) && (
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Online/Offline Toggle */}
        <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-base font-bold text-[#3c0068]">
              {isOnline ? 'Você está Online' : 'Você está Offline'}
            </span>
          </div>

          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              isOnline ? 'bg-[#ff4700]' : 'bg-gray-300'
            }`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${
              isOnline ? 'right-1' : 'left-1'
            }`}></div>
          </button>
        </div>
      </div>

      {/* ═══ Content ═══ */}
      <div className="px-8">

        {/* ─── Today's Stats ─── */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#3c0068] mb-4" style={{ fontFamily: 'serif' }}>
            Resumo de Hoje
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="w-10 h-10 bg-[#ff4700] rounded-2xl flex items-center justify-center mb-3">
                <Package className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-gray-400 mb-1">Entregas</p>
              <p className="text-xl font-bold text-[#3c0068]">{todayStats.deliveries}</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="w-10 h-10 bg-[#3c0068] rounded-2xl flex items-center justify-center mb-3">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-gray-400 mb-1">Ganhos</p>
              <p className="text-xl font-bold text-[#3c0068]">MT {todayStats.earnings.toFixed(2)}</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="w-10 h-10 bg-[#3c0068] rounded-2xl flex items-center justify-center mb-3">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-gray-400 mb-1">Tempo Online</p>
              <p className="text-xl font-bold text-[#3c0068]">{todayStats.hours.toFixed(1)}h</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="w-10 h-10 bg-[#ff4700] rounded-2xl flex items-center justify-center mb-3">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
              <p className="text-xs text-gray-400 mb-1">Avaliação</p>
              <p className="text-xl font-bold text-[#3c0068]">{todayStats.rating.toFixed(1)}</p>
            </div>
          </div>
        </div>

        {/* ─── Pedidos Pendentes de Confirmação ─── */}
        {pendingOrders.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
                Confirme o Pedido
              </h2>
              <span className="bg-[#ff4700] text-white px-3 py-1 rounded-2xl text-xs font-bold">
                {pendingOrders.length}
              </span>
            </div>

            {pendingOrders.map((order) => (
              <div key={order.id} className="bg-gray-50 border-2 border-[#ff4700] rounded-3xl p-5 mb-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 bg-[#ff4700] rounded-2xl flex items-center justify-center">
                    <Package className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-[#3c0068] mb-1">{order.restaurant}</h3>
                    <p className="text-sm text-gray-400">Para: {order.customerName}</p>
                    <p className="text-xs text-gray-400">Pedido {order.orderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#ff4700]">MT {order.payment.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">{order.distance}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-[#ff4700] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">Endereço de Entrega</p>
                      <p className="text-sm font-bold text-[#3c0068]">{order.deliveryAddress}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-3 mb-4 border border-gray-100">
                  <p className="text-xs text-gray-400 text-center">
                    Confirme ou rejeite este pedido para continuar
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={() => openRejectModal(order)}
                    className="flex-1 bg-white border-2 border-red-500 text-red-500 rounded-2xl py-3 flex items-center justify-center space-x-2 font-bold active:bg-red-50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                    <span className="text-sm">Rejeitar</span>
                  </button>
                  
                  <button 
                    onClick={() => handleConfirmOrder(order)}
                    className="flex-1 bg-[#ff4700] text-white rounded-2xl py-3 flex items-center justify-center space-x-2 font-bold active:opacity-80 transition-opacity"
                  >
                    <Check className="w-5 h-5" />
                    <span className="text-sm">Confirmar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── Entregas Ativas ─── */}
        {activeDeliveries.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
                Entrega Ativa
              </h2>
              <span className="bg-[#3c0068] text-white px-3 py-1 rounded-2xl text-xs font-bold">
                Em Progresso
              </span>
            </div>

            {activeDeliveries.map((delivery) => (
              <div key={delivery.id} className="bg-gray-50 rounded-3xl p-5 mb-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 bg-[#3c0068] rounded-2xl flex items-center justify-center">
                    <Package className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-[#3c0068] mb-1">{delivery.restaurant}</h3>
                    <p className="text-sm text-gray-400">Para: {delivery.customerName}</p>
                    <p className="text-xs text-gray-400">Pedido {delivery.orderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#ff4700]">MT {delivery.payment.toFixed(2)}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 mb-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <MapPin className="w-5 h-5 text-[#ff4700] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">Endereço de Entrega</p>
                      <p className="text-sm font-bold text-[#3c0068]">{delivery.deliveryAddress}</p>
                    </div>
                  </div>
                  
                  {delivery.customerPhone && (
                    <a 
                      href={`tel:${delivery.customerPhone}`}
                      className="flex items-center space-x-2 bg-gray-50 rounded-2xl px-4 py-3 active:bg-gray-100 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-[#3c0068]" />
                      <span className="text-sm font-bold text-[#3c0068]">{delivery.customerPhone}</span>
                    </a>
                  )}
                </div>

                <div className="flex space-x-3">
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(delivery.deliveryAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#3c0068] rounded-2xl py-3 flex items-center justify-center space-x-2 active:opacity-80 transition-opacity"
                  >
                    <Navigation className="w-5 h-5 text-white" />
                    <span className="text-sm font-bold text-white">Navegar</span>
                  </a>
                  
                  {delivery.status === 'picked_up' ? (
                    <button 
                      onClick={() => handleStartDelivery(delivery)}
                      className="flex-1 bg-[#ff4700] rounded-2xl py-3 flex items-center justify-center active:opacity-80 transition-opacity"
                    >
                      <span className="text-sm font-bold text-white">Iniciar Entrega</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleMarkDelivered(delivery)}
                      className="flex-1 bg-green-500 rounded-2xl py-3 flex items-center justify-center active:opacity-80 transition-opacity"
                    >
                      <span className="text-sm font-bold text-white">Entregue</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── Pedidos Disponíveis na Rede ─── */}
        {isOnline && availableOrders.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
                Pedidos na Rede
              </h2>
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-2xl">
                <Radio className="w-3 h-3 text-[#ff4700] animate-pulse" />
                <span className="text-xs font-bold text-[#3c0068]">{availableOrders.length}</span>
              </div>
            </div>

            <div className="space-y-4">
              {availableOrders.map((order) => (
                <div key={order.id} className="bg-gray-50 rounded-3xl overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-[#3c0068] rounded-2xl flex items-center justify-center">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-[#3c0068]">{order.restaurant}</h3>
                          <p className="text-xs text-gray-400">{order.items} itens • {order.orderId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#ff4700]">MT {order.payment.toFixed(2)}</p>
                        <p className="text-xs text-gray-400">{order.distance}</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 mb-4 space-y-3">
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-[#ff4700] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">C</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-400">Cliente</p>
                          <p className="text-sm font-bold text-[#3c0068]">{order.customerName}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-[#3c0068] rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-400">Entrega</p>
                          <p className="text-sm font-bold text-[#3c0068]">{order.deliveryAddress}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">{order.estimatedTime}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          Total: MT {order.total.toFixed(2)}
                        </span>
                      </div>

                      <button 
                        onClick={() => handleAcceptOrder(order)}
                        className="bg-[#ff4700] text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg active:opacity-80 transition-opacity"
                      >
                        Aceitar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Empty State ─── */}
        {isOnline && availableOrders.length === 0 && pendingOrders.length === 0 && activeDeliveries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Package className="w-16 h-16 text-gray-200" />
            </div>
            <h2 className="text-2xl font-bold text-[#3c0068] mb-2" style={{ fontFamily: 'serif' }}>
              Nenhum Pedido Disponível
            </h2>
            <p className="text-sm text-gray-400 text-center">
              Aguarde novos pedidos na rede
            </p>
          </div>
        )}

        {/* ─── Offline State ─── */}
        {!isOnline && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Radio className="w-16 h-16 text-gray-200" />
            </div>
            <h2 className="text-2xl font-bold text-[#3c0068] mb-2" style={{ fontFamily: 'serif' }}>
              Você está Offline
            </h2>
            <p className="text-sm text-gray-400 text-center mb-6">
              Fique online para receber pedidos da rede
            </p>
            <button
              onClick={() => setIsOnline(true)}
              className="bg-[#ff4700] text-white font-bold px-8 py-4 rounded-2xl shadow-lg active:opacity-80 transition-opacity"
            >
              Ficar Online
            </button>
          </div>
        )}

      </div>

      <BottomNavDriver activePage="DriverDashboard" />
    </div>
  );
}
