import React from 'react';
import { Utensils, Pizza, Salad, Fish, Lollipop, Soup } from 'lucide-react';

export default function CategoryList({ onSelectCategory }) {
  const categories = [
    { name: 'Burger', icon: <Utensils className="w-6 h-6" />, slug: 'burger' },
    { name: 'Pizza', icon: <Pizza className="w-6 h-6" />, slug: 'pizza' },
    { name: 'Salada', icon: <Salad className="w-6 h-6" />, slug: 'salada' },
    { name: 'Sushi', icon: <Fish className="w-6 h-6" />, slug: 'sushi' },
    { name: 'Sopa', icon: <Soup className="w-6 h-6" />, slug: 'sopa' },
    { name: 'Doce', icon: <Lollipop className="w-6 h-6" />, slug: 'doce' },
  ];

  return (
    <div className="py-4">
      <div className="flex space-x-5 overflow-x-auto pb-2 pl-4">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => onSelectCategory(category.slug)}
            className="flex flex-col items-center justify-center space-y-2 flex-shrink-0 w-20 group"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-600 transition-all duration-300 transform group-hover:scale-105">
              {category.icon}
            </div>
            <p className="text-xs font-semibold text-gray-800">{category.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}