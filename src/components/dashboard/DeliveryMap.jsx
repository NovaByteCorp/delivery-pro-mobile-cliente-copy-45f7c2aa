
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Truck, Clock } from "lucide-react";

export default function DeliveryMap({ deliveryPersons }) {
  const activeDeliveries = deliveryPersons?.filter(d => d.is_available && d.is_active) || [];
  
  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="w-5 h-5 text-orange-600" />
          Entregadores Ativos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeDeliveries.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Truck className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-500 text-sm">Nenhum entregador ativo</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeDeliveries.slice(0, 5).map((delivery) => (
              <div
                key={delivery.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {delivery.name?.[0] || "E"}
                  </div>
                  
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{delivery.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                        Disponível
                      </Badge>
                      <span className="text-xs text-slate-500 capitalize">
                        {delivery.vehicle_type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <Clock className="w-3 h-3" />
                    Online
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {delivery.total_deliveries || 0} entregas
                  </p>
                </div>
              </div>
            ))}
            
            {activeDeliveries.length > 5 && (
              <p className="text-center text-xs text-slate-500 pt-2">
                +{activeDeliveries.length - 5} outros entregadores
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
