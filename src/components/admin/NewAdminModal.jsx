import React, { useState } from "react";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  UserCog, 
  AlertCircle, 
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Shield
} from "lucide-react";

export default function NewAdminModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    assigned_region: "",
    user_type: "admin"
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const regions = [
    "Maputo Cidade",
    "Maputo Província", 
    "Gaza",
    "Inhambane",
    "Sofala",
    "Manica",
    "Tete",
    "Zambézia",
    "Nampula",
    "Cabo Delgado",
    "Niassa"
  ];

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'full_name':
        if (!value.trim()) {
          newErrors.full_name = "Nome completo é obrigatório";
        } else if (value.length < 3) {
          newErrors.full_name = "Nome deve ter pelo menos 3 caracteres";
        } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
          newErrors.full_name = "Nome deve conter apenas letras e espaços";
        } else {
          delete newErrors.full_name;
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

      case 'password':
        if (!value.trim()) {
          newErrors.password = "Senha é obrigatória";
        } else if (value.length < 6) {
          newErrors.password = "Senha deve ter pelo menos 6 caracteres";
        } else {
          delete newErrors.password;
        }
        break;
      
      case 'assigned_region':
        if (!value) {
          newErrors.assigned_region = "Região é obrigatória";
        } else {
          delete newErrors.assigned_region;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateForm = async () => {
    const errorsOnSubmit = {};

    // Verificar se email já existe
    try {
      const allUsers = await SystemUser.list();
      const existingUser = allUsers.find(u => u.email && u.email.toLowerCase() === formData.email.toLowerCase());
      if (existingUser) {
        errorsOnSubmit.email = "Email já está em uso";
      }
    } catch (error) {
      console.error("Erro ao verificar emails existentes:", error);
    }

    // Full Name
    if (!formData.full_name.trim()) {
      errorsOnSubmit.full_name = "Nome completo é obrigatório";
    } else if (formData.full_name.length < 3) {
      errorsOnSubmit.full_name = "Nome deve ter pelo menos 3 caracteres";
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errorsOnSubmit.email = "Email é obrigatório";
    } else if (!emailRegex.test(formData.email)) {
      errorsOnSubmit.email = "Email deve ter formato válido";
    }

    // Phone
    if (!formData.phone.trim()) {
      errorsOnSubmit.phone = "Telefone é obrigatório";
    }

    // Password
    if (!formData.password.trim()) {
      errorsOnSubmit.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      errorsOnSubmit.password = "Senha deve ter pelo menos 6 caracteres";
    }

    // Assigned Region
    if (!formData.assigned_region) {
      errorsOnSubmit.assigned_region = "Região é obrigatória";
    }

    setErrors(errorsOnSubmit);
    return Object.keys(errorsOnSubmit).length === 0;
  };

  const handleSave = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    setSaving(true);
    try {
      // Usar SystemUser ao invés de User
      await SystemUser.create({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        user_type: "admin",
        assigned_region: formData.assigned_region,
        is_active: true
      });
      
      onSave();
    } catch (error) {
      console.error("Erro ao criar administrador:", error);
      setErrors({ ...errors, general: "Erro ao salvar administrador. Verifique os dados e tente novamente." });
    }
    setSaving(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <UserCog className="w-6 h-6 text-white" />
            </div>
            Criar Novo Admin Regional
          </DialogTitle>
          <DialogDescription className="text-base text-slate-600">
            Adicione um novo administrador regional para gerenciar a plataforma em uma região específica.
          </DialogDescription>
        </DialogHeader>

        {errors.general && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-red-600 text-white px-3 py-1 text-sm font-bold">
                OBRIGATÓRIO
              </Badge>
              <h3 className="text-lg font-bold text-slate-800">Informações do Administrador</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-sm font-bold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-orange-600" />
                  Nome Completo *
                </Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  placeholder="João Silva Santos"
                  className={`h-12 ${errors.full_name ? 'border-red-500 bg-red-50' : 'border-orange-300'}`}
                />
                {errors.full_name && <span className="text-red-600 text-xs font-medium">{errors.full_name}</span>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-bold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-600" />
                  Email Corporativo *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="joao.silva@chegoudelivery.mz"
                  className={`h-12 ${errors.email ? 'border-red-500 bg-red-50' : 'border-orange-300'}`}
                />
                {errors.email && <span className="text-red-600 text-xs font-medium">{errors.email}</span>}
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
                  placeholder="+258 84 123 4567"
                  className={`h-12 ${errors.phone ? 'border-red-500 bg-red-50' : 'border-orange-300'}`}
                />
                {errors.phone && <span className="text-red-600 text-xs font-medium">{errors.phone}</span>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-bold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-orange-600" />
                  Senha *
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••••"
                  className={`h-12 ${errors.password ? 'border-red-500 bg-red-50' : 'border-orange-300'}`}
                />
                {errors.password && <span className="text-red-600 text-xs font-medium">{errors.password}</span>}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                Região Atribuída *
              </Label>
              <Select value={formData.assigned_region} onValueChange={(value) => handleInputChange('assigned_region', value)}>
                <SelectTrigger className={`h-12 ${errors.assigned_region ? 'border-red-500 bg-red-50' : 'border-orange-300'}`}>
                  <SelectValue placeholder="Selecione uma região" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region} className="text-base">
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assigned_region && <span className="text-red-600 text-xs font-medium">{errors.assigned_region}</span>}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center pt-4">
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
                  Criando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Criar Admin Regional
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}