
import React, { useState, useEffect } from "react";
import { Order } from "@/api/entities";
import { Restaurant } from "@/api/entities";
import { Product } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { PlusCircle, Trash2, X } from "lucide-react";

export default function NewOrderModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    customer_id: "",
    restaurant_id: "",
    items: [],
    delivery_address: { street: "", number: "", neighborhood: "", city: "Cidade" },
    payment_method: "dinheiro",
  });

  const [restaurants, setRestaurants] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [restaurantData, customerData] = await Promise.all([
          Restaurant.list(),
          User.filter({ user_type: "cliente" }),
        ]);
        setRestaurants(restaurantData);
        setCustomers(customerData);
      } catch (error) {
        console.error("Erro ao carregar dados para novo pedido:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.restaurant_id) {
      const fetchProducts = async () => {
        const productData = await Product.filter({ restaurant_id: formData.restaurant_id, is_available: true });
        setProducts(productData);
      };
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [formData.restaurant_id]);

  const handleAddItem = (product) => {
    setFormData(prev => {
      const existingItem = prev.items.find(item => item.product_id === product.id);
      if (existingItem) {
        return {
          ...prev,
          items: prev.items.map(item =>
            item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      } else {
        return {
          ...prev,
          items: [...prev.items, { product_id: product.id, name: product.name, quantity: 1, price: product.price }],
        };
      }
    });
  };
  
  const handleRemoveItem = (productId) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.product_id !== productId)
    }))
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const total = calculateTotal();
      const orderData = {
        ...formData,
        order_number: `M-${Date.now().toString().slice(-6)}`,
        status: "confirmado",
        subtotal: total,
        total_amount: total, // Assuming delivery fee is handled elsewhere or is 0 for manual orders
        items: formData.items.map(i => ({...i, unit_price: i.price, total_price: i.price * i.quantity})),
      };
      await Order.create(orderData);
      onSave();
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
    }
    setSaving(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Criar Novo Pedido Manual</DialogTitle>
        </DialogHeader>
        
        <div className="flex-grow overflow-y-auto pr-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Coluna Esquerda: Detalhes e Itens */}
          <div className="space-y-4">
            <div>
              <Label>Cliente</Label>
              <Select onValueChange={(value) => setFormData({...formData, customer_id: value})}>
                <SelectTrigger><SelectValue placeholder="Selecione um cliente..." /></SelectTrigger>
                <SelectContent>
                  {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.full_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Endereço de Entrega</Label>
              <Input placeholder="Rua" value={formData.delivery_address.street} onChange={e => setFormData({...formData, delivery_address: {...formData.delivery_address, street: e.target.value}})} className="mb-2" />
              <div className="flex gap-2">
                <Input placeholder="Número" value={formData.delivery_address.number} onChange={e => setFormData({...formData, delivery_address: {...formData.delivery_address, number: e.target.value}})} />
                <Input placeholder="Bairro" value={formData.delivery_address.neighborhood} onChange={e => setFormData({...formData, delivery_address: {...formData.delivery_address, neighborhood: e.target.value}})} />
              </div>
            </div>
            <div>
              <Label>Itens do Pedido</Label>
              <div className="p-3 border rounded-lg min-h-48 space-y-2">
                {formData.items.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-10">Selecione produtos ao lado</p>
                ) : (
                  formData.items.map(item => (
                    <div key={item.product_id} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded">
                      <span>{item.name} (x{item.quantity})</span>
                      <div className="flex items-center gap-2">
                        <span>MT {(item.price * item.quantity).toFixed(2)}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveItem(item.product_id)}>
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
             <div className="text-right font-bold text-lg">
                Total: MT {calculateTotal().toFixed(2)}
            </div>
          </div>

          {/* Coluna Direita: Seleção de Produtos */}
          <div className="space-y-4">
            <div>
              <Label>Restaurante</Label>
              <Select onValueChange={value => setFormData({ ...formData, restaurant_id: value, items: [] })}>
                <SelectTrigger><SelectValue placeholder="Selecione um restaurante..." /></SelectTrigger>
                <SelectContent>
                  {restaurants.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Cardápio</Label>
              <div className="border rounded-lg max-h-96 overflow-y-auto p-2 space-y-2">
                {!formData.restaurant_id ? (
                    <p className="text-sm text-slate-500 text-center py-10">Selecione um restaurante para ver o cardápio</p>
                ) : products.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-10">Nenhum produto disponível</p>
                ) : (
                    products.map(product => (
                      <div key={product.id} className="flex items-center justify-between p-2 hover:bg-slate-100 rounded cursor-pointer" onClick={() => handleAddItem(product)}>
                          <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-slate-600">MT {product.price.toFixed(2)}</p>
                          </div>
                          <PlusCircle className="w-5 h-5 text-orange-600" />
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving || formData.items.length === 0} className="bg-orange-600 hover:bg-orange-700">
            {saving ? "Salvando..." : "Criar Pedido"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
