
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, CreditCard, Bell, HelpCircle, Settings, LogOut, Clock, Star, Edit } from 'lucide-react';
import { createPageUrl } from '@/utils';
import BottomNav from "../components/client/BottomNav";

export default function ProfileScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const testUser = localStorage.getItem('testUser');
    if (testUser) {
      setUser(JSON.parse(testUser));
    } else {
      // Mock user data
      setUser({
        full_name: 'João Silva',
        email: 'joao.silva@email.com',
        phone: '+258 84 123 4567',
        orders_count: 15,
        favorites_count: 8,
        points: 250
      });
    }
  }, []);

  const navigate = (url) => {
    window.location.href = url;
  };

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      localStorage.removeItem('testUser');
      localStorage.removeItem('simulatedRole');
      navigate(createPageUrl('Welcome'));
    }
  };

  if (!user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-[#ff4700] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
        <div className="relative w-full h-screen bg-white overflow-y-auto pb-24">
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 bg-white z-10 px-8 pt-12 pb-6 shadow-sm">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => window.history.back()}
                className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6 text-[#3c0068]" />
              </button>

              <h1 className="text-2xl font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
                Perfil
              </h1>

              <button 
                onClick={() => navigate(createPageUrl('Settings'))}
                className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center"
              >
                <Settings className="w-6 h-6 text-[#3c0068]" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="mt-32 px-8">
            {/* Profile Section */}
            <div className="bg-[#3c0068] rounded-3xl p-6 mb-6 shadow-lg">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-3xl">👤</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-white mb-1 truncate" style={{ fontFamily: 'serif' }}>
                    {user.full_name}
                  </h2>
                  <p className="text-sm text-gray-300 truncate">{user.email}</p>
                  <p className="text-sm text-gray-300 truncate">{user.phone}</p>
                </div>
                <button 
                  onClick={() => navigate(createPageUrl('AccountPage'))}
                  className="w-10 h-10 bg-[#4d0083] rounded-full flex items-center justify-center"
                >
                  <Edit className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#4d0083] rounded-2xl p-3 text-center">
                  <p className="text-2xl font-bold text-white mb-1">{user.orders_count || 15}</p>
                  <p className="text-xs text-gray-300">Pedidos</p>
                </div>
                <div className="bg-[#4d0083] rounded-2xl p-3 text-center">
                  <p className="text-2xl font-bold text-white mb-1">{user.favorites_count || 8}</p>
                  <p className="text-xs text-gray-300">Favoritos</p>
                </div>
                <div className="bg-[#ff4700] rounded-2xl p-3 text-center shadow-lg">
                  <p className="text-2xl font-bold text-white mb-1">{user.points || 250}</p>
                  <p className="text-xs text-white">Pontos</p>
                </div>
              </div>
            </div>

            {/* Account Section */}
            <h2 className="text-lg font-bold mb-4 text-[#3c0068]" style={{ fontFamily: 'serif' }}>
              Conta
            </h2>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => navigate(createPageUrl('DeliveryAddress'))}
                className="w-full bg-gray-50 rounded-2xl p-4 flex items-center space-x-3 shadow-sm hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                  <MapPin className="w-5 h-5 text-[#3c0068]" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h3 className="text-sm font-bold text-[#3c0068] truncate">Meus Endereços</h3>
                  <p className="text-xs text-gray-400 truncate">3 endereços salvos</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </button>

              <button
                onClick={() => navigate(createPageUrl('PaymentMethods'))}
                className="w-full bg-gray-50 rounded-2xl p-4 flex items-center space-x-3 shadow-sm hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                  <CreditCard className="w-5 h-5 text-[#3c0068]" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h3 className="text-sm font-bold text-[#3c0068] truncate">Métodos de Pagamento</h3>
                  <p className="text-xs text-gray-400 truncate">2 cartões salvos</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </button>

              <button
                onClick={() => navigate(createPageUrl('OrderHistory'))}
                className="w-full bg-gray-50 rounded-2xl p-4 flex items-center space-x-3 shadow-sm hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                  <Clock className="w-5 h-5 text-[#3c0068]" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h3 className="text-sm font-bold text-[#3c0068] truncate">Histórico de Pedidos</h3>
                  <p className="text-xs text-gray-400 truncate">15 pedidos</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </button>
            </div>

            {/* More Section */}
            <h2 className="text-lg font-bold mb-4 text-[#3c0068]" style={{ fontFamily: 'serif' }}>
              Mais
            </h2>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => navigate(createPageUrl('PaymentMethods'))}
                className="w-full bg-gray-50 rounded-2xl p-4 flex items-center space-x-3 shadow-sm hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                  <Bell className="w-5 h-5 text-[#3c0068]" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h3 className="text-sm font-bold text-[#3c0068] truncate">Notificações</h3>
                  <p className="text-xs text-gray-400 truncate">Configurar notificações</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </button>

              <button
                onClick={() => navigate(createPageUrl('Support'))}
                className="w-full bg-gray-50 rounded-2xl p-4 flex items-center space-x-3 shadow-sm hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                  <HelpCircle className="w-5 h-5 text-[#3c0068]" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h3 className="text-sm font-bold text-[#3c0068] truncate">Ajuda & Suporte</h3>
                  <p className="text-xs text-gray-400 truncate">FAQs e contato</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </button>

              <button
                onClick={() => navigate(createPageUrl('ClientSettings'))}
                className="w-full bg-gray-50 rounded-2xl p-4 flex items-center space-x-3 shadow-sm hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                  <Settings className="w-5 h-5 text-[#3c0068]" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h3 className="text-sm font-bold text-[#3c0068] truncate">Configurações</h3>
                  <p className="text-xs text-gray-400 truncate">Preferências do app</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </button>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="w-full bg-gray-50 rounded-2xl p-4 flex items-center justify-center space-x-3 shadow-sm mb-6 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 text-red-600" />
              <span className="text-base font-bold text-red-600">Sair</span>
            </button>
          </div>

          <BottomNav activePage="Profile" />
        </div>
      </div>
    </div>
  );
}
