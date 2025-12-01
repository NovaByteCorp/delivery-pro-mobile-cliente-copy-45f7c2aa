import React from 'react';
import { MapPin, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header({ address }) {
  return (
    <div className="flex justify-between items-center px-4 pt-4 pb-2 bg-white">
      <div className="flex items-center gap-1.5 text-gray-800">
        <MapPin className="w-5 h-5 text-orange-500" />
        <div>
            <p className="font-semibold text-sm leading-tight">{address}</p>
            <p className="text-xs text-gray-500">Entregar para</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="w-6 h-6 text-gray-700" />
        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
      </Button>
    </div>
  );
}