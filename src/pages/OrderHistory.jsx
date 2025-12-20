
import React, { useState } from 'react';
import { ChevronLeft, Home, Star, Heart, ShoppingBag, User, Clock, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import BottomNav from '../components/client/BottomNav'; // Added import for BottomNav

export default function OrderHistoryScreen() {
  const [activeTab, setActiveTab] = useState('all');

  const orders = [
    {
      id: 'ORD-2024-1507',
      restaurant: 'Chillox Burger',
      restaurantEmoji: '🍔',
      items: ['Beef Burger x2', 'French Fries x1', 'Chicken Burger x3'],
      total: 36.55,
      date: 'Oct 14, 2025',
      time: '2:30 PM',
      status: 'completed',
      rating: 4.8
    },
    {
      id: 'ORD-2024-1498',
      restaurant: "McDonald's",
      restaurantEmoji: '🍟',
      items: ['Big Mac x1', 'Large Fries x2', 'Cola x2'],
      total: 24.99,
      date: 'Oct 12, 2025',
      time: '7:15 PM',
      status: 'completed',
      rating: 4.5
    },
    {
      id: 'ORD-2024-1489',
      restaurant: 'Madchef',
      restaurantEmoji: '🍕',
      items: ['XL Burger x2', 'Onion Rings x1'],
      total: 28.50,
      date: 'Oct 10, 2025',
      time: '1:45 PM',
      status: 'completed',
      rating: 4.9
    },
    {
      id: 'ORD-2024-1475',
      restaurant: 'Chillox Burger',
      restaurantEmoji: '🍔',
      items: ['Chicken Burger x1', 'Naga Drums x1'],
      total: 14.98,
      date: 'Oct 8, 2025',
      time: '8:30 PM',
      status: 'cancelled',
      rating: null
    },
    {
      id: 'ORD-2024-1460',
      restaurant: "McDonald's",
      restaurantEmoji: '🍟',
      items: ['Quarter Pounder x2', 'McNuggets x1'],
      total: 31.20,
      date: 'Oct 5, 2025',
      time: '6:00 PM',
      status: 'completed',
      rating: 4.7
    }
  ];

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
    return 'text-[#ff4700]'; // Updated to primary color
  };

  const getStatusBg = (status) => {
    if (status === 'completed') return 'bg-green-50';
    if (status === 'cancelled') return 'bg-red-50';
    return 'bg-orange-50'; // Kept as orange-50 for a lighter background for pending
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
        <div className="relative w-full h-screen bg-white overflow-y-auto pb-24">
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 bg-white z-10 px-8 pt-12 pb-4">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => window.history.back()}
                className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6 text-[#3c0068]" />
              </button>
              
              <h1 className="text-2xl font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
                Histórico de Pedidos
              </h1>
              
              <div className="w-14 h-14" />
            </div>

            {/* Tabs */}
            <div className="flex space-x-3">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 rounded-2xl px-4 py-4 text-sm font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-[#ff4700] text-white shadow-lg' // Updated to primary color
                    : 'bg-gray-50 text-[#3c0068]'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`flex-1 rounded-2xl px-4 py-4 text-sm font-bold transition-all ${
                  activeTab === 'completed'
                    ? 'bg-[#ff4700] text-white shadow-lg' // Updated to primary color
                    : 'bg-gray-50 text-[#3c0068]'
                }`}
              >
                Concluídos
              </button>
              <button
                onClick={() => setActiveTab('cancelled')}
                className={`flex-1 rounded-2xl px-4 py-4 text-sm font-bold transition-all ${
                  activeTab === 'cancelled'
                    ? 'bg-[#ff4700] text-white shadow-lg' // Updated to primary color
                    : 'bg-gray-50 text-[#3c0068]'
                }`}
              >
                Cancelados
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
                    <div key={order.id} className="bg-gray-50 rounded-3xl p-5 shadow-sm">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-[#3c0068] rounded-xl flex items-center justify-center"> {/* Updated to secondary color */}
                            <span className="text-2xl">{order.restaurantEmoji}</span>
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-[#3c0068]">{order.restaurant}</h3>
                            <p className="text-xs text-gray-400">{order.date} • {order.time}</p>
                          </div>
                        </div>
                        
                        <div className={`${getStatusBg(order.status)} rounded-xl px-3 py-2 flex items-center space-x-1`}>
                          <StatusIcon className={`w-4 h-4 ${getStatusColor(order.status)}`} />
                        </div>
                      </div>

                      {/* Items */}
                      <div className="bg-white rounded-2xl p-4 mb-4">
                        <p className="text-xs text-gray-400 mb-2">Pedido #{order.id}</p>
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <p key={idx} className="text-sm text-[#3c0068]">{item}</p>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Valor Total</p>
                          <p className="text-lg font-bold text-[#3c0068]">${order.total.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          {order.status === 'completed' && (
                            <>
                              <button className="bg-[#ff4700] rounded-2xl px-5 py-3 flex items-center space-x-2 shadow-lg"> {/* Updated to primary color */}
                                <RotateCcw className="w-4 h-4 text-white" />
                                <span className="text-sm font-bold text-white">Reordenar</span>
                              </button>
                              {order.rating && (
                                <button className="bg-[#3c0068] rounded-2xl px-4 py-3 flex items-center space-x-1"> {/* Updated to secondary color */}
                                  <Star className="w-4 h-4 fill-[#ff4700] text-[#ff4700]" /> {/* Updated to primary color */}
                                  <span className="text-sm font-bold text-white">{order.rating}</span>
                                </button>
                              )}
                            </>
                          )}
                          
                          {order.status === 'cancelled' && (
                            <button className="bg-[#3c0068] rounded-2xl px-5 py-3"> {/* Updated to secondary color */}
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
                <h2 className="text-2xl font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
                  Nenhum Pedido Ainda
                </h2>
                <p className="text-sm text-gray-400 text-center mb-8">
                  Você não fez nenhum pedido nesta categoria
                </p>
                <button className="bg-[#ff4700] text-white font-bold px-8 py-4 rounded-2xl shadow-lg"> {/* Updated to primary color */}
                  Explorar Menu
                </button>
              </div>
            )}
          </div>

          {/* Bottom Navigation - Replaced with BottomNav component */}
          <BottomNav activePage="MyOrders" />
        </div>
      </div>
    </div>
  );
}
