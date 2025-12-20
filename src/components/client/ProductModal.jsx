import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  X,
  Share,
  Heart,
  Plus,
  Minus
} from "lucide-react";

const sizeOptions = [
  { id: "small", name: "Small", price: 8.99 },
  { id: "medium", name: "Medium", price: 9.99 },
  { id: "large", name: "Large", price: 10.99 }
];

export default function ProductModal({ product, restaurant, onClose, onAddToCart, cartQuantity }) {
  const [selectedSize, setSelectedSize] = useState("small");
  const [quantity, setQuantity] = useState(1);
  
  const selectedSizePrice = sizeOptions.find(size => size.id === selectedSize)?.price || product.price;

  const handleAddToCart = () => {
    const productWithSize = {
      ...product,
      price: selectedSizePrice,
      size: selectedSize
    };
    
    onAddToCart(productWithSize, restaurant, quantity);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[100vh] overflow-hidden p-0 m-0 rounded-t-3xl rounded-b-none">
        {/* Header with Product Image */}
        <div className="relative h-64 overflow-hidden">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center">
              <span className="text-8xl">🍔</span>
            </div>
          )}
          
          {/* Header Icons */}
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <Button 
              onClick={onClose}
              size="icon" 
              variant="ghost" 
              className="bg-white/80 backdrop-blur rounded-xl"
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" className="bg-white/80 backdrop-blur rounded-xl">
                <Share className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="bg-white/80 backdrop-blur rounded-xl">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-orange-500 text-white text-lg font-bold px-3 py-1">
              $ {selectedSizePrice.toFixed(2)}
            </Badge>
          </div>
        </div>

        {/* Product Info */}
        <div className="px-6 py-4 bg-white flex-1 overflow-y-auto">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-1 text-orange-500 mb-2">
              <span className="text-sm">🔥</span>
              <span className="text-sm font-medium">271 Cal.</span>
            </div>
            <p className="text-sm text-orange-500 mb-4">$0 Delivery fee over $26</p>
            
            {/* Ingredients */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Ingredients</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• 1 Juicy beef • 1 Slice of cheddar cheese</p>
                <p>• 1 burger bun • Fresh lettuce</p>
                <p>• Ripe tomato slices • Pickles for crunch</p>
                <p>• Ketchup • Mustard • Onions and bacon</p>
              </div>
            </div>

            {/* Size Variations */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Variation</h3>
              <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                {sizeOptions.map((size) => (
                  <div key={size.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={size.id} 
                        id={size.id}
                        className="border-orange-500 text-orange-500"
                      />
                      <Label htmlFor={size.id} className="text-sm font-medium">
                        {size.name}
                      </Label>
                    </div>
                    <span className="text-sm font-semibold">$ {size.price.toFixed(2)}</span>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="bg-white p-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <Button
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl h-12 mr-4"
              onClick={handleAddToCart}
            >
              Add to cart
            </Button>
            
            {/* Quantity Selector */}
            <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-3 py-2">
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 hover:bg-gray-200 rounded-full"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-semibold text-lg min-w-[20px] text-center">
                {quantity}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 hover:bg-gray-200 rounded-full"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}