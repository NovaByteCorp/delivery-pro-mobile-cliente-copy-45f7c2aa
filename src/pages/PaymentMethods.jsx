
import React, { useState } from 'react';
import { ChevronLeft, CreditCard, Plus, Trash2, Check, Star, Lock } from 'lucide-react';
import { createPageUrl } from '@/utils';
import BottomNav from '../components/client/BottomNav';

export default function PaymentMethodsScreen() {
  const navigate = (url) => {
    window.location.href = url;
  };

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'credit',
      cardNumber: '**** **** **** 4532',
      cardHolder: 'João Silva',
      expiryDate: '12/25',
      brand: 'Visa',
      emoji: '💳',
      isDefault: true
    },
    {
      id: 2,
      type: 'credit',
      cardNumber: '**** **** **** 8765',
      cardHolder: 'João Silva',
      expiryDate: '08/26',
      brand: 'Mastercard',
      emoji: '💳',
      isDefault: false
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    saveCard: true
  });

  const handleSetDefault = (id) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };

  const handleDelete = (id) => {
    if (paymentMethods.length > 1 && !paymentMethods.find(m => m.id === id).isDefault) {
      setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    }
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setNewCard({ ...newCard, cardNumber: value });
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    if (value.length <= 5) {
      setNewCard({ ...newCard, expiryDate: value });
    }
  };

  const handleSaveCard = () => {
    if (newCard.cardNumber.length === 16 && newCard.cardHolder && newCard.expiryDate.length === 5 && newCard.cvv.length === 3) {
      const newMethod = {
        id: Date.now(),
        type: 'credit',
        cardNumber: '**** **** **** ' + newCard.cardNumber.slice(-4),
        cardHolder: newCard.cardHolder,
        expiryDate: newCard.expiryDate,
        brand: newCard.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
        emoji: '💳',
        isDefault: false
      };
      
      setPaymentMethods([...paymentMethods, newMethod]);
      setNewCard({ cardNumber: '', cardHolder: '', expiryDate: '', cvv: '', saveCard: true });
      setShowAddForm(false);

      // Success toast
      const toast = document.createElement('div');
      toast.className = 'fixed top-20 left-4 right-4 z-[60] flex justify-center';
      toast.innerHTML = `
        <div class="bg-emerald-500 text-white rounded-2xl shadow-2xl p-4 max-w-md w-full">
          <p class="font-bold text-center">Cartão adicionado com sucesso!</p>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
        <div className="relative w-full h-screen bg-white overflow-y-auto pb-32">
          
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 bg-white z-10 px-8 pt-12 pb-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => window.history.back()}
                className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6 text-[#3c0068]" />
              </button>
              
              <h1 className="text-2xl font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
                Pagamento
              </h1>
              
              <button 
                onClick={() => setShowAddForm(true)}
                className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Plus className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="mt-28 px-8">
            
            {/* Add New Card Form */}
            {showAddForm && (
              <div className="bg-[#3c0068] rounded-3xl p-6 mb-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'serif' }}>
                    Adicionar Cartão
                  </h2>
                  <button 
                    onClick={() => {
                      setShowAddForm(false);
                      setNewCard({ cardNumber: '', cardHolder: '', expiryDate: '', cvv: '', saveCard: true });
                    }}
                    className="w-8 h-8 bg-[#4d0083] rounded-lg flex items-center justify-center"
                  >
                    <span className="text-white text-lg">×</span>
                  </button>
                </div>

                {/* Card Preview */}
                <div className="bg-gradient-to-br from-[#4d0083] to-[#5d0099] rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <CreditCard className="w-10 h-10 text-white opacity-80" />
                      <Lock className="w-5 h-5 text-white opacity-60" />
                    </div>
                    
                    <p className="text-white text-xl font-mono tracking-wider mb-4">
                      {newCard.cardNumber ? formatCardNumber(newCard.cardNumber) : '**** **** **** ****'}
                    </p>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-gray-300 mb-1">TITULAR</p>
                        <p className="text-white font-medium">
                          {newCard.cardHolder || 'NOME DO TITULAR'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-300 mb-1">VALIDADE</p>
                        <p className="text-white font-medium">
                          {newCard.expiryDate || 'MM/AA'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 mb-2 block">NÚMERO DO CARTÃO</label>
                    <input
                      type="text"
                      value={formatCardNumber(newCard.cardNumber)}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full bg-[#4d0083] rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-400 outline-none border-2 border-[#4d0083] focus:border-orange-500"
                      maxLength="19"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-gray-300 mb-2 block">NOME DO TITULAR</label>
                    <input
                      type="text"
                      value={newCard.cardHolder}
                      onChange={(e) => setNewCard({ ...newCard, cardHolder: e.target.value.toUpperCase() })}
                      placeholder="JOÃO SILVA"
                      className="w-full bg-[#4d0083] rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-400 outline-none border-2 border-[#4d0083] focus:border-orange-500 uppercase"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-300 mb-2 block">VALIDADE</label>
                      <input
                        type="text"
                        value={newCard.expiryDate}
                        onChange={handleExpiryChange}
                        placeholder="MM/AA"
                        className="w-full bg-[#4d0083] rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-400 outline-none border-2 border-[#4d0083] focus:border-orange-500"
                        maxLength="5"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-300 mb-2 block">CVV</label>
                      <input
                        type="password"
                        value={newCard.cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 3) setNewCard({ ...newCard, cvv: value });
                        }}
                        placeholder="123"
                        className="w-full bg-[#4d0083] rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-400 outline-none border-2 border-[#4d0083] focus:border-orange-500"
                        maxLength="3"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleSaveCard}
                  className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl shadow-lg mt-6 hover:bg-orange-600 transition-colors disabled:opacity-50"
                  disabled={!newCard.cardNumber || !newCard.cardHolder || !newCard.expiryDate || !newCard.cvv}
                >
                  Salvar Cartão
                </button>
              </div>
            )}

            {/* Payment Methods List */}
            <h2 className="text-lg font-bold mb-4 text-[#3c0068]" style={{ fontFamily: 'serif' }}>
              Meus Cartões
            </h2>

            <div className="space-y-4 mb-8">
              {paymentMethods.map((method) => (
                <div key={method.id} className="relative">
                  <div className="bg-gray-50 rounded-3xl overflow-hidden shadow-lg">
                    
                    {/* Default Badge */}
                    {method.isDefault && (
                      <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-2xl shadow-lg z-10 flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-white" />
                        <span>Padrão</span>
                      </div>
                    )}

                    {/* Card Info */}
                    <div className="p-5">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-16 h-16 bg-[#3c0068] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-3xl">{method.emoji}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
                              {method.brand}
                            </h3>
                            <span className="text-xs bg-[#3c0068] text-white px-2 py-1 rounded-lg font-bold">
                              {method.type === 'credit' ? 'CRÉDITO' : 'DÉBITO'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-800 font-mono mb-1">{method.cardNumber}</p>
                          <p className="text-xs text-gray-600">{method.cardHolder}</p>
                          <p className="text-xs text-gray-500">Validade: {method.expiryDate}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-3">
                        {!method.isDefault ? (
                          <button 
                            onClick={() => handleSetDefault(method.id)}
                            className="bg-white rounded-2xl py-3 flex items-center justify-center space-x-2 shadow-sm border-2 border-gray-200 hover:border-orange-500 transition-colors"
                          >
                            <Check className="w-4 h-4 text-[#3c0068]" />
                            <span className="text-sm font-bold text-[#3c0068]">Tornar Padrão</span>
                          </button>
                        ) : (
                          <div className="bg-emerald-50 rounded-2xl py-3 flex items-center justify-center space-x-2 border-2 border-emerald-200">
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-bold text-emerald-600">Padrão</span>
                          </div>
                        )}
                        
                        <button 
                          onClick={() => handleDelete(method.id)}
                          disabled={method.isDefault}
                          className="bg-white rounded-2xl py-3 flex items-center justify-center shadow-sm border-2 border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>

                      {method.isDefault && (
                        <p className="text-xs text-gray-500 mt-3 text-center">
                          Não é possível deletar o cartão padrão
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 rounded-2xl p-4 mb-8 border-2 border-blue-200">
              <div className="flex items-start space-x-3">
                <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-blue-900 mb-1">Pagamento Seguro</h3>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Seus dados de pagamento são criptografados e armazenados com segurança. Nunca compartilhamos suas informações com terceiros.
                  </p>
                </div>
              </div>
            </div>

          </div>

          <BottomNav activePage="Profile" />
        </div>
      </div>
    </div>
  );
}
