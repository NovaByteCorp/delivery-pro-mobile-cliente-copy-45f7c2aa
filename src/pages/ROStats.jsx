import React, { useState } from 'react';
import { ChevronLeft, TrendingUp, TrendingDown, DollarSign, Package, Clock, Star, Users, Calendar, Settings } from 'lucide-react';
import BottomNavRO from '../components/restaurants/ROBottomNav';

export default function RestaurantOwnerStats() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const stats = {
    today: {
      revenue: 4850.00,
      orders: 47,
      avgTicket: 103.19,
      rating: 4.8,
      prepTime: 22,
      acceptanceRate: 95,
      growthRevenue: 12,
      growthOrders: 8
    },
    week: {
      revenue: 28500.00,
      orders: 324,
      avgTicket: 87.96,
      rating: 4.7,
      prepTime: 24,
      acceptanceRate: 92,
      growthRevenue: 15,
      growthOrders: 11
    },
    month: {
      revenue: 115400.00,
      orders: 1289,
      avgTicket: 89.53,
      rating: 4.8,
      prepTime: 23,
      acceptanceRate: 94,
      growthRevenue: 18,
      growthOrders: 14
    }
  };

  const topProducts = [
    { name: 'Beef Burger', sales: 234, revenue: 1869.66, growth: 12 },
    { name: 'French Fries', sales: 423, revenue: 1687.77, growth: 8 },
    { name: 'XL Burger', sales: 156, revenue: 1716.00, growth: 15 },
    { name: 'Chicken Burger', sales: 198, revenue: 988.02, growth: -3 },
    { name: 'Coca-Cola', sales: 389, revenue: 972.50, growth: 5 }
  ];

  const peakHours = [
    { hour: '12:00', orders: 45, percentage: 85 },
    { hour: '13:00', orders: 52, percentage: 100 },
    { hour: '19:00', orders: 48, percentage: 92 },
    { hour: '20:00', orders: 41, percentage: 78 }
  ];

  const weekDays = [
    { day: 'Seg', orders: 42, revenue: 3680 },
    { day: 'Ter', orders: 38, revenue: 3420 },
    { day: 'Qua', orders: 45, revenue: 3950 },
    { day: 'Qui', orders: 51, revenue: 4480 },
    { day: 'Sex', orders: 68, revenue: 5950 },
    { day: 'Sáb', orders: 54, revenue: 4730 },
    { day: 'Dom', orders: 26, revenue: 2290 }
  ];

  const currentStats = stats[selectedPeriod];
  const maxOrders = Math.max(...weekDays.map(d => d.orders));

  return (
    <div className="flex items-center justify-center min-h-screen pb-20 bg-gray-100">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
        <div className="relative w-full h-screen bg-white overflow-y-auto pb-8">
          
          {/* Header */}
          <div className="bg-gray-800 px-8 pt-12 pb-20 rounded-b-3xl">
            <div className="flex items-center justify-between mb-8">
              <button className="w-14 h-14 bg-gray-700 rounded-2xl flex items-center justify-center">
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'serif' }}>
                Estatísticas
              </h1>
              
              <button className="w-14 h-14 bg-gray-700 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
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

          {/* Main Stats - Overlapping */}
          <div className="relative px-8 -mt-12 mb-6">
            <div className="bg-white rounded-3xl p-6 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                
                {/* Revenue */}
                <div className="bg-green-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs font-bold text-green-500">+{currentStats.growthRevenue}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">Faturamento</p>
                  <p className="text-xl font-bold text-gray-800">MT {currentStats.revenue.toFixed(2)}</p>
                </div>

                {/* Orders */}
                <div className="bg-orange-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Package className="w-5 h-5 text-orange-500" />
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs font-bold text-green-500">+{currentStats.growthOrders}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">Pedidos</p>
                  <p className="text-xl font-bold text-gray-800">{currentStats.orders}</p>
                </div>

                {/* Avg Ticket */}
                <div className="bg-blue-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-xs text-gray-400 mb-1">Ticket Médio</p>
                  <p className="text-xl font-bold text-gray-800">MT {currentStats.avgTicket.toFixed(2)}</p>
                </div>

                {/* Rating */}
                <div className="bg-orange-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                  </div>
                  <p className="text-xs text-gray-400 mb-1">Avaliação</p>
                  <p className="text-xl font-bold text-gray-800">{currentStats.rating}</p>
                </div>

              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="px-8 mb-6">
            <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
              Performance
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4">
                <Clock className="w-5 h-5 text-blue-500 mb-2" />
                <p className="text-xs text-gray-400 mb-1">Tempo Médio</p>
                <p className="text-2xl font-bold text-gray-800">{currentStats.prepTime} min</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <Users className="w-5 h-5 text-green-500 mb-2" />
                <p className="text-xs text-gray-400 mb-1">Taxa de Aceitação</p>
                <p className="text-2xl font-bold text-gray-800">{currentStats.acceptanceRate}%</p>
              </div>
            </div>
          </div>

          {/* Week Chart */}
          {selectedPeriod === 'week' && (
            <div className="px-8 mb-6">
              <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
                Pedidos por Dia
              </h2>
              
              <div className="bg-gray-50 rounded-3xl p-6 shadow-sm">
                <div className="flex items-end justify-between space-x-2 h-40">
                  {weekDays.map((day, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex flex-col justify-end flex-1 mb-2">
                        <div 
                          className="w-full bg-orange-500 rounded-t-xl transition-all"
                          style={{ height: `${(day.orders / maxOrders) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs font-bold text-gray-800 mb-1">{day.orders}</p>
                      <p className="text-xs text-gray-400">{day.day}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Peak Hours */}
          <div className="px-8 mb-6">
            <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
              Horários de Pico
            </h2>
            
            <div className="bg-gray-800 rounded-3xl p-5 shadow-lg">
              <div className="space-y-4">
                {peakHours.map((hour, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-white">{hour.hour}</span>
                      <span className="text-sm font-bold text-orange-500">{hour.orders} pedidos</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all"
                        style={{ width: `${hour.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="px-8 mb-6">
            <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
              Produtos Mais Vendidos
            </h2>
            
            <div className="space-y-3">
              {topProducts.map((product, idx) => (
                <div key={idx} className="bg-gray-50 rounded-3xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold">{idx + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-800">{product.name}</h3>
                        <p className="text-xs text-gray-400">{product.sales} vendas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-gray-800">MT {product.revenue.toFixed(2)}</p>
                      <div className="flex items-center justify-end space-x-1 mt-1">
                        {product.growth > 0 ? (
                          <>
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-xs font-bold text-green-500">+{product.growth}%</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-3 h-3 text-red-500" />
                            <span className="text-xs font-bold text-red-500">{product.growth}%</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sales Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all"
                      style={{ width: `${(product.sales / 450) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by Day (Week view) */}
          {selectedPeriod === 'week' && (
            <div className="px-8 mb-6">
              <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
                Faturamento por Dia
              </h2>
              
              <div className="bg-gray-50 rounded-3xl p-5 shadow-sm space-y-3">
                {weekDays.map((day, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-800 w-12">{day.day}</span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${(day.revenue / 6000) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-green-500 w-24 text-right">
                      MT {day.revenue.toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      <BottomNavRO activePage="RestaurantOwnerStats" />
    </div>
  );
}