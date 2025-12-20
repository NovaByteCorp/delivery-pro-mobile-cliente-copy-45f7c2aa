import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, Heart } from "lucide-react";

export default function RatingModal({ onClose }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Por favor, selecione uma avaliação!');
      return;
    }

    const review = {
      rating,
      comment,
      date: new Date().toISOString(),
      user: JSON.parse(localStorage.getItem('testUser') || '{}')
    };

    // Salvar avaliação
    const existingReviews = JSON.parse(localStorage.getItem('userReviews') || '[]');
    existingReviews.push(review);
    localStorage.setItem('userReviews', JSON.stringify(existingReviews));

    alert('Obrigado pela sua avaliação!');
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            Avalie nossa experiência
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Como foi sua experiência?
            </h3>
            <p className="text-gray-600">
              Sua opinião é muito importante para nós!
            </p>
          </div>

          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="p-1"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conte-nos mais sobre sua experiência (opcional)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escreva aqui seus comentários..."
              rows={4}
              className="w-full"
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="flex-1 bg-yellow-500 hover:bg-yellow-600">
              Enviar Avaliação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}