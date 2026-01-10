import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Minus, Trash2, Loader2 } from 'lucide-react';
import { createPageUrl } from '@/utils';
import BottomNav from '../components/client/BottomNav';
import { supabase } from '@/supabase';

export default function CartScreen() {
  const navigate = (url) => {
    window.location.href = url;
  };

  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(cart);
    };

    loadCart();
    
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cartUpdate', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdate', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  const updateQuantity = (cartItemId, change) => {
    const updatedCart = cartItems.map(item =>
      item.cartItemId === cartItemId
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new CustomEvent('cartUpdate'));
  };

  const removeItem = (cartItemId) => {
    const updatedCart = cartItems.filter(item => item.cartItemId !== cartItemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new CustomEvent('cartUpdate'));
  };

  const createOrder = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Calcula os totais
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const deliveryFee = 2.50;
      const tax = subtotal * 0.1;
      const total = subtotal + deliveryFee + tax;

      // Pega o usuário do localStorage (conforme seu sistema de login)
      const testUser = localStorage.getItem('testUser');
      
      if (!testUser) {
        throw new Error('Você precisa estar logado para fazer um pedido. Por favor, faça login e tente novamente.');
      }

      const user = JSON.parse(testUser);
      const userId = user.id;

      if (!userId) {
        throw new Error('Usuário inválido. Por favor, faça login novamente.');
      }

      console.log('👤 Usuário autenticado:', userId, user.full_name);

      // Pega informações adicionais
      const userAddress = user.address || 
                         localStorage.getItem('delivery_address') || 
                         localStorage.getItem('userAddress') || 
                         'Av. Julius Nyerere, 123, Sommerschield, Maputo';
      
      // Pega o restaurant_id do primeiro item
      const restaurantId = cartItems[0]?.restaurant_id || 
                          cartItems[0]?.restaurantId || 
                          cartItems[0]?.restaurant?.id;

      if (!restaurantId) {
        throw new Error('Restaurante não identificado. Verifique os itens do carrinho.');
      }

      console.log('🚀 Criando pedido no Supabase...');
      console.log('📦 Dados:', { userId, restaurantId, total: total.toFixed(2) });

      // 1. Cria o pedido na tabela Order
      const orderData = {
        user_id: userId,
        restaurant_id: restaurantId,
        status: 'pending',
        subtotal: subtotal,
        delivery_fee: deliveryFee,
        total_amount: total,
        delivery_address: userAddress,
        payment_method: localStorage.getItem('payment_method') || 'cash',
        payment_status: 'pending',
        estimated_prep_time: 30,
        notes: ''
      };

      console.log('📤 Enviando pedido:', orderData);

      const { data: order, error: orderError } = await supabase
        .from('Order')
        .insert([orderData])
        .select()
        .single();

      if (orderError) {
        console.error('❌ Erro ao criar pedido:', orderError);
        console.error('❌ Detalhes:', orderError.details);
        console.error('❌ Hint:', orderError.hint);
        throw new Error(`Erro ao criar pedido: ${orderError.message}`);
      }

      console.log('✅ Pedido criado com ID:', order.id);

      // 2. Cria os itens do pedido na tabela OrderItem
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id || item.product_id || item.productId,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity,
        notes: item.removedIngredients?.length > 0 
          ? `Sem: ${item.removedIngredients.join(', ')}` 
          : (item.notes || '')
      }));

      console.log('📤 Enviando itens:', orderItems);

      const { data: items, error: itemsError } = await supabase
        .from('OrderItem')
        .insert(orderItems)
        .select();

      if (itemsError) {
        console.error('❌ Erro ao criar itens:', itemsError);
        console.error('❌ Detalhes:', itemsError.details);
        // Tenta deletar o pedido criado para manter consistência
        await supabase.from('Order').delete().eq('id', order.id);
        throw new Error(`Erro ao criar itens do pedido: ${itemsError.message}`);
      }

      console.log('✅ Itens criados:', items.length);

      // Salva o order_id no localStorage
      localStorage.setItem('last_order_id', order.id);

      // Navega para a confirmação
      navigate(createPageUrl('OrderConfirmation') + `?order_id=${order.id}`);

    } catch (err) {
      console.error('❌ Erro ao criar pedido:', err);
      setError(err.message || 'Erro ao processar pedido. Tente novamente.');
      setIsProcessing(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 2.50;
  const tax = subtotal * 0.1;
  const total = subtotal + deliveryFee + tax;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
        <div className="relative w-full h-screen bg-white overflow-y-auto pb-48">
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 bg-white z-10 px-8 pt-12 pb-4 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => window.history.back()}
                className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center"
                disabled={isProcessing}
              >
                <ChevronLeft className="w-6 h-6 text-[#3c0068]" />
              </button>

              <h1 className="text-2xl font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
                Meu Carrinho
              </h1>

              <div className="w-14 h-14" />
            </div>
          </div>

          {/* Content */}
          <div className="mt-32 px-8">
            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="text-sm text-red-600 text-center font-semibold mb-1">Erro</p>
                <p className="text-xs text-red-500 text-center">{error}</p>
              </div>
            )}

            {cartItems.length > 0 ? (
              <>
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.cartItemId} className="bg-gray-50 rounded-3xl p-4 shadow-lg">
                      <div className="flex space-x-4">
                        {/* Image */}
                        <div className="w-24 h-24 bg-[#3c0068] rounded-2xl overflow-hidden flex-shrink-0">
                          <img
                            src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop'}
                            alt={item.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop';
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <h3 className="text-base font-bold text-[#3c0068] mb-1 truncate">{item.name}</h3>
                            <p className="text-xs text-gray-400 mb-1 truncate">{item.restaurant || 'Restaurante'}</p>
                            <p className="text-xs text-gray-400 line-clamp-1">{item.description}</p>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <span className="text-lg font-bold text-[#3c0068]">
                              MT {(item.price * item.quantity).toFixed(2)}
                            </span>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => updateQuantity(item.cartItemId, -1)}
                                className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow"
                                disabled={isProcessing}
                              >
                                <Minus className="w-4 h-4 text-[#3c0068]" />
                              </button>
                              <span className="text-sm font-bold text-[#3c0068] w-6 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.cartItemId, 1)}
                                className="w-8 h-8 bg-[#ff4700] rounded-lg flex items-center justify-center shadow"
                                disabled={isProcessing}
                              >
                                <Plus className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => removeItem(item.cartItemId)}
                          className="w-10 h-10 bg-white rounded-xl flex items-center justify-center self-start shadow flex-shrink-0"
                          disabled={isProcessing}
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                      </div>

                      {/* Removed Ingredients */}
                      {item.removedIngredients && item.removedIngredients.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500 font-semibold mb-1">Sem:</p>
                          <p className="text-xs text-gray-400">{item.removedIngredients.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-4 text-[#3c0068]" style={{ fontFamily: 'serif' }}>
                    Resumo do Pedido
                  </h2>
                  <div className="bg-gray-50 rounded-3xl p-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Subtotal</span>
                      <span className="text-sm font-bold text-[#3c0068]">MT {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Taxa de Entrega</span>
                      <span className="text-sm font-bold text-[#3c0068]">MT {deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Taxa</span>
                      <span className="text-sm font-bold text-[#3c0068]">MT {tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-bold text-[#3c0068]">Total</span>
                        <span className="text-xl font-bold text-[#3c0068]">MT {total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Empty Cart State */
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <span className="text-6xl">🛒</span>
                </div>
                <h2 className="text-2xl font-bold text-[#3c0068] mb-2" style={{ fontFamily: 'serif' }}>
                  Seu Carrinho está Vazio
                </h2>
                <p className="text-sm text-gray-400 text-center mb-8">
                  Adicione itens ao carrinho para começar
                </p>
                <button 
                  onClick={() => navigate(createPageUrl('ClientDashboard'))}
                  className="bg-[#ff4700] text-white font-bold px-8 py-4 rounded-2xl shadow-lg"
                >
                  Ver Cardápio
                </button>
              </div>
            )}
          </div>

          {/* Checkout Button */}
          {cartItems.length > 0 && (
            <div className="fixed bottom-20 left-0 right-0 bg-white shadow-lg px-8 py-6">
              <button 
                onClick={createOrder}
                disabled={isProcessing}
                className={`w-full text-white font-bold text-lg py-5 rounded-3xl shadow-lg flex items-center justify-center space-x-2 ${
                  isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#ff4700]'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <span>Finalizar Pedido</span>
                )}
              </button>
            </div>
          )}

          {/* Bottom Navigation */}
          <BottomNav activePage="Cart" />
        </div>
      </div>
    </div>
  );
}