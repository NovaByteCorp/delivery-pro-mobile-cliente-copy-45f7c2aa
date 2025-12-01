import React, { useState, useEffect } from "react";
import { Product } from "@/api/entities";
import { Category } from "@/api/entities";
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
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  X, 
  ImageIcon, 
  AlertCircle, 
  CheckCircle,
  Plus,
  Clock,
  DollarSign,
  FileText,
  Camera,
  Star,
  Info
} from "lucide-react";

export default function AddProductModal({ restaurantId, categories, onClose, onSave }) {
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
    allergens: ""
  });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [existingProducts, setExistingProducts] = useState([]);
  const [showNewCategoryField, setShowNewCategoryField] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");

  useEffect(() => {
    const loadExistingProducts = async () => {
      try {
        const products = await Product.filter({ restaurant_id: restaurantId });
        setExistingProducts(products);
      } catch (error) {
        console.error("Erro ao carregar produtos existentes:", error);
      }
    };
    loadExistingProducts();
  }, [restaurantId]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = "Nome do produto é obrigatório";
        } else if (value.length < 3) {
          newErrors.name = "Nome deve ter pelo menos 3 caracteres";
        } else if (value.length > 80) {
          newErrors.name = "Nome deve ter no máximo 80 caracteres";
        } else if (existingProducts.some(p => p.name.toLowerCase() === value.toLowerCase())) {
          newErrors.name = "Já existe um produto com este nome neste restaurante";
        } else if (!/^[a-zA-ZÀ-ÿ0-9\s\-\.]+$/.test(value)) {
          newErrors.name = "Nome deve conter apenas letras, números, espaços e hífens";
        } else {
          delete newErrors.name;
        }
        break;
      
      case 'description':
        if (!value.trim()) {
          newErrors.description = "Descrição é obrigatória";
        } else if (value.length < 20) {
          newErrors.description = "Descrição deve ter pelo menos 20 caracteres";
        } else if (value.length > 300) {
          newErrors.description = "Descrição deve ter no máximo 300 caracteres";
        } else {
          delete newErrors.description;
        }
        break;
      
      case 'category_id':
        if (!value) {
          newErrors.category_id = "Categoria é obrigatória";
        } else {
          delete newErrors.category_id;
        }
        break;
      
      case 'price':
        const price = parseFloat(value);
        if (!value) {
          newErrors.price = "Preço é obrigatório";
        } else if (isNaN(price) || price < 1) {
          newErrors.price = "Preço deve ser pelo menos 1,00 MT";
        } else if (price > 10000) {
          newErrors.price = "Preço não pode exceder 10.000,00 MT";
        } else {
          delete newErrors.price;
        }
        break;
      
      case 'preparation_time':
        const time = parseInt(value);
        if (!value) {
          newErrors.preparation_time = "Tempo de preparo é obrigatório";
        } else if (isNaN(time) || time < 5 || time > 120) {
          newErrors.preparation_time = "Tempo deve ser entre 5 e 120 minutos";
        } else {
          delete newErrors.preparation_time;
        }
        break;

      case 'calories':
        if (value && (isNaN(parseInt(value)) || parseInt(value) < 0 || parseInt(value) > 5000)) {
          newErrors.calories = "Calorias devem estar entre 0 e 5000";
        } else {
          delete newErrors.calories;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateImageDimensions = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(img.width >= 800 && img.height >= 600);
      };
      img.onerror = () => resolve(false);
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    if (images.length + files.length > 5) {
      setErrors({ ...errors, images: "Máximo de 5 imagens permitidas" });
      return;
    }

    setUploading(true);
    const uploadedImages = [];
    const validationErrors = [];

    for (const file of files) {
      // Validar formato
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        validationErrors.push(`${file.name}: Apenas arquivos JPG e PNG são permitidos`);
        continue;
      }

      // Validar tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        validationErrors.push(`${file.name}: Arquivo muito grande (máximo 5MB)`);
        continue;
      }

      // Validar dimensões mínimas
      const validDimensions = await validateImageDimensions(file);
      if (!validDimensions) {
        validationErrors.push(`${file.name}: Imagem deve ter pelo menos 800x600 pixels`);
        continue;
      }
      
      try {
        const { file_url } = await UploadFile({ file });
        uploadedImages.push(file_url);
      } catch (error) {
        console.error("Erro no upload:", error);
        validationErrors.push(`${file.name}: Erro no upload`);
      }
    }

    if (validationErrors.length > 0) {
      setErrors({ ...errors, images: validationErrors.join(', ') });
    }

    setImages([...images, ...uploadedImages]);
    setUploading(false);
    
    // Remove erro de imagens se tiver pelo menos 1
    if (images.length + uploadedImages.length >= 1 && validationErrors.length === 0) {
      const newErrors = { ...errors };
      delete newErrors.images;
      setErrors(newErrors);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    
    if (newImages.length === 0) {
      setErrors({ ...errors, images: "Pelo menos uma imagem é obrigatória" });
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setErrors({ ...errors, newCategory: "Nome da categoria é obrigatório" });
      return;
    }
    
    if (categories.some(c => c.name.toLowerCase() === newCategoryName.toLowerCase())) {
      setErrors({ ...errors, newCategory: "Categoria com este nome já existe" });
      return;
    }
    
    try {
      const newCategory = await Category.create({
        restaurant_id: restaurantId,
        name: newCategoryName,
        description: newCategoryDescription || `Categoria: ${newCategoryName}`,
        is_active: true
      });
      
      categories.push(newCategory);
      setFormData({ ...formData, category_id: newCategory.id });
      setNewCategoryName("");
      setNewCategoryDescription("");
      setShowNewCategoryField(false);
      
      // Remove erro se existir
      const newErrors = { ...errors };
      delete newErrors.newCategory;
      setErrors(newErrors);
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      setErrors({ ...errors, newCategory: "Erro ao criar categoria" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validações obrigatórias
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.description.trim()) newErrors.description = "Descrição é obrigatória";
    if (!formData.category_id) newErrors.category_id = "Categoria é obrigatória";
    if (!formData.price) newErrors.price = "Preço é obrigatório";
    if (!formData.preparation_time) newErrors.preparation_time = "Tempo de preparo é obrigatório";
    if (images.length === 0) newErrors.images = "Pelo menos uma imagem é obrigatória";

    // Validações de formato
    if (formData.name && formData.name.length < 3) newErrors.name = "Nome muito curto";
    if (formData.description && formData.description.length < 20) newErrors.description = "Descrição muito curta";
    if (formData.price && parseFloat(formData.price) < 1) newErrors.price = "Preço inválido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const productData = {
        ...formData,
        restaurant_id: restaurantId,
        price: parseFloat(formData.price),
        preparation_time: parseInt(formData.preparation_time),
        calories: formData.calories ? parseInt(formData.calories) : null,
        ingredients: formData.ingredients ? formData.ingredients.split(',').map(i => i.trim()) : [],
        allergens: formData.allergens ? formData.allergens.split(',').map(a => a.trim()) : [],
        image_url: images[0], // Primeira imagem como principal
        gallery_images: images // Todas as imagens
      };

      await Product.create(productData);
      onSave();
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      setErrors({ general: "Erro ao salvar produto. Verifique os dados e tente novamente." });
    }
    setSaving(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-3xl font-black flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Plus className="w-6 h-6 text-white" />
            </div>
            Criar Novo Produto
          </DialogTitle>
          <DialogDescription className="text-base text-slate-600">
            Preencha todos os campos obrigatórios para adicionar um produto profissional ao cardápio. 
            Informações completas garantem melhor experiência para os clientes.
          </DialogDescription>
        </DialogHeader>

        {errors.general && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-8">
          {/* Seção Principal - Obrigatórios */}
          <Card className="border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-red-50 shadow-lg">
            <CardContent className="p-8 space-y-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Badge className="bg-red-600 text-white px-4 py-2 text-sm font-bold">
                    OBRIGATÓRIO
                  </Badge>
                  <h3 className="text-2xl font-bold text-slate-800">Informações Principais</h3>
                </div>
                <Info className="w-5 h-5 text-orange-600" />
              </div>

              {/* Nome e Descrição */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-bold flex items-center gap-2 text-slate-700">
                    <FileText className="w-4 h-4 text-orange-600" />
                    Nome do Produto *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ex: Pizza Margherita Especial"
                    maxLength={80}
                    className={`text-lg font-medium h-12 ${errors.name ? 'border-red-500 bg-red-50' : 'border-orange-300'}`}
                  />
                  <div className="flex justify-between items-center text-xs">
                    {errors.name && <span className="text-red-600 font-medium">{errors.name}</span>}
                    <span className="text-slate-500 ml-auto font-medium">{formData.name.length}/80 caracteres</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="price" className="text-sm font-bold flex items-center gap-2 text-slate-700">
                    <DollarSign className="w-4 h-4 text-orange-600" />
                    Preço Base *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-600 font-bold text-lg">MT</span>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="1"
                      max="10000"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="25.00"
                      className={`pl-16 text-lg font-bold h-12 ${errors.price ? 'border-red-500 bg-red-50' : 'border-orange-300'}`}
                    />
                  </div>
                  {errors.price && <span className="text-red-600 text-xs font-medium">{errors.price}</span>}
                </div>
              </div>

              {/* Descrição Completa */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-sm font-bold flex items-center gap-2 text-slate-700">
                  <FileText className="w-4 h-4 text-orange-600" />
                  Descrição Completa *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva detalhadamente o produto: ingredientes principais, modo de preparo, características especiais, etc. Uma boa descrição atrai mais clientes!"
                  maxLength={300}
                  rows={4}
                  className={`text-base leading-relaxed ${errors.description ? 'border-red-500 bg-red-50' : 'border-orange-300'}`}
                />
                <div className="flex justify-between items-center text-xs">
                  {errors.description && <span className="text-red-600 font-medium">{errors.description}</span>}
                  <span className="text-slate-500 ml-auto font-medium">{formData.description.length}/300 caracteres</span>
                </div>
              </div>

              {/* Categoria e Tempo */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-sm font-bold flex items-center gap-2 text-slate-700">
                    <FileText className="w-4 h-4 text-orange-600" />
                    Categoria *
                  </Label>
                  <div className="space-y-3">
                    <Select value={formData.category_id} onValueChange={(value) => handleInputChange('category_id', value)}>
                      <SelectTrigger className={`h-12 text-lg ${errors.category_id ? 'border-red-500 bg-red-50' : 'border-orange-300'}`}>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id} className="text-base">
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {!showNewCategoryField ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowNewCategoryField(true)}
                        className="w-full h-10 border-2 border-dashed border-orange-300 hover:border-orange-400"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Nova Categoria
                      </Button>
                    ) : (
                      <Card className="border-orange-200">
                        <CardContent className="p-4 space-y-3">
                          <Input
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Nome da categoria"
                            className="font-medium"
                          />
                          <Input
                            value={newCategoryDescription}
                            onChange={(e) => setNewCategoryDescription(e.target.value)}
                            placeholder="Descrição (opcional)"
                          />
                          <div className="flex gap-2">
                            <Button onClick={handleCreateCategory} size="sm" className="flex-1">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Criar
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setShowNewCategoryField(false);
                                setNewCategoryName("");
                                setNewCategoryDescription("");
                                const newErrors = { ...errors };
                                delete newErrors.newCategory;
                                setErrors(newErrors);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          {errors.newCategory && (
                            <span className="text-red-600 text-xs font-medium">{errors.newCategory}</span>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  {errors.category_id && <span className="text-red-600 text-xs font-medium">{errors.category_id}</span>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="preparation_time" className="text-sm font-bold flex items-center gap-2 text-slate-700">
                    <Clock className="w-4 h-4 text-orange-600" />
                    Tempo de Preparo *
                  </Label>
                  <div className="relative">
                    <Input
                      id="preparation_time"
                      type="number"
                      min="5"
                      max="120"
                      value={formData.preparation_time}
                      onChange={(e) => handleInputChange('preparation_time', e.target.value)}
                      placeholder="30"
                      className={`pr-20 text-lg font-medium h-12 ${errors.preparation_time ? 'border-red-500 bg-red-50' : 'border-orange-300'}`}
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-600 font-medium">
                      minutos
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">Entre 5 e 120 minutos</p>
                  {errors.preparation_time && <span className="text-red-600 text-xs font-medium">{errors.preparation_time}</span>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload de Imagens */}
          <Card className="border-2 border-orange-300 shadow-lg">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Badge className="bg-red-600 text-white px-4 py-2 text-sm font-bold">
                  OBRIGATÓRIO
                </Badge>
                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Camera className="w-6 h-6 text-orange-600" />
                  Galeria de Fotos
                </h3>
              </div>

              <div className="space-y-6">
                <div className="border-3 border-dashed border-orange-400 rounded-2xl p-12 text-center hover:border-orange-500 transition-all duration-300 bg-gradient-to-br from-orange-50 to-yellow-50">
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={uploading || images.length >= 5}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="space-y-6">
                      {uploading ? (
                        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      ) : (
                        <Upload className="w-16 h-16 text-orange-600 mx-auto" />
                      )}
                      
                      <div className="space-y-2">
                        <p className="text-2xl font-bold text-slate-800">
                          {uploading ? "Processando imagens..." : "Clique ou arraste fotos aqui"}
                        </p>
                        <div className="space-y-1 text-slate-600">
                          <p className="font-medium">📸 Formatos: JPG, PNG</p>
                          <p className="font-medium">📏 Mínimo: 800x600 pixels</p>
                          <p className="font-medium">📦 Máximo: 5 fotos (5MB cada)</p>
                          <p className="text-sm text-orange-600 font-bold">A primeira foto será a imagem principal</p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="relative overflow-hidden rounded-xl border-2 border-slate-200 group-hover:border-orange-400 transition-all duration-300">
                          <img
                            src={image}
                            alt={`Produto ${index + 1}`}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                        </div>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute -top-2 -right-2 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        {index === 0 && (
                          <Badge className="absolute bottom-2 left-2 text-xs bg-orange-600 text-white font-bold shadow-lg">
                            <Star className="w-3 h-3 mr-1" />
                            PRINCIPAL
                          </Badge>
                        )}
                        <div className="absolute top-2 left-2 text-xs bg-white/90 text-slate-700 px-2 py-1 rounded-full font-bold">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {errors.images && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="font-medium">{errors.images}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card className="border border-slate-200 shadow-lg">
            <CardContent className="p-8 space-y-6">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Informações Complementares (Opcional)</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="calories" className="text-sm font-semibold text-slate-700">
                    Calorias por porção
                  </Label>
                  <Input
                    id="calories"
                    type="number"
                    min="0"
                    max="5000"
                    value={formData.calories}
                    onChange={(e) => handleInputChange('calories', e.target.value)}
                    placeholder="350"
                    className="h-12"
                  />
                  {errors.calories && <span className="text-red-600 text-xs">{errors.calories}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ingredients" className="text-sm font-semibold text-slate-700">
                    Ingredientes principais
                  </Label>
                  <Input
                    id="ingredients"
                    value={formData.ingredients}
                    onChange={(e) => handleInputChange('ingredients', e.target.value)}
                    placeholder="Ex: Tomate, Mussarela, Manjericão"
                    className="h-12"
                  />
                  <p className="text-xs text-slate-500">Separe por vírgulas</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergens" className="text-sm font-semibold text-slate-700">
                    Alérgenos
                  </Label>
                  <Input
                    id="allergens"
                    value={formData.allergens}
                    onChange={(e) => handleInputChange('allergens', e.target.value)}
                    placeholder="Ex: Lactose, Glúten"
                    className="h-12"
                  />
                  <p className="text-xs text-slate-500">Separe por vírgulas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configurações Finais */}
          <Card className="border border-slate-200">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold mb-4">Configurações de Disponibilidade</h4>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center space-x-3">
                  <Switch
                    id="is_available"
                    checked={formData.is_available}
                    onCheckedChange={(checked) => setFormData({...formData, is_available: checked})}
                  />
                  <Label htmlFor="is_available" className="font-medium">Disponível imediatamente</Label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({...formData, is_featured: checked})}
                  />
                  <Label htmlFor="is_featured" className="font-medium flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Produto em destaque
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-between items-center pt-8 border-t-2 border-slate-200">
          <div className="text-sm text-slate-600">
            <p>* Campos obrigatórios devem ser preenchidos</p>
          </div>
          
          <div className="flex gap-4">
            <Button variant="outline" onClick={onClose} disabled={saving} className="px-8 h-12">
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving || Object.keys(errors).length > 0}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 h-12 shadow-lg"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Criando Produto...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-3" />
                  Criar Produto
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}