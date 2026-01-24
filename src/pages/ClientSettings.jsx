import React, { useState, useEffect } from 'react';
import { ChevronLeft, Bell, Globe, Moon, Volume2, Shield, LogOut } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import BottomNav from '../components/client/BottomNav';

export default function ClientSettingsScreen() {
  const { t, language } = useLanguage();
  
  const navigate = (url) => {
    window.location.href = url;
  };

  const [settings, setSettings] = useState({
    notifications: {
      orderUpdates: true,
      promotions: true,
      newRestaurants: false,
      newsletter: true
    },
    darkMode: false,
    soundEffects: true
  });

  const toggleSetting = (category, key) => {
    if (category) {
      setSettings({
        ...settings,
        [category]: {
          ...settings[category],
          [key]: !settings[category][key]
        }
      });
    } else {
      setSettings({
        ...settings,
        [key]: !settings[key]
      });
    }
  };

  const handleLogout = () => {
    if (confirm(t('confirmLogout'))) {
      localStorage.removeItem('testUser');
      localStorage.removeItem('simulatedRole');
      navigate(createPageUrl('Welcome'));
    }
  };

  // Mapear códigos de idioma para nomes exibidos
  const getLanguageName = (code) => {
    const languageNames = {
      pt: 'Português',
      en: 'English',
      es: 'Español',
      fr: 'Français',
      de: 'Deutsch',
      it: 'Italiano',
      zh: '中文',
      ja: '日本語'
    };
    return languageNames[code] || 'Português';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden">
        <div className="relative w-full h-screen bg-white overflow-y-auto pb-24">
          
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 bg-white z-10 px-8 pt-12 pb-6 shadow-sm">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => window.history.back()}
                className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6 text-[#3c0068]" />
              </button>

              <h1 className="text-2xl font-bold text-[#3c0068]" style={{ fontFamily: 'serif' }}>
                {t('settings')}
              </h1>

              <div className="w-14 h-14" />
            </div>
          </div>

          {/* Content */}
          <div className="mt-32 px-8">
            
            {/* Notifications Section */}
            <h2 className="text-lg font-bold mb-4 text-[#3c0068]" style={{ fontFamily: 'serif' }}>
              {t('notifications')}
            </h2>

            <div className="bg-gray-50 rounded-3xl p-5 mb-6 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Bell className="w-5 h-5 text-[#3c0068]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#3c0068]">{t('orderUpdates')}</h3>
                    <p className="text-xs text-gray-500">{t('orderStatus')}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.orderUpdates}
                    onChange={() => toggleSetting('notifications', 'orderUpdates')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-xl">🎁</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#3c0068]">{t('promotions')}</h3>
                    <p className="text-xs text-gray-500">{t('specialOffers')}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.promotions}
                    onChange={() => toggleSetting('notifications', 'promotions')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-xl">🍔</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#3c0068]">{t('newRestaurants')}</h3>
                    <p className="text-xs text-gray-500">{t('platformNews')}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.newRestaurants}
                    onChange={() => toggleSetting('notifications', 'newRestaurants')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#3c0068]">{t('newsletter')}</h3>
                    <p className="text-xs text-gray-500">{t('newsByEmail')}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.newsletter}
                    onChange={() => toggleSetting('notifications', 'newsletter')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            </div>

            {/* Preferences Section */}
            <h2 className="text-lg font-bold mb-4 text-[#3c0068]" style={{ fontFamily: 'serif' }}>
              {t('preferences')}
            </h2>

            <div className="space-y-3 mb-6">
              {/* Language Selector - Abre o componente LanguageSelector */}
              <div className="w-full bg-gray-50 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Globe className="w-5 h-5 text-[#3c0068]" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-bold text-[#3c0068]">{t('language')}</h3>
                      <p className="text-xs text-gray-500">{getLanguageName(language)}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <LanguageSelector position="relative" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Moon className="w-5 h-5 text-[#3c0068]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#3c0068]">{t('darkMode')}</h3>
                    <p className="text-xs text-gray-500">{t('darkTheme')}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={() => toggleSetting(null, 'darkMode')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Volume2 className="w-5 h-5 text-[#3c0068]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#3c0068]">{t('soundEffects')}</h3>
                    <p className="text-xs text-gray-500">{t('appSounds')}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.soundEffects}
                    onChange={() => toggleSetting(null, 'soundEffects')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            </div>

            {/* Security Section */}
            <h2 className="text-lg font-bold mb-4 text-[#3c0068]" style={{ fontFamily: 'serif' }}>
              {t('security')}
            </h2>

            <div className="space-y-3 mb-6">
              <button 
                onClick={() => navigate(createPageUrl('ChangePassword'))}
                className="w-full bg-gray-50 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Shield className="w-5 h-5 text-[#3c0068]" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-[#3c0068]">{t('changePassword')}</h3>
                    <p className="text-xs text-gray-500">{t('changeYourPassword')}</p>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180" />
              </button>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="w-full bg-gray-50 rounded-2xl p-4 flex items-center justify-center space-x-3 shadow-sm mb-6 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 text-red-600" />
              <span className="text-base font-bold text-red-600">{t('logoutAccount')}</span>
            </button>

            {/* App Version */}
            <div className="text-center text-xs text-gray-400 pb-6">
              <p>ChegouDelivery v1.0.0</p>
              <p className="mt-1">{t('allRightsReserved')}</p>
            </div>

          </div>

          <BottomNav activePage="Profile" />
        </div>
      </div>
    </div>
  );
}