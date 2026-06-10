import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="header">
        <h1>CyberRakshak</h1>
        <p>Stay Safe Online</p>

        <div className="languages">
          <button>English</button>
          <button>తెలుగు</button>
          <button>हिन्दी</button>
          <button>தமிழ்</button>
        </div>
      </div>

      <div className="cards">
        <div
          className="card"
          onClick={() => navigate("/learn")}
        >
          <h3>📘 Learn Cyber Safety</h3>
        </div>

        <div className="card">
          <h3>🤖 AI Chatbot</h3>
        </div>

        <div className="card">
          <h3>🚨 Emergency Help</h3>
        </div>

        <div className="card">
          <h3>⚠️ Report Scam</h3>
        </div>
      </div>

      <div className="tip-card">
        <h3>Today's Safety Tip</h3>
        <p>Never share your OTP with anyone.</p>
      </div>

      <div className="auth-buttons">
        <button
          className="login-btn"
          onClick={() => navigate("/login")}
        >
          Login
        </button>

        <button
          className="register-btn"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default Home;