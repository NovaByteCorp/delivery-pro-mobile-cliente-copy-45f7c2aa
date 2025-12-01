import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  User as UserIcon,
  Settings,
  Star,
  Info,
  Shield,
  ChevronRight,
  ShoppingBag
} from "lucide-react";
import { createPageUrl } from "@/utils";
import BottomNav from "../components/client/BottomNav";
import FloatingCartButton from "../components/client/FloatingCartButton";
import ConfigurationsModal from "../components/client/ConfigurationsModal";
import RatingModal from "../components/client/RatingModal";
import PrivacyModal from "../components/client/PrivacyModal";

const ProfileMenuItem = ({ icon, title, subtitle, onClick }) => {
  const Icon = icon;
  return (
    <Button
      variant="ghost"
      className="w-full justify-between p-4 h-auto rounded-xl hover:bg-gray-50"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-sm">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-left">
          <p className="font-semibold text-gray-800">{title}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </Button>
  );
};

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfigurations, setShowConfigurations] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      const testUser = localStorage.getItem('testUser');
      if (testUser) {
        setUser(JSON.parse(testUser));
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const navigate = (url) => {
    window.location.href = url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="pb-24">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-8 text-white">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
              {user?.profile_image ? (
                <AvatarImage src={user.profile_image} alt={user?.full_name || 'User'} />
              ) : (
                <AvatarFallback className="bg-white text-orange-500 text-2xl font-bold">
                  {user?.full_name?.[0]?.toUpperCase() || 'E'}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user?.full_name || 'Edy Finga'}</h1>
              <p className="text-sm opacity-90 font-medium">{user?.email || 'fingaedy@gmail.com'}</p>
              <p className="text-sm opacity-80">{user?.phone || 'Contacto não disponível'}</p>
            </div>
          </div>
        </div>

        {/* Menu Sections */}
        <div className="px-4 space-y-6 -mt-4">
          {/* Conta Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 pt-4 pb-2">
              <h2 className="text-lg font-bold text-gray-800">Conta</h2>
            </div>
            <div className="space-y-1">
              <ProfileMenuItem
                icon={UserIcon}
                title="Editar Perfil"
                subtitle="Atualize suas informações pessoais"
                onClick={() => navigate(createPageUrl('Profile'))}
              />
              <ProfileMenuItem
                icon={ShoppingBag}
                title="Meus Pedidos"
                subtitle="Histórico de pedidos realizados"
                onClick={() => navigate(createPageUrl('MyOrders'))}
              />
              <ProfileMenuItem
                icon={Settings}
                title="Configurações"
                subtitle="Preferências e notificações"
                onClick={() => setShowConfigurations(true)}
              />
            </div>
          </div>

          {/* Suporte Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 pt-4 pb-2">
              <h2 className="text-lg font-bold text-gray-800">Suporte</h2>
            </div>
            <div className="space-y-1">
              <ProfileMenuItem
                icon={Star}
                title="Avalie-nos"
                subtitle="Compartilhe sua experiência"
                onClick={() => setShowRating(true)}
              />
              <ProfileMenuItem
                icon={Info}
                title="Sobre"
                subtitle="Informações do aplicativo"
                onClick={() => navigate(createPageUrl('Support'))}
              />
            </div>
          </div>

          {/* Legal Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 pt-4 pb-2">
              <h2 className="text-lg font-bold text-gray-800">Legal</h2>
            </div>
            <div className="space-y-1">
              <ProfileMenuItem
                icon={Shield}
                title="Privacidade"
                subtitle="Política de privacidade"
                onClick={() => setShowPrivacy(true)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <BottomNav activePage="AccountPage" />
      <FloatingCartButton />

      {/* Modals */}
      {showConfigurations && (
        <ConfigurationsModal onClose={() => setShowConfigurations(false)} />
      )}
      {showRating && (
        <RatingModal onClose={() => setShowRating(false)} />
      )}
      {showPrivacy && (
        <PrivacyModal onClose={() => setShowPrivacy(false)} />
      )}
    </div>
  );
}