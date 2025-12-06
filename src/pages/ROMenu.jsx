import React, { useState } from 'react';
import { ChevronLeft, Plus, Edit2, Trash2, Eye, EyeOff, Search, Filter, Clock, DollarSign, Camera, Package, TrendingUp, Settings } from 'lucide-react';
import BottomNavRO from '../components/restaurants/ROBottomNav';

export default function RestaurantOwnerMenu() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Beef Burger',
      category: 'Burgers',
      price: 7.99,
      prepTime: 15,
      image: '/api/placeholder/120/120',
      available: true,
      description: 'Beef Patty and special sauce',
      sales: 145
    },
    {
      id: 2,
      name: 'Chicken Burger',
      category: 'Burgers',
      price: 4.99,
      prepTime: 12,
      image: '/api/placeholder/120/120',
      available: true,
      description: 'Chicken Patty and special sauce',
      sales: 98
    },
    {
      id: 3,
      name: 'XL Burger',
      category: 'Burgers',
      price: 11.00,
      prepTime: 20,
      image: '/api/placeholder/120/120',
      available: true,
      description: 'Cheese & beef pastrami perfectly paired',
      sales: 67
    },
    {
      id: 4,
      name: 'French Fries',
      category: 'Acompanhamentos',
      price: 3.99,
      prepTime: 8,
      image: '/api/placeholder/120/120',
      available: true,
      description: 'Cut deep fried potatoes',
      sales: 203
    },
    {
      id: 5,
      name: 'Onion Rings',
      category: 'Acompanhamentos',
      price: 4.50,
      prepTime: 10,
      image: '/api/placeholder/120/120',
      available: false,
      description: 'Crispy fried onion rings',
      sales: 54
    },
    {
      id: 6,
      name: 'Coca-Cola',
      category: 'Bebidas',
      price: 2.50,
      prepTime: 2,
      image: '/api/placeholder/120/120',
      available: true,
      description: '350ml',
      sales: 189
    }
  ]);

  const categories = ['all', 'Burgers', 'Acompanhamentos', 'Bebidas'];

  const toggleAvailability = (id) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, available: !p.available } : p
    ));
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowAddModal(true);
  };

  const handleSaveProduct = () => {
    setShowAddModal(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryLabel = (cat) => {
    return cat === 'all' ? 'Todos' : cat;
  };

  if (showAddModal) {
    return (
      <div className="flex items-center justify-center min-h-screen pb-24 bg-gray-100">
        <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
          <div className="relative w-full h-screen bg-white overflow-y-auto pb-8">
            
            {/* Header */}
            <div className="bg-gray-800 px-8 pt-12 pb-8 rounded-b-3xl">
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                  }}
                  className="w-14 h-14 bg-gray-700 rounded-2xl flex items-center justify-center"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                
                <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'serif' }}>
                  {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                </h1>
                
                <div className="w-14 h-14" />
              </div>
            </div>

            {/* Form */}
            <div className="px-8 mt-6">
              
              {/* Image Upload */}
              <div className="bg-gray-50 rounded-3xl p-6 mb-6 text-center">
                <div className="w-32 h-32 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-12 h-12 text-white" />
                </div>
                <button className="bg-orange-500 text-white font-bold px-6 py-3 rounded-2xl">
                  Adicionar Foto
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 mb-2 block">NOME DO PRODUTO</label>
                  <input
                    type="text"
                    defaultValue={editingProduct?.name}
                    placeholder="Ex: Beef Burger"
                    className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none border-2 border-gray-200 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 mb-2 block">CATEGORIA</label>
                  <select
                    defaultValue={editingProduct?.category}
                    className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none border-2 border-gray-200 focus:border-orange-500"
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Burgers">Burgers</option>
                    <option value="Acompanhamentos">Acompanhamentos</option>
                    <option value="Bebidas">Bebidas</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 mb-2 block">DESCRIÇÃO</label>
                  <textarea
                    defaultValue={editingProduct?.description}
                    placeholder="Descreva o produto..."
                    className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none border-2 border-gray-200 focus:border-orange-500 resize-none"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 mb-2 block">PREÇO (MT)</label>
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={editingProduct?.price}
                      placeholder="0.00"
                      className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none border-2 border-gray-200 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 mb-2 block">PREPARO (min)</label>
                    <input
                      type="number"
                      defaultValue={editingProduct?.prepTime}
                      placeholder="15"
                      className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none border-2 border-gray-200 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={editingProduct?.available ?? true}
                      className="w-5 h-5 text-orange-500 rounded"
                    />
                    <span className="text-sm font-bold text-gray-800">Produto disponível</span>
                  </label>
                </div>
              </div>

              <button 
                onClick={handleSaveProduct}
                className="w-full bg-orange-500 text-white font-bold text-base py-5 rounded-3xl shadow-lg mt-6"
              >
                {editingProduct ? 'Salvar Alterações' : 'Adicionar Produto'}
              </button>

            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
        <div className="relative w-full h-screen bg-white overflow-y-auto pb-8">
          
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 bg-white z-10 px-8 pt-12 pb-4 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <button className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              
              <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'serif' }}>
                Cardápio
              </h1>
              
              <button 
                onClick={() => setShowAddModal(true)}
                className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Plus className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative bg-gray-50 rounded-2xl px-4 py-3 flex items-center mb-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar produto..." 
                className="bg-transparent w-full pl-3 text-sm text-gray-800 outline-none placeholder-gray-400"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-gray-50 text-gray-800'
                  }`}
                >
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="mt-64 px-8">
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-800">{products.length}</p>
                <p className="text-xs text-gray-400">Total</p>
              </div>
              <div className="bg-green-50 rounded-2xl p-4 text-center">
                <p className="text-2xl font-bold text-green-500">
                  {products.filter(p => p.available).length}
                </p>
                <p className="text-xs text-gray-400">Ativos</p>
              </div>
              <div className="bg-red-50 rounded-2xl p-4 text-center">
                <p className="text-2xl font-bold text-red-500">
                  {products.filter(p => !p.available).length}
                </p>
                <p className="text-xs text-gray-400">Inativos</p>
              </div>
            </div>

            {/* Products List */}
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  className={`bg-gray-50 rounded-3xl overflow-hidden shadow-sm ${
                    !product.available ? 'opacity-50' : ''
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl">🍔</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-base font-bold text-gray-800">{product.name}</h3>
                          {!product.available && (
                            <span className="bg-red-100 text-red-500 text-xs font-bold px-2 py-1 rounded-lg">
                              Indisponível
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mb-2">{product.category}</p>
                        <p className="text-sm text-gray-600">{product.description}</p>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-white rounded-xl p-3 text-center">
                        <DollarSign className="w-4 h-4 text-green-500 mx-auto mb-1" />
                        <p className="text-sm font-bold text-gray-800">MT {product.price.toFixed(2)}</p>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center">
                        <Clock className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                        <p className="text-sm font-bold text-gray-800">{product.prepTime} min</p>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400 mb-1">Vendas</p>
                        <p className="text-sm font-bold text-gray-800">{product.sales}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => toggleAvailability(product.id)}
                        className={`rounded-2xl py-3 flex items-center justify-center space-x-1 ${
                          product.available 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {product.available ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-white rounded-2xl py-3 flex items-center justify-center border-2 border-gray-200"
                      >
                        <Edit2 className="w-4 h-4 text-gray-800" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-white rounded-2xl py-3 flex items-center justify-center border-2 border-red-200"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-16 h-16 text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'serif' }}>
                  Nenhum Produto
                </h2>
                <p className="text-sm text-gray-400 text-center">
                  Não encontramos produtos com esses filtros
                </p>
              </div>
            )}

          </div>

        </div>
      </div>
      <BottomNavRO activePage="RestaurantOwnerMenu" />
    </div>
  );
}
