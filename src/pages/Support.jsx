import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { 
  ChevronLeft,
  ChevronRight, 
  MapPin, 
  CreditCard, 
  HelpCircle, 
  Truck,
  MessageCircle,
  Phone,
  Mail
} from "lucide-react";
import { createPageUrl } from "@/utils";
import BottomNav from "../components/client/BottomNav";

export default function SupportPage() {
  const [showTickets, setShowTickets] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.Support.list("-created_date");
      setTickets(data);
    } catch (error) {
      console.error("Erro ao carregar tickets de suporte:", error);
    }
    setLoading(false);
  };

  const navigate = (url) => {
    window.location.href = url;
  };

  const helpItems = [
    {
      title: "Como rastrear meu pedido?",
      icon: MapPin,
      emoji: "📍",
      onClick: () => navigate(createPageUrl('Orders'))
    },
    {
      title: "Problemas com pagamento?",
      icon: CreditCard,
      emoji: "💳",
      onClick: () => {}
    },
    {
      title: "Perguntas Frequentes",
      icon: HelpCircle,
      emoji: "❓",
      onClick: () => {}
    },
    {
      title: "Contatar meu entregador?",
      icon: Truck,
      emoji: "🛵",
      onClick: () => {}
    }
  ];

  const handleContactSupport = () => {
    navigate(createPageUrl('NewSupportTicket'));
  };

  const handleCheckTickets = () => {
    setShowTickets(true);
    loadTickets();
  };

  if (showTickets) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
          <div className="relative w-full h-screen bg-white overflow-y-auto pb-24">
            
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 bg-white z-10 px-8 pt-12 pb-6 shadow-sm">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setShowTickets(false)}
                  className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center"
                >
                  <ChevronLeft className="w-6 h-6 text-[#3c0068]" />
                </button>

                <h1 className="text-2xl font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
                  Meus Tickets
                </h1>

                <div className="w-14 h-14" />
              </div>
            </div>

            {/* Content */}
            <div className="mt-32 px-8">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-50 rounded-3xl animate-pulse"></div>
                  ))}
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-[#3c0068] mb-2" style={{ fontFamily: 'serif' }}>
                    Nenhum ticket ainda
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Você não tem tickets de suporte abertos
                  </p>
                  <button 
                    onClick={handleContactSupport}
                    className="bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg"
                  >
                    Criar Novo Ticket
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map(ticket => (
                    <div key={ticket.id} className="bg-gray-50 rounded-3xl p-5 shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-[#3c0068] mb-1">{ticket.subject}</h3>
                          <p className="text-xs text-gray-500">#{ticket.ticket_number}</p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-xl ${
                          ticket.status === 'resolvido' ? 'bg-emerald-100 text-emerald-700' :
                          ticket.status === 'em_investigacao' ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{ticket.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <BottomNav activePage="Profile" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
        <div className="relative w-full h-screen bg-white overflow-y-auto pb-24">
          
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 bg-white z-10 px-8 pt-12 pb-6 shadow-sm">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => window.history.back()}
                className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6 text-[#3c0068]" />
              </button>

              <h1 className="text-2xl font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
                Ajuda & Suporte
              </h1>

              <div className="w-14 h-14" />
            </div>
          </div>

          {/* Content */}
          <div className="mt-32 px-8">
            
            {/* Hero Section */}
            <div className="bg-[#3c0068] rounded-3xl p-8 mb-6 shadow-lg text-center">
              <div className="w-20 h-20 bg-[#4d0083] rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'serif' }}>
                Como podemos ajudar?
              </h2>
              <p className="text-sm text-gray-300">
                Estamos aqui para resolver suas dúvidas
              </p>
            </div>

            {/* Help Center Section */}
            <h2 className="text-lg font-bold mb-4 text-[#3c0068]" style={{ fontFamily: 'serif' }}>
              Central de Ajuda
            </h2>
            
            <div className="space-y-3 mb-6">
              {helpItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-full bg-gray-50 rounded-2xl p-4 flex items-center space-x-3 shadow-sm hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                    <span className="text-2xl">{item.emoji}</span>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <h3 className="text-sm font-bold text-[#3c0068] truncate">{item.title}</h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </button>
              ))}
            </div>

            {/* Contact Section */}
            <h2 className="text-lg font-bold mb-4 text-[#3c0068]" style={{ fontFamily: 'serif' }}>
              Entre em Contato
            </h2>

            <div className="space-y-3 mb-6">
              <div className="bg-gray-50 rounded-2xl p-4 flex items-center space-x-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Phone className="w-5 h-5 text-[#3c0068]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#3c0068]">Telefone</h3>
                  <p className="text-xs text-gray-600">+258 84 123 4567</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 flex items-center space-x-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Mail className="w-5 h-5 text-[#3c0068]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#3c0068]">Email</h3>
                  <p className="text-xs text-gray-600">suporte@chegoudelivery.co.mz</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={handleContactSupport}
                className="w-full bg-orange-500 text-white font-bold text-base py-5 rounded-2xl shadow-lg hover:bg-orange-600 transition-colors"
              >
                Criar Novo Ticket
              </button>

              <button
                onClick={handleCheckTickets}
                className="w-full bg-gray-50 text-[#3c0068] font-bold text-base py-4 rounded-2xl shadow-sm hover:bg-gray-100 transition-colors"
              >
                Ver Meus Tickets
              </button>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
              <h3 className="text-sm font-bold text-blue-900 mb-2">Horário de Atendimento</h3>
              <p className="text-xs text-blue-700 leading-relaxed">
                Segunda a Sexta: 8h - 18h<br />
                Sábado: 9h - 14h<br />
                Domingo: Fechado
              </p>
            </div>

          </div>

          <BottomNav activePage="Profile" />
        </div>
      </div>
    </div>
  );
}