

import React from 'react';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  ShoppingCart, 
  Users, 
  Package,
  BarChart3,
  Settings,
  User
} from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  // Lista completa de páginas de cliente que NÃO devem ter layout de admin
  const clientPages = [
    'Welcome', 
    'Home', 
    'ClientDashboard', 
    'AccountPage', 
    'Profile', 
    'Support', 
    'DeliveryAddress', 
    'ChangePassword', 
    'Orders', 
    'NewSupportTicket', 
    'Cart', 
    'MyOrders', 
    'ProductDetails',
    'Search',
    'AllProducts',
    'Menu',
    'Favorites',
    'Checkoutclient',
    'OrderConfirmation',
    'OrderTracking',
    'OrderHistory',
    'PaymentMethods', // Added PaymentMethods
    'ClientSettings' // Added ClientSettings
  ];
  
  // Se for página de cliente, não mostrar layout de admin
  if (clientPages.includes(currentPageName)) {
    return children;
  }

  const navigate = (pageName) => {
    window.location.href = createPageUrl(pageName);
  };

  const menuItems = [
    { name: 'Dashboard', icon: Home, page: 'Dashboard' },
    { name: 'Pedidos', icon: ShoppingCart, page: 'AllOrders' },
    { name: 'Restaurantes', icon: Package, page: 'AllRestaurants' },
    { name: 'Entregas', icon: Users, page: 'AllDeliveries' },
    { name: 'Suporte', icon: User, page: 'Reports' },
    { name: 'Configurações', icon: Settings, page: 'Settings' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 flex items-center justify-center">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c86d65c4f51add45f7c2aa/6e6e29b85_MATERIAL_DE_APRESENTAO-08-removebg-preview.png" 
            alt="ChegouDelivery Logo" 
            className="h-16" 
          />
        </div>
        
        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPageName === item.page;
              
              return (
                <li key={item.name}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      isActive 
                        ? "bg-orange-500 text-white hover:bg-orange-600" 
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => navigate(item.page)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              {currentPageName === 'Dashboard' && 'Dashboard'}
              {currentPageName === 'AllOrders' && 'Gerenciar Pedidos'}
              {currentPageName === 'AllRestaurants' && 'Gerenciar Restaurantes'}
              {currentPageName === 'AllDeliveries' && 'Gerenciar Entregas'}
              {currentPageName === 'Reports' && 'Relatórios e Suporte'}
              {currentPageName === 'Settings' && 'Configurações'}
            </h1>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

