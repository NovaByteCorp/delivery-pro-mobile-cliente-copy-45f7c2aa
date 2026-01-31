import React, { useState } from 'react';
import { useLanguage } from "@/contexts/LanguageContext";

// Ícone de tradução customizado
const TranslateIcon = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="10" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
    <text x="6" y="11" fontSize="6" fontWeight="bold" fill="currentColor">A</text>
    <text x="13" y="16" fontSize="5" fontWeight="bold" fill="currentColor">文</text>
  </svg>
);

const LanguageSelector = ({ position = "absolute" }) => {
  const { language, changeLanguage } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'en', name: 'English', flag: 'EN' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ];

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setShowLanguageMenu(false);
  };

  const positionClass = position === "absolute" ? "absolute top-6 right-6" : "";

  return (
    <div className={positionClass}>
      <div className="relative">
        <button
          onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
        >
          <TranslateIcon className="w-5 h-5 text-gray-700" />
          <span className="text-sm font-medium text-gray-700">
            {languages.find(l => l.code === language)?.flag}
          </span>
        </button>

        {/* Dropdown de Idiomas */}
        {showLanguageMenu && (
          <>
            {/* Overlay para fechar ao clicar fora */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowLanguageMenu(false)}
            />
            
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                    language === lang.code ? 'bg-orange-50' : ''
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className={`text-sm ${
                    language === lang.code ? 'font-semibold text-orange-500' : 'text-gray-700'
                  }`}>
                    {lang.name}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;
