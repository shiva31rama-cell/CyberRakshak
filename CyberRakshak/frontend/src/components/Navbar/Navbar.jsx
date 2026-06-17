import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setIsLoggedIn(true);
      const userData = JSON.parse(user);
      setUserName(userData.name);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName("");
    setIsOpen(false);
    navigate("/");
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => handleNavClick("/")}>
          <span className="logo-icon">🛡️</span>
          <span className="logo-text">CyberRakshak</span>
        </div>

        <div className={`nav-menu ${isOpen ? "active" : ""}`}>
          <button
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            onClick={() => handleNavClick("/")}
          >
            Home
          </button>

          <button
            className={`nav-link ${
              location.pathname === "/learn" ? "active" : ""
            }`}
            onClick={() => handleNavClick("/learn")}
          >
            Learn
          </button>

          <button
            className={`nav-link ${
              location.pathname === "/digital-literacy-quiz" ? "active" : ""
            }`}
            onClick={() => handleNavClick("/digital-literacy-quiz")}
          >
            Quiz
          </button>

          <button
            className={`nav-link ${
              location.pathname === "/emergency-help" ? "active" : ""
            }`}
            onClick={() => handleNavClick("/emergency-help")}
          >
            Emergency
          </button>

          <button
            className={`nav-link ${
              location.pathname === "/report-scam" ? "active" : ""
            }`}
            onClick={() => handleNavClick("/report-scam")}
          >
            Report Scam
          </button>

          <button
            className={`nav-link ${
              location.pathname === "/feedback" ? "active" : ""
            }`}
            onClick={() => handleNavClick("/feedback")}
          >
            Feedback
          </button>

          {isLoggedIn ? (
            <div className="user-menu">
              <span className="user-name">Hi, {userName}!</span>
              <button className="nav-link logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button
                className="nav-link login-link"
                onClick={() => handleNavClick("/login")}
              >
                Login
              </button>
              <button
                className="nav-link register-link"
                onClick={() => handleNavClick("/register")}
              >
                Register
              </button>
            </div>
          )}
        </div>

        <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
