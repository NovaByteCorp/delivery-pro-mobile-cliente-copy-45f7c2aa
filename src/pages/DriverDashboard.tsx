import React, { useState, useEffect } from "react";
import { createPageUrl } from "@/utils";
import { 
  MapPin, DollarSign, Clock, Star, Package, Navigation, Bell, Loader2, Phone, X, Check
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
  const [pendingOrders, setPendingOrders] = useState([]); // NOVO: Pedidos aguardando confirmação
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
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(loadDriverData, 30000);
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
      console.log('👤 Driver ID:', testUser.id);

      // ============================================
      // BUSCAR PEDIDOS DISPONÍVEIS (sem driver)
      // ============================================
      const { data: readyOrders, error: readyError } = await supabase
        .from('Order')
        .select('*, Restaurant(name)')
        .eq('status', 'pronto')
        .is('driver_id', null)
        .order('ready_at', { ascending: true });

      if (readyError) {
        console.error('❌ Erro ao buscar pedidos disponíveis:', readyError);
      }

      console.log('📦 Pedidos disponíveis:', readyOrders?.length || 0);

      // Processar pedidos disponíveis
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
            restaurantEmoji: '🍔',
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

      setAvailableOrders(available);

      // ============================================
      // BUSCAR PEDIDOS PENDENTES DE CONFIRMAÇÃO
      // ============================================
      const { data: pendingOrdersData, error: pendingError } = await supabase
        .from('Order')
        .select('*, Restaurant(name)')
        .eq('driver_id', testUser.id)
        .in('status', ['aguardando_confirmacao', 'em rota', 'pronto'])
        .order('created_date', { ascending: false });

      if (pendingError) {
        console.error('❌ Erro ao buscar pedidos pendentes:', pendingError);
      }

      console.log('⏳ Pedidos pendentes de confirmação:', pendingOrdersData?.length || 0);

      // Processar pedidos pendentes
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
            restaurantEmoji: '🍔',
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

      // ============================================
      // BUSCAR ENTREGAS ATIVAS (confirmadas)
      // ============================================
      console.log('🔍 Buscando pedidos atribuídos ao driver_id:', testUser.id);
      
      const { data: assignedOrders, error: assignedError } = await supabase
        .from('Order')
        .select('*, Restaurant(name)')
        .eq('driver_id', testUser.id)
        .in('status', [
          'coletado',           // Pedido coletado no restaurante
          'confirmado',         // NOVO: Confirmado pelo driver
          'em_entrega',         // Em rota para entrega
          'saiu_para_entrega'   // Saiu para entregar
        ])
        .order('created_date', { ascending: false });

      if (assignedError) {
        console.error('❌ Erro ao buscar entregas ativas:', assignedError);
        console.error('Detalhes do erro:', assignedError.message);
      } else {
        console.log('✅ Entregas ativas encontradas:', assignedOrders?.length || 0);
        
        if (assignedOrders && assignedOrders.length > 0) {
          console.log('📋 Pedidos atribuídos:', assignedOrders.map(o => ({
            id: o.id,
            order_number: o.order_number,
            status: o.status,
            driver_id: o.driver_id,
            restaurant: o.Restaurant?.name
          })));
        }
      }

      // Processar entregas ativas
      const active = await Promise.all(
        (assignedOrders || []).map(async (order) => {
          const status = (order.status || '').toLowerCase();
          
          // Mapear status do banco para status do app
          let mappedStatus = 'picked_up'; // Padrão: coletado
          
          if (status === 'em_entrega' || status === 'saiu_para_entrega') {
            mappedStatus = 'delivering'; // Em entrega
          } else if (status === 'coletado' || status === 'confirmado') {
            mappedStatus = 'picked_up'; // Coletado/Confirmado para entregar
          }
          
          return {
            id: order.id,
            orderId: order.order_number || `#${order.id.slice(0, 8).toUpperCase()}`,
            restaurant: order.Restaurant?.name || 'Restaurante',
            restaurantEmoji: '🍔',
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
      console.log('✅ Entregas ativas processadas:', active.length);

      // ============================================
      // CALCULAR ESTATÍSTICAS DE HOJE
      // ============================================
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: todayDeliveries, error: todayError } = await supabase
        .from('Order')
        .select('*')
        .eq('driver_id', testUser.id)
        .eq('status', 'entregue')
        .gte('delivered_at', today.toISOString());

      if (todayError) {
        console.error('❌ Erro ao buscar entregas de hoje:', todayError);
      }

      const deliveriesCount = todayDeliveries?.length || 0;
      const earnings = todayDeliveries?.reduce((sum, o) => 
        sum + parseFloat(o.delivery_fee || 0), 0) || 0;

      // Calcular horas online (simplificado)
      const onlineHours = deliveriesCount > 0 ? deliveriesCount * 0.5 : 0;

      setTodayStats({
        deliveries: deliveriesCount,
        earnings: earnings,
        hours: onlineHours,
        rating: testUser.rating || 4.9
      });

      console.log('📊 Estatísticas de hoje:', {
        deliveries: deliveriesCount,
        earnings: earnings.toFixed(2),
        hours: onlineHours.toFixed(1)
      });

    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      console.error('Stack trace:', error.stack);
    } finally {
      setLoading(false);
    }
  };

  // NOVO: Aceitar pedido (apenas atribui ao driver, aguarda confirmação)
  const handleAcceptOrder = async (order) => {
    try {
      console.log('📦 Aceitando pedido (aguardando confirmação):', order.id);
      console.log('👤 Driver ID:', driver.id);
      
      const { data, error } = await supabase
        .from('Order')
        .update({
          driver_id: driver.id,
          status: 'aguardando_confirmacao', // Status temporário
          picked_up_at: new Date().toISOString()
        })
        .eq('id', order.id)
        .select();

      if (error) {
        console.error('❌ Erro detalhado:', error);
        throw error;
      }

      console.log('✅ Pedido atribuído, aguardando confirmação:', data);
      showToast('Pedido atribuído! Confirme para continuar.', 'success');
      
      // Recarregar dados após 1 segundo
      setTimeout(() => loadDriverData(), 1000);

    } catch (error) {
      console.error('❌ Erro ao aceitar pedido:', error);
      showToast('Erro ao aceitar pedido: ' + error.message, 'error');
    }
  };

  // NOVO: Confirmar pedido (aceita definitivamente)
  const handleConfirmOrder = async (order) => {
    try {
      console.log('✅ Confirmando pedido:', order.id);
      
      const { data, error } = await supabase
        .from('Order')
        .update({
          status: 'coletado', // Agora sim, coletado
          confirmed_at: new Date().toISOString()
        })
        .eq('id', order.id)
        .select();

      if (error) throw error;

      console.log('✅ Pedido confirmado:', data);
      showToast('Pedido confirmado! Dirija-se ao restaurante. 🚗', 'success');
      await loadDriverData();

    } catch (error) {
      console.error('❌ Erro ao confirmar pedido:', error);
      showToast('Erro ao confirmar pedido: ' + error.message, 'error');
    }
  };

  // NOVO: Rejeitar pedido (devolve ao restaurante)
  const handleRejectOrder = async (order, reason = '') => {
    try {
      console.log('❌ Rejeitando pedido:', order.id);
      console.log('📝 Motivo:', reason);
      
      const { data, error } = await supabase
        .from('Order')
        .update({
          driver_id: null,        // Remove o driver
          status: 'pronto',       // Volta para status "pronto"
          notes: `Pedido rejeitado pelo entregador. Motivo: ${reason || 'Não informado'}`,
          picked_up_at: null      // Remove timestamp de coleta
        })
        .eq('id', order.id)
        .select();

      if (error) throw error;

      console.log('✅ Pedido devolvido ao restaurante:', data);
      showToast('Pedido rejeitado e devolvido ao restaurante.', 'success');
      
      // Fechar modal e limpar
      setShowRejectModal(false);
      setOrderToReject(null);
      setRejectReason('');
      
      await loadDriverData();

    } catch (error) {
      console.error('❌ Erro ao rejeitar pedido:', error);
      showToast('Erro ao rejeitar pedido: ' + error.message, 'error');
    }
  };

  // Abrir modal de rejeição
  const openRejectModal = (order) => {
    setOrderToReject(order);
    setShowRejectModal(true);
  };

  const handleMarkDelivered = async (order) => {
    try {
      console.log('✅ Marcando pedido como entregue:', order.id);
      
      const { error } = await supabase
        .from('Order')
        .update({
          status: 'entregue',
          delivered_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (error) throw error;

      console.log('✅ Pedido marcado como entregue');
      showToast('Entrega concluída! Parabéns! 🎉', 'success');
      await loadDriverData();

    } catch (error) {
      console.error('❌ Erro ao marcar como entregue:', error);
      showToast('Erro ao atualizar status', 'error');
    }
  };

  const handleStartDelivery = async (order) => {
    try {
      console.log('🚚 Iniciando entrega:', order.id);
      
      const { error } = await supabase
        .from('Order')
        .update({
          status: 'em_entrega'
        })
        .eq('id', order.id);

      if (error) throw error;

      console.log('✅ Entrega iniciada');
      showToast('Entrega iniciada!', 'success');
      await loadDriverData();

    } catch (error) {
      console.error('❌ Erro ao iniciar entrega:', error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-lg font-bold text-gray-800">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-white overflow-y-auto pb-24 no-scrollbar">

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* MODAL DE REJEIÇÃO */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Rejeitar Pedido</h3>
                <button 
                  onClick={() => {
                    setShowRejectModal(false);
                    setOrderToReject(null);
                    setRejectReason('');
                  }}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Pedido: <span className="font-bold">{orderToReject?.orderId}</span>
              </p>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Motivo da rejeição (opcional)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Ex: Distância muito longa, problema com veículo, etc."
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none resize-none"
                  rows={3}
                />
              </div>

              <div className="mb-6">
                <p className="text-xs text-gray-600 bg-orange-50 p-3 rounded-xl">
                  ⚠️ O pedido será devolvido ao restaurante e ficará disponível para outros entregadores.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowRejectModal(false);
                    setOrderToReject(null);
                    setRejectReason('');
                  }}
                  className="bg-gray-200 text-gray-800 py-4 px-6 rounded-2xl font-bold hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => handleRejectOrder(orderToReject, rejectReason)}
                  className="bg-red-500 text-white py-4 px-6 rounded-2xl font-bold hover:bg-red-600 transition-colors"
                >
                  Rejeitar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER FIXO */}
      <div className="bg-gray-800 px-8 pt-24 pb-10 rounded-b-3xl fixed top-0 left-0 right-0 z-10 shadow-xl">
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-400 mb-1">Bem-vindo de volta,</p>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'serif' }}>
              {driver?.full_name || 'Entregador'}
            </h1>
          </div>

          <button className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center relative">
            <Bell className="w-6 h-6 text-white" />
            {(availableOrders.length > 0 || pendingOrders.length > 0) && (
              <span className="absolute top-1 right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-gray-800"></span>
            )}
          </button>
        </div>

        {/* Online/Offline Toggle */}
        <div className="bg-gray-700 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
            <span className="text-base font-bold text-white">
              {isOnline ? 'Você está Online' : 'Você está Offline'}
            </span>
          </div>

          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              isOnline ? 'bg-green-500' : 'bg-gray-600'
            }`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
              isOnline ? 'right-1' : 'left-1'
            }`}></div>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="mt-[280px] px-8">

        {/* Today's Stats */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'serif' }}>
              Resumo de Hoje
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mb-3">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs text-gray-400 mb-1">Entregas</p>
                <p className="text-2xl font-bold text-gray-800">{todayStats.deliveries}</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mb-3">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs text-gray-400 mb-1">Ganhos</p>
                <p className="text-2xl font-bold text-gray-800">MT {todayStats.earnings.toFixed(2)}</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs text-gray-400 mb-1">Tempo Online</p>
                <p className="text-2xl font-bold text-gray-800">{todayStats.hours.toFixed(1)}h</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mb-3">
                  <Star className="w-5 h-5 text-white fill-white" />
                </div>
                <p className="text-xs text-gray-400 mb-1">Avaliação</p>
                <p className="text-2xl font-bold text-gray-800">{todayStats.rating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* NOVO: Pedidos Pendentes de Confirmação */}
        {pendingOrders.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'serif' }}>
                Confirme o Pedido
              </h2>
              <span className="bg-yellow-500 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-lg">
                Aguardando Confirmação
              </span>
            </div>

            {pendingOrders.map((order) => (
              <div key={order.id} className="bg-yellow-50 border-2 border-yellow-500 rounded-3xl p-5 shadow-lg mb-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 bg-yellow-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">{order.restaurantEmoji}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-800 mb-1">{order.restaurant}</h3>
                    <p className="text-sm text-gray-600">Para: {order.customerName}</p>
                    <p className="text-xs text-gray-500">Pedido {order.orderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">MT {order.payment.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{order.distance}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">Endereço de Entrega</p>
                      <p className="text-sm text-gray-800 font-medium">{order.deliveryAddress}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-100 rounded-2xl p-3 mb-4">
                  <p className="text-xs text-gray-700 text-center">
                    ⏰ Confirme ou rejeite este pedido para continuar
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={() => openRejectModal(order)}
                    className="flex-1 bg-white border-2 border-red-500 text-red-500 rounded-2xl py-3 flex items-center justify-center space-x-2 font-bold hover:bg-red-50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                    <span className="text-sm">Rejeitar</span>
                  </button>
                  
                  <button 
                    onClick={() => handleConfirmOrder(order)}
                    className="flex-1 bg-green-500 text-white rounded-2xl py-3 flex items-center justify-center space-x-2 font-bold hover:bg-green-600 transition-colors"
                  >
                    <Check className="w-5 h-5" />
                    <span className="text-sm">Confirmar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Active Deliveries */}
        {activeDeliveries.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'serif' }}>
                Entrega Ativa
              </h2>
              <span className="bg-orange-500 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-lg">
                Em Progresso
              </span>
            </div>

            {activeDeliveries.map((delivery) => (
              <div key={delivery.id} className="bg-gray-800 rounded-3xl p-5 shadow-lg mb-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 bg-gray-700 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">{delivery.restaurantEmoji}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-white mb-1">{delivery.restaurant}</h3>
                    <p className="text-sm text-gray-400">Entregando para {delivery.customerName}</p>
                    <p className="text-xs text-gray-500">Pedido {delivery.orderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-400">MT {delivery.payment.toFixed(2)}</p>
                  </div>
                </div>

                <div className="bg-gray-700 rounded-2xl p-4 mb-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">Endereço de Entrega</p>
                      <p className="text-sm text-white">{delivery.deliveryAddress}</p>
                    </div>
                  </div>
                  
                  {delivery.customerPhone && (
                    <a 
                      href={`tel:${delivery.customerPhone}`}
                      className="flex items-center space-x-2 bg-gray-600 rounded-xl px-4 py-2 hover:bg-gray-500 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-white" />
                      <span className="text-sm text-white">{delivery.customerPhone}</span>
                    </a>
                  )}
                </div>

                <div className="flex space-x-3">
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(delivery.deliveryAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-orange-500 rounded-2xl py-3 flex items-center justify-center space-x-2"
                  >
                    <Navigation className="w-5 h-5 text-white" />
                    <span className="text-sm font-bold text-white">Navegar</span>
                  </a>
                  
                  {delivery.status === 'picked_up' ? (
                    <button 
                      onClick={() => handleStartDelivery(delivery)}
                      className="flex-1 bg-blue-500 rounded-2xl py-3 flex items-center justify-center"
                    >
                      <span className="text-sm font-bold text-white">Iniciar Entrega</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleMarkDelivered(delivery)}
                      className="flex-1 bg-green-500 rounded-2xl py-3 flex items-center justify-center"
                    >
                      <span className="text-sm font-bold text-white">Entregue</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Available Orders */}
        {isOnline && availableOrders.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'serif' }}>
              Pedidos Disponíveis ({availableOrders.length})
            </h2>

            <div className="space-y-4">
              {availableOrders.map((order) => (
                <div key={order.id} className="bg-gray-50 rounded-3xl overflow-hidden shadow-lg">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">{order.restaurantEmoji}</span>
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-800">{order.restaurant}</h3>
                          <p className="text-xs text-gray-400">{order.items} itens • {order.orderId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-500">MT {order.payment.toFixed(2)}</p>
                        <p className="text-xs text-gray-400">{order.distance}</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 mb-4 space-y-3">
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">C</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-400">Cliente</p>
                          <p className="text-sm text-gray-800 font-medium">{order.customerName}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-400">Entrega</p>
                          <p className="text-sm text-gray-800 font-medium">{order.deliveryAddress}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{order.estimatedTime}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Total: MT {order.total.toFixed(2)}
                        </div>
                      </div>

                      <button 
                        onClick={() => handleAcceptOrder(order)}
                        className="bg-orange-500 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg hover:bg-orange-600 transition-colors"
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

        {/* Empty State */}
        {isOnline && availableOrders.length === 0 && pendingOrders.length === 0 && activeDeliveries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Package className="w-16 h-16 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'serif' }}>
              Nenhum Pedido Disponível
            </h2>
            <p className="text-sm text-gray-400 text-center">
              Aguarde novos pedidos aparecerem
            </p>
          </div>
        )}

      </div>

      <BottomNavDriver activePage="DriverDashboard" />

    </div>
  );
}