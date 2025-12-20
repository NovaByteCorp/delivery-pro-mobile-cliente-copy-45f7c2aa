
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Info, Users, ShieldCheck } from "lucide-react";
import EditUserModal from "../components/admin/EditUserModal";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await User.list();
      setUsers(allUsers);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
    setLoading(false);
  };

  const handleUserUpdate = () => {
    setEditingUser(null);
    loadUsers();
  };

  const userTypeColors = {
    cliente: "bg-blue-100 text-blue-800",
    entregador: "bg-purple-100 text-purple-800",
    dono_restaurante: "bg-emerald-100 text-emerald-800",
    suporte: "bg-yellow-100 text-yellow-800",
    admin: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gradient-to-br from-slate-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Painel de Administração</h1>
          <p className="text-slate-600">Gerencie usuários e permissões do sistema.</p>
        </div>

        <Alert className="mb-8 border-orange-200 bg-orange-50/80">
          <Info className="h-4 w-4 text-orange-500" />
          <AlertTitle className="text-orange-800">Como convidar novos usuários?</AlertTitle>
          <AlertDescription className="text-orange-700">
            Para adicionar novos usuários, utilize o painel principal da plataforma base44, na seção "Data" {'>'} "User" e clique em "Invite User". Após o cadastro, eles aparecerão nesta lista para gerenciamento.
          </AlertDescription>
        </Alert>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-600" />
              Lista de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tipo de Usuário</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5} className="py-4">
                        <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={`${userTypeColors[user.user_type] || "bg-slate-100 text-slate-800"} capitalize`}>
                          {user.user_type?.replace(/_/g, ' ') || "Não definido"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? "default" : "destructive"} className={user.is_active ? "bg-emerald-500" : ""}>
                          {user.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => setEditingUser(user)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {editingUser && (
          <EditUserModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSave={handleUserUpdate}
          />
        )}
      </div>
    </div>
  );
}
