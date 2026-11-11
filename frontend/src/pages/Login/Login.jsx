import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/authService";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email.trim().toLowerCase(), formData.password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>🔐 Login</h1>
          <p>Access your CyberRakshak account</p>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" value={formData.email}
              onChange={handleChange} placeholder="your@email.com" autoComplete="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input type={showPassword ? "text" : "password"} id="password" name="password"
                value={formData.password} onChange={handleChange} placeholder="Enter your password"
                autoComplete="current-password" required />
              <button type="button" className="toggle-password" onClick={() => setShowPassword((v) => !v)}
                title={showPassword ? "Hide password" : "Show password"} aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <Link to="/register" className="register-link">Register here</Link></p>
          <Link to="/" className="back-home-link">← Back to Home</Link>
        </div>
      </div>

      <div className="login-info">
        <div className="info-card"><h3>🛡️ Secure Login</h3><p>Your password is processed by the secure backend authentication service.</p></div>
        <div className="info-card"><h3>🚀 Quick Access</h3><p>Access CyberRakshak learning and safety features after signing in.</p></div>
        <div className="info-card"><h3>📊 Track Progress</h3><p>Keep track of your learning progress and quiz scores.</p></div>
      </div>
    </div>
  );
}

export default Login;
