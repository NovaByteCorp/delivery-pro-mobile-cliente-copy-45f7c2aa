import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  TrendingUp,
  Truck,
  HeadphonesIcon
} from "lucide-react";

export default function StatsOverview({ stats }) {
  const statsCards = [
    {
      title: "Pedidos Hoje",
      value: stats.todayOrders,
      icon: ShoppingBag,
      color: "gradient-primary",
      textColor: "text-red-600",
      bgColor: "bg-red-50",
      change: "+12%",
      trending: true
    },
    {
      title: "Pedidos Pendentes",
      value: stats.pendingOrders,
      icon: Clock,
      color: "gradient-warning",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
      urgent: stats.pendingOrders > 10
    },
    {
      title: "Receita Total",
      value: `MT ${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "gradient-success",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      change: "+8%",
      trending: true
    },
    {
      title: "Entregadores Ativos",
      value: stats.activeDeliveryPersons,
      icon: Truck,
      color: "gradient-purple",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <style>
        {`
          .gradient-primary { background: linear-gradient(135deg, #ea1d2c 0%, #ff4757 100%); }
          .gradient-warning { background: linear-gradient(135deg, #ff6348 0%, #ffa502 100%); }
          .gradient-success { background: linear-gradient(135deg, #2ed573 0%, #1dd1a1 100%); }
          .gradient-purple { background: linear-gradient(135deg, #a55eea 0%, #8854d0 100%); }
          
          .glass-effect {
            backdrop-filter: blur(20px);
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .shadow-elegant {
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
        `}
      </style>
      {statsCards.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden border-0 shadow-elegant glass-effect hover:shadow-2xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-100 to-orange-100 rounded-full opacity-20 transform translate-x-8 -translate-y-8" />
          <CardHeader className="flex flex-row items-center justify-between pb-4 relative z-10">
            <div className={`p-4 rounded-2xl ${stat.bgColor} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
            <div className="flex flex-col items-end gap-1">
              {stat.urgent && (
                <div className="flex items-center gap-2 text-red-500 text-xs font-bold">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  URGENTE
                </div>
              )}
              {stat.trending && (
                <div className="flex items-center gap-1 text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-bold">{stat.change}</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0 relative z-10">
            <div className="space-y-3">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{stat.title}</p>
              <p className="text-4xl font-black text-gray-900 leading-none">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}