import React, { useState, useEffect } from "react";
import { DeliveryPerson } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, 
  Search, 
  Plus, 
  Phone, 
  Star,
  Edit,
  Eye
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import NewDeliveryPersonModal from "../components/deliveries/NewDeliveryPersonModal";
import EditDeliveryPersonModal from "../components/deliveries/EditDeliveryPersonModal";
import DeliveryPersonDetailsModal from "../components/deliveries/DeliveryPersonDetailsModal";

export default function AllDeliveriesPage() {
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewDeliveryModal, setShowNewDeliveryModal] = useState(false);
  const [editingDeliveryPerson, setEditingDeliveryPerson] = useState(null);
  const [viewingDeliveryPerson, setViewingDeliveryPerson] = useState(null);

  useEffect(() => {
    loadDeliveryPersons();
  }, []);

  const loadDeliveryPersons = async () => {
    setLoading(true);
    try {
      const data = await DeliveryPerson.list();
      setDeliveryPersons(data);
    } catch (error) {
      console.error("Erro ao carregar entregadores:", error);
    }
    setLoading(false);
  };

  const handleDeliveryPersonSaved = () => {
    setShowNewDeliveryModal(false);
    setEditingDeliveryPerson(null); // Close edit modal as well
    loadDeliveryPersons();
  };

  const filteredDeliveryPersons = deliveryPersons.filter(delivery =>
    !searchQuery ||
    delivery.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    delivery.vehicle_type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Entregadores</h1>
          <p className="text-gray-600">Gerencie todos os entregadores da plataforma</p>
        </div>
        <Button 
          onClick={() => setShowNewDeliveryModal(true)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Entregador
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar entregadores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary" className="px-3 py-2">
          {filteredDeliveryPersons.length} entregadores
        </Badge>
      </div>

      {/* Delivery Persons Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-orange-500" />
            Lista de Entregadores
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Entregas</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Disponibilidade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveryPersons.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <Truck className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="font-semibold">{delivery.name}</p>
                          <p className="text-sm text-gray-500">Entregador</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {delivery.vehicle_type}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{delivery.vehicle_plate}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="w-3 h-3 text-gray-400" />
                        {delivery.phone}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {delivery.total_deliveries || 0}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">
                          {delivery.rating?.toFixed(1) || '5.0'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={delivery.is_active ? "default" : "secondary"}
                        className={delivery.is_active ? "bg-green-500" : ""}
                      >
                        {delivery.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={delivery.is_available ? "default" : "secondary"}
                        className={delivery.is_available ? "bg-blue-500" : ""}
                      >
                        {delivery.is_available ? "Disponível" : "Indisponível"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Ver Detalhes"
                          onClick={() => setViewingDeliveryPerson(delivery)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Editar"
                          onClick={() => setEditingDeliveryPerson(delivery)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {showNewDeliveryModal && (
        <NewDeliveryPersonModal
          onClose={() => setShowNewDeliveryModal(false)}
          onSave={handleDeliveryPersonSaved}
        />
      )}

      {editingDeliveryPerson && (
        <EditDeliveryPersonModal
          deliveryPerson={editingDeliveryPerson}
          onClose={() => setEditingDeliveryPerson(null)}
          onSave={handleDeliveryPersonSaved}
        />
      )}

      {viewingDeliveryPerson && (
        <DeliveryPersonDetailsModal
          deliveryPerson={viewingDeliveryPerson}
          onClose={() => setViewingDeliveryPerson(null)}
        />
      )}
    </div>
  );
}