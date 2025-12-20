import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Restaurant } from "@/api/entities";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function EditUserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    user_type: "cliente",
    is_active: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        user_type: user.user_type || "cliente",
        is_active: user.is_active !== undefined ? user.is_active : true,
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await User.update(user.id, formData);
      onSave();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    }
    setSaving(false);
  };

  const userTypes = ["cliente", "entregador", "dono_restaurante", "suporte", "admin"];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Gerencie o tipo e o status de acesso para {user.full_name}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="user-type" className="text-right">
              Tipo
            </Label>
            <div className="col-span-3">
              <Select
                value={formData.user_type}
                onValueChange={(value) => setFormData({ ...formData, user_type: value })}
              >
                <SelectTrigger id="user-type">
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  {userTypes.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="is-active" className="text-right">
              Status
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Switch
                id="is-active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <span className="text-sm text-slate-600">
                {formData.is_active ? "Ativo" : "Inativo"}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-orange-600 hover:bg-orange-700">
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
