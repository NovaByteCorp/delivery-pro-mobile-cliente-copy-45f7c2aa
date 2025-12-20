
import React, { useState } from 'react';
import { ChevronLeft, MapPin, ChevronRight, CreditCard, Clock, FileText } from 'lucide-react';
import BottomNav from '../components/client/BottomNav';

export default function CheckoutScreen() {
  const [deliveryOption, setDeliveryOption] = useState('asap');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const orderItems = [
    { name: 'Beef Burger', quantity: 2, price: 7.99 },
    { name: 'French Fries', quantity: 1, price: 3.99 },
    { name: 'Chicken Burger', quantity: 3, price: 4.99 }
  ];

  const subtotal = 30.95;
  const deliveryFee = 2.50;
  const tax = 3.10;
  const total = 36.55;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
        <div className="relative w-full h-screen bg-white overflow-y-auto pb-48">
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 bg-white z-10 px-8 pt-12 pb-4 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <button className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              
              <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'serif' }}>
                Finalizar Pedido
              </h1>
              
              <div className="w-14 h-14" />
            </div>
          </div>

          {/* Content */}
          <div className="mt-32 px-8">
            {/* Delivery Address */}
            <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
              Endereço de Entrega
            </h2>
            
            <button className="w-full bg-gray-50 rounded-2xl p-5 mb-6 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-base font-bold text-gray-800 mb-1">Casa</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Rua Principal 123, Apto 4B, Beira, Moçambique
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 mt-1" />
              </div>
            </button>

            {/* Delivery Time */}
            <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
              Horário de Entrega
            </h2>
            
            <div className="flex space-x-3 mb-6">
              <button
                onClick={() => setDeliveryOption('asap')}
                className={`flex-1 rounded-2xl px-4 py-5 transition-all shadow-sm ${
                  deliveryOption === 'asap'
                    ? 'bg-[#ff4700] text-white shadow-lg'
                    : 'bg-gray-50 text-gray-800'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Clock className={`w-6 h-6 ${deliveryOption === 'asap' ? 'text-white' : 'text-gray-800'}`} />
                  <span className="text-sm font-bold">Agora</span>
                  <span className={`text-xs ${deliveryOption === 'asap' ? 'text-white' : 'text-gray-400'}`}>
                    15-20 min
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => setDeliveryOption('scheduled')}
                className={`flex-1 rounded-2xl px-4 py-5 transition-all shadow-sm ${
                  deliveryOption === 'scheduled'
                    ? 'bg-[#ff4700] text-white shadow-lg'
                    : 'bg-gray-50 text-gray-800'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Clock className={`w-6 h-6 ${deliveryOption === 'scheduled' ? 'text-white' : 'text-gray-800'}`} />
                  <span className="text-sm font-bold">Agendar</span>
                  <span className={`text-xs ${deliveryOption === 'scheduled' ? 'text-white' : 'text-gray-400'}`}>
                    Escolher horário
                  </span>
                </div>
              </button>
            </div>

            {/* Payment Method */}
            <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
              Método de Pagamento
            </h2>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`w-full rounded-2xl p-5 transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-[#3c0068] text-white shadow-lg'
                    : 'bg-gray-50 text-gray-800'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-white' : 'text-gray-800'}`} />
                  <span className="text-sm font-bold">Cartão de Crédito/Débito</span>
                </div>
              </button>
              
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`w-full rounded-2xl p-5 transition-all ${
                  paymentMethod === 'cash'
                    ? 'bg-[#3c0068] text-white shadow-lg'
                    : 'bg-gray-50 text-gray-800'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">💵</span>
                  <span className="text-sm font-bold">Dinheiro na Entrega</span>
                </div>
              </button>
            </div>

            {/* Order Summary */}
            <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
              Resumo do Pedido
            </h2>
            
            <div className="bg-gray-50 rounded-3xl p-6 mb-6 shadow-sm">
              <div className="space-y-2 mb-4">
                {orderItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{item.name} x{item.quantity}</span>
                    <span className="text-sm font-bold text-gray-800">MT {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Subtotal</span>
                  <span className="text-sm font-bold text-gray-800">MT {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Taxa de Entrega</span>
                  <span className="text-sm font-bold text-gray-800">MT {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Taxa</span>
                  <span className="text-sm font-bold text-gray-800">MT {tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-gray-800">MT {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Place Order Button */}
          <div className="fixed bottom-20 left-0 right-0 bg-white shadow-lg px-8 py-6 z-10">
            <button className="w-full bg-[#ff4700] text-white font-bold text-lg py-5 rounded-3xl shadow-lg">
              Fazer Pedido - MT {total.toFixed(2)}
            </button>
          </div>

          {/* Bottom Navigation */}
          <BottomNav activePage="Cart" />
        </div>
      </div>
    </div>
  );
}
