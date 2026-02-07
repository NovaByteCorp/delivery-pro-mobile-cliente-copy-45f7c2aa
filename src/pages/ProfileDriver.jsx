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
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#ff4700] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-base font-medium text-gray-600">A carregar perfil...</p>
        </div>
      </div>
    );
  }

  if (!driverInfo) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="text-center px-8">
          <h2 className="text-2xl font-bold text-[#3c0068] mb-4" style={{ fontFamily: 'serif' }}>
            Perfil não encontrado
          </h2>
          <p className="text-gray-400">Entre em contato com o suporte.</p>
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
    <div className="relative w-full min-h-screen bg-white overflow-y-auto pb-24">
      
      {/* Header Limpo */}
      <div className="bg-white px-8 pt-12 pb-6">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => window.history.back()}
            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center active:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#3c0068]" />
          </button>
          
          <h1 className="text-xl font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
            Perfil
          </h1>
          
          <div className="w-12 h-12" />
        </div>

        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-100">
              {driverInfo.profileImage ? (
                <img src={driverInfo.profileImage} alt={driverInfo.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">👨‍🍳</span>
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#ff4700] rounded-full flex items-center justify-center shadow-lg active:opacity-80 transition-opacity">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Name and Rating */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#3c0068] mb-2" style={{ fontFamily: 'serif' }}>
            {driverInfo.name}
          </h2>
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Star className="w-4 h-4 fill-[#ff4700] text-[#ff4700]" />
            <span className="text-base font-bold text-[#3c0068]">{driverInfo.rating}</span>
            <span className="text-sm text-gray-400">• {driverInfo.totalDeliveries} entregas</span>
          </div>
          <p className="text-xs text-gray-400">Membro desde {driverInfo.memberSince}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-2" />
            <p className="text-xl font-bold text-[#3c0068] mb-1">{driverInfo.stats.acceptance}%</p>
            <p className="text-xs text-gray-400">Aceitação</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <TrendingUp className="w-5 h-5 text-[#3c0068] mx-auto mb-2" />
            <p className="text-xl font-bold text-[#3c0068] mb-1">{driverInfo.stats.onTime}%</p>
            <p className="text-xs text-gray-400">No Prazo</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <Award className="w-5 h-5 text-[#ff4700] mx-auto mb-2" />
            <p className="text-xl font-bold text-[#3c0068] mb-1">{driverInfo.stats.completion}%</p>
            <p className="text-xs text-gray-400">Completas</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8">

        {/* Achievements */}
        <div className="mb-6">
          <h2 className="text-base font-bold mb-4 text-[#3c0068]">
            Conquistas
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="bg-gray-50 rounded-2xl p-4 text-center">
                <span className="text-3xl mb-2 block">{achievement.emoji}</span>
                <h3 className="text-sm font-bold text-[#3c0068] mb-1">{achievement.title}</h3>
                <p className="text-xs text-gray-400">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Account Info */}
        <div className="mb-6">
          <h2 className="text-base font-bold mb-4 text-[#3c0068]">
            Informações da Conta
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 bg-gray-50 rounded-2xl p-4">
              <div className="w-10 h-10 bg-[#3c0068] rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">Telefone</p>
                <p className="text-sm font-bold text-[#3c0068]">{driverInfo.phone}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-gray-50 rounded-2xl p-4">
              <div className="w-10 h-10 bg-[#3c0068] rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">Email</p>
                <p className="text-sm font-bold text-[#3c0068]">{driverInfo.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-gray-50 rounded-2xl p-4">
              <div className="w-10 h-10 bg-[#ff4700] rounded-xl flex items-center justify-center flex-shrink-0">
                <Bike className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">Veículo</p>
                <p className="text-sm font-bold text-[#3c0068]">{driverInfo.vehicle.model}</p>
                <p className="text-xs text-gray-400">{driverInfo.vehicle.plate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="mb-6">
          <h2 className="text-base font-bold mb-4 text-[#3c0068]">
            Configurações
          </h2>
          
          <div className="space-y-3">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
                className="w-full bg-gray-50 rounded-2xl p-4 flex items-center space-x-3 active:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-[#3c0068]" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-bold text-[#3c0068]">{item.title}</h3>
                  <p className="text-xs text-gray-400">{item.subtitle}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="mb-6">
          <button className="w-full bg-gray-50 rounded-2xl p-4 flex items-center justify-center space-x-2 active:bg-gray-100 transition-colors">
            <LogOut className="w-5 h-5 text-[#3c0068]" />
            <span className="text-sm font-bold text-[#3c0068]">Sair da Conta</span>
          </button>
        </div>

        {/* Version */}
        <div className="text-center pb-6">
          <p className="text-xs text-gray-400">Versão 1.0.0</p>
        </div>

      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-8">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
                Editar Perfil
              </h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center active:bg-gray-100 transition-colors"
              >
                <span className="text-[#3c0068] text-xl">×</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 mb-2 block">NOME COMPLETO</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm text-[#3c0068] outline-none border-2 border-gray-100 focus:border-[#ff4700] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 mb-2 block">TELEFONE</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm text-[#3c0068] outline-none border-2 border-gray-100 focus:border-[#ff4700] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 mb-2 block">EMAIL</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm text-[#3c0068] outline-none border-2 border-gray-100 focus:border-[#ff4700] transition-colors"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-gray-50 text-[#3c0068] font-bold py-4 rounded-2xl active:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveProfile}
                className="flex-1 bg-[#ff4700] text-white font-bold py-4 rounded-2xl shadow-lg active:opacity-80 transition-opacity"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavDriver activePage="ProfileDriver" />
      
    </div>
  );
}
