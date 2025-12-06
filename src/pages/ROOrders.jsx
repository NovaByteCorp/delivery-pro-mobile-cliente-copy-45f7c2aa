import React, { useState } from 'react';
import { ChevronLeft, Clock, Package, User, MapPin, Phone, CheckCircle, XCircle, ChefHat, Bike, DollarSign, TrendingUp, Settings } from 'lucide-react';
import BottomNavRO from '../components/restaurants/ROBottomNav';

export default function RestaurantOwnerOrders() {
  const [selectedTab, setSelectedTab] = useState('new');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const orders = {
    new: [
      {
        id: 1,
        orderId: 'ORD-1507',
        customer: {
          name: 'Maria Silva',
          phone: '+258 84 987 6543',
          address: 'Rua da Imprensa, 456, Apt 4B, Polana'
        },
        items: [
          { name: 'Beef Burger', quantity: 2, price: 7.99, notes: 'Sem cebola' },
          { name: 'French Fries', quantity: 1, price: 3.99, notes: '' },
          { name: 'Coca-Cola', quantity: 2, price: 2.50, notes: '' }
        ],
        total: 24.97,
        time: '2 min atrás',
        paymentMethod: 'Cartão'
      },
      {
        id: 2,
        orderId: 'ORD-1508',
        customer: {
          name: 'João Santos',
          phone: '+258 84 555 6666',
          address: 'Av. Marginal, 321, Malhangalene'
        },
        items: [
          { name: 'XL Burger', quantity: 1, price: 11.00, notes: '' },
          { name: 'Onion Rings', quantity: 1, price: 4.50, notes: '' }
        ],
        total: 15.50,
        time: '5 min atrás',
        paymentMethod: 'Dinheiro'
      }
    ],
    preparing: [
      {
        id: 3,
        orderId: 'ORD-1506',
        customer: {
          name: 'Ana Costa',
          phone: '+258 84 111 2222',
          address: 'Av. 24 de Julho, 888'
        },
        items: [
          { name: 'Chicken Burger', quantity: 3, price: 4.99, notes: '' },
          { name: 'French Fries', quantity: 2, price: 3.99, notes: '' }
        ],
        total: 22.95,
        prepTime: 12,
        estimatedTime: 20,
        acceptedAt: '14:30'
      }
    ],
    ready: [
      {
        id: 4,
        orderId: 'ORD-1505',
        customer: {
          name: 'Pedro Lima',
          phone: '+258 84 333 4444',
          address: 'Rua do Bagamoyo, 222'
        },
        items: [
          { name: 'Beef Burger', quantity: 2, price: 7.99, notes: '' }
        ],
        total: 15.98,
        readyAt: '14:35',
        driver: {
          name: 'Michael Johnson',
          eta: '5 min'
        }
      }
    ],
    completed: []
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

  const handleAcceptOrder = (order) => {
    alert(`Pedido ${order.orderId} aceito!`);
    setSelectedOrder(null);
  };

  const handleRejectOrder = () => {
    alert(`Pedido ${selectedOrder.orderId} rejeitado!`);
    setShowRejectModal(false);
    setSelectedOrder(null);
  };

  const handleMarkReady = (order) => {
    alert(`Pedido ${order.orderId} marcado como pronto!`);
    setSelectedOrder(null);
  };

  if (selectedOrder) {
    const isNew = selectedTab === 'new';
    const isPreparing = selectedTab === 'preparing';
    const isReady = selectedTab === 'ready';

    return (
      <div className="flex items-center justify-center min-h-screen pb-24 bg-gray-100">
        <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
          <div className="relative w-full h-screen bg-white overflow-y-auto pb-32">
            
            {/* Header */}
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

              {/* Status Badge */}
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
                      style={{ width: `${(selectedOrder.prepTime / selectedOrder.estimatedTime) * 100}%` }}
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
            </div>

            {/* Content */}
            <div className="px-8 -mt-6 mb-6">
              
              {/* Customer Info */}
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
                    <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{selectedOrder.customer.address}</p>
                      <p className="text-xs text-gray-400 mt-1">Endereço de entrega</p>
                    </div>
                  </div>

                  <button className="w-full bg-gray-50 rounded-2xl py-3 flex items-center justify-center space-x-2">
                    <Phone className="w-5 h-5 text-gray-800" />
                    <span className="text-sm font-bold text-gray-800">{selectedOrder.customer.phone}</span>
                  </button>
                </div>
              </div>

              {/* Driver Info (for ready orders) */}
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
                    <button className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center">
                      <Phone className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
                Items do Pedido
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

            {/* Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white px-8 py-6 shadow-2xl">
              {isNew && (
                <div className="space-y-3">
                  <button 
                    onClick={() => handleAcceptOrder(selectedOrder)}
                    className="w-full bg-green-500 text-white font-bold text-base py-5 rounded-3xl shadow-lg"
                  >
                    Aceitar Pedido
                  </button>
                  <button 
                    onClick={() => setShowRejectModal(true)}
                    className="w-full bg-gray-50 text-gray-800 font-bold text-base py-4 rounded-3xl"
                  >
                    Rejeitar
                  </button>
                </div>
              )}

              {isPreparing && (
                <button 
                  onClick={() => handleMarkReady(selectedOrder)}
                  className="w-full bg-green-500 text-white font-bold text-base py-5 rounded-3xl shadow-lg"
                >
                  Marcar como Pronto
                </button>
              )}

              {isReady && (
                <button className="w-full bg-gray-50 text-gray-800 font-bold text-base py-5 rounded-3xl">
                  Aguardando Coleta
                </button>
              )}
            </div>

            {/* Reject Modal */}
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
                      className="flex-1 bg-gray-200 text-gray-800 font-bold py-4 rounded-2xl"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleRejectOrder}
                      className="flex-1 bg-red-500 text-white font-bold py-4 rounded-2xl shadow-lg"
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
          
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 bg-white z-10 px-8 pt-12 pb-4 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <button className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              
              <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'serif' }}>
                Pedidos
              </h1>
              
              <div className="w-14 h-14" />
            </div>

            {/* Tabs */}
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

          {/* Content */}
          <div className="mt-52 px-8">
            
            {orders[selectedTab].length > 0 ? (
              <div className="space-y-4">
                {orders[selectedTab].map((order) => (
                  <div 
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="cursor-pointer"
                  >
                    <div className="bg-gray-50 rounded-3xl overflow-hidden shadow-lg">
                      
                      {/* Header */}
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

                      {/* Body */}
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="text-base font-bold text-gray-800">{order.customer.name}</h3>
                            <p className="text-xs text-gray-400">{order.items.length} items</p>
                          </div>
                          <p className="text-lg font-bold text-gray-800">MT {order.total.toFixed(2)}</p>
                        </div>

                        {/* Items Preview */}
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

                        {/* Progress for preparing orders */}
                        {selectedTab === 'preparing' && order.prepTime && (
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
                                style={{ width: `${(order.prepTime / order.estimatedTime) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Action Hint */}
                        <div className="text-center">
                          <span className="text-xs text-gray-400">Toque para ver detalhes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
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
