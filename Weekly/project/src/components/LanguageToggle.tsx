import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'te' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 text-gray-700 rounded-lg font-medium transition-all border border-white/30"
      title={i18n.language === 'en' ? 'Switch to Telugu' : 'Switch to English'}
    >
      <Languages className="w-4 h-4" />
      <span className="text-sm font-semibold">
        {i18n.language === 'en' ? 'తె' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageToggle;