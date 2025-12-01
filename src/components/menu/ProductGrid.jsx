
import React, { useState } from "react";
import { Product } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  MoreVertical, 
  Eye, 
  EyeOff,
  Star,
  Clock,
  Utensils,
  Trash2 // Added Trash2 icon for delete
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, // Added AlertDialog for delete confirmation
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import EditProductModal from './EditProductModal';

export default function ProductGrid({ products, categories, loading, onProductUpdate, role }) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null); // State for product to delete

  const handleToggleAvailability = async (product) => {
    try {
      await Product.update(product.id, { is_available: !product.is_available });
      if (onProductUpdate) {
        onProductUpdate();
      }
    } catch(error) {
      console.error("Erro ao atualizar disponibilidade do produto", error);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await Product.delete(productToDelete.id);
      setProductToDelete(null); // Close the dialog
      if (onProductUpdate) {
        onProductUpdate(); // Refresh product list
      }
    } catch (error) {
      console.error("Erro ao deletar produto", error);
      // Optionally, add a toast/notification here for error feedback
    }
  };

  const handleProductSaved = () => {
    setEditingProduct(null);
    if (onProductUpdate) {
      onProductUpdate();
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-48 bg-slate-200 animate-pulse"></div>
            <CardContent className="p-4 space-y-2">
              <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-3 bg-slate-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Utensils className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500">Nenhum produto encontrado</p>
          <p className="text-sm text-slate-400 mt-1">Adicione produtos ao cardápio para começar</p>
        </CardContent>
      </Card>
    );
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || "Categoria";
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card 
            key={product.id} 
            className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm"
          >
            {/* Product Image */}
            <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Utensils className="w-12 h-12 text-slate-400" />
                </div>
              )}
              
              {/* Overlay with actions */}
              <div className="absolute top-3 right-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="w-8 h-8 bg-white/90 backdrop-blur-sm hover:bg-white"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setEditingProduct(product)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleAvailability(product)}>
                      {product.is_available ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Ativar
                        </>
                      )}
                    </DropdownMenuItem>
                    {/* Add Delete option, visible only for 'admin' role */}
                    {role === 'admin' && (
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        onClick={() => setProductToDelete(product)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Featured Badge */}
              {product.is_featured && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-yellow-500 text-yellow-900">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Destaque
                  </Badge>
                </div>
              )}

              {/* Availability Badge */}
              <div className="absolute bottom-3 left-3">
                <Badge 
                  variant="outline" 
                  className={`text-xs font-medium ${
                    product.is_available
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {product.is_available ? "Disponível" : "Indisponível"}
                </Badge>
              </div>
            </div>

            {/* Product Info */}
            <CardContent className="p-4 space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-xs text-slate-600">
                    {getCategoryName(product.category_id)}
                  </Badge>
                  {product.preparation_time && (
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {product.preparation_time}min
                    </div>
                  )}
                </div>
                
                <h3 className="font-semibold text-slate-900 leading-tight">
                  {product.name}
                </h3>
                
                {product.description && (
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                    {product.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <p className="text-xl font-bold text-orange-600">
                    MT {product.price?.toFixed(2)}
                  </p>
                  {product.calories && (
                    <p className="text-xs text-slate-500">{product.calories} cal</p>
                  )}
                </div>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="hover:bg-orange-50 hover:border-orange-200" 
                  onClick={() => setEditingProduct(product)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => setEditingProduct(null)}
          onSave={handleProductSaved}
          userRole={role} // Pass the user role to the modal
        />
      )}

      {/* Delete Confirmation Dialog */}
      {productToDelete && (
        <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza que deseja excluir este produto?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso excluirá permanentemente o produto{" "}
                <span className="font-semibold">{productToDelete.name}</span> do seu cardápio.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteProduct} className="bg-red-500 hover:bg-red-600">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
