import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getStoredUser, isAuthenticated, logout } from "../../services/authService";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
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
    try {
      await logout();
    } catch {
      // The local session is cleared by authService even if the API is unavailable.
    } finally {
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

  return (
    <nav className="navbar" aria-label="Primary navigation">
      <div className="navbar-container">
        <button className="navbar-logo" onClick={() => handleNavClick("/")} aria-label="CyberRakshak home">
          <span className="logo-icon" aria-hidden="true">🛡️</span>
          <span className="logo-text">CyberRakshak</span>
        </button>

        <div className={`nav-menu ${isOpen ? "active" : ""}`}>
          <button className={`nav-link ${location.pathname === "/" ? "active" : ""}`} onClick={() => handleNavClick("/")}>Home</button>
          <button className={`nav-link ${location.pathname === "/learn" ? "active" : ""}`} onClick={() => handleNavClick("/learn")}>Learn</button>
          <button className={`nav-link ${location.pathname === "/digital-literacy-quiz" ? "active" : ""}`} onClick={() => handleNavClick("/digital-literacy-quiz")}>Quiz</button>
          <button className={`nav-link ${location.pathname === "/emergency-help" ? "active" : ""}`} onClick={() => handleNavClick("/emergency-help")}>Emergency</button>
          <button className={`nav-link ${location.pathname === "/report-scam" ? "active" : ""}`} onClick={() => handleNavClick("/report-scam")}>Report Scam</button>
          <button className={`nav-link ${location.pathname === "/feedback" ? "active" : ""}`} onClick={() => handleNavClick("/feedback")}>Feedback</button>

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
