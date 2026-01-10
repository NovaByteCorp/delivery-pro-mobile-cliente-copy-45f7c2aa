import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, TrendingUp, Award, User, Phone, Mail, MapPin, Bike, FileText, Settings, LogOut, ChevronRight, Camera, Loader2 } from 'lucide-react';
import { supabase } from '@/supabase';

import BottomNavDriver from '../components/driver/DriverBottomNav';

export default function DriverProfileScreen() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [driverInfo, setDriverInfo] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    loadDriverData();
  }, []);

  const loadDriverData = async () => {
    setLoading(true);
    try {
      const testUser = JSON.parse(localStorage.getItem('testUser') || '{}');
      
      if (!testUser.id) {
        console.error('Usuário não encontrado');
        setLoading(false);
        return;
      }

      // Buscar dados do driver na tabela DeliveryPerson
      const { data: driver, error } = await supabase
        .from('DeliveryPerson')
        .select('*')
        .eq('user_id', testUser.id)
        .single();

      if (error) {
        console.error('Erro ao buscar dados do driver:', error);
        setLoading(false);
        return;
      }

      if (!driver) {
        console.error('Driver não encontrado');
        setLoading(false);
        return;
      }

      // Calcular estatísticas (pode ser expandido para buscar dados reais)
      const stats = {
        acceptance: 98,
        onTime: 95,
        completion: 99
      };

      // Formatar data de membro
      const memberSince = driver.created_date ? 
        new Date(driver.created_date).toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' }) : 
        'Jan 2024';

      const driverData = {
        id: driver.id,
        userId: driver.user_id,
        name: driver.name || 'Michael Johnson',
        phone: driver.phone || '+258 84 123 4567',
        email: driver.email || 'michael.j@email.com',
        rating: driver.rating || 4.9,
        totalDeliveries: Math.floor(driver.total_deliveries || 1247),
        memberSince: memberSince,
        profileImage: driver.profile_image_url,
        vehicle: {
          type: driver.vehicle_type || 'Motocicleta',
          model: driver.vehicle_type ? `${driver.vehicle_type}` : 'Honda CB 125',
          plate: driver.vehicle_plate || 'MPM-1234'
        },
        stats: stats,
        address: driver.address,
        documentNumber: driver.document_number,
        isAvailable: driver.is_available,
        isActive: driver.is_active
      };

      setDriverInfo(driverData);
      setEditForm({
        name: driverData.name,
        phone: driverData.phone,
        email: driverData.email
      });

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from('DeliveryPerson')
        .update({
          name: editForm.name,
          phone: editForm.phone,
          email: editForm.email,
          updated_date: new Date().toISOString()
        })
        .eq('id', driverInfo.id);

      if (error) throw error;

      showToast('Perfil atualizado com sucesso!', 'success');
      setShowEditModal(false);
      await loadDriverData();

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      showToast('Erro ao atualizar perfil', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    const bgColor = type === 'success' ? 'bg-emerald-500' : 'bg-red-500';
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 left-4 right-4 z-[60] flex justify-center';
    toast.innerHTML = `
      <div class="${bgColor} text-white rounded-2xl shadow-2xl p-4 max-w-md w-full">
        <p class="font-bold text-center">${message}</p>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-lg font-bold text-gray-800">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!driverInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Perfil não encontrado</h2>
          <p className="text-gray-600">Entre em contato com o suporte.</p>
        </div>
      </div>
    );
  }

  const achievements = [
    { id: 1, title: 'Top Entregador', emoji: '🏆', description: '100 entregas' },
    { id: 2, title: 'Estrela 5', emoji: '⭐', description: 'Rating 4.8+' },
    { id: 3, title: 'Rápido', emoji: '⚡', description: '95% no prazo' },
    { id: 4, title: 'Confiável', emoji: '💎', description: '99% completas' }
  ];

  const menuItems = [
    {
      icon: User,
      title: 'Informações Pessoais',
      subtitle: 'Nome, telefone, email',
      action: () => setShowEditModal(true)
    },
    {
      icon: Bike,
      title: 'Meu Veículo',
      subtitle: driverInfo.vehicle.model,
      action: () => {}
    },
    {
      icon: FileText,
      title: 'Documentos',
      subtitle: 'CNH, documentos do veículo',
      action: () => {}
    },
    {
      icon: Settings,
      title: 'Configurações',
      subtitle: 'Notificações, privacidade',
      action: () => {}
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
        <div className="relative w-full h-screen bg-white overflow-y-auto pb-8">
          
          {/* Header */}
          <div className="bg-gray-800 px-8 pt-12 pb-20 rounded-b-3xl">
            <div className="flex items-center justify-between mb-8">
              <button className="w-14 h-14 bg-gray-700 rounded-2xl flex items-center justify-center">
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'serif' }}>
                Meu Perfil
              </h1>
              
              <div className="w-14 h-14" />
            </div>

            {/* Profile Picture */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-28 h-28 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                  {driverInfo.profileImage ? (
                    <img src={driverInfo.profileImage} alt={driverInfo.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl">👨‍🍳</span>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Camera className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Name and Rating */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'serif' }}>
                {driverInfo.name}
              </h2>
              <div className="flex items-center justify-center space-x-2 mb-1">
                <Star className="w-5 h-5 fill-orange-500 text-orange-500" />
                <span className="text-lg font-bold text-white">{driverInfo.rating}</span>
                <span className="text-sm text-gray-400">({driverInfo.totalDeliveries} entregas)</span>
              </div>
              <p className="text-sm text-gray-400">Membro desde {driverInfo.memberSince}</p>
            </div>
          </div>

          {/* Stats Card - Overlapping */}
          <div className="relative px-8 -mt-12 mb-6">
            <div className="bg-white rounded-3xl p-6 shadow-2xl">
              <h3 className="text-base font-bold text-gray-800 mb-4 text-center">Estatísticas de Performance</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="w-7 h-7 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800 mb-1">{driverInfo.stats.acceptance}%</p>
                  <p className="text-xs text-gray-400">Aceitação</p>
                </div>

                <div className="text-center">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="w-7 h-7 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800 mb-1">{driverInfo.stats.onTime}%</p>
                  <p className="text-xs text-gray-400">No Prazo</p>
                </div>

                <div className="text-center">
                  <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <Award className="w-7 h-7 text-orange-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800 mb-1">{driverInfo.stats.completion}%</p>
                  <p className="text-xs text-gray-400">Completas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="px-8 mb-6">
            <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
              Conquistas
            </h2>
            
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="bg-gray-50 rounded-3xl p-4 shadow-sm text-center">
                  <span className="text-4xl mb-2 block">{achievement.emoji}</span>
                  <h3 className="text-sm font-bold text-gray-800 mb-1">{achievement.title}</h3>
                  <p className="text-xs text-gray-400">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Account Info */}
          <div className="px-8 mb-6">
            <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
              Informações da Conta
            </h2>
            
            <div className="bg-gray-50 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">Telefone</p>
                  <p className="text-sm font-bold text-gray-800">{driverInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">Email</p>
                  <p className="text-sm font-bold text-gray-800">{driverInfo.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Bike className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">Veículo</p>
                  <p className="text-sm font-bold text-gray-800">{driverInfo.vehicle.model}</p>
                  <p className="text-xs text-gray-400">{driverInfo.vehicle.plate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="px-8 mb-6">
            <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
              Configurações
            </h2>
            
            <div className="space-y-3">
              {menuItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={item.action}
                  className="w-full bg-gray-50 rounded-2xl p-5 flex items-center space-x-4 shadow-sm"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow flex-shrink-0">
                    <item.icon className="w-6 h-6 text-gray-800" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-base font-bold text-gray-800">{item.title}</h3>
                    <p className="text-xs text-gray-400">{item.subtitle}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Logout */}
          <div className="px-8 mb-6">
            <button className="w-full bg-gray-50 rounded-2xl p-5 flex items-center justify-center space-x-3 shadow-sm">
              <LogOut className="w-5 h-5 text-gray-800" />
              <span className="text-base font-bold text-gray-800">Sair da Conta</span>
            </button>
          </div>

          {/* Version */}
          <div className="text-center pb-8">
            <p className="text-xs text-gray-400">Versão 1.0.0</p>
          </div>

          {/* Edit Modal */}
          {showEditModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
              <div className="bg-white rounded-3xl p-6 w-full max-w-sm max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'serif' }}>
                    Editar Perfil
                  </h3>
                  <button 
                    onClick={() => setShowEditModal(false)}
                    className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center"
                  >
                    <span className="text-gray-800 text-lg">×</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 mb-2 block">NOME COMPLETO</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none border-2 border-gray-200 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 mb-2 block">TELEFONE</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none border-2 border-gray-200 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 mb-2 block">EMAIL</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none border-2 border-gray-200 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button 
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 font-bold py-4 rounded-2xl"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSaveProfile}
                    className="flex-1 bg-orange-500 text-white font-bold py-4 rounded-2xl shadow-lg"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* FUTURO: BottomNavDriver */}
      {<BottomNavDriver activePage="ProfileDriver" /> }
      
    </div>
  );
}