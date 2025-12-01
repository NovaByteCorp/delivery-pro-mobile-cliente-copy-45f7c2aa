
import React, { useState, useEffect } from "react";
import { Restaurant } from "@/api/entities";
import { User } from "@/api/entities"; // Added import for SystemUser
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
  Building2, 
  AlertCircle, 
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  UtensilsCrossed,
  Upload,
  X,
  Shield // Added Shield icon
} from "lucide-react";

export default function EditRestaurantModal({ restaurant, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    cuisine_type: "",
    minimum_order: "",
    is_active: true,
    image_url: "",
    current_password: "", // New field for current password
    new_password: "",    // New field for new password
    confirm_password: "" // New field for confirming new password
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || "",
        description: restaurant.description || "",
        address: restaurant.address || "",
        phone: restaurant.phone || "",
        email: restaurant.email || "",
        cuisine_type: restaurant.cuisine_type || "",
        minimum_order: restaurant.minimum_order || "",
        is_active: restaurant.is_active !== false,
        image_url: restaurant.image_url || "",
        current_password: "", // Reset password fields on restaurant change
        new_password: "",
        confirm_password: ""
      });
      setErrors({}); // Clear errors when restaurant changes
    }
  }, [restaurant]);

  const cuisineTypes = [
    { value: "brasileira", label: "Brasileira" },
    { value: "italiana", label: "Italiana" },
    { value: "japonesa", label: "Japonesa" },
    { value: "mexicana", label: "Mexicana" },
    { value: "arabe", label: "Árabe" },
    { value: "americana", label: "Americana" },
    { value: "vegetariana", label: "Vegetariana" },
    { value: "outras", label: "Outras" }
  ];

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData({ ...formData, image_url: file_url });
    } catch (error) {
      console.error("Erro no upload:", error);
      setErrors({ ...errors, image: "Erro no upload da imagem" });
    }
    setUploading(false);
  };

  const removeImage = () => {
    setFormData({ ...formData, image_url: "" });
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = "Nome do restaurante é obrigatório";
        } else if (value.length < 3) {
          newErrors.name = "Nome deve ter pelo menos 3 caracteres";
        } else {
          delete newErrors.name;
        }
        break;
      
      case 'address':
        if (!value.trim()) {
          newErrors.address = "Endereço é obrigatório";
        } else if (value.length < 10) {
          newErrors.address = "Endereço deve ser mais detalhado";
        } else {
          delete newErrors.address;
        }
        break;
      
      case 'phone':
        const phoneRegex = /^(\+258|258)?[0-9]{9}$/;
        if (!value.trim()) {
          newErrors.phone = "Telefone é obrigatório";
        } else if (!phoneRegex.test(value.replace(/\s/g, ''))) {
          newErrors.phone = "Telefone deve ter formato válido moçambicano";
        } else {
          delete newErrors.phone;
        }
        break;
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          newErrors.email = "Email deve ter formato válido";
        } else {
          delete newErrors.email;
        }
        break;
      
      case 'minimum_order':
        const minOrder = parseFloat(value);
        if (value && (isNaN(minOrder) || minOrder < 0)) {
          newErrors.minimum_order = "Pedido mínimo deve ser um valor válido";
        } else {
          delete newErrors.minimum_order;
        }
        break;
      // Password fields are not validated onChange, but on save.
    }

    setErrors(newErrors);
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.address.trim()) newErrors.address = "Endereço é obrigatório";
    if (!formData.phone.trim()) newErrors.phone = "Telefone é obrigatório";
    if (!formData.cuisine_type) newErrors.cuisine_type = "Tipo de culinária é obrigatório";

    // Validar senhas se estiver tentando alterar
    if (formData.new_password || formData.confirm_password) {
      if (!formData.current_password) {
        newErrors.current_password = "Senha atual é obrigatória para alterar senha";
      }

      if (formData.new_password !== formData.confirm_password) {
        newErrors.new_password = "Senhas não coincidem";
      }

      if (formData.new_password && formData.new_password.length < 6) { // Check new_password length only if it's provided
        newErrors.new_password = "Nova senha deve ter pelo menos 6 caracteres";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const restaurantData = {
        ...formData,
        minimum_order: formData.minimum_order ? parseFloat(formData.minimum_order) : 0
      };

      // Remove campos de senha dos dados do restaurante, eles são tratados separadamente
      delete restaurantData.current_password;
      delete restaurantData.new_password;
      delete restaurantData.confirm_password;

      await Restaurant.update(restaurant.id, restaurantData);

      // Se há alteração de senha, atualizar também o dono do restaurante
      if (formData.new_password) {
        try {
          const allUsers = await SystemUser.list();
          const owner = allUsers.find(u => u.assigned_restaurant_id === restaurant.id && u.user_type === 'dono_restaurante');
          
          if (owner) {
            // CRITICAL: This is a plaintext password comparison. In a real-world scenario,
            // current_password would be sent to the backend for secure hashing and comparison.
            if (owner.password !== formData.current_password) {
              setErrors(prevErrors => ({ ...prevErrors, current_password: "Senha atual incorreta" }));
              setSaving(false);
              return;
            }
            
            await SystemUser.update(owner.id, { password: formData.new_password });
          } else {
            console.warn("Nenhum usuário proprietário encontrado para este restaurante.");
          }
        } catch (error) {
          console.error("Erro ao atualizar senha do dono:", error);
          setErrors(prevErrors => ({ ...prevErrors, general: prevErrors.general || "Erro ao atualizar senha do proprietário." }));
          setSaving(false); // Stop saving if password update fails
          return; // Prevent onSave() from being called if password update fails
        }
      }

      onSave(); // Call onSave only if all updates are successful
    } catch (error) {
      console.error("Erro ao atualizar restaurante:", error);
      setErrors(prevErrors => ({ ...prevErrors, general: prevErrors.general || "Erro ao salvar restaurante. Verifique os dados e tente novamente." }));
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
            Editar Restaurante
          </DialogTitle>
        </DialogHeader>

        {errors.general && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-red-600 text-white px-3 py-1 text-sm font-bold">
                  OBRIGATÓRIO
                </Badge>
                <h3 className="text-lg font-bold text-slate-800">Informações Básicas</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-orange-600" />
                    Nome do Restaurante *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`h-12 ${errors.name ? 'border-red-500 bg-red-50' : 'border-orange-300'}`}
                  />
                  {errors.name && <span className="text-red-600 text-xs font-medium">{errors.name}</span>}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                    Tipo de Culinária *
                  </Label>
                  <Select value={formData.cuisine_type} onValueChange={(value) => handleInputChange('cuisine_type', value)}>
                    <SelectTrigger className={`h-12 ${errors.cuisine_type ? 'border-red-500 bg-red-50' : 'border-orange-300'}`}>
                      <SelectValue placeholder="Selecione o tipo de culinária" />
                    </SelectTrigger>
                    <SelectContent>
                      {cuisineTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="text-base">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.cuisine_type && <span className="text-red-600 text-xs font-medium">{errors.cuisine_type}</span>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-bold">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva seu restaurante..."
                  rows={3}
                  className="border-orange-300"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contato e Localização */}
          <Card className="border border-slate-200">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Contato e Localização</h3>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-bold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  Endereço Completo *
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Rua, número, bairro, cidade"
                  className={`h-12 ${errors.address ? 'border-red-500 bg-red-50' : ''}`}
                />
                {errors.address && <span className="text-red-600 text-xs font-medium">{errors.address}</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-bold flex items-center gap-2">
                    <Phone className="w-4 h-4 text-orange-600" />
                    Telefone *
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+258 84 123 4567"
                    className={`h-12 ${errors.phone ? 'border-red-500 bg-red-50' : ''}`}
                  />
                  {errors.phone && <span className="text-red-600 text-xs font-medium">{errors.phone}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold flex items-center gap-2">
                    <Mail className="w-4 h-4 text-orange-600" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contato@restaurante.com"
                    className={`h-12 ${errors.email ? 'border-red-500 bg-red-50' : ''}`}
                  />
                  {errors.email && <span className="text-red-600 text-xs font-medium">{errors.email}</span>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload de Imagem */}
          <Card className="border border-slate-200">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Imagem do Restaurante</h3>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={uploading}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="space-y-4">
                      {uploading ? (
                        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      ) : (
                        <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      )}
                      
                      <div>
                        <p className="text-lg font-semibold text-gray-700">
                          {uploading ? "Enviando imagem..." : "Clique para fazer upload"}
                        </p>
                        <p className="text-sm text-gray-500">JPG, PNG até 5MB</p>
                      </div>
                    </div>
                  </label>
                </div>

                {formData.image_url && (
                  <div className="relative">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Configurações e Senha */}
          <Card className="border border-slate-200">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Configurações</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="minimum_order" className="text-sm font-bold flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-orange-600" />
                    Pedido Mínimo (MT)
                  </Label>
                  <Input
                    id="minimum_order"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.minimum_order}
                    onChange={(e) => handleInputChange('minimum_order', e.target.value)}
                    placeholder="50.00"
                    className="h-12"
                  />
                  {errors.minimum_order && <span className="text-red-600 text-xs font-medium">{errors.minimum_order}</span>}
                </div>

                <div className="flex items-center space-x-3 pt-8">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                  />
                  <Label htmlFor="is_active" className="font-medium">Restaurante ativo</Label>
                </div>
              </div>

              {/* Alterar Senha do Dono */}
              <div className="pt-6 border-t">
                <h4 className="text-md font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-500" />
                  Alterar Senha do Proprietário
                </h4>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_password" className="font-bold">Senha Atual</Label>
                    <Input
                      id="current_password"
                      type="password"
                      value={formData.current_password}
                      onChange={(e) => setFormData({...formData, current_password: e.target.value})}
                      placeholder="••••••••"
                      className={errors.current_password ? 'border-red-500' : ''}
                    />
                    {errors.current_password && <span className="text-red-600 text-xs">{errors.current_password}</span>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new_password" className="font-bold">Nova Senha</Label>
                      <Input
                        id="new_password"
                        type="password"
                        value={formData.new_password}
                        onChange={(e) => setFormData({...formData, new_password: e.target.value})}
                        placeholder="••••••••"
                        className={errors.new_password ? 'border-red-500' : ''}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm_password" className="font-bold">Confirmar Nova Senha</Label>
                      <Input
                        id="confirm_password"
                        type="password"
                        value={formData.confirm_password}
                        onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  {errors.new_password && <span className="text-red-600 text-xs">{errors.new_password}</span>}

                  <p className="text-sm text-slate-600">
                    Deixe os campos de senha em branco se não quiser alterar a senha do proprietário.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <p className="text-sm text-slate-600">* Campos obrigatórios</p>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={saving} className="px-6 h-12">
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving || Object.keys(errors).some(key => errors[key] !== undefined)} // Disable if any validation errors exist
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 h-12"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
