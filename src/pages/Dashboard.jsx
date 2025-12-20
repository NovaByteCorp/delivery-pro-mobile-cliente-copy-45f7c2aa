import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Order } from "@/api/entities";
import { Restaurant } from "@/api/entities";
import { DeliveryPerson } from "@/api/entities";
import { User } from "@/api/entities";
import StatsOverview from "../components/dashboard/StatsOverview";
import RecentOrders from "../components/dashboard/RecentOrders";
import DeliveryMap from "../components/dashboard/DeliveryMap";
import QuickActions from "../components/dashboard/QuickActions";
import { createPageUrl } from "@/utils";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    orders: [],
    restaurants: [],
    deliveryPersons: [],
    customers: [],
    loading: true
  });
  const [simulatedRole, setSimulatedRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('simulatedRole');
    setSimulatedRole(storedRole);

    // REMOVA ESTA PARTE:
    // if (storedRole === 'cliente') {
    //   window.location.href = createPageUrl('ClientDashboard');
    //   return;
    // }

    // Carregar dados do dashboard
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [orders, restaurants, deliveryPersons, allUsers] = await Promise.all([
        Order.list("-created_date", 100),
        Restaurant.list(),
        DeliveryPerson.list(),
        User.list()
      ]);

      const customers = allUsers.filter(u => u.user_type === 'cliente');

      setStats({
        orders,
        restaurants,
        deliveryPersons,
        customers,
        loading: false
      });
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const getTotalRevenue = () => {
    return stats.orders
      .filter(order => order.status === 'entregue')
      .reduce((sum, order) => sum + (order.total_amount || 0), 0);
  };

  const getActiveRestaurants = () => {
    return stats.restaurants.filter(r => r.is_active).length;
  };

  const getActiveCustomers = () => {
    return stats.customers.filter(c => c.is_active !== false).length;
  };

  const getActiveDeliveryPersons = () => {
    return stats.deliveryPersons.filter(d => d.is_active).length;
  };

  const getSupportTickets = () => {
    return 23;
  };

  if (stats.loading || simulatedRole === null) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-96 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg p-6">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getDashboardTitle = () => {
    const titles = {
      'super_admin': 'Dashboard Super Admin',
      'admin': 'Dashboard Admin Regional',
      'dono_restaurante': 'Dashboard Restaurante',
      'entregador': 'Dashboard Entregador',
      'cliente': 'Dashboard Cliente'
    };
    return titles[simulatedRole] || 'Dashboard';
  };

  const getDashboardSubtitle = () => {
    const subtitles = {
      'super_admin': 'Controle total da plataforma ChegouDelivery',
      'admin': 'Gestão regional da plataforma',
      'dono_restaurante': 'Gestão do seu restaurante',
      'entregador': 'Suas entregas e disponibilidade',
      'cliente': 'Seus pedidos e favoritos'
    };
    return subtitles[simulatedRole] || '';
  };

  const isAdmin = simulatedRole === 'super_admin' || simulatedRole === 'admin';

  // REMOVA ESTA PARTE TAMBÉM:
  // if (simulatedRole === 'cliente') {
  //   return null;
  // }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral da plataforma e métricas importantes</p>
      </div>

      <StatsOverview
        ordersLength={stats.orders.length}
        totalRevenue={getTotalRevenue()}
        activeRestaurants={getActiveRestaurants()}
        activeDeliveryPersons={getActiveDeliveryPersons()}
        activeCustomers={getActiveCustomers()}
        simulatedRole={simulatedRole}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentOrders orders={stats.orders} />
        
        <QuickActions
          simulatedRole={simulatedRole}
          navigate={navigate}
          getSupportTickets={getSupportTickets}
        />
      </div>

      <DeliveryMap />
    </div>
  );
}