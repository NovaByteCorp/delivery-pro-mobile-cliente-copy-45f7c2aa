import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Home, Menu, ShoppingCart, User } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function NewSupportTicketPage() {
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "outros",
    priority: "media"
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const testUser = JSON.parse(localStorage.getItem('testUser') || '{}');
      
      await Support.create({
        ...formData,
        customer_id: testUser.id || "cliente_teste",
        ticket_number: `SUP${Date.now()}`,
        status: "aberto"
      });
      
      // Navigate back to support page
      window.location.href = createPageUrl('Support');
    } catch (error) {
      console.error("Erro ao criar ticket:", error);
    }
    setLoading(false);
  };

  const navigate = (url) => {
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Status Bar */}
      <div className="bg-white px-6 py-2 text-center text-sm font-semibold text-orange-500">
        ChegouDelivery
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white">
        <Button 
          onClick={() => navigate(createPageUrl('Support'))} 
          variant="ghost" 
          size="icon"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Contatar Suporte</h1>
        <div className="w-10"></div>
      </div>

      <div className="p-4 pb-24">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              placeholder="Assunto"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="h-12 bg-white border-gray-200 rounded-xl"
              required
            />
          </div>
          
          <div>
            <Textarea
              placeholder="Descreva seu problema em detalhes..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="bg-white border-gray-200 rounded-xl min-h-[120px]"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
              <SelectTrigger className="h-12 bg-white border-gray-200 rounded-xl">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrega_atrasada">Problema de Entrega</SelectItem>
                <SelectItem value="pedido_errado">Pedido Errado</SelectItem>
                <SelectItem value="problema_pagamento">Problema de Pagamento</SelectItem>
                <SelectItem value="qualidade_comida">Qualidade da Comida</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
              <SelectTrigger className="h-12 bg-white border-gray-200 rounded-xl">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl h-12"
          >
            {loading ? "Enviando..." : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar Solicitação
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 shadow-lg">
        <div className="flex items-center justify-around">
          <Button 
            variant="ghost" 
            className="flex flex-col items-center gap-1"
            onClick={() => navigate(createPageUrl('ClientDashboard'))}
          >
            <Home className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Início</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1">
            <Menu className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Menu</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center gap-1"
            onClick={() => navigate(createPageUrl('Cart'))}
          >
            <ShoppingCart className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Carrinho</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center gap-1 text-orange-500"
            onClick={() => navigate(createPageUrl('AccountPage'))}
          >
            <User className="w-5 h-5 text-orange-500" />
            <span className="text-xs text-orange-500">Conta</span>
          </Button>
        </div>
      </div>
    </div>
  );
}