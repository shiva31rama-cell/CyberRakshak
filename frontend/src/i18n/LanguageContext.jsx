import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { STRINGS } from "./strings";

const STORAGE_KEY = "cyberrakshak.lang";
const LanguageContext = createContext(null);

const readStored = () => {
  try { const v = localStorage.getItem(STORAGE_KEY); return v === "te" || v === "en" ? v : "en"; } catch { return "en"; }
};

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readStored);

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* storage unavailable */ }
  }, [lang]);

  const setLang = useCallback((next) => setLangState(next === "te" ? "te" : "en"), []);
  const t = useCallback((key) => STRINGS[lang][key] ?? STRINGS.en[key] ?? key, [lang]);
  /** Pick the current language from an { en, te } content object. */
  const pick = useCallback((obj) => (obj && typeof obj === "object" ? obj[lang] ?? obj.en : obj), [lang]);

  const value = useMemo(() => ({ lang, setLang, t, pick }), [lang, setLang, t, pick]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
