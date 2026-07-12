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
    previous: "Previous", next: "Next", page_info: "Page {current} of {total}",
    all: "All",
pending: "Pending",
accepted: "Accepted",
in_progress: "In Progress",
completed: "Completed",
cancelled: "Cancelled",
  },
  am: {
    search_placeholder: "ታማኝ የአካባቢ ባለሙያዎችን ይፈልጉ...",
    become_provider: "አገልግሎት ሰጪ ይሁኑ",
    login: "ግባ",
    register: "ተመዝገብ",
    dashboard: "ዳሽቦርድ",
    messages: "መልዕክቶች",
    notifications: "ማስታወቂያዎች",
    previous: "ቀዳሚ", next: "ቀጣይ", page_info: "ገጽ {current} ከ {total}",
    all: "ሁሉም", pending: "በጥበቃ ላይ", accepted: "ተቀባይነት ያገኘ", in_progress: "በሂደት ላይ", completed: "ተጠናቋል", cancelled: "የተሰረዘ",
  },
  om: {
    search_placeholder: "Ogeeyyii naannoo amanamoo barbaadi...",
    become_provider: "Tajaajila Kennaa Tahi",
    login: "Seeni",
    register: "Galmee",
    dashboard: "Daashboordii",
    messages: "Ergaawwan",
    notifications: "Beeksisoota",
    previous: "Duraa", next: "Kan itti anu", page_info: "Fuula {current} keessaa {total}",
    all: "Hunda", pending: "Eeggamaa jira", accepted: "Fudhatameera", in_progress: "Itti fufamaa jira", completed: "Xumurameera", cancelled: "Haqameera",
  },
  ti: {
    search_placeholder: "እሙናት ናይ ከባቢ ሰብ ሞያታት ድለዩ...",
    become_provider: "ኣቕራቢ ኣገልግሎት ኩኑ",
    login: "እተው",
    register: "ተመዝገብ",
    dashboard: "ዳሽቦርድ",
    messages: "መልእኽትታት",
    notifications: "መተሓሳሰቢታት",
    previous: "ቀዳማይ", next: "ቀጻሊ", page_info: "ገጽ {current} ካብ {total}",
    all: "ኩሉ", pending: "ብምጽባቕ", accepted: "ተቐባልነት ዝረኸበ", in_progress: "ኣብ መስርሕ", completed: "ተወዲኡ", cancelled: "ዝተረፈ"
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