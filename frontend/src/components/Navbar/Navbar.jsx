import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getStoredUser, isAuthenticated, logout } from "../../services/authService";
import { useLanguage } from "../../i18n/LanguageContext";
import "./Navbar.css";

const secondaryLinks = [
  ["/digital-literacy", "digitalLiteracy"],
  ["/digital-literacy-quiz", "quiz"],
  ["/upi-safety", "upiSafety"],
  ["/cyber-crime-awareness", "cyberCrime"],
  ["/social-media-safety", "socialSafety"],
  ["/password-security", "passwordSafety"],
  ["/feedback", "feedback"],
  ["/privacy", "privacy"],
  ["/terms", "terms"],
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, languages, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
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

  const handleNavClick = (path) => {
    navigate(path);
    setIsOpen(false);
    setIsMoreOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // authService clears the local session even when the API is unavailable.
    } finally {
      setIsLoggedIn(false);
      setUserName("");
      setIsOpen(false);
      setIsMoreOpen(false);
      window.dispatchEvent(new Event("cyberrakshak:auth-changed"));
      navigate("/");
    }
  };

  const primaryLinks = [
    ["/", "home"],
    ["/check", "check"],
    ["/learn", "learn"],
    ["/emergency-help", "emergency"],
    ["/report-scam", "report"],
  ];

  return (
    <nav className="navbar" aria-label="Primary navigation">
      <div className="navbar-container">
        <button className="navbar-logo" onClick={() => handleNavClick("/")} aria-label="CyberRakshak home">
          <span className="logo-icon" aria-hidden="true">🛡️</span>
          <span className="logo-text">CyberRakshak</span>
        </button>

        <button
          type="button"
          className="hamburger"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? t("closeMenu") : t("openMenu")}
          aria-expanded={isOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-menu ${isOpen ? "active" : ""}`}>
          {primaryLinks.map(([path, labelKey]) => (
            <button
              type="button"
              key={path}
              className={`nav-link ${location.pathname === path ? "active" : ""}`}
              onClick={() => handleNavClick(path)}
            >
              {t(labelKey)}
            </button>
          ))}

          <div className={`more-menu ${isMoreOpen ? "active" : ""}`}>
            <button
              type="button"
              className="nav-link more-toggle"
              aria-expanded={isMoreOpen}
              onClick={() => setIsMoreOpen((open) => !open)}
            >
              {t("more")} <span aria-hidden="true">⌄</span>
            </button>

            <div className="more-panel">
              {secondaryLinks.map(([path, labelKey]) => (
                <button type="button" key={path} onClick={() => handleNavClick(path)}>
                  {t(labelKey)}
                </button>
              ))}
              <div className="language-picker">
                <span>{t("language")}</span>
                <div className="language-options" role="group" aria-label={t("language")}>
                  {languages.map((option) => (
                    <button
                      type="button"
                      key={option}
                      className={language === option ? "selected" : ""}
                      aria-pressed={language === option}
                      onClick={() => setLanguage(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {isLoggedIn ? (
            <div className="user-menu">
              <span className="user-name">Hi, {userName || "User"}</span>
              <button type="button" className="nav-link logout-btn" onClick={handleLogout}>{t("logout")}</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button type="button" className="nav-link login-link" onClick={() => handleNavClick("/login")}>{t("login")}</button>
              <button type="button" className="nav-link register-link" onClick={() => handleNavClick("/register")}>{t("register")}</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
