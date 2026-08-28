import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    home: "Home",
    products: "Products",
    cart: "Cart",
    marketPrices: "Market Prices",
    aiDiseaseDetect: "AI Disease Detect",
    about: "About",
    contactUs: "Contact Us",
    sellerPanel: "Seller Panel",
    login: "Login",
    shopNow: "Shop Now",
    whoWeAre: "Who We Are",
    whyChoose: "Why Choose FarmingHub",
    howItWorks: "How FarmingHub Works",
    ourMission: "Our Mission",
    ourVision: "Our Vision",
    partnerWith: "Partner with FarmingHub",
    getStarted: "Get Started Today",
    addToCart: "Add to Cart",
    searchProducts: "Search products...",
    orderSummary: "Order Summary",
    proceedCheckout: "Proceed to Checkout",
    selectPayment: "Select Payment Method",
    confirmPayment: "Confirm Payment",
    orderSuccess: "Order Successful!",
    continueShopping: "Continue Shopping",
    languageLabel: "Language",
    community: "Community",
    govSchemes: "Gov Schemes",
    logout: "Logout",
    register: "Register"
  },
  hi: {
    home: "होम",
    products: "उत्पाद",
    cart: "कार्ट",
    marketPrices: "बाज़ार भाव",
    aiDiseaseDetect: "AI रोग पहचान",
    about: "हमारे बारे में",
    contactUs: "संपर्क करें",
    sellerPanel: "विक्रेता पैनल",
    login: "लॉगिन",
    shopNow: "अभी खरीदें",
    whoWeAre: "हम कौन हैं",
    whyChoose: "FarmingHub क्यों चुनें",
    howItWorks: "FarmingHub कैसे काम करता है",
    ourMission: "हमारा मिशन",
    ourVision: "हमारा विज़न",
    partnerWith: "FarmingHub के साथ जुड़ें",
    getStarted: "आज ही शुरू करें",
    addToCart: "कार्ट में जोड़ें",
    searchProducts: "उत्पाद खोजें...",
    orderSummary: "ऑर्डर सारांश",
    proceedCheckout: "चेकआउट करें",
    selectPayment: "भुगतान विधि चुनें",
    confirmPayment: "भुगतान की पुष्टि करें",
    orderSuccess: "ऑर्डर सफल!",
    continueShopping: "खरीदारी जारी रखें",
    languageLabel: "भाषा",
    community: "समुदाय",
    govSchemes: "सरकारी योजनाएं",
    logout: "लॉग आउट",
    register: "पंजीकरण करें"
  },
  mr: {
    home: "मुख्यपृष्ठ",
    products: "उत्पादने",
    cart: "कार्ट",
    marketPrices: "बाजारभाव",
    aiDiseaseDetect: "AI रोग ओळख",
    about: "आमच्याबद्दल",
    contactUs: "संपर्क करा",
    sellerPanel: "विक्रेता पॅनल",
    login: "लॉगिन",
    shopNow: "आता खरेदी करा",
    whoWeAre: "आम्ही कोण आहोत",
    whyChoose: "FarmingHub का निवडा",
    howItWorks: "FarmingHub कसे कार्य करते",
    ourMission: "आमचे ध्येय",
    ourVision: "आमची दूरदृष्टी",
    partnerWith: "FarmingHub सोबत जोडा",
    getStarted: "आजच सुरू करा",
    addToCart: "कार्टमध्ये जोडा",
    searchProducts: "उत्पादने शोधा...",
    orderSummary: "ऑर्डर सारांश",
    proceedCheckout: "चेकआउट करा",
    selectPayment: "पेमेंट पद्धत निवडा",
    confirmPayment: "पेमेंट पुष्टी करा",
    orderSuccess: "ऑर्डर यशस्वी!",
    continueShopping: "खरेदी चालू ठेवा",
    languageLabel: "भाषा",
    community: "समुदाय",
    govSchemes: "सरकारी योजना",
    logout: "लॉगआउट",
    register: "नोंदणी करा"
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  const t = (key) => {
    return translations[language]?.[key] || translations["en"]?.[key] || key;
  };

  const languageNames = {
    en: "English",
    hi: "हिन्दी",
    mr: "मराठी",
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languageNames }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
