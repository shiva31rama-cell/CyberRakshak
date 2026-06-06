import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {

  const navigate = useNavigate();

  return (
    <div className="register-page">

      <div className="register-header">
        <h1>CyberRakshak</h1>
        <p>Create Your Account</p>
      </div>

      <div className="register-card">

        <input
          type="text"
          placeholder="Full Name"
        />

        <input
          type="tel"
          placeholder="Mobile Number"
        />

        <input
          type="email"
          placeholder="Email Address"
        />

        <input
          type="password"
          placeholder="Password"
        />

        <button className="register-btn">
          Register
        </button>

        <p className="login-text">
          Already have an account?
          <span
            className="login-link"
            onClick={() => navigate("/login")}
          >
            {" "}Login
          </span>
        </p>

        <div className="secure-box">
          🔒 Your data is completely secure
        </div>

      </div>

    </div>
  );
}

export default Register;