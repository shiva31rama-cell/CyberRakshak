import { createContext, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "cyberrakshak-language";

const translations = {
  en: {
    nav: { home: "Home", learn: "Learn", quiz: "Quiz", emergency: "Emergency", report: "Report Scam", feedback: "Feedback", intelligence: "Intelligence", threats: "Threat Radar", check: "Check", incidents: "Incident Mode", login: "Login", register: "Register", logout: "Logout" },
    language: "Language",
    home: {
      eyebrow: "CYBERRAKSHAK 2.0",
      title1: "Before you click.", title2: "Before you pay.", title3: "Before you trust.",
      lead: "A privacy-first digital safety layer for messages, links, payments, notifications and the moments when something suddenly feels wrong.",
      principles: ["Local-first", "India-ready", "Evidence-led"],
      checkNow: "CHECK SOMETHING NOW", pasteLabel: "Paste the thing that feels suspicious", placeholder: "Example: ‘Your account will be blocked. Send OTP immediately…’", checkSafely: "Check safely", alreadyTitle: "Already clicked, paid, shared something or installed an app?", alreadyText: "Start Incident Mode. It gives you a calm, ordered recovery path instead of making you guess what to do next.", openIncident: "Open Incident Mode",
      whatChanging: "What’s changing around you?", explore: "Explore Threat Radar →", learnEyebrow: "LEARN WITHOUT THE LECTURE", learnTitle: "One real scenario at a time.", learnText: "Short, visual lessons built around what people actually see: fake KYC notices, payment requests, job offers, deepfake pressure and suspicious app prompts.", learningHub: "Open Learning Hub →",
      checks: { message: "Message", messageHint: "Paste SMS, WhatsApp, email or DM text", link: "Link", linkHint: "Check a suspicious URL before opening it", upi: "UPI / payment", upiHint: "Review a UPI ID or payment request", phone: "Phone", phoneHint: "Check an unfamiliar Indian number", qr: "QR / screenshot", qrHint: "Use import/share on your device", incident: "I already acted", incidentHint: "Get the next safest steps" },
      detect: "Signals across messages, links, identifiers and notifications", understand: "Plain-language reasons instead of scary black-box scores", act: "Clear next steps with verified official resources"
    }
  },
  te: {
    nav: { home: "హోమ్", learn: "నేర్చుకోండి", quiz: "క్విజ్", emergency: "అత్యవసరం", report: "స్కామ్ రిపోర్ట్", feedback: "ఫీడ్‌బ్యాక్", intelligence: "ఇంటెలిజెన్స్", threats: "థ్రెట్ రాడార్", check: "చెక్", incidents: "ఇన్సిడెంట్ మోడ్", login: "లాగిన్", register: "రిజిస్టర్", logout: "లాగౌట్" },
    language: "భాష",
    home: {
      eyebrow: "CYBERRAKSHAK 2.0",
      title1: "క్లిక్ చేసే ముందు.", title2: "డబ్బు పంపే ముందు.", title3: "నమ్మే ముందు.",
      lead: "మెసేజ్‌లు, లింక్‌లు, చెల్లింపులు, నోటిఫికేషన్‌లు మరియు ఏదైనా అనుమానంగా అనిపించే సమయంలో మీ గోప్యతను ముందుగా ఉంచే డిజిటల్ భద్రతా సహాయకం.",
      principles: ["లోకల్-ఫస్ట్", "భారతదేశానికి సిద్ధం", "ఆధారాలపై ఆధారితం"],
      checkNow: "ఇప్పుడే ఏదైనా చెక్ చేయండి", pasteLabel: "అనుమానంగా అనిపించినదాన్ని ఇక్కడ పెట్టండి", placeholder: "ఉదాహరణ: ‘మీ ఖాతా బ్లాక్ అవుతుంది. వెంటనే OTP పంపండి…’", checkSafely: "సురక్షితంగా చెక్ చేయండి", alreadyTitle: "ఇప్పటికే క్లిక్ చేశారా, డబ్బు పంపారా, సమాచారం పంచుకున్నారా లేదా యాప్ ఇన్‌స్టాల్ చేశారా?", alreadyText: "ఇన్సిడెంట్ మోడ్‌ను ప్రారంభించండి. తర్వాత ఏమి చేయాలో ప్రశాంతంగా, క్రమంగా చూపిస్తుంది.", openIncident: "ఇన్సిడెంట్ మోడ్ తెరవండి",
      whatChanging: "మీ చుట్టూ ఏమి మారుతోంది?", explore: "థ్రెట్ రాడార్ చూడండి →", learnEyebrow: "లెక్చర్ లేకుండా నేర్చుకోండి", learnTitle: "ఒక్కసారి ఒక నిజమైన పరిస్థితి.", learnText: "నకిలీ KYC నోటీసులు, చెల్లింపు అభ్యర్థనలు, ఉద్యోగ ఆఫర్లు, డీప్‌ఫేక్ ఒత్తిడి మరియు అనుమానాస్పద యాప్ సందేశాలపై చిన్న, సులభమైన పాఠాలు.", learningHub: "లెర్నింగ్ హబ్ తెరవండి →",
      checks: { message: "మెసేజ్", messageHint: "SMS, WhatsApp, ఇమెయిల్ లేదా DM టెక్స్ట్ పెట్టండి", link: "లింక్", linkHint: "ఓపెన్ చేసే ముందు అనుమానాస్పద URL చెక్ చేయండి", upi: "UPI / చెల్లింపు", upiHint: "UPI ID లేదా చెల్లింపు అభ్యర్థనను పరిశీలించండి", phone: "ఫోన్", phoneHint: "తెలియని భారతీయ నంబర్‌ను చెక్ చేయండి", qr: "QR / స్క్రీన్‌షాట్", qrHint: "మీ పరికరంలో import/share ఉపయోగించండి", incident: "నేను ఇప్పటికే చర్య తీసుకున్నాను", incidentHint: "తర్వాత తీసుకోవాల్సిన సురక్షితమైన చర్యలు పొందండి" },
      detect: "మెసేజ్‌లు, లింక్‌లు, గుర్తింపులు మరియు నోటిఫికేషన్‌లలో ప్రమాద సంకేతాలను గుర్తిస్తుంది", understand: "భయపెట్టే స్కోర్లకు బదులుగా సులభమైన కారణాలను వివరిస్తుంది", act: "ధృవీకరించిన అధికారిక వనరులతో స్పష్టమైన తదుపరి చర్యలను చూపిస్తుంది"
    }
  }
};

const LanguageContext = createContext(null);

function getInitialLanguage() {
  if (typeof window === "undefined") return "en";
  return window.localStorage.getItem(STORAGE_KEY) === "te" ? "te" : "en";
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  const setLanguage = (next) => {
    const value = next === "te" ? "te" : "en";
    setLanguageState(value);
    window.localStorage.setItem(STORAGE_KEY, value);
    document.documentElement.lang = value;
  };

  const value = useMemo(() => ({ language, setLanguage, t: translations[language] }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
