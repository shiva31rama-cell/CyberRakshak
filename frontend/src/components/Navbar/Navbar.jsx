import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getStoredUser, isAuthenticated, logout } from "../../services/authService";
import { useLanguage } from "../../contexts/LanguageContext";
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
    try { await logout(); } catch { /* local session is still cleared by authService */ }
    setIsLoggedIn(false);
    setUserName("");
    setIsOpen(false);
    window.dispatchEvent(new Event("cyberrakshak:auth-changed"));
    navigate("/");
  };

  const handleNavClick = (path) => { navigate(path); setIsOpen(false); };
  const isActive = (paths) => paths.some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`));

  return (
    <nav className="navbar" aria-label="Primary navigation">
      <div className="navbar-container">
        <button className="navbar-logo" onClick={() => handleNavClick("/")} aria-label="CyberRakshak home">
          <span className="logo-icon" aria-hidden="true">🛡️</span>
          <span className="logo-text">CyberRakshak</span>
        </button>

        <div className={`nav-menu ${isOpen ? "active" : ""}`}>
          <button className={`nav-link ${isActive(["/"]) && location.pathname === "/" ? "active" : ""}`} onClick={() => handleNavClick("/")}>{t.home}</button>
          <button className={`nav-link ${isActive(["/scan"]) ? "active" : ""}`} onClick={() => handleNavClick("/scan")}>🔎 {t.scan}</button>
          <button className={`nav-link ${isActive(["/learn", "/digital-literacy", "/upi-safety", "/password-security"]) ? "active" : ""}`} onClick={() => handleNavClick("/learn")}>📚 {t.learn}</button>
          <button className={`nav-link ${isActive(["/emergency-help", "/report-scam"]) ? "active" : ""}`} onClick={() => handleNavClick("/emergency-help")}>🆘 {t.help}</button>
          <button className="nav-link" onClick={() => handleNavClick("/")}>💬 {t.ask}</button>

          <label className="language-control" title={t.language}>
            <span aria-hidden="true">🌐</span>
            <span className="sr-only">{t.language}</span>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} aria-label={t.language}>
              <option value="en">EN</option><option value="te">తెలుగు</option><option value="hi">हिन्दी</option>
            </select>
          </label>

          {isLoggedIn ? (
            <div className="user-menu">
              <span className="user-name">Hi, {userName || "User"}!</span>
              <button className="nav-link logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="nav-link login-link" onClick={() => handleNavClick("/login")}>Login</button>
              <button className="nav-link register-link" onClick={() => handleNavClick("/register")}>Register</button>
            </div>
          )}
        </div>

        <button className="hamburger" onClick={() => setIsOpen((open) => !open)} aria-label={isOpen ? "Close menu" : "Open menu"} aria-expanded={isOpen}>
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
