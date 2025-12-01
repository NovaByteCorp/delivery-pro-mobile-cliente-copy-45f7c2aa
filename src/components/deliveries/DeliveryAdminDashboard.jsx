
import React, { useState, useEffect } from "react";
import { DeliveryPerson } from "@/api/entities";
import { Order } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck, Search, MapPin, Phone } from "lucide-react";

export default function DeliveryAdminDashboard() {
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [personsData, ordersData] = await Promise.all([
        DeliveryPerson.list(),
        Order.filter({ status: "saiu_entrega" })
      ]);
      setDeliveryPersons(personsData);
      setOngoingOrders(ordersData);
    } catch (error) {
      console.error("Erro ao carregar dados de entrega:", error);
    }
    setLoading(false);
  };
  
  const filteredPersons = deliveryPersons.filter(person => 
    !searchQuery || person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Gestão de Entregas</h1>
        <p className="text-slate-600">Monitore seus entregadores e entregas em andamento.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-orange-600" />
                  Entregadores ({deliveryPersons.length})
                </div>
                <div className="relative w-full max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar entregador..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPersons.map(person => (
                  <div key={person.id} className="p-4 border rounded-xl flex items-center gap-4 bg-white">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{person.name?.[0] || 'E'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{person.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={person.is_available ? "default" : "secondary"} className={person.is_available ? "bg-emerald-500" : ""}>
                          {person.is_available ? "Disponível" : "Offline"}
                        </Badge>
                        <Badge variant="outline" className="capitalize">{person.vehicle_type}</Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                Entregas em Andamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ongoingOrders.length > 0 ? (
                <div className="space-y-3">
                  {ongoingOrders.map(order => (
                    <div key={order.id} className="p-3 border rounded-lg">
                      <p className="font-semibold">Pedido #{order.order_number}</p>
                      <p className="text-sm text-slate-600">Entregador: {deliveryPersons.find(p => p.id === order.delivery_person_id)?.name || 'Não atribuído'}</p>
                      <p className="text-xs text-slate-500">{order.delivery_address.street}, {order.delivery_address.neighborhood}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-8">Nenhuma entrega em andamento.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
