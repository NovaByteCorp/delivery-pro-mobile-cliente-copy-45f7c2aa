import React, { useState } from 'react';
import { ChevronLeft, Star, MapPin, Clock, DollarSign, Calendar, Filter, Search } from 'lucide-react';
import BottomNavDriver from '../components/driver/DriverBottomNav';

export default function DriverHistoryScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const deliveries = [
    {
      id: 1,
      orderId: 'ORD-1507',
      date: 'Hoje, 14:45',
      fullDate: '30 Out 2025, 14:45',
      restaurant: {
        name: 'Chillox Burger',
        emoji: '🍔',
        address: 'Av. Julius Nyerere, 123'
      },
      customer: {
        name: 'Maria Silva',
        address: 'Rua da Imprensa, 456, Apt 4B'
      },
      distance: '2.3 km',
      duration: '18 min',
      earnings: 35.00,
      tip: 5.00,
      rating: 5,
      items: ['Beef Burger x2', 'French Fries x1', 'Coca-Cola x2']
    },
    {
      id: 2,
      orderId: 'ORD-1506',
      date: 'Hoje, 14:20',
      fullDate: '30 Out 2025, 14:20',
      restaurant: {
        name: "McDonald's",
        emoji: '🍟',
        address: 'Av. Eduardo Mondlane, 789'
      },
      customer: {
        name: 'João Santos',
        address: 'Av. Marginal, 321'
      },
      distance: '1.8 km',
      duration: '15 min',
      earnings: 28.00,
      tip: 0,
      rating: 5,
      items: ['Big Mac x1', 'McNuggets x1']
    },
    {
      id: 3,
      orderId: 'ORD-1505',
      date: 'Hoje, 13:50',
      fullDate: '30 Out 2025, 13:50',
      restaurant: {
        name: 'Madchef',
        emoji: '🍕',
        address: 'Rua da Resistência, 555'
      },
      customer: {
        name: 'Ana Costa',
        address: 'Av. 24 de Julho, 888'
      },
      distance: '3.5 km',
      duration: '22 min',
      earnings: 42.00,
      tip: 8.00,
      rating: 4,
      items: ['XL Burger x2', 'Onion Rings x1']
    },
    {
      id: 4,
      orderId: 'ORD-1504',
      date: 'Hoje, 13:15',
      fullDate: '30 Out 2025, 13:15',
      restaurant: {
        name: 'Chillox Burger',
        emoji: '🍔',
        address: 'Av. Julius Nyerere, 123'
      },
      customer: {
        name: 'Pedro Lima',
        address: 'Rua do Bagamoyo, 222'
      },
      distance: '2.1 km',
      duration: '16 min',
      earnings: 31.00,
      tip: 3.00,
      rating: 5,
      items: ['Chicken Burger x1', 'French Fries x2']
    },
    {
      id: 5,
      orderId: 'ORD-1498',
      date: 'Ontem, 19:30',
      fullDate: '29 Out 2025, 19:30',
      restaurant: {
        name: "McDonald's",
        emoji: '🍟',
        address: 'Av. Eduardo Mondlane, 789'
      },
      customer: {
        name: 'Carlos Mendes',
        address: 'Av. Mao Tse Tung, 444'
      },
      distance: '4.2 km',
      duration: '28 min',
      earnings: 48.00,
      tip: 10.00,
      rating: 5,
      items: ['Quarter Pounder x2', 'Large Fries x2', 'Milkshake x2']
    }
  ];

  const stats = {
    all: { count: deliveries.length, total: deliveries.reduce((sum, d) => sum + d.earnings + d.tip, 0) },
    today: { count: 4, total: 144.00 },
    week: { count: 68, total: 2850.00 },
    month: { count: 285, total: 11400.00 }
  };

  const filteredDeliveries = selectedFilter === 'all' 
    ? deliveries 
    : selectedFilter === 'today' 
      ? deliveries.filter(d => d.date.includes('Hoje'))
      : deliveries;

  if (selectedDelivery) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
          <div className="relative w-full h-screen bg-white overflow-y-auto pb-24">
            
            {/* Header */}
            <div className="bg-gray-800 px-8 pt-12 pb-8 rounded-b-3xl">
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={() => setSelectedDelivery(null)}
                  className="w-14 h-14 bg-gray-700 rounded-2xl flex items-center justify-center"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                
                <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'serif' }}>
                  Detalhes da Entrega
                </h1>
                
                <div className="w-14 h-14" />
              </div>

              {/* Order ID */}
              <div className="bg-gray-700 rounded-2xl px-4 py-3 text-center">
                <p className="text-xs text-gray-400 mb-1">Pedido</p>
                <p className="text-lg font-bold text-white">#{selectedDelivery.orderId}</p>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 -mt-6 mb-6">
              
              {/* Earnings Card */}
              <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">Ganho Total</p>
                  <p className="text-4xl font-bold text-green-500 mb-1" style={{ fontFamily: 'serif' }}>
                    MT {(selectedDelivery.earnings + selectedDelivery.tip).toFixed(2)}
                  </p>
                  <div className="flex justify-center space-x-4 mt-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Base</p>
                      <p className="text-sm font-bold text-gray-800">MT {selectedDelivery.earnings.toFixed(2)}</p>
                    </div>
                    {selectedDelivery.tip > 0 && (
                      <>
                        <div className="w-px h-10 bg-gray-200" />
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Gorjeta</p>
                          <p className="text-sm font-bold text-green-500">MT {selectedDelivery.tip.toFixed(2)}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
                Avaliação do Cliente
              </h2>
              
              <div className="bg-gray-50 rounded-3xl p-6 mb-6 shadow-sm text-center">
                <div className="flex justify-center space-x-1 mb-2">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-8 h-8 ${
                        idx < selectedDelivery.rating
                          ? 'fill-orange-500 text-orange-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-2xl font-bold text-gray-800">{selectedDelivery.rating}.0</p>
              </div>

              {/* Restaurant */}
              <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
                Restaurante
              </h2>
              
              <div className="bg-gray-800 rounded-3xl p-5 mb-6 shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gray-700 rounded-xl flex items-center justify-center">
                    <span className="text-3xl">{selectedDelivery.restaurant.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">{selectedDelivery.restaurant.name}</h3>
                    <p className="text-sm text-gray-400">{selectedDelivery.restaurant.address}</p>
                  </div>
                </div>
              </div>

              {/* Customer */}
              <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
                Cliente
              </h2>
              
              <div className="bg-gray-50 rounded-3xl p-5 mb-6 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-800 mb-1">{selectedDelivery.customer.name}</h3>
                    <p className="text-sm text-gray-600">{selectedDelivery.customer.address}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
                Items Entregues
              </h2>
              
              <div className="bg-gray-50 rounded-3xl p-5 mb-6 shadow-sm">
                <div className="space-y-2">
                  {selectedDelivery.items.map((item, idx) => (
                    <p key={idx} className="text-sm text-gray-800">{item}</p>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                  <MapPin className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-400 mb-1">Distância</p>
                  <p className="text-base font-bold text-gray-800">{selectedDelivery.distance}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                  <Clock className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-400 mb-1">Duração</p>
                  <p className="text-base font-bold text-gray-800">{selectedDelivery.duration}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                  <Calendar className="w-5 h-5 text-gray-800 mx-auto mb-2" />
                  <p className="text-xs text-gray-400 mb-1">Data</p>
                  <p className="text-xs font-bold text-gray-800">{selectedDelivery.date}</p>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* FUTURO: BottomNavDriver */}
      {<BottomNavDriver activePage="DriverHistory" /> }
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
                Histórico
              </h1>
              
              <button className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                <Filter className="w-6 h-6 text-gray-800" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative bg-gray-50 rounded-2xl px-4 py-3 flex items-center mb-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar por pedido ou restaurante" 
                className="bg-transparent w-full pl-3 text-sm text-gray-800 outline-none placeholder-gray-400"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-3 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`flex-shrink-0 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                  selectedFilter === 'all'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-gray-50 text-gray-800'
                }`}
              >
                Todas ({stats.all.count})
              </button>
              <button
                onClick={() => setSelectedFilter('today')}
                className={`flex-shrink-0 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                  selectedFilter === 'today'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-gray-50 text-gray-800'
                }`}
              >
                Hoje ({stats.today.count})
              </button>
              <button
                onClick={() => setSelectedFilter('week')}
                className={`flex-shrink-0 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                  selectedFilter === 'week'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-gray-50 text-gray-800'
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setSelectedFilter('month')}
                className={`flex-shrink-0 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                  selectedFilter === 'month'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-gray-50 text-gray-800'
                }`}
              >
                Mês
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="mt-72 px-8">
            
            {/* Summary Card */}
            <div className="bg-gray-800 rounded-3xl p-6 mb-6 shadow-lg">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">Total do Período</p>
                <p className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'serif' }}>
                  MT {stats[selectedFilter].total.toFixed(2)}
                </p>
                <p className="text-sm text-gray-400">{stats[selectedFilter].count} entregas completadas</p>
              </div>
            </div>

            {/* Deliveries List */}
            <div className="space-y-4">
              {filteredDeliveries.map((delivery) => (
                <div 
                  key={delivery.id}
                  onClick={() => setSelectedDelivery(delivery)}
                  className="bg-gray-50 rounded-3xl p-5 shadow-sm cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                        <span className="text-xl">{delivery.restaurant.emoji}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-800">{delivery.restaurant.name}</h3>
                        <p className="text-xs text-gray-400">#{delivery.orderId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-gray-800">MT {(delivery.earnings + delivery.tip).toFixed(2)}</p>
                      {delivery.tip > 0 && (
                        <p className="text-xs font-bold text-green-500">+{delivery.tip.toFixed(2)} gorjeta</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-3 mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{delivery.date}</span>
                      <span>{delivery.distance}</span>
                      <span>{delivery.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
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
                    <span className="text-xs text-gray-400">{delivery.customer.name}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        {/* FUTURO: BottomNavDriver */}
        {<BottomNavDriver activePage="DriverHistory" /> } 

        </div>
      </div>     
    </div>
  );
}