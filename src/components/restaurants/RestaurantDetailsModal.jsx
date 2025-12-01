import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  MapPin,
  Phone,
  Mail,
  DollarSign,
  UtensilsCrossed,
  Star,
  Clock
} from "lucide-react";

export default function RestaurantDetailsModal({ restaurant, onClose }) {
  if (!restaurant) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            Detalhes do Restaurante
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Imagem e Informações Básicas */}
          <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {restaurant.image_url && (
                  <img 
                    src={restaurant.image_url} 
                    alt={restaurant.name}
                    className="w-24 h-24 object-cover rounded-lg border-2 border-orange-200"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{restaurant.name}</h3>
                  <p className="text-slate-600 mb-4">{restaurant.description}</p>
                  
                  <div className="flex gap-2 flex-wrap">
                    <Badge className="bg-orange-100 text-orange-800 capitalize">
                      {restaurant.cuisine_type}
                    </Badge>
                    <Badge className={restaurant.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {restaurant.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                    <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      {restaurant.rating?.toFixed(1) || '5.0'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações de Contato */}
          <Card className="border border-slate-200">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Phone className="w-5 h-5 text-slate-600" />
                Informações de Contato
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-orange-600" />
                  <div>
                    <p className="text-sm text-slate-600">Telefone</p>
                    <p className="font-semibold">{restaurant.phone}</p>
                  </div>
                </div>

                {restaurant.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-orange-600" />
                    <div>
                      <p className="text-sm text-slate-600">Email</p>
                      <p className="font-semibold">{restaurant.email}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-orange-600" />
                <div>
                  <p className="text-sm text-slate-600">Endereço</p>
                  <p className="font-semibold">{restaurant.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configurações Operacionais */}
          <Card className="border border-slate-200">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-slate-600" />
                Configurações Operacionais
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-orange-600" />
                  <div>
                    <p className="text-sm text-slate-600">Pedido Mínimo</p>
                    <p className="font-semibold">MT {restaurant.minimum_order?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <div>
                    <p className="text-sm text-slate-600">Tempo Médio de Entrega</p>
                    <p className="font-semibold">25-35 min</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Horários de Funcionamento */}
          {restaurant.operating_hours && (
            <Card className="border border-slate-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-slate-600" />
                  Horários de Funcionamento
                </h3>

                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(restaurant.operating_hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                      <span className="font-medium capitalize">{day}</span>
                      <span className="text-slate-600">{hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}