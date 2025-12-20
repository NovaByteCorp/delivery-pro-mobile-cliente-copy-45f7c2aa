import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Restaurant } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { createPageUrl } from "@/utils";
import { 
  Search, 
  Star, 
  Clock, 
  MapPin,
  UtensilsCrossed,
  Pizza,
  Beef,
  Coffee
} from "lucide-react";

const categories = [
  { name: "Pizza", icon: "🍕", color: "bg-red-100 text-red-600" },
  { name: "Hamburger", icon: "🍔", color: "bg-yellow-100 text-yellow-600" },
  { name: "Japonesa", icon: "🍱", color: "bg-green-100 text-green-600" },
  { name: "Italiana", icon: "🍝", color: "bg-purple-100 text-purple-600" },
  { name: "Brasileira", icon: "🥘", color: "bg-orange-100 text-orange-600" },
  { name: "Mexicana", icon: "🌮", color: "bg-pink-100 text-pink-600" },
  { name: "Açaí", icon: "🍇", color: "bg-indigo-100 text-indigo-600" },
  { name: "Lanche", icon: "🥪", color: "bg-cyan-100 text-cyan-600" }
];

const featuredRestaurants = [
  {
    id: 1,
    name: "Pizzaria Bella Vista",
    cuisine: "Pizza",
    rating: 4.8,
    deliveryTime: "25-35 min",
    deliveryFee: "R$ 5,90",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=250&fit=crop"
  },
  {
    id: 2,
    name: "Burger House Premium",
    cuisine: "Hamburger",
    rating: 4.5,
    deliveryTime: "20-30 min",
    deliveryFee: "R$ 3,50",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=250&fit=crop"
  },
  {
    id: 3,
    name: "Sushi Yamato",
    cuisine: "Japonesa",
    rating: 4.9,
    deliveryTime: "30-40 min",
    deliveryFee: "R$ 7,90",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=250&fit=crop"
  },
  {
    id: 4,
    name: "Açaí da Praia",
    cuisine: "Açaí",
    rating: 4.7,
    deliveryTime: "15-25 min",
    deliveryFee: "R$ 2,90",
    image: "https://images.unsplash.com/photo-1488477304112-4944851de03d?w=400&h=250&fit=crop"
  }
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Load featured restaurants from database
    const loadRestaurants = async () => {
      try {
        const data = await Restaurant.list();
        setRestaurants(data.slice(0, 4)); // Show only first 4
      } catch (error) {
        console.error("Erro ao carregar restaurantes:", error);
      }
    };
    loadRestaurants();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl font-bold text-orange-500">ChegouDelivery</span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to={createPageUrl('Home')} className="text-gray-700 hover:text-orange-500 font-medium">
                Início
              </Link>
              <Link to={createPageUrl('Home')} className="text-gray-700 hover:text-orange-500 font-medium">
                Restaurantes
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link to={createPageUrl('Welcome')}>
                <Button variant="ghost" className="text-gray-700 hover:text-orange-500">
                  Entrar
                </Button>
              </Link>
              <Link to={createPageUrl('Welcome')}>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Cadastrar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center py-24 px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=600&fit=crop')`
        }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Comida deliciosa, entregue rapidamente
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Descubra milhares de restaurantes e peça sua comida favorita
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Digite seu endereço ou nome do restaurante..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-16 pl-6 pr-16 text-lg border-0 rounded-2xl shadow-xl"
              />
              <Button 
                size="lg"
                className="absolute right-2 top-2 h-12 px-8 bg-orange-500 hover:bg-orange-600 rounded-xl"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Categorias</h2>
          <p className="text-gray-600 mb-8">Explore nossa variedade de culinárias</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            {categories.map((category, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full ${category.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-lg`}>
                  {category.icon}
                </div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-orange-500 transition-colors">
                  {category.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Restaurantes em destaque</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(restaurants.length > 0 ? restaurants : featuredRestaurants).map((restaurant, index) => (
              <Card key={restaurant.id || index} className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
                <div className="relative">
                  <img 
                    src={restaurant.image_url || restaurant.image} 
                    alt={restaurant.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white text-gray-800 shadow-lg">
                      <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
                      {restaurant.rating || "4.8"}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-orange-500 transition-colors">
                    {restaurant.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3 capitalize">
                    {restaurant.cuisine_type || restaurant.cuisine}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {restaurant.deliveryTime || "25-35 min"}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {restaurant.deliveryFee || "MT 15"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 py-16 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Quer entregar comida?
          </h2>
          <p className="text-xl mb-8 text-orange-100">
            Cadastre seu restaurante ou torne-se um entregador parceiro
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Welcome')}>
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-xl"
              >
                Cadastrar Restaurante
              </Button>
            </Link>
            <Link to={createPageUrl('Welcome')}>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-500 px-8 py-3 text-lg font-semibold rounded-xl"
              >
                Ser Entregador
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <UtensilsCrossed className="w-8 h-8 mr-3 text-orange-500" />
            <span className="text-2xl font-bold">ChegouDelivery</span>
          </div>
          <p className="text-gray-400">
            © 2025 ChegouDelivery. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}