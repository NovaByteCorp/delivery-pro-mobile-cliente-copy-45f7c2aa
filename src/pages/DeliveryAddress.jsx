import React, { useState } from 'react';
import { ChevronLeft, Home, Star, Heart, ShoppingBag, User, MapPin, Plus, Edit2, Trash2, Check, Navigation } from 'lucide-react';

export default function MyAddressesScreen() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: 'Home',
      emoji: '🏠',
      street: 'Av. Julius Nyerere, 123',
      apartment: 'Apt 4B',
      neighborhood: 'Sommerschield',
      city: 'Maputo',
      isDefault: true
    },
    {
      id: 2,
      label: 'Work',
      emoji: '💼',
      street: 'Rua da Imprensa, 456',
      apartment: 'Floor 3',
      neighborhood: 'Polana',
      city: 'Maputo',
      isDefault: false
    },
    {
      id: 3,
      label: 'Mom\'s House',
      emoji: '👵',
      street: 'Av. Eduardo Mondlane, 789',
      apartment: '',
      neighborhood: 'Malhangalene',
      city: 'Maputo',
      isDefault: false
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [useGPS, setUseGPS] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  const handleSetDefault = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const handleDelete = (id) => {
    if (addresses.length > 1) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  const handleUseGPS = () => {
    setGpsLoading(true);
    setUseGPS(true);
    // Simulate GPS loading
    setTimeout(() => {
      setGpsLoading(false);
      // Auto-fill with GPS data (mock)
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
        <div className="relative w-full h-screen bg-white overflow-y-auto pb-32">
          
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 bg-white z-10 px-8 pt-12 pb-4 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => window.history.back()} className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              
              <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'serif' }}>
                My Addresses
              </h1>
              
              <button 
                onClick={() => setShowAddForm(true)}
                className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Plus className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="mt-32 px-8">
            
            {/* Add New Address Form */}
            {showAddForm && (
              <div className="bg-gray-800 rounded-3xl p-6 mb-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'serif' }}>
                    Add New Address
                  </h2>
                  <button 
                    onClick={() => {
                      setShowAddForm(false);
                      setUseGPS(false);
                      setGpsLoading(false);
                    }}
                    className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center"
                  >
                    <span className="text-white text-lg">×</span>
                  </button>
                </div>

                {/* GPS Option */}
                <button
                  onClick={handleUseGPS}
                  disabled={gpsLoading}
                  className="w-full bg-orange-500 rounded-2xl p-4 mb-6 flex items-center justify-center space-x-3 shadow-lg disabled:opacity-50"
                >
                  {gpsLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-bold text-white">Getting your location...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-5 h-5 text-white" />
                      <span className="text-sm font-bold text-white">Use Current Location (GPS)</span>
                    </>
                  )}
                </button>

                {useGPS && !gpsLoading && (
                  <div className="bg-gray-700 rounded-2xl p-4 mb-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <MapPin className="w-5 h-5 text-orange-500" />
                      <span className="text-sm font-bold text-white">Location Found</span>
                    </div>
                    <p className="text-sm text-gray-300 pl-8">
                      Av. Julius Nyerere, Sommerschield, Maputo
                    </p>
                  </div>
                )}

                <div className="relative mb-6">
                  <div className="absolute inset-x-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-gray-800 px-3 text-xs text-gray-400">OR ENTER MANUALLY</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 mb-2 block">LABEL</label>
                    <input
                      type="text"
                      placeholder="Home, Work, Gym, etc."
                      className="w-full bg-gray-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none border-2 border-gray-700 focus:border-orange-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-400 mb-2 block">STREET</label>
                      <input
                        type="text"
                        placeholder="Av. Julius Nyerere"
                        className="w-full bg-gray-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none border-2 border-gray-700 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 mb-2 block">NUMBER</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full bg-gray-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none border-2 border-gray-700 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 mb-2 block">APARTMENT / FLOOR (OPTIONAL)</label>
                    <input
                      type="text"
                      placeholder="Apt 4B, Floor 3, etc."
                      className="w-full bg-gray-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none border-2 border-gray-700 focus:border-orange-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-400 mb-2 block">NEIGHBORHOOD</label>
                      <input
                        type="text"
                        placeholder="Sommerschield"
                        className="w-full bg-gray-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none border-2 border-gray-700 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 mb-2 block">CITY</label>
                      <input
                        type="text"
                        placeholder="Maputo"
                        className="w-full bg-gray-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none border-2 border-gray-700 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 mb-2 block">DELIVERY INSTRUCTIONS (OPTIONAL)</label>
                    <textarea
                      placeholder="Ring the doorbell twice, call when you arrive, etc."
                      className="w-full bg-gray-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none border-2 border-gray-700 focus:border-orange-500 resize-none"
                      rows="3"
                    />
                  </div>
                </div>

                <button className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl shadow-lg mt-6">
                  Save Address
                </button>
              </div>
            )}

            {/* Addresses List */}
            <div className="space-y-4">
              {addresses.map((address) => (
                <div key={address.id} className="relative">
                  <div className="bg-gray-50 rounded-3xl overflow-hidden shadow-lg">
                    
                    {/* Default Badge - Outside Card */}
                    {address.isDefault && (
                      <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-2xl shadow-lg z-10 flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-white" />
                        <span>Default</span>
                      </div>
                    )}

                    {/* Main Info */}
                    <div className="p-5">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-3xl">{address.emoji}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: 'serif' }}>
                            {address.label}
                          </h3>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-800 font-medium">{address.street}</p>
                            {address.apartment && (
                              <p className="text-sm text-gray-600">{address.apartment}</p>
                            )}
                            <p className="text-sm text-gray-600">{address.neighborhood}, {address.city}</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-3 gap-3">
                        {!address.isDefault ? (
                          <button 
                            onClick={() => handleSetDefault(address.id)}
                            className="col-span-2 bg-white rounded-2xl py-3 flex items-center justify-center space-x-2 shadow-sm border-2 border-gray-200"
                          >
                            <Check className="w-4 h-4 text-gray-800" />
                            <span className="text-sm font-bold text-gray-800">Set Default</span>
                          </button>
                        ) : (
                          <div className="col-span-2" />
                        )}
                        
                        <button className="bg-white rounded-2xl py-3 flex items-center justify-center shadow-sm border-2 border-gray-200">
                          <Edit2 className="w-4 h-4 text-gray-800" />
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(address.id)}
                          className="bg-white rounded-2xl py-3 flex items-center justify-center shadow-sm border-2 border-red-200"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg px-8 py-6">
            <div className="flex justify-between items-center">
              <button>
                <Home className="w-6 h-6 text-gray-800" />
              </button>
              <button>
                <Star className="w-6 h-6 text-gray-800" />
              </button>
              <button>
                <Heart className="w-6 h-6 text-gray-800" />
              </button>
              <button>
                <ShoppingBag className="w-6 h-6 text-gray-800" />
              </button>
              <button>
                <User className="w-6 h-6 text-gray-800" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}