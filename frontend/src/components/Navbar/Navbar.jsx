import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getStoredUser, isAuthenticated, logout } from "../../services/authService";
import { useLanguage } from "../../i18n/LanguageContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [userName, setUserName] = useState(() => getStoredUser()?.name || "");

  useEffect(() => {
    const syncAuth = () => {
      const user = getStoredUser();
      setIsLoggedIn(isAuthenticated());
      setUserName(user?.name || "");
    };
    syncAuth();
    window.addEventListener("storage", syncAuth);
    window.addEventListener("cyberrakshak:auth-changed", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("cyberrakshak:auth-changed", syncAuth);
    };
  }, [location]);

  const handleLogout = async () => {
    try { await logout(); } catch { /* local session is cleared by authService */ }
    finally {
      setIsLoggedIn(false);
      setUserName("");
      setIsOpen(false);
      window.dispatchEvent(new Event("cyberrakshak:auth-changed"));
      navigate("/");
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const navItems = [
    ["/", t.nav.home], ["/check", t.nav.check], ["/threats", t.nav.threats],
    ["/intelligence", t.nav.intelligence], ["/learn", t.nav.learn], ["/incidents", t.nav.incidents],
    ["/digital-literacy-quiz", t.nav.quiz], ["/emergency-help", t.nav.emergency],
    ["/report-scam", t.nav.report], ["/feedback", t.nav.feedback],
  ];

  return (
    <nav className="navbar" aria-label="Primary navigation">
      <div className="navbar-container">
        <button className="navbar-logo" onClick={() => handleNavClick("/")} aria-label="CyberRakshak home">
          <span className="logo-icon" aria-hidden="true">🛡️</span><span className="logo-text">CyberRakshak</span>
        </button>
        <div className={`nav-menu ${isOpen ? "active" : ""}`}>
          {navItems.map(([path, label]) => <button key={path} className={`nav-link ${location.pathname === path ? "active" : ""}`} onClick={() => handleNavClick(path)}>{label}</button>)}
          <div className="language-switcher" aria-label={t.language}>
            <button type="button" className={language === "en" ? "language-active" : ""} onClick={() => setLanguage("en")} aria-pressed={language === "en"}>EN</button>
            <button type="button" className={language === "te" ? "language-active" : ""} onClick={() => setLanguage("te")} aria-pressed={language === "te"}>తెలుగు</button>
          </div>
          {isLoggedIn ? <div className="user-menu"><span className="user-name">Hi, {userName || "User"}!</span><button className="nav-link logout-btn" onClick={handleLogout}>{t.nav.logout}</button></div> : <div className="auth-buttons"><button className="nav-link login-link" onClick={() => handleNavClick("/login")}>{t.nav.login}</button><button className="nav-link register-link" onClick={() => handleNavClick("/register")}>{t.nav.register}</button></div>}
        </div>
        <button className="hamburger" onClick={() => setIsOpen((open) => !open)} aria-label={isOpen ? "Close menu" : "Open menu"} aria-expanded={isOpen}><span></span><span></span><span></span></button>
      </div>
    </nav>
  );
}

export default Navbar;
