
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock } from "lucide-react";

export default function RestaurantSelector({ restaurants, selectedRestaurant, onSelect }) {
  if (!restaurants || restaurants.length === 0) {
    return (
      <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <p className="text-slate-500">Nenhum restaurante cadastrado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Selecione um Restaurante</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map((restaurant) => (
          <Card
            key={restaurant.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
              selectedRestaurant?.id === restaurant.id
                ? "border-orange-500 bg-orange-50/50 shadow-lg"
                : "border-slate-200 bg-white/80 hover:border-slate-300"
            }`}
            onClick={() => onSelect(restaurant)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">{restaurant.name}</h3>
                  <p className="text-sm text-slate-600 mb-2">{restaurant.description}</p>
                </div>
                {selectedRestaurant?.id === restaurant.id && (
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{restaurant.address}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-medium">{restaurant.rating || "5.0"}</span>
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      restaurant.is_active 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {restaurant.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{restaurant.delivery_time || "30-45 min"}</span>
                  </div>
                  <span>Taxa: MT {restaurant.delivery_fee?.toFixed(2) || "0.00"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
