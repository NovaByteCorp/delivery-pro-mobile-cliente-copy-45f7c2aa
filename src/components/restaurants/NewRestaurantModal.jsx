import React, { useState } from "react";
import { Restaurant } from "@/api/entities";
import { User } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  Building2, 
  AlertCircle, 
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Shield
} from "lucide-react";

export default function NewRestaurantModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    cuisine_type: "",
    minimum_order: "",
    is_active: true
  });

  const [ownerData, setOwnerData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: ""
  });

  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const cuisineTypes = [
    "brasileira", "italiana", "japonesa", "mexicana", 
    "arabe", "americana", "vegetariana", "outras"
  ];

  const validateForm = async () => {
    const newErrors = {};

    // Validar dados do restaurante
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.description.trim()) newErrors.description = "Descrição é obrigatória";
    if (!formData.address.trim()) newErrors.address = "Endereço é obrigatório";
    if (!formData.phone.trim()) newErrors.phone = "Telefone é obrigatório";
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório";
    if (!formData.cuisine_type) newErrors.cuisine_type = "Tipo de culinária é obrigatório";

    // Validar dados do dono
    if (!ownerData.full_name.trim()) newErrors.owner_name = "Nome do dono é obrigatório";
    if (!ownerData.email.trim()) newErrors.owner_email = "Email do dono é obrigatório";
    if (!ownerData.phone.trim()) newErrors.owner_phone = "Telefone do dono é obrigatório";
    if (!ownerData.password.trim()) newErrors.owner_password = "Senha é obrigatória";
    if (ownerData.password.length < 6) newErrors.owner_password = "Senha deve ter pelo menos 6 caracteres";

    // Verificar se email do dono já existe
    try {
      const allUsers = await SystemUser.list();
      const existingUser = allUsers.find(u => u.email.toLowerCase() === ownerData.email.toLowerCase());
      if (existingUser) {
        newErrors.owner_email = "Este email já está em uso";
      }
    } catch (error) {
      console.error("Erro ao verificar email:", error);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setImage(file_url);
    } catch (error) {
      console.error("Erro no upload:", error);
      setErrors({ ...errors, image: "Erro no upload da imagem" });
    }
    setUploading(false);
  };

  const handleSave = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    setSaving(true);
    try {
      // 1. Criar o restaurante
      const restaurantData = {
        ...formData,
        minimum_order: formData.minimum_order ? parseFloat(formData.minimum_order) : 0,
        image_url: image,
        rating: 5.0
      };

      const newRestaurant = await Restaurant.create(restaurantData);

      // 2. Criar conta do dono do restaurante
      await SystemUser.create({
        full_name: ownerData.full_name,
        email: ownerData.email,
        phone: ownerData.phone,
        password: ownerData.password,
        user_type: "dono_restaurante",
        assigned_restaurant_id: newRestaurant.id,
        is_active: true
      });

      onSave();
    } catch (error) {
      console.error("Erro ao criar restaurante:", error);
      setErrors({ general: "Erro ao salvar restaurante. Verifique os dados." });
    }
    setSaving(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            Cadastrar Novo Restaurante
          </DialogTitle>
        </DialogHeader>

        {errors.general && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-8">
          {/* Informações do Restaurante */}
          <Card className="border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-red-50">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-red-600 text-white px-3 py-1 text-sm font-bold">RESTAURANTE</Badge>
                <h3 className="text-xl font-bold text-slate-800">Dados do Estabelecimento</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-bold">Nome do Restaurante *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Restaurante Sabores do Mar"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <span className="text-red-600 text-xs">{errors.name}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cuisine_type" className="font-bold">Tipo de Culinária *</Label>
                  <Select value={formData.cuisine_type} onValueChange={(value) => setFormData({...formData, cuisine_type: value})}>
                    <SelectTrigger className={errors.cuisine_type ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {cuisineTypes.map(type => (
                        <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.cuisine_type && <span className="text-red-600 text-xs">{errors.cuisine_type}</span>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold">Descrição *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descreva o restaurante, especialidades, ambiente..."
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <span className="text-red-600 text-xs">{errors.description}</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="address" className="font-bold">Endereço Completo *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Rua, número, bairro, cidade"
                    className={errors.address ? 'border-red-500' : ''}
                  />
                  {errors.address && <span className="text-red-600 text-xs">{errors.address}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-bold">Telefone do Restaurante *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+258 84 123 4567"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && <span className="text-red-600 text-xs">{errors.phone}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold">Email do Restaurante *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="contato@restaurante.mz"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <span className="text-red-600 text-xs">{errors.email}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimum_order" className="font-bold">Pedido Mínimo (MT)</Label>
                  <Input
                    id="minimum_order"
                    type="number"
                    step="0.01"
                    value={formData.minimum_order}
                    onChange={(e) => setFormData({...formData, minimum_order: e.target.value})}
                    placeholder="100.00"
                  />
                </div>
              </div>

              {/* Upload de Imagem */}
              <div className="space-y-2">
                <Label className="font-bold">Foto do Restaurante</Label>
                <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="restaurant-image"
                    disabled={uploading}
                  />
                  <label htmlFor="restaurant-image" className="cursor-pointer">
                    {uploading ? (
                      <div className="text-orange-600">Enviando...</div>
                    ) : image ? (
                      <div className="space-y-2">
                        <img src={image} alt="Preview" className="w-32 h-32 object-cover rounded-lg mx-auto" />
                        <p className="text-green-600 font-medium">Imagem carregada ✓</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-orange-600 mx-auto" />
                        <p>Clique para adicionar foto</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
                <Label htmlFor="is_active" className="font-medium">Restaurante ativo imediatamente</Label>
              </div>
            </CardContent>
          </Card>

          {/* Conta do Dono do Restaurante */}
          <Card className="border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-blue-600 text-white px-3 py-1 text-sm font-bold">DONO</Badge>
                <h3 className="text-xl font-bold text-slate-800">Conta do Proprietário</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="owner_name" className="font-bold flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    Nome Completo do Dono *
                  </Label>
                  <Input
                    id="owner_name"
                    value={ownerData.full_name}
                    onChange={(e) => setOwnerData({...ownerData, full_name: e.target.value})}
                    placeholder="João Silva Santos"
                    className={errors.owner_name ? 'border-red-500' : ''}
                  />
                  {errors.owner_name && <span className="text-red-600 text-xs">{errors.owner_name}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner_email" className="font-bold flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    Email de Login *
                  </Label>
                  <Input
                    id="owner_email"
                    type="email"
                    value={ownerData.email}
                    onChange={(e) => setOwnerData({...ownerData, email: e.target.value})}
                    placeholder="joao@email.com"
                    className={errors.owner_email ? 'border-red-500' : ''}
                  />
                  {errors.owner_email && <span className="text-red-600 text-xs">{errors.owner_email}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="owner_phone" className="font-bold flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    Telefone Pessoal *
                  </Label>
                  <Input
                    id="owner_phone"
                    value={ownerData.phone}
                    onChange={(e) => setOwnerData({...ownerData, phone: e.target.value})}
                    placeholder="+258 84 987 6543"
                    className={errors.owner_phone ? 'border-red-500' : ''}
                  />
                  {errors.owner_phone && <span className="text-red-600 text-xs">{errors.owner_phone}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner_password" className="font-bold flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    Senha de Acesso *
                  </Label>
                  <Input
                    id="owner_password"
                    type="password"
                    value={ownerData.password}
                    onChange={(e) => setOwnerData({...ownerData, password: e.target.value})}
                    placeholder="••••••••"
                    className={errors.owner_password ? 'border-red-500' : ''}
                  />
                  {errors.owner_password && <span className="text-red-600 text-xs">{errors.owner_password}</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-between items-center pt-6">
          <p className="text-sm text-slate-600">* Campos obrigatórios</p>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={saving} className="px-6">
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Criando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Criar Restaurante + Conta
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}