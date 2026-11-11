import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../services/authService";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "", agreeTerms: false });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setError("");
  };

  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const passwordStrength = () => {
    let strength = 0;
    const password = formData.password;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    return strength;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { name, email, password, confirmPassword, agreeTerms } = formData;

    if (!name.trim() || !email.trim() || !password || !confirmPassword) return setError("All fields are required");
    if (name.trim().length < 3) return setError("Name must be at least 3 characters");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email address");
    if (!validatePassword(password)) return setError("Password must be at least 8 characters with uppercase, lowercase, number, and special character");
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (!agreeTerms) return setError("You must agree to the terms and conditions");

    setIsLoading(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password, confirmPassword);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const strength = passwordStrength();
  const strengthLabel = strength < 2 ? "Weak" : strength < 4 ? "Fair" : "Strong";
  const strengthColor = strength < 2 ? "#f44336" : strength < 4 ? "#f57c00" : "#4caf50";

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header"><h1>📝 Create Account</h1><p>Join CyberRakshak to start learning cyber security</p></div>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group"><label htmlFor="name">Full Name</label><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" autoComplete="name" required /></div>
          <div className="form-group"><label htmlFor="email">Email Address</label><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" autoComplete="email" required /></div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper"><input type={showPassword ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter a strong password" autoComplete="new-password" required /><button type="button" className="toggle-password" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "👁️" : "👁️‍🗨️"}</button></div>
            <div className="password-requirements"><p className="requirement-title">Password Requirements:</p><ul>
              <li className={formData.password.length >= 8 ? "met" : "not-met"}>At least 8 characters</li>
              <li className={/[a-z]/.test(formData.password) ? "met" : "not-met"}>One lowercase letter</li>
              <li className={/[A-Z]/.test(formData.password) ? "met" : "not-met"}>One uppercase letter</li>
              <li className={/\d/.test(formData.password) ? "met" : "not-met"}>One number</li>
              <li className={/[@$!%*?&]/.test(formData.password) ? "met" : "not-met"}>One special character (@$!%*?&)</li>
            </ul><div className="strength-bar"><div className="strength-fill" style={{ width: `${(strength / 5) * 100}%`, backgroundColor: strengthColor }} /></div><p className="strength-label">Strength: <span style={{ color: strengthColor }}>{strengthLabel}</span></p></div>
          </div>
          <div className="form-group"><label htmlFor="confirmPassword">Confirm Password</label><div className="password-input-wrapper"><input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter your password" autoComplete="new-password" required /><button type="button" className="toggle-password" onClick={() => setShowConfirmPassword((v) => !v)} aria-label={showConfirmPassword ? "Hide password" : "Show password"}>{showConfirmPassword ? "👁️" : "👁️‍🗨️"}</button></div></div>
          <div className="form-group checkbox"><input type="checkbox" id="agreeTerms" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} /><label htmlFor="agreeTerms">I agree to the <a href="#terms" className="terms-link">Terms and Conditions</a></label></div>
          <button type="submit" className="register-btn" disabled={isLoading}>{isLoading ? "Creating Account..." : "Create Account"}</button>
        </form>
        <div className="register-footer"><p>Already have an account? <Link to="/login" className="login-link">Login here</Link></p><Link to="/" className="back-home-link">← Back to Home</Link></div>
      </div>
      <div className="register-benefits"><h2>Why Join CyberRakshak?</h2><div className="benefits-grid">
        <div className="benefit-card"><span className="benefit-icon">📚</span><h3>Comprehensive Learning</h3><p>Access free cyber security education on various topics</p></div>
        <div className="benefit-card"><span className="benefit-icon">📊</span><h3>Track Progress</h3><p>Monitor your learning journey with detailed progress reports</p></div>
        <div className="benefit-card"><span className="benefit-icon">🎯</span><h3>Interactive Quizzes</h3><p>Test your knowledge with engaging quizzes and assessments</p></div>
        <div className="benefit-card"><span className="benefit-icon">🆘</span><h3>Emergency Support</h3><p>Get immediate help and resources in cyber emergencies</p></div>
        <div className="benefit-card"><span className="benefit-icon">💬</span><h3>AI Chatbot</h3><p>Chat with our AI assistant for quick answers anytime</p></div>
        <div className="benefit-card"><span className="benefit-icon">🛡️</span><h3>Secure Platform</h3><p>Your data is protected with industry-leading security</p></div>
      </div></div>
    </div>
  );
}

export default Register;
