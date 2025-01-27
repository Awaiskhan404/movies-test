"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  useEffect(() => {
    setLanguage(i18n.language);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50">
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-[#224957] text-white px-6 py-3 pr-10 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#2BD17E] shadow-lg hover:cursor-pointer transition duration-200 ease-in-out appearance-none"
        style={{
          backgroundImage:
            'url(data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27white%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpolyline points=%276 9 12 15 18 9%27/%3E%3C/svg%3E)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 10px center',
        }}
      >
        <option value="en">🇬🇧 English</option>
        <option value="fr">🇫🇷 Français</option>
        <option value="es">🇪🇸 Español</option>
      </select>
    </div>
  );
};

export default LanguageSelector;

