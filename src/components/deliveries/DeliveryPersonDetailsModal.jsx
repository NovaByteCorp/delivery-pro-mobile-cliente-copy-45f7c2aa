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
  Truck, 
  User,
  Phone,
  Mail,
  CreditCard,
  Car,
  Star,
  MapPin,
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function DeliveryPersonDetailsModal({ deliveryPerson, onClose }) {
  if (!deliveryPerson) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <Truck className="w-6 h-6 text-white" />
            </div>
            Detalhes do Entregador
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Pessoais */}
          <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{deliveryPerson.name}</h3>
                  
                  <div className="flex gap-2 flex-wrap mb-4">
                    <Badge className={deliveryPerson.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {deliveryPerson.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                    <Badge className={deliveryPerson.is_available ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
                      {deliveryPerson.is_available ? "Disponível" : "Indisponível"}
                    </Badge>
                    <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      {deliveryPerson.rating?.toFixed(1) || '5.0'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-orange-600" />
                      <span>{deliveryPerson.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-orange-600" />
                      <span>{deliveryPerson.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-orange-600" />
                      <span>{deliveryPerson.document_number}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      <span>Desde {format(new Date(deliveryPerson.created_date), "dd/MM/yyyy", { locale: ptBR })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Veículo */}
          <Card className="border border-slate-200">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Car className="w-5 h-5 text-slate-600" />
                Informações do Veículo
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Car className="w-4 h-4 text-orange-600" />
                  <div>
                    <p className="text-sm text-slate-600">Tipo de Veículo</p>
                    <p className="font-semibold capitalize">{deliveryPerson.vehicle_type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-orange-600" />
                  <div>
                    <p className="text-sm text-slate-600">Placa</p>
                    <p className="font-semibold">{deliveryPerson.vehicle_plate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card className="border border-slate-200">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-slate-600" />
                Estatísticas de Performance
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{deliveryPerson.total_deliveries || 0}</p>
                  <p className="text-sm text-blue-700">Total de Entregas</p>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{deliveryPerson.rating?.toFixed(1) || '5.0'}</p>
                  <p className="text-sm text-yellow-700">Avaliação Média</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">98%</p>
                  <p className="text-sm text-green-700">Taxa de Sucesso</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dados Bancários */}
          {deliveryPerson.bank_account && (
            <Card className="border border-slate-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Dados Bancários</h3>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <p className="text-sm text-slate-600">Banco</p>
                    <p className="font-semibold">{deliveryPerson.bank_account.bank || "Não informado"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Agência</p>
                      <p className="font-semibold">{deliveryPerson.bank_account.agency || "Não informado"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Conta</p>
                      <p className="font-semibold">{deliveryPerson.bank_account.account || "Não informado"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}