import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Bell, 
  Smartphone, 
  Mail, 
  Volume2,
  Moon,
  Globe,
  Shield
} from "lucide-react";

export default function ConfigurationsModal({ onClose }) {
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: false,
    orderUpdates: true,
    promotions: true,
    darkMode: false,
    sound: true
  });

  const handleSave = () => {
    localStorage.setItem('userNotifications', JSON.stringify(notifications));
    alert('Configurações salvas com sucesso!');
    onClose();
  };

  const ConfigItem = ({ icon: Icon, title, subtitle, value, onChange }) => (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            Configurações
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Notificações</h3>
            <div className="space-y-2">
              <ConfigItem
                icon={Smartphone}
                title="Notificações Push"
                subtitle="Receber notificações no dispositivo"
                value={notifications.push}
                onChange={(checked) => setNotifications({...notifications, push: checked})}
              />
              <ConfigItem
                icon={Mail}
                title="Email"
                subtitle="Receber notificações por email"
                value={notifications.email}
                onChange={(checked) => setNotifications({...notifications, email: checked})}
              />
              <ConfigItem
                icon={Bell}
                title="Atualizações de Pedidos"
                subtitle="Status dos seus pedidos"
                value={notifications.orderUpdates}
                onChange={(checked) => setNotifications({...notifications, orderUpdates: checked})}
              />
              <ConfigItem
                icon={Shield}
                title="Promoções"
                subtitle="Ofertas e descontos especiais"
                value={notifications.promotions}
                onChange={(checked) => setNotifications({...notifications, promotions: checked})}
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Aparência</h3>
            <div className="space-y-2">
              <ConfigItem
                icon={Moon}
                title="Modo Escuro"
                subtitle="Tema escuro para o app"
                value={notifications.darkMode}
                onChange={(checked) => setNotifications({...notifications, darkMode: checked})}
              />
              <ConfigItem
                icon={Volume2}
                title="Sons"
                subtitle="Ativar sons de notificação"
                value={notifications.sound}
                onChange={(checked) => setNotifications({...notifications, sound: checked})}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-blue-500 hover:bg-blue-600">
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}