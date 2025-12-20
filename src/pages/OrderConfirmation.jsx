import React from 'react';
import { CheckCircle, Star, MapPin, Clock, Phone } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function OrderConfirmationScreen() {
  const navigate = (url) => {
    window.location.href = url;
  };

  const order = {
    id: 20241507,
    items: [
      { name: 'Beef Burger', quantity: 2, price: 7.99 },
      { name: 'French Fries', quantity: 1, price: 3.99 },
      { name: 'Chicken Burger', quantity: 3, price: 4.99 }
    ],
    subtotal: 30.95,
    deliveryFee: 2.50,
    tax: 3.10,
    total: 36.55,
    deliveryAddress: 'Av. Julius Nyerere, 123, Sommerschield, Maputo',
    restaurant: {
      name: 'Chillox Burger',
      rating: 4.8,
      type: 'Fast Food'
    },
    estimatedTime: '30-45'
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
        <div className="relative w-full h-screen bg-white overflow-y-auto pb-40">
          
          {/* Header Image with Success Icon */}
          <div className="relative h-72 bg-[#3c0068]">
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            
            {/* Success Icon Centered */}
            <div className="absolute inset-0 flex justify-center" style={{ top: '40%', transform: 'translateY(-40%)' }}>
              <div className="w-32 h-32 bg-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                <CheckCircle className="w-20 h-20 text-white" strokeWidth={3} />
              </div>
            </div>
          </div>

          {/* Order Info Card - Overlapping */}
          <div className="relative px-8 -mt-24">
            <div className="bg-gray-50 rounded-3xl p-6 shadow-lg">
              
              <div className="mt-8">
                <h1 className="text-3xl font-bold text-[#3c0068] text-center mb-2" style={{ fontFamily: 'serif' }}>
                  Pedido Confirmado!
                </h1>
                
                <p className="text-sm text-gray-400 text-center mb-4">
                  Seu pedido foi realizado com sucesso
                </p>

                {/* Order Number */}
                <div className="bg-white rounded-2xl px-6 py-4 text-center mb-4">
                  <p className="text-xs text-gray-400 mb-1">Número do Pedido</p>
                  <p className="text-2xl font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
                    #{order.id.toString().slice(-6)}
                  </p>
                </div>
                
                <div className="flex justify-center space-x-3">
                  <div className="bg-white rounded-2xl px-4 py-3 flex items-center space-x-2">
                    <span className="text-lg">🛵</span>
                    <span className="text-sm font-bold text-[#3c0068]">Grátis</span>
                  </div>
                  <div className="bg-white rounded-2xl px-5 py-3 flex items-center space-x-2">
                    <span className="text-lg">⏰</span>
                    <span className="text-sm font-bold text-[#3c0068]">{order.estimatedTime} min</span>
                  </div>
                  <div className="bg-white rounded-2xl px-4 py-3 flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
                    <span className="text-sm font-bold text-[#3c0068]">{order.restaurant.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Restaurant & Delivery Section */}
          <div className="px-8 mt-6 mb-6">
            
            {/* Restaurant Info */}
            <h2 className="text-lg font-bold mb-4 text-[#3c0068]" style={{ fontFamily: 'serif' }}>
              Restaurante
            </h2>
            
            <div className="bg-[#3c0068] rounded-3xl p-5 mb-6 shadow-lg">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-[#4d0083] rounded-full flex items-center justify-center">
                  <span className="text-3xl">🍔</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{order.restaurant.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
                    <span className="text-sm text-gray-300">{order.restaurant.rating}</span>
                    <span className="text-sm text-gray-500 ml-2">{order.restaurant.type}</span>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-[#4d0083] rounded-2xl py-4 flex items-center justify-center space-x-2">
                <Phone className="w-5 h-5 text-white" />
                <span className="text-sm font-bold text-white">Ligar para Restaurante</span>
              </button>
            </div>

            {/* Delivery Address */}
            <h2 className="text-lg font-bold mb-4 text-[#3c0068]" style={{ fontFamily: 'serif' }}>
              Endereço de Entrega
            </h2>
            
            <div className="bg-gray-50 rounded-3xl p-5 mb-6 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#3c0068] rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-[#3c0068] mb-1">Casa</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {order.deliveryAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items Section */}
            <h2 className="text-lg font-bold mb-4 text-[#3c0068]" style={{ fontFamily: 'serif' }}>
              Resumo do Pedido
            </h2>
            
            {/* Order Items Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {order.items.map((item, idx) => (
                <div key={idx} className="bg-[#3c0068] rounded-3xl overflow-hidden shadow-lg">
                  <div className="relative h-24 bg-[#4d0083] flex items-center justify-center">
                    <span className="text-4xl">🍔</span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-bold text-sm mb-1">{item.name}</h3>
                    <p className="text-gray-300 text-xs mb-2">Qtd: {item.quantity}</p>
                    <span className="text-[#3c0068] font-bold bg-gray-50 px-3 py-1 rounded-xl text-sm inline-block">
                      MT {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Summary */}
            <div className="bg-gray-50 rounded-3xl p-6 shadow-sm">
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Subtotal</span>
                  <span className="text-sm font-bold text-[#3c0068]">MT {order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Taxa de Entrega</span>
                  <span className="text-sm font-bold text-[#3c0068]">MT {order.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Taxa</span>
                  <span className="text-sm font-bold text-[#3c0068]">MT {order.tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-[#3c0068]">Total Pago</span>
                <span className="text-2xl font-bold text-orange-500">MT {order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg px-8 py-6 z-20">
            <button 
              onClick={() => navigate(createPageUrl('OrderTracking'))}
              className="w-full bg-orange-500 text-white font-bold text-lg py-5 rounded-3xl shadow-lg mb-3"
            >
              Rastrear Pedido
            </button>
            <button 
              onClick={() => navigate(createPageUrl('ClientDashboard'))}
              className="w-full bg-gray-50 text-[#3c0068] font-bold text-base py-4 rounded-3xl shadow-sm"
            >
              Voltar ao Início
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}