import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, Utensils } from "lucide-react";

export default function RestaurantCard({ restaurant, onClick }) {
  return (
    <Card 
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white"
      onClick={onClick}
    >
      {/* Restaurant Image */}
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {restaurant.image_url ? (
          <img
            src={restaurant.image_url}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Utensils className="w-12 h-12 text-slate-400" />
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-white text-slate-800 shadow-lg">
            <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
            {restaurant.rating?.toFixed(1) || "5.0"}
          </Badge>
        </div>
      </div>

      {/* Restaurant Info */}
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg text-slate-900 group-hover:text-orange-500 transition-colors mb-1">
            {restaurant.name}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-2">
            {restaurant.description}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>30-45 min</span>
          </div>
          <Badge variant="outline" className="capitalize">
            {restaurant.cuisine_type}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-slate-600">
            <MapPin className="w-4 h-4" />
            <span className="truncate">Taxa: MT 15</span>
          </div>
          <span className="text-slate-600 font-medium">
            Min: MT {restaurant.minimum_order?.toFixed(0) || "50"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}