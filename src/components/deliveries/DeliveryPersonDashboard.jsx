
import React, { useState, useEffect } from "react";
import { DeliveryPerson } from "@/api/entities";
import { Order } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Bike, Check, Package, X } from "lucide-react";

export default function DeliveryPersonDashboard({ user }) {
  const [deliveryPerson, setDeliveryPerson] = useState(null);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [currentDelivery, setCurrentDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const personData = await DeliveryPerson.filter({ user_id: user.id });
      if (personData.length > 0) {
        const person = personData[0];
        setDeliveryPerson(person);
        
        // Fetch current delivery first
        const currentOrderData = await Order.filter({ delivery_person_id: person.id, status: "saiu_entrega" });
        const currentOrder = currentOrderData.length > 0 ? currentOrderData[0] : null;
        setCurrentDelivery(currentOrder);
        
        // Fetch available orders only if not on a delivery and available
        if (!currentOrder && person.is_available) {
          const availableOrderData = await Order.filter({ status: "pronto" });
          setAvailableOrders(availableOrderData);
        } else {
          setAvailableOrders([]);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados do entregador:", error);
    }
    setLoading(false);
  };

  const handleAvailabilityToggle = async (is_available) => {
    if (!deliveryPerson) return;
    try {
      await DeliveryPerson.update(deliveryPerson.id, { is_available });
      setDeliveryPerson({ ...deliveryPerson, is_available });
      // Refetch available orders if becoming available
      if (is_available) {
        fetchData();
      } else {
        setAvailableOrders([]);
      }
    } catch (error) {
      console.error("Erro ao atualizar disponibilidade:", error);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await Order.update(orderId, { delivery_person_id: deliveryPerson.id, status: "saiu_entrega" });
      fetchData(); // Refresh all data
    } catch (error) {
      console.error("Erro ao aceitar pedido:", error);
    }
  };
  
  const handleCompleteDelivery = async () => {
     if(!currentDelivery) return;
      try {
        await Order.update(currentDelivery.id, { status: "entregue" });
        await DeliveryPerson.update(deliveryPerson.id, { total_deliveries: (deliveryPerson.total_deliveries || 0) + 1 });
        fetchData();
      } catch(error) {
        console.error("Erro ao completar entrega:", error);
      }
  };

  if (loading) return <p>Carregando painel...</p>;
  if (!deliveryPerson) return <p>Perfil de entregador não encontrado.</p>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Painel do Entregador</h1>
          <p className="text-slate-600">Bem-vindo, {deliveryPerson.name}.</p>
        </div>
        <div className="flex items-center space-x-2 p-3 rounded-lg bg-white shadow-sm border">
          <Switch 
            id="availability" 
            checked={deliveryPerson.is_available}
            onCheckedChange={handleAvailabilityToggle}
          />
          <Label htmlFor="availability" className={`font-semibold ${deliveryPerson.is_available ? 'text-emerald-600' : 'text-slate-600'}`}>
            {deliveryPerson.is_available ? "Disponível" : "Offline"}
          </Label>
        </div>
      </div>

      {currentDelivery ? (
        <Card className="shadow-xl border-orange-300 bg-orange-50/50">
          <CardHeader>
            <CardTitle className="text-orange-800">Sua Entrega Atual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                <p className="text-lg font-bold">Pedido #{currentDelivery.order_number}</p>
                <p className="text-sm text-slate-700">
                  {currentDelivery.delivery_address.street}, {currentDelivery.delivery_address.number}, {currentDelivery.delivery_address.neighborhood}
                </p>
             </div>
             <Button onClick={handleCompleteDelivery} className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Check className="mr-2 h-4 w-4" /> Marcar como Entregue
             </Button>
          </CardContent>
        </Card>
      ) : deliveryPerson.is_available ? (
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Ofertas de Entrega Disponíveis ({availableOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {availableOrders.length > 0 ? (
              <div className="space-y-4">
                {availableOrders.map(order => (
                  <div key={order.id} className="p-4 border rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white">
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-900">Pedido #{order.order_number}</p>
                      <p className="text-sm text-slate-600">{order.delivery_address.street}, {order.delivery_address.neighborhood}</p>
                    </div>
                    <Button onClick={() => handleAcceptOrder(order.id)}>
                      <Bike className="mr-2 h-4 w-4" /> Aceitar Entrega
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 py-10">Nenhuma oferta de entrega no momento. Aguardando novos pedidos...</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
             <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Você está offline</h3>
                <p className="text-slate-500 mt-1">Ative sua disponibilidade para ver novas entregas.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
