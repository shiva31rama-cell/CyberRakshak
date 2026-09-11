import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getStoredUser, isAuthenticated, logout } from "../../services/authService";
import "./Navbar.css";

const primaryLinks = [
  ["/", "Home"],
  ["/check", "Check"],
  ["/learn", "Learn"],
  ["/emergency-help", "Emergency"],
  ["/report-scam", "Report Scam"]
];

const moreLinks = [
  ["/digital-literacy", "Digital Literacy"],
  ["/digital-literacy-quiz", "Quiz"],
  ["/upi-safety", "UPI Safety"],
  ["/cyber-crime-awareness", "Cyber Crime Awareness"],
  ["/social-media-safety", "Social Media Safety"],
  ["/password-security", "Password Security"],
  ["/feedback", "Feedback"]
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [userName, setUserName] = useState(() => getStoredUser()?.name || "");
  const [isAdmin, setIsAdmin] = useState(() => getStoredUser()?.role === "admin");

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

  const handleNavClick = (path) => {
    navigate(path);
    setIsOpen(false);
    setIsMoreOpen(false);
  };

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

  const isActive = (path) => location.pathname === path;
  const moreActive = moreLinks.some(([path]) => location.pathname === path);

  return (
    <nav className="navbar" aria-label="Primary navigation">
      <div className="navbar-container">
        <button className="navbar-logo" type="button" onClick={() => handleNavClick("/")} aria-label="CyberRakshak home">
          <span className="logo-icon" aria-hidden="true">🛡️</span>
          <span className="logo-text">CyberRakshak</span>
        </button>

        <button
          className="hamburger"
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          <span /><span /><span />
        </button>

        <div className={`nav-menu ${isOpen ? "active" : ""}`}>
          <div className="nav-primary">
            {primaryLinks.map(([path, label]) => (
              <button key={path} type="button" className={`nav-link ${isActive(path) ? "active" : ""}`} onClick={() => handleNavClick(path)}>
                {label}
              </button>
            ))}

            <div className="more-menu" ref={menuRef}>
              <button type="button" className={`nav-link more-trigger ${moreActive ? "active" : ""}`} onClick={() => setIsMoreOpen((open) => !open)} aria-expanded={isMoreOpen}>
                More <span aria-hidden="true">⌄</span>
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

          <div className="nav-account">
            {isLoggedIn ? (
              <div className="user-menu">
                <span className="user-name">Hi, {userName || "User"}</span>
                <button type="button" className="nav-link logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <div className="auth-buttons">
                <button type="button" className="nav-link login-link" onClick={() => handleNavClick("/login")}>Login</button>
                <button type="button" className="register-link" onClick={() => handleNavClick("/register")}>Register</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
