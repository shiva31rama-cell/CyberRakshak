import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import Icon from "../Icon/Icon";
import "./Navbar.css";

const LINKS = [
  ["/", "nav.home"], ["/threats", "nav.threats"], ["/analyser", "nav.analyser"], ["/videos", "nav.videos"],
  ["/safety-guide", "nav.guide"], ["/quiz", "nav.quiz"], ["/about", "nav.about"],
];

function Navbar() {
  const { t, lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <a href="#main" className="skip-link">{t("nav.skip")}</a>
      <div className="nav-inner">
        <Link to="/" className="nav-brand" aria-label="CyberRakshak">
          <span className="nav-logo"><Icon name="shield" size={20} /></span>
          <span className="nav-brand-text"><strong>CyberRakshak</strong><small>{t("brand.tag")}</small></span>
        </Link>

        <nav className={`nav-links ${open ? "open" : ""}`} aria-label="Primary">
          {LINKS.map(([to, key]) => (
            <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>{t(key)}</NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <div className="lang-switch" role="group" aria-label={t("nav.language")}>
            <button type="button" className={lang === "en" ? "on" : ""} aria-pressed={lang === "en"} onClick={() => setLang("en")}>English</button>
            <span aria-hidden="true">|</span>
            <button type="button" className={lang === "te" ? "on" : ""} aria-pressed={lang === "te"} onClick={() => setLang("te")} lang="te">తెలుగు</button>
          </div>
          <button type="button" className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? t("nav.close") : t("nav.menu")}>
            <Icon name={open ? "x" : "menu"} size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
