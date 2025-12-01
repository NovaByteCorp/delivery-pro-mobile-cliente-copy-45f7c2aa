
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import DeliveryAdminDashboard from "../components/deliveries/DeliveryAdminDashboard";
import DeliveryPersonDashboard from "../components/deliveries/DeliveryPersonDashboard";

export default function DeliveriesPage() {
  const [user, setUser] = useState(null);
  const [simulatedRole, setSimulatedRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        const storedRole = localStorage.getItem('simulatedRole');
        setSimulatedRole(storedRole || currentUser.user_type);
      } catch (error) {
        console.error("User not authenticated", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="h-8 w-1/3 bg-slate-200 rounded animate-pulse mb-8"></div>
        <div className="h-64 bg-slate-200 rounded animate-pulse"></div>
      </div>
    );
  }

  const isAdmin = simulatedRole === 'admin' || simulatedRole === 'super_admin';
  const isDeliveryPerson = simulatedRole === 'entregador';

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gradient-to-br from-slate-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {isAdmin && <DeliveryAdminDashboard />}
        {isDeliveryPerson && <DeliveryPersonDashboard user={user} />}
        {!isAdmin && !isDeliveryPerson && (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-slate-800">Acesso Negado</h2>
            <p className="text-slate-600">Você não tem permissão para visualizar esta página.</p>
          </div>
        )}
      </div>
    </div>
  );
}
