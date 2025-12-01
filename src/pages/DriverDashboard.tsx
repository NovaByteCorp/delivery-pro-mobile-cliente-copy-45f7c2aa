import React, { useState } from 'react';
import { 
  MapPin, DollarSign, Clock, Star, Package, Navigation, Bell 
} from 'lucide-react';

import BottomNavDriver from '../components/driver/DriverBottomNav';

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(true);

  const todayStats = {
    deliveries: 12,
    earnings: 450.50,
    hours: 6.5,
    rating: 4.9
  };

  const availableOrders = [
    {
      id: 1,
      restaurant: 'Chillox Burger',
      restaurantEmoji: '🍔',
      pickupAddress: 'Av. Julius Nyerere, 123',
      deliveryAddress: 'Rua da Imprensa, 456',
      distance: '2.3 km',
      estimatedTime: '15 min',
      payment: 35.00,
      items: 3
    },
    {
      id: 2,
      restaurant: "McDonald's",
      restaurantEmoji: '🍟',
      pickupAddress: 'Av. Eduardo Mondlane, 789',
      deliveryAddress: 'Av. Marginal, 321',
      distance: '4.1 km',
      estimatedTime: '25 min',
      payment: 52.00,
      items: 5
    }
  ];

  const activeDeliveries = [
    {
      id: 3,
      restaurant: 'Madchef',
      restaurantEmoji: '🍕',
      customerName: 'Maria Silva',
      deliveryAddress: 'Av. Julius Nyerere, 555',
      status: 'picked_up',
      estimatedTime: '8 min'
    }
  ];

  return (
    <div className="relative w-full min-h-screen bg-white overflow-y-auto pb-24 no-scrollbar">

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* HEADER FIXO */}
      <div className="bg-gray-800 px-8 pt-24 pb-10 rounded-b-3xl fixed top-0 left-0 right-0 z-10 shadow-xl">
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-400 mb-1">Welcome back,</p>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'serif' }}>
              Michael Johnson
            </h1>
          </div>

          <button className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center relative">
            <Bell className="w-6 h-6 text-white" />
            <span className="absolute top-1 right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-gray-800"></span>
          </button>
        </div>

        {/* Online/Offline Toggle */}
        <div className="bg-gray-700 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
            <span className="text-base font-bold text-white">
              {isOnline ? 'You are Online' : 'You are Offline'}
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
      <div className="mt-[350px] px-8">

        {/* Today's Stats */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'serif' }}>
              Today's Summary
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mb-3">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs text-gray-400 mb-1">Deliveries</p>
                <p className="text-2xl font-bold text-gray-800">{todayStats.deliveries}</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mb-3">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs text-gray-400 mb-1">Earnings</p>
                <p className="text-2xl font-bold text-gray-800">MT {todayStats.earnings}</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs text-gray-400 mb-1">Online Time</p>
                <p className="text-2xl font-bold text-gray-800">{todayStats.hours}h</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mb-3">
                  <Star className="w-5 h-5 text-white fill-white" />
                </div>
                <p className="text-xs text-gray-400 mb-1">Rating</p>
                <p className="text-2xl font-bold text-gray-800">{todayStats.rating}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Deliveries */}
        {activeDeliveries.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'serif' }}>
                Active Delivery
              </h2>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-lg">
                In Progress
              </button>
            </div>

            {activeDeliveries.map((delivery) => (
              <div key={delivery.id} className="bg-gray-800 rounded-3xl p-5 shadow-lg mb-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 bg-gray-700 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">{delivery.restaurantEmoji}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-white mb-1">{delivery.restaurant}</h3>
                    <p className="text-sm text-gray-400">Delivering to {delivery.customerName}</p>
                  </div>
                </div>

                <div className="bg-gray-700 rounded-2xl p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">Delivery Address</p>
                      <p className="text-sm text-white">{delivery.deliveryAddress}</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-orange-500 rounded-2xl py-3 flex items-center justify-center space-x-2">
                    <Navigation className="w-5 h-5 text-white" />
                    <span className="text-sm font-bold text-white">Navigate</span>
                  </button>
                  <button className="flex-1 bg-gray-700 rounded-2xl py-3 flex items-center justify-center space-x-2">
                    <span className="text-sm font-bold text-white">Mark Delivered</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Available Orders */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'serif' }}>
            Available Orders
          </h2>

          <div className="space-y-4">
            {availableOrders.map((order) => (
              <div key={order.id} className="bg-gray-50 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">{order.restaurantEmoji}</span>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-800">{order.restaurant}</h3>
                        <p className="text-xs text-gray-400">{order.items} items</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-500">MT {order.payment}</p>
                      <p className="text-xs text-gray-400">{order.distance}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 mb-4 space-y-2">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">P</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400">Pickup</p>
                        <p className="text-sm text-gray-800 font-medium">{order.pickupAddress}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">D</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400">Delivery</p>
                        <p className="text-sm text-gray-800 font-medium">{order.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{order.estimatedTime}</span>
                    </div>

                    <button className="bg-orange-500 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg">
                      Accept Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* FUTURO: BottomNavDriver */}
      {<BottomNavDriver activePage="DriverDashboard" /> }

    </div>
  );
}
