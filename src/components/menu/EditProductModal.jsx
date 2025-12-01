import React, { useState, useEffect } from "react";
import { Product } from "@/api/entities";
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
  X, 
  AlertCircle, 
  CheckCircle,
  Edit,
  Lock
} from "lucide-react";

export default function EditProductModal({ product, categories, onClose, onSave, userRole }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    preparation_time: "",
    is_available: true,
    is_featured: false,
    calories: "",
    ingredients: "",
    allergens: "",
    image_url: ""
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const isAdmin = ['super_admin', 'admin'].includes(userRole);
  const isRestaurantOwner = userRole === 'dono_restaurante';

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category_id: product.category_id || "",
        preparation_time: product.preparation_time || "",
        is_available: product.is_available !== false,
        is_featured: product.is_featured || false,
        calories: product.calories || "",
        ingredients: Array.isArray(product.ingredients) ? product.ingredients.join(", ") : "",
        allergens: Array.isArray(product.allergens) ? product.allergens.join(", ") : "",
        image_url: product.image_url || ""
      });
    }
  }, [product]);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) newErrors.description = "Descrição é obrigatória";
    if (!formData.price) newErrors.price = "Preço é obrigatório";
    if (!formData.preparation_time) newErrors.preparation_time = "Tempo de preparo é obrigatório";

    // Validações específicas para admins
    if (isAdmin) {
      if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
      if (!formData.category_id) newErrors.category_id = "Categoria é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const updateData = {
        description: formData.description,
        price: parseFloat(formData.price),
        preparation_time: parseInt(formData.preparation_time),
        is_available: formData.is_available,
        image_url: formData.image_url,
        calories: formData.calories ? parseInt(formData.calories) : null,
        ingredients: formData.ingredients ? formData.ingredients.split(',').map(i => i.trim()) : [],
        allergens: formData.allergens ? formData.allergens.split(',').map(a => a.trim()) : []
      };

      // Campos que só admins podem editar
      if (isAdmin) {
        updateData.name = formData.name;
        updateData.category_id = formData.category_id;
        updateData.is_featured = formData.is_featured;
      }

      await Product.update(product.id, updateData);
      onSave();
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      setErrors({ general: "Erro ao salvar produto. Verifique os dados e tente novamente." });
    }
    setSaving(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <Edit className="w-6 h-6 text-white" />
            </div>
            Editar Produto
          </DialogTitle>
        </DialogHeader>

        {errors.general && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Campos que só admins podem editar */}
          {isAdmin && (
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-blue-600 text-white px-3 py-1 text-sm font-bold">
                    ADMIN APENAS
                  </Badge>
                  <h3 className="text-lg font-bold text-slate-800">Informações Principais</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-bold">Nome do Produto</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <span className="text-red-600 text-xs">{errors.name}</span>}
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold">Categoria</Label>
                    <Select value={formData.category_id} onValueChange={(value) => setFormData({...formData, category_id: value})}>
                      <SelectTrigger className={errors.category_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category_id && <span className="text-red-600 text-xs">{errors.category_id}</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Campos que donos podem editar */}
          <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-orange-600 text-white px-3 py-1 text-sm font-bold">
                  {isRestaurantOwner ? 'EDITÁVEL' : 'ADMIN'}
                </Badge>
                <h3 className="text-lg font-bold text-slate-800">Informações Editáveis</h3>
              </div>

              {/* Nome readonly para donos */}
              {isRestaurantOwner && (
                <div className="space-y-2">
                  <Label className="font-bold flex items-center gap-2">
                    <Lock className="w-4 h-4 text-gray-400" />
                    Nome do Produto (Não editável)
                  </Label>
                  <Input value={formData.name} readOnly className="bg-gray-100 text-gray-600" />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <span className="text-red-600 text-xs">{errors.description}</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="font-bold">Preço (MT)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && <span className="text-red-600 text-xs">{errors.price}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preparation_time" className="font-bold">Tempo de Preparo (min)</Label>
                  <Input
                    id="preparation_time"
                    type="number"
                    value={formData.preparation_time}
                    onChange={(e) => setFormData({...formData, preparation_time: e.target.value})}
                    className={errors.preparation_time ? 'border-red-500' : ''}
                  />
                  {errors.preparation_time && <span className="text-red-600 text-xs">{errors.preparation_time}</span>}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  id="is_available"
                  checked={formData.is_available}
                  onCheckedChange={(checked) => setFormData({...formData, is_available: checked})}
                />
                <Label htmlFor="is_available" className="font-medium">Produto disponível</Label>
              </div>
            </CardContent>
          </Card>

          {/* Upload de Imagem */}
          <Card className="border border-slate-200">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-800">Imagem do Produto</h3>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card className="border border-slate-200">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-800">Informações Complementares</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories">Calorias</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({...formData, calories: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ingredients">Ingredientes</Label>
                  <Input
                    id="ingredients"
                    value={formData.ingredients}
                    onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                    placeholder="Separe por vírgulas"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergens">Alérgenos</Label>
                  <Input
                    id="allergens"
                    value={formData.allergens}
                    onChange={(e) => setFormData({...formData, allergens: e.target.value})}
                    placeholder="Separe por vírgulas"
                  />
                </div>
              </div>

              {/* Campo de destaque só para admins */}
              {isAdmin && (
                <div className="pt-4 border-t">
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData({...formData, is_featured: checked})}
                    />
                    <Label htmlFor="is_featured" className="font-medium">Produto em destaque</Label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <div className="text-sm text-gray-600">
            {isRestaurantOwner && <p>⚠️ Alguns campos só podem ser editados por administradores</p>}
          </div>
          
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