
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, MapPin, DollarSign } from "lucide-react";

const statusColors = {
  pendente: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmado: "bg-blue-100 text-blue-800 border-blue-200",
  em_preparacao: "bg-indigo-100 text-indigo-800 border-indigo-200",
  pronto: "bg-purple-100 text-purple-800 border-purple-200",
  saiu_entrega: "bg-sky-100 text-sky-800 border-sky-200",
  entregue: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelado: "bg-red-100 text-red-800 border-red-200"
};

const statusLabels = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  em_preparacao: "Preparando",
  pronto: "Pronto",
  saiu_entrega: "Saiu p/ Entrega",
  entregue: "Entregue",
  cancelado: "Cancelado"
};

export default function RecentOrders({ orders }) {
  if (!orders || orders.length === 0) {
    return (
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Clock className="w-5 h-5 text-orange-600" />
            Pedidos Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500">Nenhum pedido encontrado</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Clock className="w-5 h-5 text-orange-600" />
          Pedidos Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 bg-white"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                  #{order.order_number?.slice(-2) || "00"}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">
                      Pedido #{order.order_number}
                    </p>
                    <Badge className={`${statusColors[order.status]} border text-xs font-medium`}>
                      {statusLabels[order.status]}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {format(new Date(order.created_date), "HH:mm", { locale: ptBR })}
                    </span>
                    {order.delivery_address && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {order.delivery_address.neighborhood}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-slate-900 flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-orange-600" />
                  {order.total_amount ? order.total_amount.toFixed(2) : "0.00"}
                </p>
                <p className="text-xs text-slate-500">
                  {order.items?.length || 0} itens
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
