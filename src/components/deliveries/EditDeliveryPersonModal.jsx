import React, { useState, useEffect } from "react";
import { DeliveryPerson } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Truck, 
  AlertCircle, 
  CheckCircle,
  User,
  Phone,
  Mail,
  CreditCard,
  Car
} from "lucide-react";

export default function EditDeliveryPersonModal({ deliveryPerson, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    document_number: "",
    vehicle_type: "",
    vehicle_plate: "",
    is_available: true,
    is_active: true,
    bank_account: {
      bank: "",
      agency: "",
      account: ""
    }
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (deliveryPerson) {
      setFormData({
        name: deliveryPerson.name || "",
        phone: deliveryPerson.phone || "",
        email: deliveryPerson.email || "",
        document_number: deliveryPerson.document_number || "",
        vehicle_type: deliveryPerson.vehicle_type || "",
        vehicle_plate: deliveryPerson.vehicle_plate || "",
        is_available: deliveryPerson.is_available !== false,
        is_active: deliveryPerson.is_active !== false,
        bank_account: deliveryPerson.bank_account || {
          bank: "",
          agency: "",
          account: ""
        }
      });
    }
  }, [deliveryPerson]);

  const vehicleTypes = [
    { value: "bicicleta", label: "Bicicleta" },
    { value: "motocicleta", label: "Motocicleta" },
    { value: "carro", label: "Carro" }
  ];

  const banks = [
    "BCI - Banco Comercial e de Investimentos",
    "Millennium bim",
    "Standard Bank",
    "Banco ABC",
    "FNB Moçambique",
    "Banco Único",
    "Ecobank Moçambique",
    "Nedbank",
    "Banco Terra"
  ];

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = "Nome completo é obrigatório";
        } else if (value.length < 3) {
          newErrors.name = "Nome deve ter pelo menos 3 caracteres";
        } else {
          delete newErrors.name;
        }
        break;
      
      case 'phone':
        const phoneRegex = /^(\+258|258)?[0-9]{9}$/;
        if (!value.trim()) {
          newErrors.phone = "Telefone é obrigatório";
        } else if (!phoneRegex.test(value.replace(/\s/g, ''))) {
          newErrors.phone = "Telefone deve ter formato válido moçambicano";
        } else {
          delete newErrors.phone;
        }
        break;
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = "Email é obrigatório";
        } else if (!emailRegex.test(value)) {
          newErrors.email = "Email deve ter formato válido";
        } else {
          delete newErrors.email;
        }
        break;
      
      case 'vehicle_plate':
        if (!value.trim()) {
          newErrors.vehicle_plate = "Placa do veículo é obrigatória";
        } else {
          delete newErrors.vehicle_plate;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (name, value) => {
    if (name.startsWith('bank_account.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        bank_account: {
          ...formData.bank_account,
          [field]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
      validateField(name, value);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.phone.trim()) newErrors.phone = "Telefone é obrigatório";
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório";
    if (!formData.vehicle_type) newErrors.vehicle_type = "Veículo é obrigatório";
    if (!formData.vehicle_plate.trim()) newErrors.vehicle_plate = "Placa é obrigatória";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      await DeliveryPerson.update(deliveryPerson.id, formData);
      onSave();
    } catch (error) {
      console.error("Erro ao atualizar entregador:", error);
      setErrors({ general: "Erro ao salvar entregador. Verifique os dados e tente novamente." });
    }
    setSaving(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <Truck className="w-6 h-6 text-white" />
            </div>
            Editar Entregador
          </DialogTitle>
        </DialogHeader>

        {errors.general && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Informações Pessoais */}
          <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-red-600 text-white px-3 py-1 text-sm font-bold">
                  OBRIGATÓRIO
                </Badge>
                <h3 className="text-lg font-bold text-slate-800">Informações Pessoais</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-600" />
                    Nome Completo *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`h-12 ${errors.name ? 'border-red-500 bg-red-50' : 'border-orange-300'}`}
                  />
                  {errors.name && <span className="text-red-600 text-xs font-medium">{errors.name}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document_number" className="text-sm font-bold flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-orange-600" />
                    Número do Documento
                  </Label>
                  <Input
                    id="document_number"
                    value={formData.document_number}
                    onChange={(e) => handleInputChange('document_number', e.target.value)}
                    placeholder="12345678901"
                    className="h-12"
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-bold flex items-center gap-2">
                    <Phone className="w-4 h-4 text-orange-600" />
                    Telefone *
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`h-12 ${errors.phone ? 'border-red-500 bg-red-50' : 'border-orange-300'}`}
                  />
                  {errors.phone && <span className="text-red-600 text-xs font-medium">{errors.phone}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold flex items-center gap-2">
                    <Mail className="w-4 h-4 text-orange-600" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`h-12 ${errors.email ? 'border-red-500 bg-red-50' : 'border-orange-300'}`}
                  />
                  {errors.email && <span className="text-red-600 text-xs font-medium">{errors.email}</span>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Veículo */}
          <Card className="border border-slate-200">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Informações do Veículo</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold flex items-center gap-2">
                    <Car className="w-4 h-4 text-orange-600" />
                    Tipo de Veículo *
                  </Label>
                  <Select value={formData.vehicle_type} onValueChange={(value) => handleInputChange('vehicle_type', value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione o tipo de veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="text-base">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicle_plate" className="text-sm font-bold">
                    Placa do Veículo *
                  </Label>
                  <Input
                    id="vehicle_plate"
                    value={formData.vehicle_plate}
                    onChange={(e) => handleInputChange('vehicle_plate', e.target.value.toUpperCase())}
                    className={`h-12 ${errors.vehicle_plate ? 'border-red-500 bg-red-50' : ''}`}
                  />
                  {errors.vehicle_plate && <span className="text-red-600 text-xs font-medium">{errors.vehicle_plate}</span>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card className="border border-slate-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Status</h3>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center space-x-3">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                  />
                  <Label htmlFor="is_active" className="font-medium">Entregador ativo na plataforma</Label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Switch
                    id="is_available"
                    checked={formData.is_available}
                    onCheckedChange={(checked) => setFormData({...formData, is_available: checked})}
                  />
                  <Label htmlFor="is_available" className="font-medium">Disponível para entregas</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <p className="text-sm text-slate-600">* Campos obrigatórios</p>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={saving} className="px-6 h-12">
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving || Object.keys(errors).length > 0}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 h-12"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}