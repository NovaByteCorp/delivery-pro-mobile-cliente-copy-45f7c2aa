import React from "react";
import { Home, Heart, ShoppingBag, User, DollarSignIcon, HistoryIcon } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function BottomNav({ activePage }) {
  const navigate = (url) => {
    window.location.href = url;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg px-8 py-6 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <button 
          onClick={() => navigate(createPageUrl('DriverDashboard'))}
          className="relative"
        >
          {activePage === 'DriverDashboard' ? (
            <div className="w-9 h-9 bg-[#ff4700] rounded-full flex items-center justify-center shadow-lg">
              <Home className="w-5 h-5 text-white" />
            </div>
          ) : (
            <Home className="w-6 h-6 text-gray-800" />
          )}
        </button>
        
        <button onClick={() => navigate(createPageUrl('DriverEarnings'))}>
          {activePage === 'DriverEarnings' ? (
            <div className="w-9 h-9 bg-[#ff4700] rounded-full flex items-center justify-center shadow-lg">
              <DollarSignIcon className="w-5 h-5 text-white" />
            </div>
          ) : (
            <DollarSignIcon className="w-6 h-6 text-gray-800" />
          )}
        </button>
        
        <button onClick={() => navigate(createPageUrl('DriverHistory'))}>
          {activePage === 'DriverHistory' ? (
            <div className="w-9 h-9 bg-[#ff4700] rounded-full flex items-center justify-center shadow-lg">
              <HistoryIcon className="w-5 h-5 text-white" />
            </div>
          ) : (
            <HistoryIcon className="w-6 h-6 text-gray-800" />
          )}
        </button>
        
        <button onClick={() => navigate(createPageUrl('ProfileDriver'))}>
          {activePage === 'ProfileDriver' ? (
            <div className="w-9 h-9 bg-[#ff4700] rounded-full flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
          ) : (
            <User className="w-6 h-6 text-gray-800" />
          )}
        </button>
      </div>
    </div>
  );
}