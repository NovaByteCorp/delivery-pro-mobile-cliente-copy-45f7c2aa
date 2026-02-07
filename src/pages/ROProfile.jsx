import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Store, Clock, MapPin, Bell, CreditCard, Users, FileText, HelpCircle, LogOut, Package, DollarSign, TrendingUp, Settings, Camera, Phone, Mail } from 'lucide-react';
import BottomNavRO from '../components/restaurants/ROBottomNav';
import { createPageUrl } from '@/utils';
import { Restaurant, Category } from '@/api/entities';

export default function RestaurantOwnerProfile() {
    const [loading, setLoading] = useState(true);
    const [restaurant, setRestaurant] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isOpen, setIsOpen] = useState(true);
    const [autoAccept, setAutoAccept] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        cuisine_type: '',
        phone: '',
        email: '',
        address: '',
        description: ''
    });

    useEffect(() => {
        loadRestaurantData();
    }, []);

    const loadRestaurantData = async () => {
        setLoading(true);
        try {
            const testUser = JSON.parse(localStorage.getItem('testUser') || '{}');
            
            if (!testUser.id) {
                console.error('Usuário não encontrado');
                setLoading(false);
                return;
            }

            let userRestaurant = null;
            if (testUser.assigned_restaurant_id) {
                userRestaurant = await Restaurant.get(testUser.assigned_restaurant_id);
            } else {
                const allRestaurants = await Restaurant.list();
                userRestaurant = allRestaurants.find(r => r.owner_id === testUser.id);
            }

            if (!userRestaurant) {
                console.error('Restaurante não encontrado');
                setLoading(false);
                return;
            }

            setRestaurant(userRestaurant);
            setIsOpen(userRestaurant.is_active !== false);
            
            setFormData({
                name: userRestaurant.name || '',
                cuisine_type: userRestaurant.cuisine_type || '',
                phone: userRestaurant.phone || '',
                email: userRestaurant.email || '',
                address: userRestaurant.address || '',
                description: userRestaurant.description || ''
            });

            const allCategories = await Category.list();
            setCategories(allCategories);

        } catch (error) {
            console.error('Erro ao carregar dados do restaurante:', error);
        } finally {
            setLoading(false);
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

    const handleToggleStatus = async () => {
        if (!restaurant) return;
        
        try {
            const newStatus = !isOpen;
            await Restaurant.update(restaurant.id, { is_active: newStatus });
            setIsOpen(newStatus);
            showToast(`Restaurante ${newStatus ? 'Aberto' : 'Fechado'}!`);
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            showToast('Erro ao atualizar status', 'error');
        }
    };

    const handleSaveRestaurant = async () => {
        if (!restaurant) return;
        
        if (!formData.name || !formData.phone || !formData.address) {
            showToast('Preencha os campos obrigatórios', 'error');
            return;
        }

        try {
            await Restaurant.update(restaurant.id, {
                name: formData.name,
                cuisine_type: formData.cuisine_type,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                description: formData.description
            });

            setRestaurant({
                ...restaurant,
                ...formData
            });

            showToast('Dados atualizados com sucesso!');
            setShowEditModal(false);
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            showToast('Erro ao salvar dados', 'error');
        }
    };

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

    const menuSections = [
        {
            icon: Store,
            title: 'Informações do Restaurante',
            subtitle: 'Nome, categoria, contato',
            action: () => setShowEditModal(true)
        },
        {
            icon: Bell,
            title: 'Notificações',
            subtitle: 'Gerenciar alertas e avisos',
            action: () => { }
        },
        {
            icon: HelpCircle,
            title: 'Ajuda e Suporte',
            subtitle: 'Central de ajuda, FAQs',
            action: () => { }
        }
    ];

    // ─── Loading State ───
    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#ff4700] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-base font-medium text-gray-600">A carregar...</p>
                </div>
            </div>
        );
    }

    // ─── No Restaurant State ───
    if (!restaurant) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-white">
                <div className="text-center px-8">
                    <h2 className="text-2xl font-bold text-[#3c0068] mb-4" style={{ fontFamily: 'serif' }}>
                        Restaurante não encontrado
                    </h2>
                    <p className="text-gray-400">Entre em contato com o suporte.</p>
                </div>
            </div>
        );
    }

    // ─── Main Render ───
    return (
        <div className="relative w-full min-h-screen bg-white overflow-y-auto pb-24">

            {/* ═══ Header ═══ */}
            <div className="bg-white px-8 pt-12 pb-6">
                <div className="flex items-center justify-between mb-8">
                    <button className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                        <ChevronLeft className="w-6 h-6 text-[#3c0068]" />
                    </button>

                    <h1 className="text-2xl font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
                        Configurações
                    </h1>

                    <div className="w-14 h-14" />
                </div>

                {/* Restaurant Profile */}
                <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden">
                            {restaurant.image_url ? (
                                <img 
                                    src={restaurant.image_url} 
                                    alt={restaurant.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.parentElement.innerHTML = '<span class="text-5xl">🍔</span>';
                                    }}
                                />
                            ) : (
                                <span className="text-5xl">🍔</span>
                            )}
                        </div>
                        <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#ff4700] rounded-full flex items-center justify-center shadow-lg">
                            <Camera className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    <h2 className="text-2xl font-bold text-[#3c0068] mb-1" style={{ fontFamily: 'serif' }}>
                        {restaurant.name || 'Sem nome'}
                    </h2>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400">{restaurant.cuisine_type || 'Sem categoria'}</span>
                        {restaurant.rating && (
                            <>
                                <span className="text-gray-300">•</span>
                                <div className="flex items-center space-x-1">
                                    <Store className="w-4 h-4 text-[#ff4700]" />
                                    <span className="text-sm font-bold text-[#3c0068]">{parseFloat(restaurant.rating).toFixed(1)}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ═══ Content ═══ */}
            <div className="px-8">

                {/* ─── Status Toggles ─── */}
                <div className="mb-6 space-y-3">
                    {/* Open/Close Toggle */}
                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-base font-bold text-[#3c0068]">
                                {isOpen ? 'Aberto' : 'Fechado'}
                            </span>
                        </div>
                        <button
                            onClick={handleToggleStatus}
                            className={`relative w-14 h-8 rounded-full transition-colors ${isOpen ? 'bg-[#ff4700]' : 'bg-gray-300'}`}
                        >
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${isOpen ? 'right-1' : 'left-1'}`}></div>
                        </button>
                    </div>

                    {/* Auto Accept */}
                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex-1 mr-3">
                            <p className="text-sm font-bold text-[#3c0068] mb-1">Aceitar Pedidos Automaticamente</p>
                            <p className="text-xs text-gray-400">Pedidos serão aceitos sem confirmação</p>
                        </div>
                        <button
                            onClick={() => setAutoAccept(!autoAccept)}
                            className={`relative w-14 h-8 rounded-full transition-colors flex-shrink-0 ${autoAccept ? 'bg-[#ff4700]' : 'bg-gray-300'}`}
                        >
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${autoAccept ? 'right-1' : 'left-1'}`}></div>
                        </button>
                    </div>
                </div>

                {/* ─── Restaurant Info ─── */}
                <h2 className="text-lg font-bold mb-4 text-[#3c0068]" style={{ fontFamily: 'serif' }}>
                    Dados do Restaurante
                </h2>

                <div className="bg-gray-50 rounded-3xl p-5 mb-6 space-y-4">
                    {restaurant.phone && (
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-[#3c0068] rounded-2xl flex items-center justify-center flex-shrink-0">
                                <Phone className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-400 mb-1">Telefone</p>
                                <p className="text-sm font-bold text-[#3c0068]">{restaurant.phone}</p>
                            </div>
                        </div>
                    )}

                    {restaurant.email && (
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-[#3c0068] rounded-2xl flex items-center justify-center flex-shrink-0">
                                <Mail className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-400 mb-1">Email</p>
                                <p className="text-sm font-bold text-[#3c0068]">{restaurant.email}</p>
                            </div>
                        </div>
                    )}

                    {restaurant.address && (
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-[#3c0068] rounded-2xl flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-400 mb-1">Endereço</p>
                                <p className="text-sm font-bold text-[#3c0068]">{restaurant.address}</p>
                            </div>
                        </div>
                    )}

                    {!restaurant.phone && !restaurant.email && !restaurant.address && (
                        <div className="text-center py-4">
                            <p className="text-sm text-gray-400">Nenhuma informação de contato cadastrada</p>
                            <button 
                                onClick={() => setShowEditModal(true)}
                                className="text-sm text-[#ff4700] font-bold mt-2"
                            >
                                Adicionar informações
                            </button>
                        </div>
                    )}
                </div>

                {/* ─── Settings Menu ─── */}
                <h2 className="text-lg font-bold mb-4 text-[#3c0068]" style={{ fontFamily: 'serif' }}>
                    Configurações
                </h2>

                <div className="space-y-3 mb-6">
                    {menuSections.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={item.action}
                            className="w-full bg-gray-50 rounded-2xl p-5 flex items-center space-x-4 active:bg-gray-100 transition-colors"
                        >
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                                <item.icon className="w-6 h-6 text-[#3c0068]" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="text-base font-bold text-[#3c0068]">{item.title}</h3>
                                <p className="text-xs text-gray-400">{item.subtitle}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300" />
                        </button>
                    ))}
                </div>

                {/* ─── Logout ─── */}
                <button
                    onClick={handleLogout}
                    className="w-full bg-gray-50 rounded-2xl p-4 flex items-center justify-center space-x-3 mb-6 active:bg-red-50 transition-colors"
                >
                    <LogOut className="w-5 h-5 text-red-500" />
                    <span className="text-base font-bold text-red-500">Sair da Conta</span>
                </button>

                {/* Version */}
                <div className="text-center pb-4">
                    <p className="text-xs text-gray-400">Versão 1.0.0</p>
                </div>

            </div>

            {/* ═══ Edit Modal ═══ */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
                                Editar Restaurante
                            </h3>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center active:bg-gray-100 transition-colors"
                            >
                                <span className="text-[#3c0068] text-lg font-bold">×</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 mb-2 block">NOME DO RESTAURANTE *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-50 rounded-2xl px-4 py-4 text-sm text-[#3c0068] outline-none border-2 border-gray-100 focus:border-[#ff4700] transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 mb-2 block">TIPO DE COZINHA</label>
                                <input
                                    type="text"
                                    value={formData.cuisine_type}
                                    onChange={(e) => setFormData({ ...formData, cuisine_type: e.target.value })}
                                    placeholder="Ex: Fast Food, Pizza, Italiana"
                                    className="w-full bg-gray-50 rounded-2xl px-4 py-4 text-sm text-[#3c0068] outline-none border-2 border-gray-100 focus:border-[#ff4700] transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 mb-2 block">TELEFONE *</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-gray-50 rounded-2xl px-4 py-4 text-sm text-[#3c0068] outline-none border-2 border-gray-100 focus:border-[#ff4700] transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 mb-2 block">EMAIL</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-gray-50 rounded-2xl px-4 py-4 text-sm text-[#3c0068] outline-none border-2 border-gray-100 focus:border-[#ff4700] transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 mb-2 block">ENDEREÇO *</label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full bg-gray-50 rounded-2xl px-4 py-4 text-sm text-[#3c0068] outline-none border-2 border-gray-100 focus:border-[#ff4700] resize-none transition-colors"
                                    rows="3"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 mb-2 block">DESCRIÇÃO</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Descreva seu restaurante..."
                                    className="w-full bg-gray-50 rounded-2xl px-4 py-4 text-sm text-[#3c0068] outline-none border-2 border-gray-100 focus:border-[#ff4700] resize-none transition-colors"
                                    rows="3"
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
                                onClick={handleSaveRestaurant}
                                className="flex-1 bg-[#ff4700] text-white font-bold py-4 rounded-2xl shadow-lg active:opacity-80 transition-opacity"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <BottomNavRO activePage="RestaurantOwnerProfile" />
        </div>
    );
}
