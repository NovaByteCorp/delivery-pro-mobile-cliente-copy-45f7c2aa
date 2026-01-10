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

    const handleToggleStatus = async () => {
        if (!restaurant) return;
        
        try {
            const newStatus = !isOpen;
            await Restaurant.update(restaurant.id, { is_active: newStatus });
            setIsOpen(newStatus);
            
            const toast = document.createElement('div');
            toast.className = 'fixed top-20 left-4 right-4 z-[60] flex justify-center';
            toast.innerHTML = `
                <div class="bg-emerald-500 text-white rounded-2xl shadow-2xl p-4 max-w-md w-full">
                    <p class="font-bold text-center">Restaurante ${newStatus ? 'Aberto' : 'Fechado'}!</p>
                </div>
            `;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2000);
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
        }
    };

    const handleSaveRestaurant = async () => {
        if (!restaurant) return;
        
        if (!formData.name || !formData.phone || !formData.address) {
            alert('Por favor, preencha os campos obrigatórios: Nome, Telefone e Endereço');
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

            const toast = document.createElement('div');
            toast.className = 'fixed top-20 left-4 right-4 z-[60] flex justify-center';
            toast.innerHTML = `
                <div class="bg-emerald-500 text-white rounded-2xl shadow-2xl p-4 max-w-md w-full">
                    <p class="font-bold text-center">Dados atualizados com sucesso!</p>
                </div>
            `;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2000);

            setShowEditModal(false);
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            alert('Erro ao salvar dados. Tente novamente.');
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-12 h-12 border-4 border-[#ff4700] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Restaurante não encontrado</h2>
                    <p className="text-gray-600">Entre em contato com o suporte.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
                <div className="relative w-full h-screen bg-white overflow-y-auto pb-32">

                    {/* Header */}
                    <div className="bg-gray-800 px-8 pt-12 pb-20 rounded-b-3xl">
                        <div className="flex items-center justify-between mb-8">
                            <button className="w-14 h-14 bg-gray-700 rounded-2xl flex items-center justify-center">
                                <ChevronLeft className="w-6 h-6 text-white" />
                            </button>

                            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'serif' }}>
                                Configurações
                            </h1>

                            <div className="w-14 h-14" />
                        </div>

                        {/* Restaurant Profile */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
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
                                <button className="absolute bottom-0 right-0 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                    <Camera className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>

                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'serif' }}>
                                {restaurant.name || 'Sem nome'}
                            </h2>
                            <div className="flex items-center justify-center space-x-2 mb-1">
                                <span className="text-sm text-gray-400">{restaurant.cuisine_type || 'Sem categoria'}</span>
                                {restaurant.rating && (
                                    <>
                                        <span className="text-gray-500">•</span>
                                        <div className="flex items-center space-x-1">
                                            <Store className="w-4 h-4 text-orange-500" />
                                            <span className="text-sm font-bold text-white">{parseFloat(restaurant.rating).toFixed(1)}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Status Card - Overlapping */}
                    <div className="relative px-8 -mt-12 mb-6">
                        <div className="bg-white rounded-3xl p-6 shadow-2xl">

                            {/* Open/Close Toggle */}
                            <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="text-base font-bold text-gray-800">
                                        {isOpen ? 'Aberto' : 'Fechado'}
                                    </span>
                                </div>
                                <button
                                    onClick={handleToggleStatus}
                                    className={`relative w-14 h-8 rounded-full transition-colors ${isOpen ? 'bg-green-500' : 'bg-gray-600'}`}
                                >
                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${isOpen ? 'right-1' : 'left-1'}`}></div>
                                </button>
                            </div>

                            {/* Auto Accept */}
                            <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-gray-800 mb-1">Aceitar Pedidos Automaticamente</p>
                                    <p className="text-xs text-gray-400">Pedidos serão aceitos sem confirmação</p>
                                </div>
                                <button
                                    onClick={() => setAutoAccept(!autoAccept)}
                                    className={`relative w-14 h-8 rounded-full transition-colors flex-shrink-0 ml-3 ${autoAccept ? 'bg-orange-500' : 'bg-gray-300'}`}
                                >
                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${autoAccept ? 'right-1' : 'left-1'}`}></div>
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* Restaurant Info */}
                    <div className="px-8 mb-6">
                        <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
                            Dados do Restaurante
                        </h2>

                        <div className="bg-gray-50 rounded-3xl p-5 shadow-sm space-y-4">
                            {restaurant.phone && (
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-400 mb-1">Telefone</p>
                                        <p className="text-sm font-bold text-gray-800">{restaurant.phone}</p>
                                    </div>
                                </div>
                            )}

                            {restaurant.email && (
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-400 mb-1">Email</p>
                                        <p className="text-sm font-bold text-gray-800">{restaurant.email}</p>
                                    </div>
                                </div>
                            )}

                            {restaurant.address && (
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-400 mb-1">Endereço</p>
                                        <p className="text-sm font-bold text-gray-800">{restaurant.address}</p>
                                    </div>
                                </div>
                            )}

                            {!restaurant.phone && !restaurant.email && !restaurant.address && (
                                <div className="text-center py-4">
                                    <p className="text-sm text-gray-400">Nenhuma informação de contato cadastrada</p>
                                    <button 
                                        onClick={() => setShowEditModal(true)}
                                        className="text-sm text-orange-500 font-bold mt-2"
                                    >
                                        Adicionar informações
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Settings Menu */}
                    <div className="px-8 mb-6">
                        <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
                            Configurações
                        </h2>

                        <div className="space-y-3">
                            {menuSections.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={item.action}
                                    className="w-full bg-gray-50 rounded-2xl p-5 flex items-center space-x-4 shadow-sm hover:bg-gray-100 transition-colors"
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
                        <button
                            onClick={handleLogout}
                            className="w-full bg-gray-50 rounded-2xl p-4 flex items-center justify-center space-x-3 shadow-sm mb-6 hover:bg-red-50 transition-colors"
                        >
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
                                        Editar Restaurante
                                    </h3>
                                    <button
                                        onClick={() => setShowEditModal(false)}
                                        className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                                    >
                                        <span className="text-gray-800 text-lg">×</span>
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 mb-2 block">NOME DO RESTAURANTE *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none border-2 border-gray-200 focus:border-orange-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-gray-400 mb-2 block">TIPO DE COZINHA</label>
                                        <input
                                            type="text"
                                            value={formData.cuisine_type}
                                            onChange={(e) => setFormData({ ...formData, cuisine_type: e.target.value })}
                                            placeholder="Ex: Fast Food, Pizza, Italiana"
                                            className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none border-2 border-gray-200 focus:border-orange-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-gray-400 mb-2 block">TELEFONE *</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none border-2 border-gray-200 focus:border-orange-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-gray-400 mb-2 block">EMAIL</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none border-2 border-gray-200 focus:border-orange-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-gray-400 mb-2 block">ENDEREÇO *</label>
                                        <textarea
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none border-2 border-gray-200 focus:border-orange-500 resize-none"
                                            rows="3"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-gray-400 mb-2 block">DESCRIÇÃO</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Descreva seu restaurante..."
                                            className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none border-2 border-gray-200 focus:border-orange-500 resize-none"
                                            rows="3"
                                        />
                                    </div>
                                </div>

                                <div className="flex space-x-3 mt-6">
                                    <button
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 bg-gray-200 text-gray-800 font-bold py-4 rounded-2xl hover:bg-gray-300 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        onClick={handleSaveRestaurant}
                                        className="flex-1 bg-orange-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-orange-600 transition-colors"
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
                <BottomNavRO activePage="RestaurantOwnerProfile" />
            </div>
        </div>
    );
}