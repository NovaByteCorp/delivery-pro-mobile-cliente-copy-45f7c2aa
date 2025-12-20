
import React, { useState } from 'react';
import { ChevronLeft, Home, Star, Heart, ShoppingBag, User, Phone, MessageCircle, MapPin, Clock, CheckCircle } from 'lucide-react';
import BottomNav from '../components/client/BottomNav';

export default function OrderTrackingScreen() {
  const [activeStatus, setActiveStatus] = useState(2);

  const orderStatuses = [
    { id: 0, label: 'Pedido Realizado', time: '14:30', icon: CheckCircle },
    { id: 1, label: 'Preparando', time: '14:35', icon: CheckCircle },
    { id: 2, label: 'A Caminho', time: '14:45', icon: CheckCircle },
    { id: 3, label: 'Entregue', time: '', icon: CheckCircle }
  ];

  const orderItems = [
    { name: 'Beef Burger', quantity: 2 },
    { name: 'French Fries', quantity: 1 },
    { name: 'Chicken Burger', quantity: 3 }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
        <div className="relative w-full h-screen bg-white overflow-y-auto pb-24">
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 bg-white z-10 px-8 pt-12 pb-4 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => window.history.back()}
                className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6 text-[#3c0068]" />
              </button>
              
              <h1 className="text-2xl font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
                Rastrear Pedido
              </h1>
              
              <div className="w-14 h-14" />
            </div>
          </div>

          {/* Content */}
          <div className="mt-32 px-8">
            {/* Map Placeholder */}
            <div className="bg-[#3c0068] rounded-3xl h-64 mb-6 shadow-lg overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-[#ff4700] mx-auto mb-2" />
                  <p className="text-sm text-white">Mapa de rastreamento ao vivo</p>
                </div>
              </div>
              
              {/* Delivery Pin */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-12 bg-[#ff4700] rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                  <span className="text-xl">🛵</span>
                </div>
              </div>

              {/* ETA Badge */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <div className="bg-white rounded-2xl px-6 py-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-[#ff4700]" />
                    <span className="text-sm font-bold text-[#3c0068]">Chega em 12 min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Info */}
            <div className="bg-[#3c0068] rounded-3xl p-5 mb-6 shadow-lg">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-[#4d0083] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">👨‍🍳</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">Michael Johnson</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-[#ff4700] text-[#ff4700]" />
                    <span className="text-sm text-gray-300">4.9</span>
                    <span className="text-sm text-gray-400 ml-2">Parceiro de Entrega</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button className="flex-1 bg-[#ff4700] rounded-2xl py-4 flex items-center justify-center space-x-2 shadow-lg">
                  <Phone className="w-5 h-5 text-white" />
                  <span className="text-sm font-bold text-white">Ligar</span>
                </button>
                <button className="flex-1 bg-[#4d0083] rounded-2xl py-4 flex items-center justify-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-white" />
                  <span className="text-sm font-bold text-white">Mensagem</span>
                </button>
              </div>
            </div>

            {/* Order Status */}
            <h2 className="text-lg font-bold mb-4 text-[#3c0068]" style={{ fontFamily: 'serif' }}>
              Status do Pedido
            </h2>
            
            <div className="bg-gray-50 rounded-3xl p-6 mb-6 shadow-sm">
              <div className="relative">
                {orderStatuses.map((status, idx) => {
                  const StatusIcon = status.icon;
                  const isActive = idx <= activeStatus;
                  const isLast = idx === orderStatuses.length - 1;
                  
                  return (
                    <div key={status.id} className="relative">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isActive ? 'bg-[#ff4700]' : 'bg-gray-200'
                          }`}>
                            <StatusIcon className={`w-5 h-5 ${
                              isActive ? 'text-white' : 'text-gray-400'
                            }`} />
                          </div>
                          
                          {!isLast && (
                            <div className={`absolute top-10 left-5 w-0.5 h-16 ${
                              isActive ? 'bg-[#ff4700]' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                        
                        <div className="flex-1 pb-8">
                          <h3 className={`text-base font-bold ${
                            isActive ? 'text-[#3c0068]' : 'text-gray-400'
                          }`}>
                            {status.label}
                          </h3>
                          {status.time && (
                            <p className="text-sm text-gray-400 mt-1">{status.time}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <h2 className="text-lg font-bold mb-4 text-[#3c0068]" style={{ fontFamily: 'serif' }}>
              Itens do Pedido
            </h2>
            
            <div className="bg-gray-50 rounded-2xl p-5 mb-6">
              <div className="space-y-2">
                {orderItems.map((item, idx) => (
                  <p key={idx} className="text-sm text-[#3c0068]">
                    {item.name} x{item.quantity}
                  </p>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <h2 className="text-lg font-bold mb-4 text-[#3c0068]" style={{ fontFamily: 'serif' }}>
              Endereço de Entrega
            </h2>
            
            <div className="bg-gray-50 rounded-2xl p-5 mb-6 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#3c0068] rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-[#3c0068] mb-1">Casa</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Rua Principal, 123, Ap. 4B, Curitiba, Brasil
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Navigation - Replace the existing one */}
          <BottomNav activePage="Cart" />
        </div>
      </div>
    </div>
  );
}
