import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Hook personalizado que força re-render quando o idioma muda
 * 
 * USO:
 * import { useForceTranslation } from '@/hooks/useForceTranslation';
 * 
 * export default function MinhaPage() {
 *   const { t, language } = useForceTranslation();
 *   
 *   // Agora t('chave') sempre traduz corretamente quando mudar idioma
 *   return <div>{t('welcome')}</div>;
 * }
 */
export const useForceTranslation = () => {
  const { t, language, changeLanguage, translations } = useLanguage();
  const [, forceUpdate] = useState(0);
  
  // Observar mudanças no idioma via localStorage (para múltiplas abas)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'language') {
        forceUpdate(prev => prev + 1);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Re-renderizar quando language muda no contexto
  useEffect(() => {
    forceUpdate(prev => prev + 1);
  }, [language]);
  
  return { t, language, changeLanguage, translations };
};

export default useForceTranslation;