import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, Clock, Heart } from 'lucide-react';

export default function TopPicks({ products }) {
  return (
    <div className="space-y-4 px-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Destaques pra você</h2>
        <Button variant="link" className="text-orange-600 font-semibold">Ver todos</Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="w-full overflow-hidden rounded-2xl shadow-md border-gray-200 group">
            <div className="relative">
              <img 
                src={product.image_url || 'https://storage.googleapis.com/base44-public/product-placeholder.png'} 
                alt={product.name} 
                className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <Button size="icon" variant="secondary" className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 hover:bg-white">
                  <Heart className="w-4 h-4 text-gray-600" />
              </Button>
              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full text-xs font-semibold">
                <Clock className="w-3 h-3 text-gray-700" />
                <span>{product.preparation_time} min</span>
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-bold text-base truncate">{product.name}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-semibold">{product.rating || '4.8'}</span>
                <span className="text-gray-400">(25+)</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-lg font-black text-gray-900">MT {product.price.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Taxa entrega: Grátis</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}