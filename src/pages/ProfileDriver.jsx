import React, { useState } from 'react';
import { ChevronLeft, MessageCircle, Phone, Mail, HelpCircle, AlertCircle, Package, MapPin, DollarSign, FileText, Send, ChevronRight } from 'lucide-react';
import BottomNavDriver from '../components/driver/DriverBottomNav';

export default function DriverSupportScreen() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'support',
      text: 'Olá! Como posso ajudá-lo hoje?',
      time: '14:30'
    }
  ]);

  const supportCategories = [
    {
      id: 'delivery',
      icon: Package,
      title: 'Problemas com Entrega',
      description: 'Cliente não está, endereço errado, etc.',
      color: 'orange'
    },
    {
      id: 'payment',
      icon: DollarSign,
      title: 'Pagamentos',
      description: 'Dúvidas sobre ganhos, saques',
      color: 'green'
    },
    {
      id: 'app',
      icon: AlertCircle,
      title: 'Problemas no App',
      description: 'Erros, bugs, travamentos',
      color: 'red'
    },
    {
      id: 'account',
      icon: FileText,
      title: 'Minha Conta',
      description: 'Documentos, cadastro, perfil',
      color: 'blue'
    }
  ];

  const faqs = [
    {
      question: 'Como faço para sacar meus ganhos?',
      answer: 'Você pode solicitar saque na tela de Ganhos. O valor será transferido para sua conta em até 2 dias úteis.'
    },
    {
      question: 'O que fazer se o cliente não atender?',
      answer: 'Tente ligar 3 vezes. Se não conseguir contato, use o botão "Reportar Problema" na tela do pedido.'
    },
    {
      question: 'Como atualizar meus documentos?',
      answer: 'Vá em Perfil > Documentos e faça o upload dos novos documentos. A verificação leva até 24h.'
    },
    {
      question: 'Posso recusar um pedido?',
      answer: 'Sim, mas sua taxa de aceitação pode ser afetada. Mantenha acima de 85% para melhores oportunidades.'
    }
  ];

  const emergencyContacts = [
    {
      type: 'Emergência',
      number: '112',
      icon: '🚨',
      description: 'Polícia, Ambulância'
    },
    {
      type: 'Suporte 24h',
      number: '+258 84 000 0000',
      icon: '📞',
      description: 'Suporte urgente'
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'user',
        text: message,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');

      // Simular resposta automática
      setTimeout(() => {
        const autoReply = {
          id: messages.length + 2,
          sender: 'support',
          text: 'Obrigado pela sua mensagem. Nossa equipe irá responder em breve.',
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, autoReply]);
      }, 1000);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      orange: 'bg-orange-500',
      green: 'bg-green-500',
      red: 'bg-red-500',
      blue: 'bg-blue-500'
    };
    return colors[color] || colors.orange;
  };

  if (showChat) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
          <div className="relative w-full h-screen bg-white flex flex-col">
            
            {/* Header */}
            <div className="bg-gray-800 px-8 pt-12 pb-6 rounded-b-3xl">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setShowChat(false)}
                  className="w-14 h-14 bg-gray-700 rounded-2xl flex items-center justify-center"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Suporte</h2>
                    <p className="text-xs text-gray-400">Online agora</p>
                  </div>
                </div>
                
                <div className="w-14 h-14" />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-3xl px-5 py-3 ${
                      msg.sender === 'user'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-50 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'user' ? 'text-orange-100' : 'text-gray-400'
                    }`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-100 px-8 py-6">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none border-2 border-gray-200 focus:border-orange-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  if (selectedCategory) {
    const category = supportCategories.find(c => c.id === selectedCategory);
    
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
          <div className="relative w-full h-screen bg-white overflow-y-auto pb-8">
            
            {/* Header */}
            <div className="bg-gray-800 px-8 pt-12 pb-8 rounded-b-3xl">
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="w-14 h-14 bg-gray-700 rounded-2xl flex items-center justify-center"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                
                <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'serif' }}>
                  {category.title}
                </h1>
                
                <div className="w-14 h-14" />
              </div>
            </div>

            <div className="px-8 mt-6">
              {/* Quick Actions */}
              <div className="bg-gray-50 rounded-3xl p-5 mb-6 shadow-sm">
                <h3 className="text-base font-bold text-gray-800 mb-4">Ações Rápidas</h3>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowChat(true)}
                    className="w-full bg-white rounded-2xl p-4 flex items-center space-x-3 shadow-sm border-2 border-gray-200"
                  >
                    <MessageCircle className="w-5 h-5 text-orange-500" />
                    <span className="text-sm font-bold text-gray-800">Chat com Suporte</span>
                  </button>
                  
                  <button className="w-full bg-white rounded-2xl p-4 flex items-center space-x-3 shadow-sm border-2 border-gray-200">
                    <Phone className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-bold text-gray-800">Ligar para Suporte</span>
                  </button>
                </div>
              </div>

              {/* Related FAQs */}
              <h3 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'serif' }}>
                Perguntas Frequentes
              </h3>
              
              <div className="space-y-3">
                {faqs.slice(0, 2).map((faq, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-3xl p-5 shadow-sm">
                    <h4 className="text-sm font-bold text-gray-800 mb-2">{faq.question}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
        <div className="relative w-full h-screen bg-white overflow-y-auto pb-8">
          
          {/* Header */}
          <div className="bg-gray-800 px-8 pt-12 pb-8 rounded-b-3xl">
            <div className="flex items-center justify-between mb-6">
              <button className="w-14 h-14 bg-gray-700 rounded-2xl flex items-center justify-center">
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'serif' }}>
                Central de Ajuda
              </h1>
              
              <div className="w-14 h-14" />
            </div>

            {/* Quick Contact */}
            <button 
              onClick={() => setShowChat(true)}
              className="w-full bg-orange-500 rounded-2xl p-4 flex items-center justify-center space-x-3 shadow-lg"
            >
              <MessageCircle className="w-6 h-6 text-white" />
              <span className="text-base font-bold text-white">Chat com Suporte</span>
            </button>
          </div>

          <div className="px-8 mt-6">
            
            {/* Emergency Contacts */}
            <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
              Contatos de Emergência
            </h2>
            
            <div className="space-y-3 mb-6">
              {emergencyContacts.map((contact, idx) => (
                <button
                  key={idx}
                  className="w-full bg-gray-800 rounded-3xl p-5 flex items-center space-x-4 shadow-lg"
                >
                  <div className="w-14 h-14 bg-gray-700 rounded-xl flex items-center justify-center">
                    <span className="text-3xl">{contact.icon}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-base font-bold text-white mb-1">{contact.type}</h3>
                    <p className="text-sm text-gray-400 mb-1">{contact.description}</p>
                    <p className="text-lg font-bold text-orange-500">{contact.number}</p>
                  </div>
                  <Phone className="w-5 h-5 text-white" />
                </button>
              ))}
            </div>

            {/* Support Categories */}
            <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
              Como Podemos Ajudar?
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {supportCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="bg-gray-50 rounded-3xl p-5 shadow-sm text-center"
                >
                  <div className={`w-14 h-14 ${getColorClasses(category.color)} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                    <category.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 mb-2">{category.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{category.description}</p>
                </button>
              ))}
            </div>

            {/* FAQs */}
            <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
              Perguntas Frequentes
            </h2>
            
            <div className="space-y-3 mb-6">
              {faqs.map((faq, idx) => (
                <button
                  key={idx}
                  className="w-full bg-gray-50 rounded-3xl p-5 shadow-sm text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <h3 className="text-sm font-bold text-gray-800 mb-2">{faq.question}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>

            {/* Other Contacts */}
            <h2 className="text-lg font-bold mb-4 text-gray-800" style={{ fontFamily: 'serif' }}>
              Outros Contatos
            </h2>
            
            <div className="space-y-3 mb-6">
              <button className="w-full bg-gray-50 rounded-2xl p-5 flex items-center space-x-4 shadow-sm">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-base font-bold text-gray-800">Telefone</h3>
                  <p className="text-sm text-gray-400">+258 84 000 0000</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="w-full bg-gray-50 rounded-2xl p-5 flex items-center space-x-4 shadow-sm">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-base font-bold text-gray-800">Email</h3>
                  <p className="text-sm text-gray-400">suporte@fooddelivery.com</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>

          </div>

        </div>

         {/* FUTURO: BottomNavDriver */}
      {<BottomNavDriver activePage="ProfileDriver" /> }
      </div>
    </div>
  );
}