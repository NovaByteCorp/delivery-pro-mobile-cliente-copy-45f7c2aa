import React, { useState, useEffect } from "react";
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
  UserCog, 
  AlertCircle, 
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Shield
} from "lucide-react";

export default function EditAdminModal({ admin, onClose, onSave }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    assigned_region: "",
    is_active: true,
    current_password: "",
    new_password: "",
    confirm_password: ""
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

  useEffect(() => {
    if (admin) {
      setFormData({
        full_name: admin.full_name || "",
        email: admin.email || "",
        phone: admin.phone || "",
        assigned_region: admin.assigned_region || "",
        is_active: admin.is_active !== false,
        current_password: "",
        new_password: "",
        confirm_password: ""
      });
    }
  }, [admin]);

  const validateForm = async () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Nome completo é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Email deve ter formato válido";
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    }

    if (!formData.assigned_region) {
      newErrors.assigned_region = "Região é obrigatória";
    }

    // Validar senhas se estiver tentando alterar
    if (formData.new_password || formData.confirm_password) {
      if (!formData.current_password) {
        newErrors.current_password = "Senha atual é obrigatória para alterar senha";
      }

      if (formData.new_password !== formData.confirm_password) {
        newErrors.new_password = "Senhas não coincidem";
      }

      if (formData.new_password.length < 6) {
        newErrors.new_password = "Nova senha deve ter pelo menos 6 caracteres";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    setSaving(true);
    try {
      const updateData = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        assigned_region: formData.assigned_region,
        is_active: formData.is_active
      };

      // Se está alterando senha
      if (formData.new_password) {
        // Verificar senha atual
        if (admin.password && admin.password !== formData.current_password) {
          setErrors({ current_password: "Senha atual incorreta" });
          setSaving(false);
          return;
        }
        updateData.password = formData.new_password;
      }

      await SystemUser.update(admin.id, updateData);
      onSave();
    } catch (error) {
      console.error("Erro ao atualizar admin:", error);
      setErrors({ general: "Erro ao salvar alterações. Tente novamente." });
    }
    setSaving(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <UserCog className="w-6 h-6 text-white" />
            </div>
            Editar Admin Regional
          </DialogTitle>
        </DialogHeader>

        {errors.general && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-blue-600 text-white px-3 py-1 text-sm font-bold">DADOS BÁSICOS</Badge>
                <h3 className="text-lg font-bold text-slate-800">Informações do Administrador</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="font-bold">Nome Completo *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className={errors.full_name ? 'border-red-500' : ''}
                  />
                  {errors.full_name && <span className="text-red-600 text-xs">{errors.full_name}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <span className="text-red-600 text-xs">{errors.email}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-bold">Telefone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && <span className="text-red-600 text-xs">{errors.phone}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assigned_region" className="font-bold">Região Atribuída *</Label>
                  <Select value={formData.assigned_region} onValueChange={(value) => setFormData({...formData, assigned_region: value})}>
                    <SelectTrigger className={errors.assigned_region ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione a região" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.assigned_region && <span className="text-red-600 text-xs">{errors.assigned_region}</span>}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
                <Label htmlFor="is_active" className="font-medium">Admin ativo na plataforma</Label>
              </div>
            </CardContent>
          </Card>

          {/* Alterar Senha */}
          <Card className="border border-slate-200">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-red-600 text-white px-3 py-1 text-sm font-bold">SEGURANÇA</Badge>
                <h3 className="text-lg font-bold text-slate-800">Alterar Senha</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current_password" className="font-bold">Senha Atual</Label>
                  <Input
                    id="current_password"
                    type="password"
                    value={formData.current_password}
                    onChange={(e) => setFormData({...formData, current_password: e.target.value})}
                    placeholder="••••••••"
                    className={errors.current_password ? 'border-red-500' : ''}
                  />
                  {errors.current_password && <span className="text-red-600 text-xs">{errors.current_password}</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="new_password" className="font-bold">Nova Senha</Label>
                    <Input
                      id="new_password"
                      type="password"
                      value={formData.new_password}
                      onChange={(e) => setFormData({...formData, new_password: e.target.value})}
                      placeholder="••••••••"
                      className={errors.new_password ? 'border-red-500' : ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password" className="font-bold">Confirmar Nova Senha</Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      value={formData.confirm_password}
                      onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                {errors.new_password && <span className="text-red-600 text-xs">{errors.new_password}</span>}

                <p className="text-sm text-slate-600">
                  Deixe os campos de senha em branco se não quiser alterar a senha.
                </p>
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