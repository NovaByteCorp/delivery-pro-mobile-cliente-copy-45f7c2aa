import React, { useState } from 'react';
import { ChevronLeft, DollarSign, TrendingUp, Calendar, Download, ChevronRight, Package, Clock, Star } from 'lucide-react';

export default function DriverEarningsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const earnings = {
    today: {
      total: 450.50,
      deliveries: 12,
      hours: 6.5,
      tips: 45.00,
      base: 405.50
    },
    week: {
      total: 2850.00,
      deliveries: 68,
      hours: 42,
      tips: 285.00,
      base: 2565.00
    },
    month: {
      total: 11400.00,
      deliveries: 285,
      hours: 178,
      tips: 1140.00,
      base: 10260.00
    }
  };

  const recentDeliveries = [
    {
      id: 1,
      orderId: 'ORD-1507',
      restaurant: 'Chillox Burger',
      emoji: '🍔',
      date: 'Hoje, 14:45',
      amount: 35.00,
      tip: 5.00,
      distance: '2.3 km',
      rating: 5
    },
    {
      id: 2,
      orderId: 'ORD-1506',
      restaurant: "McDonald's",
      emoji: '🍟',
      date: 'Hoje, 14:20',
      amount: 28.00,
      tip: 0,
      distance: '1.8 km',
      rating: 5
    },
    {
      id: 3,
      orderId: 'ORD-1505',
      restaurant: 'Madchef',
      emoji: '🍕',
      date: 'Hoje, 13:50',
      amount: 42.00,
      tip: 8.00,
      distance: '3.5 km',
      rating: 4
    },
    {
      id: 4,
      orderId: 'ORD-1504',
      restaurant: 'Chillox Burger',
      emoji: '🍔',
      date: 'Hoje, 13:15',
      amount: 31.00,
      tip: 3.00,
      distance: '2.1 km',
      rating: 5
    }
  ];

  const currentEarnings = earnings[selectedPeriod];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
        <div className="relative w-full h-screen bg-white overflow-y-auto pb-8">
          
          {/* Header */}
          <div className="bg-gray-800 px-8 pt-12 pb-32 rounded-b-3xl">
            <div className="flex items-center justify-between mb-8">
              <button className="w-14 h-14 bg-gray-700 rounded-2xl flex items-center justify-center">
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'serif' }}>
                Meus Ganhos
              </h1>
              
              <button className="w-14 h-14 bg-gray-700 rounded-2xl flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Period Selector */}
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedPeriod('today')}
                className={`flex-1 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                  selectedPeriod === 'today'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                Hoje
              </button>
              <button
                onClick={() => setSelectedPeriod('week')}
                className={`flex-1 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                  selectedPeriod === 'week'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setSelectedPeriod('month')}
                className={`flex-1 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                  selectedPeriod === 'month'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                Mês
              </button>
            </div>
          </div>

          {/* Total Card - Overlapping */}
          <div className="relative px-8 -mt-20 mb-6">
            <div className="bg-white rounded-3xl p-6 shadow-2xl">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-400 mb-2">Total Ganho</p>
                <h2 className="text-5xl font-bold text-gray-800 mb-1" style={{ fontFamily: 'serif' }}>
                  MT {currentEarnings.total.toFixed(2)}
                </h2>
                <div className="flex items-center justify-center space-x-2 text-green-500">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-bold">+12% vs período anterior</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-2xl p-3 text-center">
                  <Package className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800 mb-1">{currentEarnings.deliveries}</p>
                  <p className="text-xs text-gray-400">Entregas</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-3 text-center">
                  <Clock className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800 mb-1">{currentEarnings.hours}h</p>
                  <p className="text-xs text-gray-400">Online</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-3 text-center">
                  <DollarSign className="w-5 h-5 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800 mb-1">{(currentEarnings.total / currentEarnings.deliveries).toFixed(0)}</p>
                  <p className="text-xs text-gray-400">Média</p>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="px-8 mb-6">
            <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
              Detalhamento
            </h2>
            
            <div className="bg-gray-50 rounded-3xl p-5 shadow-sm">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-bold text-gray-800">Entregas Base</span>
                  </div>
                  <span className="text-base font-bold text-gray-800">MT {currentEarnings.base.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-bold text-gray-800">Gorjetas</span>
                  </div>
                  <span className="text-base font-bold text-green-500">+MT {currentEarnings.tips.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-gray-800">MT {currentEarnings.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Withdraw Button */}
          <div className="px-8 mb-6">
            <button className="w-full bg-orange-500 text-white font-bold text-base py-5 rounded-3xl shadow-lg flex items-center justify-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Solicitar Saque</span>
            </button>
          </div>

          {/* Recent Deliveries */}
          <div className="px-8 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'serif' }}>
                Entregas Recentes
              </h2>
              <button className="text-sm font-bold text-orange-500">Ver Tudo</button>
            </div>

            <div className="space-y-3">
              {recentDeliveries.map((delivery) => (
                <div key={delivery.id} className="bg-gray-50 rounded-3xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                        <span className="text-xl">{delivery.emoji}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-800">{delivery.restaurant}</h3>
                        <p className="text-xs text-gray-400">#{delivery.orderId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-gray-800">MT {delivery.amount.toFixed(2)}</p>
                      {delivery.tip > 0 && (
                        <p className="text-xs font-bold text-green-500">+MT {delivery.tip.toFixed(2)} gorjeta</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-white rounded-2xl px-4 py-2">
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-gray-400">{delivery.date}</span>
                      <span className="text-xs text-gray-400">{delivery.distance}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-3 h-3 ${
                            idx < delivery.rating
                              ? 'fill-orange-500 text-orange-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="px-8 mb-6">
            <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
              Método de Recebimento
            </h2>
            
            <button className="w-full bg-gray-50 rounded-3xl p-5 shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🏦</span>
                </div>
                <div className="text-left">
                  <h3 className="text-base font-bold text-gray-800">Banco BCI</h3>
                  <p className="text-sm text-gray-400">•••• •••• •••• 4567</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}