import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

const dictionary: Translations = {
  login: { en: "Login", hi: "लॉग इन करें" },
  register: { en: "Register", hi: "पंजीकरण करें" },
  welcome_back: { en: "Welcome back", hi: "वापसी पर स्वागत है" },
  create_account: { en: "Create an account", hi: "खाता बनाएँ" },
  enter_credentials: { en: "Enter your credentials to access your account", hi: "अपने खाते तक पहुंचने के लिए क्रेडेंशियल दर्ज करें" },
  enter_details: { en: "Enter your details to create your health profile", hi: "अपना स्वास्थ्य प्रोफ़ाइल बनाने के लिए विवरण दर्ज करें" },
  email_phone_username: { en: "Email, Phone, or Username", hi: "ईमेल, फोन या उपयोगकर्ता नाम" },
  password: { en: "Password", hi: "पासवर्ड" },
  forgot_password: { en: "Forgot password?", hi: "पासवर्ड भूल गए?" },
  login_with_password: { en: "Login with Password", hi: "पासवर्ड से लॉग इन करें" },
  or_continue_with: { en: "Or continue with", hi: "या इसके साथ जारी रखें" },
  login_with_otp: { en: "Login with OTP", hi: "OTP से लॉग इन करें" },
  full_name: { en: "Full Name", hi: "पूरा नाम" },
  username: { en: "Username", hi: "उपयोगकर्ता नाम" },
  email: { en: "Email", hi: "ईमेल" },
  phone: { en: "Phone", hi: "फ़ोन" },
  age: { en: "Age", hi: "उम्र" },
  gender: { en: "Gender", hi: "लिंग" },
  my_records: { en: "My Records", hi: "मेरे रिकॉर्ड" },
  reminders: { en: "Reminders", hi: "रिमाइंडर" },
  profile: { en: "Profile", hi: "प्रोफ़ाइल" },
  vaccinations: { en: "Vaccinations", hi: "टीकाकरण" },
  checkups: { en: "Checkups", hi: "चेकअप" },
  upload_report: { en: "Upload Medical Report", hi: "मेडिकल रिपोर्ट अपलोड करें" },
  drag_drop: { en: "Drag and drop your PDF or image files here", hi: "अपनी PDF या छवि फ़ाइलें यहाँ खींचें और छोड़ें" },
  extracted_insights: { en: "Health Metrics & Records", hi: "स्वास्थ्य मेट्रिक्स और रिकॉर्ड" },
  generate_link: { en: "Generate Access Link", hi: "एक्सेस लिंक जनरेट करें" },
  export_pdf: { en: "Export as PDF", hi: "PDF के रूप में निर्यात करें" },
  logout: { en: "Log out", hi: "लॉग आउट करें" }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('pranaLinkLang') as Language;
    if (saved) setLanguage(saved);
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('pranaLinkLang', lang);
  };

  const t = (key: string): string => {
    return dictionary[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
