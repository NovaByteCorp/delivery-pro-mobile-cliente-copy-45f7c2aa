import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Package, Star, Gift, AlertCircle } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function NotificationsModal({ onClose }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Simular notificações
    const mockNotifications = [
      {
        id: 1,
        type: 'order',
        title: 'Pedido confirmado!',
        message: 'Seu pedido #1234 foi confirmado e está sendo preparado.',
        time: new Date(Date.now() - 10 * 60 * 1000),
        read: false,
        icon: Package
      },
      {
        id: 2,
        type: 'promotion',
        title: '🔥 Oferta especial!',
        message: 'Pizza grátis na compra de 2 pizzas. Válido até amanhã!',
        time: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        icon: Gift
      },
      {
        id: 3,
        type: 'review',
        title: 'Avalie seu último pedido',
        message: 'Como foi sua experiência com o Restaurante Sabor & Arte?',
        time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        read: true,
        icon: Star
      },
      {
        id: 4,
        type: 'alert',
        title: 'Entrega em andamento',
        message: 'Seu pedido saiu para entrega. Chegará em 15 minutos!',
        time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        read: true,
        icon: AlertCircle
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationColor = (type) => {
    switch (type) {
      case 'order': return 'text-blue-600 bg-blue-100';
      case 'promotion': return 'text-orange-600 bg-orange-100';
      case 'review': return 'text-yellow-600 bg-yellow-100';
      case 'alert': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Bell className="w-4 h-4 text-white" />
              </div>
              Notificações
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs">
                  {unreadCount}
                </Badge>
              )}
            </DialogTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-orange-600"
              >
                Marcar todas como lidas
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${
                      !notification.read 
                        ? 'bg-orange-50 border-orange-200' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-orange-500 rounded-full ml-2 mt-1"></div>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          {notification.message}
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                          {format(notification.time, "dd MMM, HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end">
          <Button onClick={onClose} variant="outline">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}