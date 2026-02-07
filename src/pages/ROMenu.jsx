import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Edit2, Trash2, Eye, EyeOff, Search, Filter, Clock, DollarSign, Camera, Package, TrendingUp, Settings } from 'lucide-react';
import BottomNavRO from '../components/restaurants/ROBottomNav';
import { Product, Category, Restaurant } from '@/api/entities';

export default function RestaurantOwnerMenu() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    description: '',
    price: '',
    preparation_time: '',
    is_available: true,
    image_url: ''
  });

  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = async () => {
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

      const allProducts = await Product.getAll();
      const restaurantProducts = allProducts.filter(p => p.restaurant_id === userRestaurant.id);
      setProducts(restaurantProducts);

      const allCategories = await Category.getAll();
      setCategories(allCategories);

    } catch (error) {
      console.error('Erro ao carregar dados do menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (id) => {
    try {
      const product = products.find(p => p.id === id);
      if (!product) return;

      const newStatus = !product.is_available;
      await Product.update(id, { is_available: newStatus });

      setProducts(products.map(p => 
        p.id === id ? { ...p, is_available: newStatus } : p
      ));

      showToast(`Produto ${newStatus ? 'ativado' : 'desativado'}!`);
    } catch (error) {
      console.error('Erro ao alterar disponibilidade:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      await Product.delete(id);
      setProducts(products.filter(p => p.id !== id));
      showToast('Produto excluído!');
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      showToast('Erro ao excluir produto', 'error');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      category_id: product.category_id || '',
      description: product.description || '',
      price: product.price || '',
      preparation_time: product.preparation_time || '',
      is_available: product.is_available !== false,
      image_url: product.image_url || ''
    });
    setShowAddModal(true);
  };

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.category_id || !formData.price) {
      showToast('Preencha todos os campos obrigatórios', 'error');
      return;
    }

    try {
      const productData = {
        restaurant_id: restaurant.id,
        name: formData.name,
        category_id: formData.category_id,
        description: formData.description,
        price: parseFloat(formData.price),
        preparation_time: parseInt(formData.preparation_time) || 15,
        is_available: formData.is_available,
        image_url: formData.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop'
      };

      if (editingProduct) {
        await Product.update(editingProduct.id, productData);
        setProducts(products.map(p => 
          p.id === editingProduct.id ? { ...p, ...productData } : p
        ));
      } else {
        const newProduct = await Product.create(productData);
        setProducts([...products, newProduct]);
      }

      showToast(`Produto ${editingProduct ? 'atualizado' : 'criado'}!`);

      setShowAddModal(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        category_id: '',
        description: '',
        price: '',
        preparation_time: '',
        is_available: true,
        image_url: ''
      });

    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      showToast('Erro ao salvar produto', 'error');
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

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Sem categoria';
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category_id === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  // ─── Add/Edit Modal ───
  if (showAddModal) {
    return (
      <div className="relative w-full min-h-screen bg-white overflow-y-auto pb-24">
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Header */}
        <div className="bg-white px-8 pt-12 pb-4">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => {
                setShowAddModal(false);
                setEditingProduct(null);
                setFormData({
                  name: '',
                  category_id: '',
                  description: '',
                  price: '',
                  preparation_time: '',
                  is_available: true,
                  image_url: ''
                });
              }}
              className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6 text-[#3c0068]" />
            </button>
            
            <h1 className="text-xl font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </h1>
            
            <div className="w-14 h-14" />
          </div>
        </div>

        {/* Form */}
        <div className="px-8">
          
          {/* Image Upload */}
          <div className="bg-gray-50 rounded-3xl p-6 mb-6 text-center">
            <div className="w-32 h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden">
              {formData.image_url ? (
                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <Camera className="w-12 h-12 text-gray-300" />
              )}
            </div>
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="URL da imagem"
              className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-[#3c0068] outline-none border-2 border-gray-100 focus:border-[#ff4700] mb-2 transition-colors"
            />
            <p className="text-xs text-gray-400">Cole o link da imagem do produto</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 mb-2 block">NOME DO PRODUTO *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Beef Burger"
                className="w-full bg-gray-50 rounded-2xl px-4 py-4 text-sm text-[#3c0068] outline-none border-2 border-gray-100 focus:border-[#ff4700] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 mb-2 block">CATEGORIA *</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full bg-gray-50 rounded-2xl px-4 py-4 text-sm text-[#3c0068] outline-none border-2 border-gray-100 focus:border-[#ff4700] transition-colors"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 mb-2 block">DESCRIÇÃO</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o produto..."
                className="w-full bg-gray-50 rounded-2xl px-4 py-4 text-sm text-[#3c0068] outline-none border-2 border-gray-100 focus:border-[#ff4700] resize-none transition-colors"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 mb-2 block">PREÇO (MT) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className="w-full bg-gray-50 rounded-2xl px-4 py-4 text-sm text-[#3c0068] outline-none border-2 border-gray-100 focus:border-[#ff4700] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 mb-2 block">PREPARO (min)</label>
                <input
                  type="number"
                  value={formData.preparation_time}
                  onChange={(e) => setFormData({ ...formData, preparation_time: e.target.value })}
                  placeholder="15"
                  className="w-full bg-gray-50 rounded-2xl px-4 py-4 text-sm text-[#3c0068] outline-none border-2 border-gray-100 focus:border-[#ff4700] transition-colors"
                />
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
              <span className="text-sm font-bold text-[#3c0068]">Produto disponível</span>
              <button
                onClick={() => setFormData({ ...formData, is_available: !formData.is_available })}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  formData.is_available ? 'bg-[#ff4700]' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${
                  formData.is_available ? 'right-1' : 'left-1'
                }`}></div>
              </button>
            </div>
          </div>

          <button 
            onClick={handleSaveProduct}
            className="w-full bg-[#ff4700] text-white font-bold text-base py-5 rounded-3xl shadow-lg mt-6 active:opacity-80 transition-opacity"
          >
            {editingProduct ? 'Salvar Alterações' : 'Adicionar Produto'}
          </button>

        </div>
      </div>
    );
  }

  // ─── Main Render ───
  return (
    <div className="relative w-full min-h-screen bg-white overflow-y-auto pb-24">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ═══ Fixed Header ═══ */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10 px-8 pt-12 pb-4">
        <div className="flex items-center justify-between mb-6">
          <button className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-[#3c0068]" />
          </button>
          
          <h1 className="text-2xl font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
            Cardápio
          </h1>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-14 h-14 bg-[#ff4700] rounded-2xl flex items-center justify-center shadow-lg active:opacity-80 transition-opacity"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative bg-gray-50 rounded-3xl px-6 py-5 flex items-center mb-4">
          <Search className="w-5 h-5 text-gray-400 absolute left-6" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar produto..." 
            className="bg-transparent w-full pl-10 text-sm text-gray-400 outline-none"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex-shrink-0 rounded-2xl px-4 py-4 text-sm font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#ff4700] text-white shadow-lg'
                : 'bg-gray-50 text-[#3c0068]'
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 rounded-2xl px-4 py-4 text-sm font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#ff4700] text-white shadow-lg'
                  : 'bg-gray-50 text-[#3c0068]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ Content ═══ */}
      <div className="mt-72 px-8">
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-[#3c0068]">{products.length}</p>
            <p className="text-xs text-gray-400">Total</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-[#ff4700]">
              {products.filter(p => p.is_available !== false).length}
            </p>
            <p className="text-xs text-gray-400">Ativos</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-400">
              {products.filter(p => p.is_available === false).length}
            </p>
            <p className="text-xs text-gray-400">Inativos</p>
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className={`bg-gray-50 rounded-3xl overflow-hidden ${
                product.is_available === false ? 'opacity-50' : ''
              }`}
            >
              <div className="p-5">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop';
                        }}
                      />
                    ) : (
                      <span className="text-3xl">🍔</span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-base font-bold text-[#3c0068] truncate">{product.name}</h3>
                      {product.is_available === false && (
                        <span className="bg-red-50 text-red-500 text-xs font-bold px-2 py-1 rounded-xl flex-shrink-0">
                          Indisponível
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mb-1">{getCategoryName(product.category_id)}</p>
                    <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white rounded-2xl p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-[#ff4700] rounded-xl flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-sm font-bold text-[#3c0068]">MT {parseFloat(product.price || 0).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-[#3c0068] rounded-xl flex items-center justify-center">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-sm font-bold text-[#3c0068]">{product.preparation_time || 15} min</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => toggleAvailability(product.id)}
                    className={`rounded-2xl py-3 flex items-center justify-center transition-all active:opacity-80 ${
                      product.is_available !== false
                        ? 'bg-[#ff4700] text-white' 
                        : 'bg-gray-200 text-[#3c0068]'
                    }`}
                  >
                    {product.is_available !== false ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-white rounded-2xl py-3 flex items-center justify-center border-2 border-gray-100 active:bg-gray-50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-[#3c0068]" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-white rounded-2xl py-3 flex items-center justify-center border-2 border-red-100 active:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Search className="w-16 h-16 text-gray-200" />
            </div>
            <h2 className="text-2xl font-bold text-[#3c0068] mb-2" style={{ fontFamily: 'serif' }}>
              Nenhum Produto
            </h2>
            <p className="text-sm text-gray-400 text-center mb-6">
              {products.length === 0 
                ? 'Adicione seu primeiro produto ao cardápio'
                : 'Não encontramos produtos com esses filtros'
              }
            </p>
            {products.length === 0 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-[#ff4700] text-white font-bold px-8 py-4 rounded-2xl shadow-lg active:opacity-80 transition-opacity"
              >
                Adicionar Produto
              </button>
            )}
          </div>
        )}

      </div>

      <BottomNavRO activePage="RestaurantOwnerMenu" />
    </div>
  );
}
