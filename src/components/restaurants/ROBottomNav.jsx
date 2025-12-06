import React from "react";
import { Package, Clock, DollarSign, TrendingUp, DollarSignIcon, HistoryIcon } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function BottomNav({ activePage }) {
  const navigate = (url) => {
    window.location.href = url;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg px-8 py-6 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <button 
          onClick={() => navigate(createPageUrl('RestaurantOwnerDashboard'))}
          className="relative"
        >
          {activePage === 'RestaurantOwnerDashboard' ? (
            <div className="w-9 h-9 bg-[#ff4700] rounded-full flex items-center justify-center shadow-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
          ) : (
            <Package className="w-6 h-6 text-gray-800" />
          )}
        </button>
        
        <button onClick={() => navigate(createPageUrl('RestaurantOwnerMenu'))}>
          {activePage === 'RestaurantOwnerMenu' ? (
            <div className="w-9 h-9 bg-[#ff4700] rounded-full flex items-center justify-center shadow-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
          ) : (
            <Clock className="w-6 h-6 text-gray-800" />
          )}
        </button>
        
        <button onClick={() => navigate(createPageUrl('RestaurantOwnerOrders'))}>
          {activePage === 'RestaurantOwnerOrders' ? (
            <div className="w-9 h-9 bg-[#ff4700] rounded-full flex items-center justify-center shadow-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          ) : (
            <DollarSign className="w-6 h-6 text-gray-800" />
          )}
        </button>
        
        <button onClick={() => navigate(createPageUrl('RestaurantOwnerStats'))}>
          {activePage === 'RestaurantOwnerStats' ? (
            <div className="w-9 h-9 bg-[#ff4700] rounded-full flex items-center justify-center shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          ) : (
            <TrendingUp className="w-6 h-6 text-gray-800" />
          )}
        </button>
      </div>
    </div>
  );
}