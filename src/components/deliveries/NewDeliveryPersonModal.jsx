import React, { useState } from "react";
import { DeliveryPerson } from "@/api/entities";
import { User } from "@/api/entities";
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
  Phone,
  Mail,
  Shield,
  Car
} from "lucide-react";

export default function NewDeliveryPersonModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    vehicle_type: "",
    vehicle_plate: "",
    document_number: "",
    is_available: true,
    is_active: true
  });

  const [loginData, setLoginData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: ""
  });

  const [bankData, setBankData] = useState({
    bank: "",
    agency: "",
    account: ""
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const vehicleTypes = ["bicicleta", "motocicleta", "carro"];

  const validateForm = async () => {
    const newErrors = {};

    // Validar dados do entregador
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.phone.trim()) newErrors.phone = "Telefone é obrigatório";
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório";
    if (!formData.vehicle_type) newErrors.vehicle_type = "Tipo de veículo é obrigatório";
    if (!formData.vehicle_plate.trim()) newErrors.vehicle_plate = "Placa é obrigatória";
    if (!formData.document_number.trim()) newErrors.document_number = "CPF é obrigatório";

    // Validar dados de login
    if (!loginData.full_name.trim()) newErrors.login_name = "Nome para login é obrigatório";
    if (!loginData.email.trim()) newErrors.login_email = "Email de login é obrigatório";
    if (!loginData.phone.trim()) newErrors.login_phone = "Telefone de login é obrigatório";
    if (!loginData.password.trim()) newErrors.login_password = "Senha é obrigatória";
    if (loginData.password.length < 6) newErrors.login_password = "Senha deve ter pelo menos 6 caracteres";

    // Verificar se email de login já existe
    try {
      const allUsers = await SystemUser.list();
      const existingUser = allUsers.find(u => u.email.toLowerCase() === loginData.email.toLowerCase());
      if (existingUser) {
        newErrors.login_email = "Este email já está em uso";
      }
    } catch (error) {
      console.error("Erro ao verificar email:", error);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    setSaving(true);
    try {
      // 1. Criar dados do entregador
      const deliveryData = {
        ...formData,
        bank_account: bankData.bank ? bankData : null,
        rating: 5.0,
        total_deliveries: 0
      };

      const newDeliveryPerson = await DeliveryPerson.create(deliveryData);

      // 2. Criar conta de login do entregador
      await SystemUser.create({
        full_name: loginData.full_name,
        email: loginData.email,
        phone: loginData.phone,
        password: loginData.password,
        user_type: "entregador",
        is_active: true
      });

      onSave();
    } catch (error) {
      console.error("Erro ao criar entregador:", error);
      setErrors({ general: "Erro ao salvar entregador. Verifique os dados." });
    }
    setSaving(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <Truck className="w-6 h-6 text-white" />
            </div>
            Cadastrar Novo Entregador
          </DialogTitle>
        </DialogHeader>

        {errors.general && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-8">
          {/* Informações do Entregador */}
          <Card className="border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-blue-600 text-white px-3 py-1 text-sm font-bold">ENTREGADOR</Badge>
                <h3 className="text-xl font-bold text-slate-800">Dados Profissionais</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-bold">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Pedro Silva Santos"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <span className="text-red-600 text-xs">{errors.name}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document_number" className="font-bold">CPF *</Label>
                  <Input
                    id="document_number"
                    value={formData.document_number}
                    onChange={(e) => setFormData({...formData, document_number: e.target.value})}
                    placeholder="123.456.789-00"
                    className={errors.document_number ? 'border-red-500' : ''}
                  />
                  {errors.document_number && <span className="text-red-600 text-xs">{errors.document_number}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-bold">Telefone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+258 84 123 4567"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && <span className="text-red-600 text-xs">{errors.phone}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="pedro@email.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <span className="text-red-600 text-xs">{errors.email}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="vehicle_type" className="font-bold">Tipo de Veículo *</Label>
                  <Select value={formData.vehicle_type} onValueChange={(value) => setFormData({...formData, vehicle_type: value})}>
                    <SelectTrigger className={errors.vehicle_type ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map(type => (
                        <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.vehicle_type && <span className="text-red-600 text-xs">{errors.vehicle_type}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicle_plate" className="font-bold">Placa do Veículo *</Label>
                  <Input
                    id="vehicle_plate"
                    value={formData.vehicle_plate}
                    onChange={(e) => setFormData({...formData, vehicle_plate: e.target.value})}
                    placeholder="ABC-1234"
                    className={errors.vehicle_plate ? 'border-red-500' : ''}
                  />
                  {errors.vehicle_plate && <span className="text-red-600 text-xs">{errors.vehicle_plate}</span>}
                </div>
              </div>

              {/* Dados Bancários (Opcional) */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-700">Dados Bancários (Opcional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank">Banco</Label>
                    <Input
                      id="bank"
                      value={bankData.bank}
                      onChange={(e) => setBankData({...bankData, bank: e.target.value})}
                      placeholder="Banco XYZ"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agency">Agência</Label>
                    <Input
                      id="agency"
                      value={bankData.agency}
                      onChange={(e) => setBankData({...bankData, agency: e.target.value})}
                      placeholder="1234"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account">Conta</Label>
                    <Input
                      id="account"
                      value={bankData.account}
                      onChange={(e) => setBankData({...bankData, account: e.target.value})}
                      placeholder="12345-6"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_available"
                    checked={formData.is_available}
                    onCheckedChange={(checked) => setFormData({...formData, is_available: checked})}
                  />
                  <Label htmlFor="is_available">Disponível para entregas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                  />
                  <Label htmlFor="is_active">Ativo no sistema</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conta de Login */}
          <Card className="border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-green-600 text-white px-3 py-1 text-sm font-bold">LOGIN</Badge>
                <h3 className="text-xl font-bold text-slate-800">Acesso ao Sistema</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="login_name" className="font-bold flex items-center gap-2">
                    <User className="w-4 h-4 text-green-600" />
                    Nome para Login *
                  </Label>
                  <Input
                    id="login_name"
                    value={loginData.full_name}
                    onChange={(e) => setLoginData({...loginData, full_name: e.target.value})}
                    placeholder="Pedro Silva"
                    className={errors.login_name ? 'border-red-500' : ''}
                  />
                  {errors.login_name && <span className="text-red-600 text-xs">{errors.login_name}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login_email" className="font-bold flex items-center gap-2">
                    <Mail className="w-4 h-4 text-green-600" />
                    Email de Login *
                  </Label>
                  <Input
                    id="login_email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    placeholder="pedro.entregador@email.com"
                    className={errors.login_email ? 'border-red-500' : ''}
                  />
                  {errors.login_email && <span className="text-red-600 text-xs">{errors.login_email}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="login_phone" className="font-bold flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-600" />
                    Telefone de Contato *
                  </Label>
                  <Input
                    id="login_phone"
                    value={loginData.phone}
                    onChange={(e) => setLoginData({...loginData, phone: e.target.value})}
                    placeholder="+258 84 987 6543"
                    className={errors.login_phone ? 'border-red-500' : ''}
                  />
                  {errors.login_phone && <span className="text-red-600 text-xs">{errors.login_phone}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login_password" className="font-bold flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    Senha de Acesso *
                  </Label>
                  <Input
                    id="login_password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    placeholder="••••••••"
                    className={errors.login_password ? 'border-red-500' : ''}
                  />
                  {errors.login_password && <span className="text-red-600 text-xs">{errors.login_password}</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-between items-center pt-6">
          <p className="text-sm text-slate-600">* Campos obrigatórios</p>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={saving} className="px-6">
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Criando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Criar Entregador + Conta
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}