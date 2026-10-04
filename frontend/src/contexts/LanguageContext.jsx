import { createContext, useContext, useMemo, useState } from "react";

const translations = {
  en: {
    home: "Home", scan: "Scan", learn: "Learn", help: "Get Help", ask: "Ask",
    heroEyebrow: "AI-POWERED · MULTILINGUAL · CYBER SAFETY",
    heroTitle: "Understand the threat.",
    heroTitle2: "Take the safer next step.",
    heroText: "CyberRakshak helps everyday users understand suspicious messages, online scams and cyber incidents in simple language — before a small mistake becomes a bigger problem.",
    scanMessage: "🔎 Scan a Message", askCyber: "💬 Ask CyberRakshak", startLearning: "Start Learning →",
    language: "Language",
  },
  te: {
    home: "హోమ్", scan: "స్కాన్", learn: "నేర్చుకోండి", help: "సహాయం", ask: "అడగండి",
    heroEyebrow: "AI ఆధారిత · బహుభాషా · సైబర్ భద్రత",
    heroTitle: "ప్రమాదాన్ని అర్థం చేసుకోండి.",
    heroTitle2: "సురక్షితమైన తదుపరి అడుగు వేయండి.",
    heroText: "CyberRakshak అనుమానాస్పద సందేశాలు, ఆన్‌లైన్ మోసాలు మరియు సైబర్ సంఘటనలను సులభమైన భాషలో అర్థం చేసుకోవడంలో సహాయపడుతుంది.",
    scanMessage: "🔎 సందేశాన్ని స్కాన్ చేయండి", askCyber: "💬 CyberRakshakను అడగండి", startLearning: "నేర్చుకోవడం ప్రారంభించండి →",
    language: "భాష",
  },
  hi: {
    home: "होम", scan: "स्कैन", learn: "सीखें", help: "मदद", ask: "पूछें",
    heroEyebrow: "AI आधारित · बहुभाषी · साइबर सुरक्षा",
    heroTitle: "खतरे को समझें।",
    heroTitle2: "सुरक्षित अगला कदम उठाएँ।",
    heroText: "CyberRakshak संदिग्ध संदेशों, ऑनलाइन घोटालों और साइबर घटनाओं को आसान भाषा में समझने में मदद करता है।",
    scanMessage: "🔎 संदेश स्कैन करें", askCyber: "💬 CyberRakshak से पूछें", startLearning: "सीखना शुरू करें →",
    language: "भाषा",
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem("cyberrakshak:language") || "en");
  const changeLanguage = (value) => {
    const next = ["en", "te", "hi"].includes(value) ? value : "en";
    setLanguage(next);
    localStorage.setItem("cyberrakshak:language", next);
  };
  const value = useMemo(() => ({ language, setLanguage: changeLanguage, t: translations[language] || translations.en }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
};
