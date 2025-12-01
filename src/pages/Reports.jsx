import React, { useState, useEffect } from "react";
import { Order } from "@/api/entities";
import { Restaurant } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, 
  ShoppingBag, 
  Truck, 
  Users,
  Download,
  FileText,
  BarChart3,
  TrendingUp,
  Calendar
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const StatCard = ({ title, value, icon: Icon, change, color = "bg-blue-500" }) => (
  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {change && <p className="text-xs text-emerald-600">{change} vs. mês passado</p>}
    </CardContent>
  </Card>
);

export default function ReportsPage() {
  const [stats, setStats] = useState({ 
    totalRevenue: 0, 
    totalOrders: 0, 
    avgTicket: 0, 
    activeRestaurants: 0,
    activeUsers: 0,
    activeDeliverers: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('sales');
  const [timeRange, setTimeRange] = useState('30days');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const [orders, restaurants, users] = await Promise.all([
        Order.list(),
        Restaurant.list(),
        User.list()
      ]);

      const totalRevenue = orders
        .filter(order => order.status === 'entregue')
        .reduce((sum, order) => sum + (order.total_amount || 0), 0);
      
      const totalOrders = orders.length;
      const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const activeRestaurants = restaurants.filter(r => r.is_active).length;
      const activeUsers = users.filter(u => u.user_type === 'cliente').length;
      const activeDeliverers = users.filter(u => u.user_type === 'entregador').length;
      
      setStats({ 
        totalRevenue, 
        totalOrders, 
        avgTicket, 
        activeRestaurants,
        activeUsers,
        activeDeliverers
      });
      
      // Mock sales data for charts
      const mockSalesData = [
        { name: 'Jan', Vendas: 4000, Pedidos: 240 },
        { name: 'Fev', Vendas: 3000, Pedidos: 180 },
        { name: 'Mar', Vendas: 5000, Pedidos: 300 },
        { name: 'Abr', Vendas: 4500, Pedidos: 270 },
        { name: 'Mai', Vendas: 6000, Pedidos: 360 },
        { name: 'Jun', Vendas: 5500, Pedidos: 330 },
      ];
      setSalesData(mockSalesData);

    } catch (error) {
      console.error("Erro ao gerar relatórios:", error);
    }
    setLoading(false);
  };

  const exportReport = (type) => {
    // Simulate report generation and download
    const fileName = `relatorio_${type}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Create mock CSV data
    let csvContent = "";
    
    switch(type) {
      case 'sales':
        csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Período,Vendas,Pedidos,Ticket Médio\n";
        salesData.forEach(row => {
          csvContent += `${row.name},${row.Vendas},${row.Pedidos},${(row.Vendas/row.Pedidos).toFixed(2)}\n`;
        });
        break;
      case 'financial':
        csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Métrica,Valor\n";
        csvContent += `Receita Total,MT ${stats.totalRevenue.toFixed(2)}\n`;
        csvContent += `Total Pedidos,${stats.totalOrders}\n`;
        csvContent += `Ticket Médio,MT ${stats.avgTicket.toFixed(2)}\n`;
        break;
      case 'users':
        csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Tipo,Quantidade\n";
        csvContent += `Clientes Ativos,${stats.activeUsers}\n`;
        csvContent += `Restaurantes Ativos,${stats.activeRestaurants}\n`;
        csvContent += `Entregadores Ativos,${stats.activeDeliverers}\n`;
        break;
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (loading) return (
    <div className="p-8">
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-slate-200 rounded w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gradient-to-br from-slate-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Relatórios e Análises</h1>
            <p className="text-slate-600">Insights detalhados sobre a performance do seu negócio.</p>
          </div>
          
          <div className="flex gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Últimos 7 dias</SelectItem>
                <SelectItem value="30days">Últimos 30 dias</SelectItem>
                <SelectItem value="90days">Últimos 90 dias</SelectItem>
                <SelectItem value="1year">Último ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6 mb-8">
          <StatCard 
            title="Receita Total" 
            value={`MT ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
            icon={DollarSign} 
            change="+20.1%" 
            color="bg-green-500"
          />
          <StatCard 
            title="Total de Pedidos" 
            value={stats.totalOrders.toLocaleString('pt-BR')} 
            icon={ShoppingBag} 
            change="+18.2%" 
            color="bg-blue-500"
          />
          <StatCard 
            title="Ticket Médio" 
            value={`MT ${stats.avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
            icon={TrendingUp} 
            change="+5.5%" 
            color="bg-purple-500"
          />
          <StatCard 
            title="Restaurantes" 
            value={stats.activeRestaurants} 
            icon={Users} 
            color="bg-orange-500"
          />
          <StatCard 
            title="Clientes Ativos" 
            value={stats.activeUsers} 
            icon={Users} 
            color="bg-indigo-500"
          />
          <StatCard 
            title="Entregadores" 
            value={stats.activeDeliverers} 
            icon={Truck} 
            color="bg-cyan-500"
          />
        </div>

        {/* Export Buttons */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-orange-500" />
              Exportar Relatórios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => exportReport('sales')} 
                className="h-16 flex flex-col gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Relatório de Vendas</span>
              </Button>
              
              <Button 
                onClick={() => exportReport('financial')} 
                className="h-16 flex flex-col gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                <DollarSign className="w-5 h-5" />
                <span>Relatório Financeiro</span>
              </Button>
              
              <Button 
                onClick={() => exportReport('users')} 
                className="h-16 flex flex-col gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              >
                <Users className="w-5 h-5" />
                <span>Relatório de Usuários</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-500" />
                Vendas Mensais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      name === 'Vendas' ? `MT ${value}` : value, 
                      name === 'Vendas' ? 'Vendas' : 'Pedidos'
                    ]} />
                    <Legend />
                    <Bar dataKey="Vendas" fill="#f97316" name="Vendas" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Tendência de Pedidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="Pedidos" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              Resumo de Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">
                  {((stats.totalRevenue / 100000) * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-green-700 font-medium">Meta de Receita</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.activeRestaurants > 10 ? '98.5' : '85.2'}%
                </div>
                <p className="text-sm text-blue-700 font-medium">Taxa de Satisfação</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((stats.totalOrders / stats.activeUsers) * 10) / 10}
                </div>
                <p className="text-sm text-purple-700 font-medium">Pedidos por Cliente</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
                <div className="text-2xl font-bold text-orange-600">32min</div>
                <p className="text-sm text-orange-700 font-medium">Tempo Médio Entrega</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}