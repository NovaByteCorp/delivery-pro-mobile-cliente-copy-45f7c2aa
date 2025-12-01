import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Settings as SettingsIcon, 
  DollarSign, 
  MapPin, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Save
} from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    delivery_fee_per_order: "",
    price_per_km: "",
    minimum_order_value: "",
    maximum_delivery_distance: "",
    default_delivery_time: "",
    cancellation_time_limit: "",
    auto_accept_orders: false,
    enable_notifications: true,
    maintenance_mode: false
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load existing settings
    loadSettings();
  }, []);

  const loadSettings = async () => {
    // Simulate loading settings from API
    // In real app, this would be: const data = await Settings.get();
    const mockSettings = {
      delivery_fee_per_order: "15.00",
      price_per_km: "3.50",
      minimum_order_value: "50.00",
      maximum_delivery_distance: "15",
      default_delivery_time: "45",
      cancellation_time_limit: "10",
      auto_accept_orders: false,
      enable_notifications: true,
      maintenance_mode: false
    };
    setSettings(mockSettings);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'delivery_fee_per_order':
      case 'price_per_km':
      case 'minimum_order_value':
        const numValue = parseFloat(value);
        if (!value || isNaN(numValue) || numValue < 0) {
          newErrors[name] = "Deve ser um valor válido";
        } else if (numValue > 1000) {
          newErrors[name] = "Valor muito alto";
        } else {
          delete newErrors[name];
        }
        break;
      
      case 'maximum_delivery_distance':
        const distance = parseInt(value);
        if (!value || isNaN(distance) || distance < 1 || distance > 50) {
          newErrors[name] = "Distância deve ser entre 1 e 50 km";
        } else {
          delete newErrors[name];
        }
        break;
      
      case 'default_delivery_time':
        const time = parseInt(value);
        if (!value || isNaN(time) || time < 15 || time > 120) {
          newErrors[name] = "Tempo deve ser entre 15 e 120 minutos";
        } else {
          delete newErrors[name];
        }
        break;
      
      case 'cancellation_time_limit':
        const cancelTime = parseInt(value);
        if (!value || isNaN(cancelTime) || cancelTime < 5 || cancelTime > 60) {
          newErrors[name] = "Tempo deve ser entre 5 e 60 minutos";
        } else {
          delete newErrors[name];
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (name, value) => {
    setSettings({ ...settings, [name]: value });
    validateField(name, value);
    setSaved(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!settings.delivery_fee_per_order) newErrors.delivery_fee_per_order = "Taxa por pedido é obrigatória";
    if (!settings.price_per_km) newErrors.price_per_km = "Preço por km é obrigatório";
    if (!settings.minimum_order_value) newErrors.minimum_order_value = "Valor mínimo é obrigatório";
    if (!settings.maximum_delivery_distance) newErrors.maximum_delivery_distance = "Distância máxima é obrigatória";
    if (!settings.default_delivery_time) newErrors.default_delivery_time = "Tempo padrão é obrigatório";
    if (!settings.cancellation_time_limit) newErrors.cancellation_time_limit = "Limite para cancelamento é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real app: await Settings.update(settings);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      setErrors({ general: "Erro ao salvar configurações. Tente novamente." });
    }
    setSaving(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gradient-to-br from-slate-50 to-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Configurações do Sistema</h1>
          <p className="text-slate-600">Configure parâmetros globais da plataforma de delivery.</p>
        </div>

        {errors.general && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        {saved && (
          <Alert className="mb-6 border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              Configurações salvas com sucesso!
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Configurações Financeiras */}
          <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge className="bg-red-600 text-white px-3 py-1 text-sm font-bold">
                  FINANCEIRO
                </Badge>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                  Configurações Financeiras
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="delivery_fee_per_order" className="text-sm font-bold">
                    Taxa por Pedido *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-600 font-bold">MT</span>
                    <Input
                      id="delivery_fee_per_order"
                      type="number"
                      step="0.01"
                      value={settings.delivery_fee_per_order}
                      onChange={(e) => handleInputChange('delivery_fee_per_order', e.target.value)}
                      placeholder="15.00"
                      className={`pl-12 h-12 ${errors.delivery_fee_per_order ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.delivery_fee_per_order && (
                    <span className="text-red-600 text-xs">{errors.delivery_fee_per_order}</span>
                  )}
                  <p className="text-xs text-slate-500">Taxa fixa cobrada por pedido</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_per_km" className="text-sm font-bold">
                    Preço por Quilômetro *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-600 font-bold">MT</span>
                    <Input
                      id="price_per_km"
                      type="number"
                      step="0.01"
                      value={settings.price_per_km}
                      onChange={(e) => handleInputChange('price_per_km', e.target.value)}
                      placeholder="3.50"
                      className={`pl-12 h-12 ${errors.price_per_km ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.price_per_km && (
                    <span className="text-red-600 text-xs">{errors.price_per_km}</span>
                  )}
                  <p className="text-xs text-slate-500">Valor cobrado por km de distância</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimum_order_value" className="text-sm font-bold">
                    Valor Mínimo de Pedido *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-600 font-bold">MT</span>
                    <Input
                      id="minimum_order_value"
                      type="number"
                      step="0.01"
                      value={settings.minimum_order_value}
                      onChange={(e) => handleInputChange('minimum_order_value', e.target.value)}
                      placeholder="50.00"
                      className={`pl-12 h-12 ${errors.minimum_order_value ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.minimum_order_value && (
                    <span className="text-red-600 text-xs">{errors.minimum_order_value}</span>
                  )}
                  <p className="text-xs text-slate-500">Valor mínimo global para pedidos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Entrega */}
          <Card className="border border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Configurações de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maximum_delivery_distance" className="text-sm font-bold">
                    Distância Máxima de Entrega *
                  </Label>
                  <div className="relative">
                    <Input
                      id="maximum_delivery_distance"
                      type="number"
                      min="1"
                      max="50"
                      value={settings.maximum_delivery_distance}
                      onChange={(e) => handleInputChange('maximum_delivery_distance', e.target.value)}
                      placeholder="15"
                      className={`pr-12 h-12 ${errors.maximum_delivery_distance ? 'border-red-500' : ''}`}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 font-medium">km</span>
                  </div>
                  {errors.maximum_delivery_distance && (
                    <span className="text-red-600 text-xs">{errors.maximum_delivery_distance}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default_delivery_time" className="text-sm font-bold">
                    Tempo Padrão de Entrega *
                  </Label>
                  <div className="relative">
                    <Input
                      id="default_delivery_time"
                      type="number"
                      min="15"
                      max="120"
                      value={settings.default_delivery_time}
                      onChange={(e) => handleInputChange('default_delivery_time', e.target.value)}
                      placeholder="45"
                      className={`pr-16 h-12 ${errors.default_delivery_time ? 'border-red-500' : ''}`}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 font-medium">min</span>
                  </div>
                  {errors.default_delivery_time && (
                    <span className="text-red-600 text-xs">{errors.default_delivery_time}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Cancelamento */}
          <Card className="border border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Configurações de Cancelamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cancellation_time_limit" className="text-sm font-bold">
                  Limite para Cancelamento *
                </Label>
                <div className="relative max-w-md">
                  <Input
                    id="cancellation_time_limit"
                    type="number"
                    min="5"
                    max="60"
                    value={settings.cancellation_time_limit}
                    onChange={(e) => handleInputChange('cancellation_time_limit', e.target.value)}
                    placeholder="10"
                    className={`pr-16 h-12 ${errors.cancellation_time_limit ? 'border-red-500' : ''}`}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 font-medium">min</span>
                </div>
                {errors.cancellation_time_limit && (
                  <span className="text-red-600 text-xs">{errors.cancellation_time_limit}</span>
                )}
                <p className="text-xs text-slate-500">Tempo limite para cancelar um pedido após confirmação</p>
              </div>
            </CardContent>
          </Card>

          {/* Configurações do Sistema */}
          <Card className="border border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-gray-600" />
                Configurações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Aceitar Pedidos Automaticamente</Label>
                    <p className="text-xs text-slate-500">Pedidos são aceitos automaticamente pelos restaurantes</p>
                  </div>
                  <Switch
                    checked={settings.auto_accept_orders}
                    onCheckedChange={(checked) => handleInputChange('auto_accept_orders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Notificações Ativas</Label>
                    <p className="text-xs text-slate-500">Enviar notificações para usuários</p>
                  </div>
                  <Switch
                    checked={settings.enable_notifications}
                    onCheckedChange={(checked) => handleInputChange('enable_notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Modo Manutenção</Label>
                    <p className="text-xs text-slate-500">Bloquear novos pedidos para manutenção</p>
                  </div>
                  <Switch
                    checked={settings.maintenance_mode}
                    onCheckedChange={(checked) => handleInputChange('maintenance_mode', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <Button 
            onClick={handleSave} 
            disabled={saving || Object.keys(errors).length > 0}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 h-12"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}