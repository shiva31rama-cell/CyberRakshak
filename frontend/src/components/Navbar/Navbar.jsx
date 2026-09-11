import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getStoredUser, isAuthenticated, logout } from "../../services/authService";
import { useLanguage } from "../../i18n/LanguageContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [userName, setUserName] = useState(() => getStoredUser()?.name || "");
  const [isAdmin, setIsAdmin] = useState(() => getStoredUser()?.role === "admin");
  const { language, languages, setLanguage, t } = useLanguage();

  const primaryLinks = [
    ["/", t("home")],
    ["/check", t("check")],
    ["/learn", t("learn")],
    ["/emergency-help", t("emergency")],
    ["/report-scam", t("report")],
  ];

  const moreLinks = [
    ["/digital-literacy", t("digitalLiteracy")],
    ["/digital-literacy-quiz", t("quiz")],
    ["/upi-safety", t("upiSafety")],
    ["/cyber-crime-awareness", t("cyberCrime")],
    ["/social-media-safety", t("socialSafety")],
    ["/password-security", t("passwordSafety")],
    ["/feedback", t("feedback")],
  ];

  useEffect(() => {
    const syncAuth = () => {
      const user = getStoredUser();
      setIsLoggedIn(isAuthenticated());
      setUserName(user?.name || "");
      setIsAdmin(user?.role === "admin");
    };

    syncAuth();
    window.addEventListener("storage", syncAuth);
    window.addEventListener("cyberrakshak:auth-changed", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("cyberrakshak:auth-changed", syncAuth);
    };
  }, [location]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsMoreOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsMoreOpen(false);
  }, [location.pathname]);

  const handleNavClick = (path) => navigate(path);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setIsLoggedIn(false);
      setUserName("");
      setIsAdmin(false);
      setIsOpen(false);
      setIsMoreOpen(false);
      window.dispatchEvent(new Event("cyberrakshak:auth-changed"));
      navigate("/");
    }
  };

  const handleLanguageChange = (event) => setLanguage(event.target.value);
  const isActive = (path) => location.pathname === path;
  const moreActive = moreLinks.some(([path]) => location.pathname === path);

  return (
    <nav className="navbar" aria-label="Primary navigation">
      <div className="navbar-container">
        <button className="navbar-logo" type="button" onClick={() => handleNavClick("/")} aria-label="CyberRakshak home">
          <span className="logo-mark" aria-hidden="true">🛡️</span>
          <span className="logo-text">CyberRakshak</span>
        </button>

        <div className="navbar-desktop-language">
          <label htmlFor="navbar-language">{t("language")}</label>
          <select id="navbar-language" value={language} onChange={handleLanguageChange} aria-label={t("language")}>
            {languages.map((item) => <option key={item} value={item}>{item === "English" ? "English" : item === "Telugu" ? "తెలుగు" : "हिन्दी"}</option>)}
          </select>
        </div>

        <button
          className={`hamburger ${isOpen ? "open" : ""}`}
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? t("closeMenu") : t("openMenu")}
          aria-expanded={isOpen}
          aria-controls="main-navigation-menu"
        >
          <span /><span /><span />
        </button>

        <div id="main-navigation-menu" className={`nav-menu ${isOpen ? "active" : ""}`}>
          <div className="nav-primary">
            {primaryLinks.map(([path, label]) => (
              <button key={path} type="button" className={`nav-link ${isActive(path) ? "active" : ""}`} onClick={() => handleNavClick(path)}>
                {label}
              </button>
            ))}

            <div className="more-menu" ref={menuRef}>
              <button type="button" className={`nav-link more-trigger ${moreActive ? "active" : ""}`} onClick={() => setIsMoreOpen((open) => !open)} aria-expanded={isMoreOpen}>
                {t("more")} <span aria-hidden="true">⌄</span>
              </button>
              {isMoreOpen && (
                <div className="more-panel" role="menu">
                  {moreLinks.map(([path, label]) => (
                    <button key={path} type="button" role="menuitem" className={isActive(path) ? "more-item active" : "more-item"} onClick={() => handleNavClick(path)}>
                      {label}
                    </button>
                  ))}
                  {isAdmin && <button type="button" role="menuitem" className={isActive("/admin") ? "more-item active" : "more-item"} onClick={() => handleNavClick("/admin")}>Admin</button>}
                </div>
              )}
            </div>
          </div>

          <div className="nav-mobile-language">
            <label htmlFor="mobile-navbar-language">{t("language")}</label>
            <select id="mobile-navbar-language" value={language} onChange={handleLanguageChange} aria-label={t("language")}>
              {languages.map((item) => <option key={item} value={item}>{item === "English" ? "English" : item === "Telugu" ? "తెలుగు" : "हिन्दी"}</option>)}
            </select>
          </div>

          <div className="nav-account">
            {isLoggedIn ? (
              <div className="user-menu">
                <span className="user-name">Hi, {userName || "User"}</span>
                <button type="button" className="nav-link logout-btn" onClick={handleLogout}>{t("logout")}</button>
              </div>
            ) : (
              <div className="auth-buttons">
                <button type="button" className="nav-link login-link" onClick={() => handleNavClick("/login")}>{t("login")}</button>
                <button type="button" className="register-link" onClick={() => handleNavClick("/register")}>{t("register")}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
