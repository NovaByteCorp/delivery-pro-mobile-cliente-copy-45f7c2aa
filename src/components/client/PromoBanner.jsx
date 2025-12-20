import React from 'react';
import { Button } from '@/components/ui/button';

export default function PromoBanner() {
  return (
    <div className="px-4 py-2">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-5 flex items-center justify-between text-white relative overflow-hidden shadow-lg">
        <img src="https://storage.googleapis.com/base44-public/french-fries.png" alt="Fries" className="absolute -bottom-6 -left-6 w-28 opacity-40 transform rotate-12" />
        <img src="https://storage.googleapis.com/base44-public/soda-can.png" alt="Soda" className="absolute -top-6 -right-6 w-24 opacity-40 transform -rotate-12" />
        <div className="z-10">
          <p className="font-black text-xl leading-tight">Ganhe 50% OFF</p>
          <p className="text-sm font-medium">No seu primeiro pedido!</p>
          <p className="text-xs mt-2">Use o código: <span className="font-bold bg-white/20 px-1.5 py-0.5 rounded">CHEGOU50</span></p>
        </div>
        <Button variant="secondary" className="bg-white text-orange-600 font-bold hover:bg-gray-100 shadow-xl z-10 h-10 px-5">
          Pedir Agora
        </Button>
      </div>
    </div>
  );
}