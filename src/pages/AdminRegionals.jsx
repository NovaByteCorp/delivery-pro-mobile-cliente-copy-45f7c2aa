
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  UserCog,
  Search,
  Plus,
  Mail,
  Phone,
  Edit,
  Shield
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import NewAdminModal from "../components/admin/NewAdminModal";
import EditAdminModal from "../components/admin/EditAdminModal"; // Import the new EditAdminModal

export default function AdminRegionalsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewAdminModal, setShowNewAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null); // New state for editing admin

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      // Usar SystemUser e filtrar apenas admins regionais
      const allUsers = await SystemUser.list();
      const adminUsers = allUsers.filter(user => user.user_type === 'admin');
      setAdmins(adminUsers);
    } catch (error) {
      console.error("Erro ao carregar administradores:", error);
    }
    setLoading(false);
  };

  const handleAdminSaved = () => {
    setShowNewAdminModal(false);
    setEditingAdmin(null); // Reset editingAdmin after save
    loadAdmins();
  };

  const filteredAdmins = admins.filter(admin =>
    !searchQuery ||
    admin.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (admin.assigned_region && admin.assigned_region.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Regionais</h1>
          <p className="text-gray-600">Gerencie administradores regionais da plataforma</p>
        </div>
        <Button
          onClick={() => setShowNewAdminModal(true)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Admin Regional
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar administradores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary" className="px-3 py-2">
          {filteredAdmins.length} administradores
        </Badge>
      </div>

      {/* Admins Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="w-5 h-5 text-orange-500" />
            Lista de Administradores
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="text-center py-8">
              <UserCog className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum administrador encontrado</p>
              <p className="text-sm text-gray-400">
                {searchQuery ? 'Tente refinar sua busca' : 'Adicione o primeiro administrador regional'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Região</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <Shield className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="font-semibold">{admin.full_name}</p>
                          <p className="text-sm text-gray-500">Admin Regional</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="w-3 h-3 text-gray-400" />
                        {admin.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="w-3 h-3 text-gray-400" />
                        {admin.phone || 'Não informado'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {admin.assigned_region || 'Não definida'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={admin.is_active ? "default" : "secondary"}
                        className={admin.is_active ? "bg-green-500" : ""}
                      >
                        {admin.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {admin.created_date ? new Date(admin.created_date).toLocaleDateString('pt-BR') : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingAdmin(admin)} // Set admin for editing
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

      {showNewAdminModal && (
        <NewAdminModal
          onClose={() => setShowNewAdminModal(false)}
          onSave={handleAdminSaved}
        />
      )}

      {editingAdmin && (
        <EditAdminModal
          admin={editingAdmin}
          onClose={() => setEditingAdmin(null)}
          onSave={handleAdminSaved}
        />
      )}
    </div>
  );
}
