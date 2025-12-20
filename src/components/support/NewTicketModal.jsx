import React, { useState, useEffect } from "react";
import { Support } from "@/api/entities";
import { Order } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  HeadphonesIcon, 
  AlertCircle, 
  CheckCircle,
  FileText,
  AlertTriangle,
  Clock
} from "lucide-react";

export default function NewTicketModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "",
    priority: "media",
    order_id: "",
    customer_id: ""
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersData, usersData] = await Promise.all([
          Order.list("-created_date", 50),
          User.filter({ user_type: "cliente" })
        ]);
        setOrders(ordersData);
        setCustomers(usersData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };
    loadData();
  }, []);

  const categories = [
    { value: "entrega_atrasada", label: "Entrega Atrasada" },
    { value: "pedido_errado", label: "Pedido Errado" },
    { value: "problema_pagamento", label: "Problema de Pagamento" },
    { value: "qualidade_comida", label: "Qualidade da Comida" },
    { value: "entregador", label: "Problema com Entregador" },
    { value: "outros", label: "Outros" }
  ];

  const priorities = [
    { value: "baixa", label: "Baixa", color: "text-green-600" },
    { value: "media", label: "Média", color: "text-yellow-600" },
    { value: "alta", label: "Alta", color: "text-orange-600" },
    { value: "urgente", label: "Urgente", color: "text-red-600" }
  ];

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'subject':
        if (!value.trim()) {
          newErrors.subject = "Assunto é obrigatório";
        } else if (value.length < 5) {
          newErrors.subject = "Assunto deve ter pelo menos 5 caracteres";
        } else if (value.length > 100) {
          newErrors.subject = "Assunto deve ter no máximo 100 caracteres";
        } else {
          delete newErrors.subject;
        }
        break;
      
      case 'description':
        if (!value.trim()) {
          newErrors.description = "Descrição é obrigatória";
        } else if (value.length < 20) {
          newErrors.description = "Descrição deve ter pelo menos 20 caracteres";
        } else if (value.length > 500) {
          newErrors.description = "Descrição deve ter no máximo 500 caracteres";
        } else {
          delete newErrors.description;
        }
        break;
      
      case 'category':
        if (!value) {
          newErrors.category = "Categoria é obrigatória";
        } else {
          delete newErrors.category;
        }
        break;
      
      case 'customer_id':
        if (!value) {
          newErrors.customer_id = "Cliente é obrigatório";
        } else {
          delete newErrors.customer_id;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.subject.trim()) newErrors.subject = "Assunto é obrigatório";
    if (!formData.description.trim()) newErrors.description = "Descrição é obrigatória";
    if (!formData.category) newErrors.category = "Categoria é obrigatória";
    if (!formData.customer_id) newErrors.customer_id = "Cliente é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateTicketNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `SUP-${timestamp}${random}`;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      await Support.create({
        ...formData,
        ticket_number: generateTicketNumber(),
        status: "aberto"
      });
      onSave();
    } catch (error) {
      console.error("Erro ao criar ticket:", error);
      setErrors({ general: "Erro ao abrir ticket. Verifique os dados e tente novamente." });
    }
    setSaving(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <HeadphonesIcon className="w-6 h-6 text-white" />
            </div>
            Abrir Novo Ticket de Suporte
          </DialogTitle>
          <DialogDescription className="text-base text-slate-600">
            Registre um novo chamado de suporte para resolver problemas dos clientes.
          </DialogDescription>
        </DialogHeader>

        {errors.general && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-red-600 text-white px-3 py-1 text-sm font-bold">
                  OBRIGATÓRIO
                </Badge>
                <h3 className="text-lg font-bold text-slate-800">Informações do Problema</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-600" />
                  Assunto do Problema *
                </Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Resumo claro do problema"
                  maxLength={100}
                  className={`h-12 ${errors.subject ? 'border-red-500 bg-red-50' : 'border-orange-300'}`}
                />
                <div className="flex justify-between text-xs">
                  {errors.subject && <span className="text-red-600 font-medium">{errors.subject}</span>}
                  <span className="text-slate-500 ml-auto">{formData.subject.length}/100</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    Categoria do Problema *
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className={`h-12 ${errors.category ? 'border-red-500 bg-red-50' : 'border-orange-300'}`}>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value} className="text-base">
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <span className="text-red-600 text-xs font-medium">{errors.category}</span>}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    Prioridade
                  </Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value} className="text-base">
                          <span className={priority.color}>{priority.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-bold">
                  Descrição Detalhada do Problema *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva o problema de forma detalhada, incluindo quando ocorreu, o que o cliente esperava, e qual foi o resultado. Quanto mais detalhes, melhor será o atendimento."
                  maxLength={500}
                  rows={4}
                  className={`${errors.description ? 'border-red-500 bg-red-50' : 'border-orange-300'}`}
                />
                <div className="flex justify-between text-xs">
                  {errors.description && <span className="text-red-600 font-medium">{errors.description}</span>}
                  <span className="text-slate-500 ml-auto">{formData.description.length}/500</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Cliente e Pedido */}
          <Card className="border border-slate-200">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Informações do Cliente e Pedido</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold">
                    Cliente *
                  </Label>
                  <Select value={formData.customer_id} onValueChange={(value) => handleInputChange('customer_id', value)}>
                    <SelectTrigger className={`h-12 ${errors.customer_id ? 'border-red-500 bg-red-50' : ''}`}>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id} className="text-base">
                          {customer.full_name} ({customer.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.customer_id && <span className="text-red-600 text-xs font-medium">{errors.customer_id}</span>}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold">
                    Pedido Relacionado (Opcional)
                  </Label>
                  <Select value={formData.order_id} onValueChange={(value) => handleInputChange('order_id', value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione o pedido (se aplicável)" />
                    </SelectTrigger>
                    <SelectContent>
                      {orders.map((order) => (
                        <SelectItem key={order.id} value={order.id} className="text-base">
                          #{order.order_number} - MT {order.total_amount?.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  Abrindo Ticket...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Abrir Ticket de Suporte
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}