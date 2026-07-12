// src/contexts/LanguageContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const LanguageContext = createContext(null);

// Minimal dictionary base to keep initial layouts dynamic across Ethiopian languages
const translations = {
  en: {
    search_placeholder: "Search for trusted local professionals...",
    become_provider: "Become a Provider",
    login: "Log In",
    register: "Register",
    dashboard: "Dashboard",
    messages: "Messages",
    notifications: "Notifications",
  },
  am: {
    search_placeholder: "ታማኝ የአካባቢ ባለሙያዎችን ይፈልጉ...",
    become_provider: "አገልግሎት ሰጪ ይሁኑ",
    login: "ግባ",
    register: "ተመዝገብ",
    dashboard: "ዳሽቦርድ",
    messages: "መልዕክቶች",
    notifications: "ማስታወቂያዎች",
  },
  om: {
    search_placeholder: "Ogeeyyii naannoo amanamoo barbaadi...",
    become_provider: "Tajaajila Kennaa Tahi",
    login: "Seeni",
    register: "Galmee",
    dashboard: "Daashboordii",
    messages: "Ergaawwan",
    notifications: "Beeksisoota",
  },
  ti: {
    search_placeholder: "እሙናት ናይ ከባቢ ሰብ ሞያታት ድለዩ...",
    become_provider: "ኣቕራቢ ኣገልግሎት ኩኑ",
    login: "እተው",
    register: "ተመዝገብ",
    dashboard: "ዳሽቦርድ",
    messages: "መልእኽትታት",
    notifications: "መተሓሳሰቢታት",
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('servicehub_lang') || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('servicehub_lang', language);
    // Adjust text direction rules dynamically if specific locales require typography overrides
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};