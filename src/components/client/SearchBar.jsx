import React from 'react';
import { Search, Mic } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SearchBar() {
  return (
    <div className="px-4 py-2 bg-white sticky top-0 z-10">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Pesquisar restaurantes ou pratos..."
          className="w-full h-12 pl-12 pr-12 bg-gray-100 rounded-xl border-transparent focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
        />
        <Mic className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer" />
      </div>
    </div>
  );
}