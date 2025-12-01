import React, { useState, useEffect } from "react";
import { Restaurant } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Search,
  Plus,
  MapPin,
  Phone,
  Star,
  Edit,
  Eye,
  UtensilsCrossed,
  Trash2
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NewRestaurantModal from "../components/restaurants/NewRestaurantModal";
import EditRestaurantModal from "../components/restaurants/EditRestaurantModal";
import RestaurantDetailsModal from "../components/restaurants/RestaurantDetailsModal";

export default function AllRestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewRestaurantModal, setShowNewRestaurantModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [viewingRestaurant, setViewingRestaurant] = useState(null);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const data = await Restaurant.getAll();
      setRestaurants(data);
    } catch (error) {
      console.error("Erro ao carregar restaurantes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantSaved = () => {
    setShowNewRestaurantModal(false);
    setEditingRestaurant(null);
    loadRestaurants();
  };

  const handleDeleteRestaurant = async (restaurant) => {
    if (!confirm(`Tem certeza que deseja deletar o restaurante "${restaurant.name}"?`)) {
      return;
    }

    try {
      await Restaurant.delete(restaurant.id);
      loadRestaurants();
    } catch (error) {
      console.error("Erro ao deletar restaurante:", error);
      alert("Erro ao deletar restaurante. Tente novamente.");
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    !searchQuery ||
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Restaurantes</h1>
          <p className="text-gray-600">Gerencie todos os restaurantes da plataforma</p>
        </div>
        <Button
          onClick={() => setShowNewRestaurantModal(true)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Restaurante
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar restaurantes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary" className="px-3 py-2">
          {filteredRestaurants.length} restaurantes
        </Badge>
      </div>

      {/* Restaurants Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-orange-500" />
            Lista de Restaurantes
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
                  <TableHead>Tipo de Culinária</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRestaurants.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Nenhum restaurante encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRestaurants.map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          {restaurant.image_url ? (
                            <img
                              src={restaurant.image_url}
                              alt={restaurant.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-orange-500" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold">{restaurant.name}</p>
                            <p className="text-sm text-gray-500">{restaurant.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">
                        {restaurant.cuisine_type || 'Não definido'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {restaurant.address}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {restaurant.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">
                            {restaurant.rating?.toFixed(1) || '5.0'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={restaurant.is_active ? "default" : "secondary"}
                          className={restaurant.is_active ? "bg-green-500" : ""}
                        >
                          {restaurant.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Link to={createPageUrl(`Menu?restaurant=${restaurant.id}`)}>
                            <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" title="Ver Cardápio">
                              <UtensilsCrossed className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Ver Detalhes"
                            onClick={() => setViewingRestaurant(restaurant)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Editar"
                            onClick={() => setEditingRestaurant(restaurant)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Deletar"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteRestaurant(restaurant)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {showNewRestaurantModal && (
        <NewRestaurantModal
          onClose={() => setShowNewRestaurantModal(false)}
          onSave={handleRestaurantSaved}
        />
      )}

      {editingRestaurant && (
        <EditRestaurantModal
          restaurant={editingRestaurant}
          onClose={() => setEditingRestaurant(null)}
          onSave={handleRestaurantSaved}
        />
      )}

      {viewingRestaurant && (
        <RestaurantDetailsModal
          restaurant={viewingRestaurant}
          onClose={() => setViewingRestaurant(null)}
        />
      )}
    </div>
  );
}