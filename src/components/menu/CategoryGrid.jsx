
import React, { useState } from "react";
import { Category } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, FolderOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


export default function CategoryGrid({ categories, restaurantId, onCategoryUpdate, role }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: ""
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  
  const isAdmin = ['super_admin', 'admin'].includes(role);

  const handleSave = async () => {
    try {
      const categoryData = {
        ...formData,
        restaurant_id: restaurantId
      };

      if (editingCategory) {
        await Category.update(editingCategory.id, categoryData);
      } else {
        await Category.create(categoryData);
      }

      handleCloseModal();
      onCategoryUpdate();
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      // Optionally, add a user-facing error notification
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      image_url: category.image_url || ""
    });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "", image_url: "" });
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await Category.delete(categoryToDelete.id);
      onCategoryUpdate();
      handleCloseDeleteConfirm();
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
      // Optionally, add a user-facing error notification
    }
  };

  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setCategoryToDelete(null);
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-900">Categorias</h2>
          {isAdmin && (
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Categoria
            </Button>
          )}
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500">Nenhuma categoria criada</p>
            <p className="text-sm text-slate-400 mt-1">Organize seus produtos em categorias</p>
          </CardContent>
        </Card>

        {isAdmin && (
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Categoria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Categoria</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Pratos Principais"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descrição da categoria (opcional)"
                />
              </div>
              <div>
                <Label htmlFor="image_url">URL da Imagem</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700">
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        )}
        {isAdmin && (
          <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso deletará permanentemente a categoria{" "}
                  <span className="font-semibold text-slate-900">{categoryToDelete?.name}</span>{" "}
                  e todos os produtos associados a ela.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleCloseDeleteConfirm}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
                  Deletar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900">Categorias</h2>
        {isAdmin && (
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Categoria
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
            <div className="relative h-32 bg-gradient-to-br from-slate-100 to-slate-200">
              {category.image_url ? (
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FolderOpen className="w-8 h-8 text-slate-400" />
                </div>
              )}
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex gap-1">
                  {isAdmin && (
                    <>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="w-7 h-7 bg-white/90 hover:bg-white"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="w-7 h-7 bg-red-500/90 hover:bg-red-600 text-white"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click if any parent click handler exists
                          handleDeleteClick(category);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="font-semibold text-slate-900 mb-1">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-slate-600">{category.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdmin && (
      <Dialog open={showAddModal} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Editar Categoria" : "Nova Categoria"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome da Categoria</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Pratos Principais"
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descrição da categoria (opcional)"
              />
            </div>
            <div>
              <Label htmlFor="image_url">URL da Imagem</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700">
                {editingCategory ? "Atualizar" : "Salvar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      )}

      {isAdmin && (
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso deletará permanentemente a categoria{" "}
                <span className="font-semibold text-slate-900">{categoryToDelete?.name}</span>{" "}
                e todos os produtos associados a ela.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCloseDeleteConfirm}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
                Deletar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
