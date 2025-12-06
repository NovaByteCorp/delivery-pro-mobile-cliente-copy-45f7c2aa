import React, { useState } from 'react';
import { Bell, Settings, DollarSign, Package, Clock, TrendingUp, Star, AlertCircle, ChevronRight } from 'lucide-react';
import BottomNavRO from '../components/restaurants/ROBottomNav';

export default function RestaurantOwnerDashboard() {
  const [isOpen, setIsOpen] = useState(true);

  const todayStats = {
    revenue: 4850.00,
    orders: 47,
    avgTicket: 103.19,
    rating: 4.8,
    prepTime: 22
  };

  const pendingOrders = [
    {
      id: 1,
      orderId: 'ORD-1507',
      customer: 'Maria Silva',
      items: 3,
      total: 135.00,
      time: '2 min atrás',
      status: 'new'
    },
    {
      id: 2,
      orderId: 'ORD-1508',
      customer: 'João Santos',
      items: 2,
      total: 98.00,
      time: '5 min atrás',
      status: 'new'
    }
  ];

  const preparingOrders = [
    {
      id: 3,
      orderId: 'ORD-1506',
      customer: 'Ana Costa',
      items: 4,
      total: 187.50,
      timeElapsed: 12,
      estimatedTime: 20
    },
    {
      id: 4,
      orderId: 'ORD-1505',
      customer: 'Pedro Lima',
      items: 2,
      total: 76.00,
      timeElapsed: 8,
      estimatedTime: 15
    }
  ];

  const topProducts = [
    { name: 'Beef Burger', sales: 23, revenue: 551.70 },
    { name: 'XL Burger', sales: 18, revenue: 594.00 },
    { name: 'French Fries', sales: 31, revenue: 309.00 }
  ];

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
                  Chillox Burger
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <button className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center relative">
                  <Bell className="w-6 h-6 text-white" />
                  <span className="absolute top-1 right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-gray-800"></span>
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
                onClick={() => setIsOpen(!isOpen)}
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
                  <p className="text-2xl font-bold text-gray-800">{todayStats.rating}</p>
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
              <div className="bg-orange-500 rounded-3xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-6 h-6 text-white" />
                    <h3 className="text-lg font-bold text-white">Pedidos Pendentes</h3>
                  </div>
                  <span className="text-2xl font-bold text-white">{pendingOrders.length}</span>
                </div>
                <p className="text-sm text-orange-100 mb-4">Aguardando sua confirmação</p>
                <button className="w-full bg-white text-orange-500 font-bold py-3 rounded-2xl">
                  Ver Pedidos
                </button>
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
                <button className="text-sm font-bold text-orange-500">Ver Todos</button>
              </div>

              <div className="space-y-3">
                {preparingOrders.map((order) => (
                  <div key={order.id} className="bg-gray-50 rounded-3xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-base font-bold text-gray-800">#{order.orderId}</h3>
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
                          style={{ width: `${(order.timeElapsed / order.estimatedTime) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <button className="w-full bg-orange-500 text-white font-bold py-3 rounded-2xl">
                      Marcar como Pronto
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Products */}
          <div className="px-8 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'serif' }}>
              Produtos Mais Vendidos
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

          {/* Quick Actions */}
          <div className="px-8 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'serif' }}>
              Ações Rápidas
            </h2>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-gray-50 rounded-2xl p-5 flex flex-col items-center justify-center space-y-2 shadow-sm">
                <Package className="w-8 h-8 text-gray-800" />
                <span className="text-sm font-bold text-gray-800">Cardápio</span>
              </button>
              <button className="bg-gray-50 rounded-2xl p-5 flex flex-col items-center justify-center space-y-2 shadow-sm">
                <DollarSign className="w-8 h-8 text-gray-800" />
                <span className="text-sm font-bold text-gray-800">Financeiro</span>
              </button>
              <button className="bg-gray-50 rounded-2xl p-5 flex flex-col items-center justify-center space-y-2 shadow-sm">
                <Star className="w-8 h-8 text-gray-800" />
                <span className="text-sm font-bold text-gray-800">Avaliações</span>
              </button>
              <button className="bg-gray-50 rounded-2xl p-5 flex flex-col items-center justify-center space-y-2 shadow-sm">
                <TrendingUp className="w-8 h-8 text-gray-800" />
                <span className="text-sm font-bold text-gray-800">Relatórios</span>
              </button>
            </div>
          </div>

        </div>
      </div>
      <BottomNavRO activePage="RestaurantOwnerDashboard" />
    </div>
  );
}
