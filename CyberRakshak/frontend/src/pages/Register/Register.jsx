import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.password) {
        setError("All fields are required");
        setIsLoading(false);
        return;
      }

      // Name validation
      if (formData.name.length < 3) {
        setError("Name must be at least 3 characters");
        setIsLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address");
        setIsLoading(false);
        return;
      }

      // Password validation
      if (!validatePassword(formData.password)) {
        setError(
          "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
        );
        setIsLoading(false);
        return;
      }

      // Confirm password
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      // Terms agreement
      if (!formData.agreeTerms) {
        setError("You must agree to the terms and conditions");
        setIsLoading(false);
        return;
      }

      // Mock API call - Replace with actual API endpoint
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     name: formData.name,
      //     email: formData.email,
      //     password: formData.password
      //   })
      // });
      // const data = await response.json();
      // if (data.token) {
      //   localStorage.setItem('token', data.token);
      //   localStorage.setItem('user', JSON.stringify(data.user));
      //   navigate('/');
      // }

      // Mock success for demo
      localStorage.setItem("token", "mock_token_" + Math.random().toString(36));
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      );

      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    if (!formData.password) return 0;
    let strength = 0;

    if (formData.password.length >= 8) strength++;
    if (/[a-z]/.test(formData.password)) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/\d/.test(formData.password)) strength++;
    if (/[@$!%*?&]/.test(formData.password)) strength++;

    return strength;
  };

  const getPasswordStrengthLabel = () => {
    const strength = passwordStrength();
    if (strength < 2) return "Weak";
    if (strength < 4) return "Fair";
    return "Strong";
  };

  const getPasswordStrengthColor = () => {
    const strength = passwordStrength();
    if (strength < 2) return "#f44336";
    if (strength < 4) return "#f57c00";
    return "#4caf50";
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">
          <h1>📝 Create Account</h1>
          <p>Join CyberRakshak to start learning cyber security</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter a strong password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <div className="password-requirements">
              <p className="requirement-title">Password Requirements:</p>
              <ul>
                <li
                  className={formData.password.length >= 8 ? "met" : "not-met"}
                >
                  At least 8 characters
                </li>
                <li
                  className={
                    /[a-z]/.test(formData.password) ? "met" : "not-met"
                  }
                >
                  One lowercase letter
                </li>
                <li
                  className={
                    /[A-Z]/.test(formData.password) ? "met" : "not-met"
                  }
                >
                  One uppercase letter
                </li>
                <li
                  className={/\d/.test(formData.password) ? "met" : "not-met"}
                >
                  One number
                </li>
                <li
                  className={
                    /[@$!%*?&]/.test(formData.password) ? "met" : "not-met"
                  }
                >
                  One special character (@$!%*?&)
                </li>
              </ul>
              <div className="strength-bar">
                <div
                  className="strength-fill"
                  style={{
                    width: `${(passwordStrength() / 5) * 100}%`,
                    backgroundColor: getPasswordStrengthColor(),
                  }}
                ></div>
              </div>
              <p className="strength-label">
                Strength:{" "}
                <span style={{ color: getPasswordStrengthColor() }}>
                  {getPasswordStrengthLabel()}
                </span>
              </p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
            />
            <label htmlFor="agreeTerms">
              I agree to the{" "}
              <a href="#terms" className="terms-link">
                Terms and Conditions
              </a>
            </label>
          </div>

          <button type="submit" className="register-btn" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="login-link">
              Login here
            </Link>
          </p>
          <Link to="/" className="back-home-link">
            ← Back to Home
          </Link>
        </div>
      </div>

      <div className="register-benefits">
        <h2>Why Join CyberRakshak?</h2>

        <div className="benefits-grid">
          <div className="benefit-card">
            <span className="benefit-icon">📚</span>
            <h3>Comprehensive Learning</h3>
            <p>Access free cyber security education on various topics</p>
          </div>

          <div className="benefit-card">
            <span className="benefit-icon">📊</span>
            <h3>Track Progress</h3>
            <p>Monitor your learning journey with detailed progress reports</p>
          </div>

          <div className="benefit-card">
            <span className="benefit-icon">🎯</span>
            <h3>Interactive Quizzes</h3>
            <p>Test your knowledge with engaging quizzes and assessments</p>
          </div>

          <div className="benefit-card">
            <span className="benefit-icon">🆘</span>
            <h3>Emergency Support</h3>
            <p>Get immediate help and resources in cyber emergencies</p>
          </div>

          <div className="benefit-card">
            <span className="benefit-icon">💬</span>
            <h3>AI Chatbot</h3>
            <p>Chat with our AI assistant for quick answers anytime</p>
          </div>

          <div className="benefit-card">
            <span className="benefit-icon">🛡️</span>
            <h3>Secure Platform</h3>
            <p>Your data is protected with industry-leading security</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
