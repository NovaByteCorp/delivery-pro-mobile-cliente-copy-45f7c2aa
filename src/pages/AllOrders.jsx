import React, { useState, useEffect, useCallback } from "react";
import { Order } from "@/api/entities";
import { Restaurant } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Clock,
  DollarSign,
  Calendar,
  Building2
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom"; // Using React Router instead of Next.js
import { createPageUrl } from "@/utils";

const statusConfig = {
  pendente: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
  confirmado: { label: "Confirmado", color: "bg-blue-100 text-blue-800" },
  em_preparacao: { label: "Preparando", color: "bg-indigo-100 text-indigo-800" },
  pronto: { label: "Pronto", color: "bg-purple-100 text-purple-800" },
  saiu_entrega: { label: "Saiu p/ Entrega", color: "bg-sky-100 text-sky-800" },
  entregue: { label: "Entregue", color: "bg-green-100 text-green-800" },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-800" },
};

export default function AllOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [restaurantFilter, setRestaurantFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersData, restaurantsData] = await Promise.all([
        Order.list("-created_date", 200),
        Restaurant.list()
      ]);

      setOrders(ordersData);

      const restaurantMap = restaurantsData.reduce((acc, r) => {
        acc[r.id] = r.name;
        return acc;
      }, {});
      setRestaurants(restaurantMap);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setLoading(false);
  };

  const filterOrdersByDate = (orders, filter) => {
    const now = new Date();
    // Set to start of today for accurate comparisons
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    today.setHours(0, 0, 0, 0);

    switch (filter) {
      case "today":
        return orders.filter(o => {
          const orderDate = new Date(o.created_date);
          const orderDay = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
          orderDay.setHours(0, 0, 0, 0);
          return orderDay.getTime() === today.getTime();
        });
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return orders.filter(o => {
          const orderDate = new Date(o.created_date);
          const orderDay = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
          orderDay.setHours(0, 0, 0, 0);
          return orderDay.getTime() === yesterday.getTime();
        });
      case "week":
        // Get the start of the current week (Monday)
        const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
        const diff = today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1); // Adjust for Monday as start of week
        const startOfWeek = new Date(today.getFullYear(), today.getMonth(), diff);
        startOfWeek.setHours(0, 0, 0, 0);
        return orders.filter(o => new Date(o.created_date) >= startOfWeek);
      case "month":
        // Get the start of the current month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        startOfMonth.setHours(0, 0, 0, 0);
        return orders.filter(o => new Date(o.created_date) >= startOfMonth);
      default:
        return orders;
    }
  };

  const filteredOrders = filterOrdersByDate(
    orders.filter(order => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesRestaurant = restaurantFilter === "all" || order.restaurant_id === restaurantFilter;
      const matchesSearch = !searchQuery ||
        order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurants[order.restaurant_id]?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesRestaurant && matchesSearch;
    }),
    dateFilter
  );

  const getRestaurantsList = () => {
    // Sort restaurants alphabetically by name for better user experience
    return Object.entries(restaurants)
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  // Callback function to handle navigation to order details page
  const handleViewOrderDetails = useCallback((orderId) => {
    navigate(createPageUrl(`OrderDetails?id=${orderId}`));
  }, [navigate]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Pedidos</h1>
        <p className="text-gray-600">Monitore todos os pedidos da plataforma em tempo real</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por nº do pedido ou restaurante..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Status: {statusFilter === "all" ? "Todos" : statusConfig[statusFilter]?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                Todos os Status
              </DropdownMenuItem>
              {Object.entries(statusConfig).map(([status, config]) => (
                <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
                  {config.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Restaurant Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Restaurante: {restaurantFilter === "all" ? "Todos" : restaurants[restaurantFilter]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-64 overflow-y-auto">
              <DropdownMenuLabel>Filtrar por Restaurante</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setRestaurantFilter("all")}>
                Todos os Restaurantes
              </DropdownMenuItem>
              {getRestaurantsList().map((restaurant) => (
                <DropdownMenuItem key={restaurant.id} onClick={() => setRestaurantFilter(restaurant.id)}>
                  {restaurant.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Data: {dateFilter === "all" ? "Todas" :
                       dateFilter === "today" ? "Hoje" :
                       dateFilter === "yesterday" ? "Ontem" :
                       dateFilter === "week" ? "Esta semana" : "Este mês"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filtrar por Data</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDateFilter("all")}>
                Todas as datas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter("today")}>
                Hoje
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter("yesterday")}>
                Ontem
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter("week")}>
                Esta semana
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter("month")}>
                Este mês
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Pedidos</p>
                <p className="text-xl font-bold">{filteredOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-xl font-bold">
                  {filteredOrders.filter(o => ['pendente', 'confirmado', 'em_preparacao'].includes(o.status)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Receita</p>
                <p className="text-xl font-bold">
                  MT {filteredOrders
                    .filter(o => o.status === 'entregue')
                    .reduce((sum, o) => sum + (o.total_amount || 0), 0)
                    .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Restaurantes Ativos</p>
                <p className="text-xl font-bold">
                  {new Set(filteredOrders.map(o => o.restaurant_id)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-500" />
            Lista de Pedidos
            <Badge variant="secondary" className="ml-auto">
              {filteredOrders.length} pedidos
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Pedido</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Restaurante</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Nenhum pedido encontrado com os filtros aplicados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        #{order.order_number}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(order.created_date), "dd/MM/yy 'às' HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        {restaurants[order.restaurant_id] || "Não encontrado"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-gray-600">
                              {order.customer_id ? order.customer_id.slice(0, 2).toUpperCase() : 'CU'}
                            </span>
                          </div>
                          <span className="text-sm">Cliente</span> {/* Placeholder for customer name */}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        MT {order.total_amount?.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusConfig[order.status]?.color}>
                          {statusConfig[order.status]?.label || order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewOrderDetails(order.id)} // Added onClick handler
                          title="Ver detalhes do pedido" // Added title for accessibility
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}