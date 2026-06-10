import { useNavigate } from "react-router-dom";
import "./Learn.css";

function Learn() {
  const navigate = useNavigate();

  return (
    <div className="learn-page">
      <div className="learn-header">
        <h1>CyberRakshak Learning Center</h1>
        <p>Choose a module to start learning</p>
      </div>

      <div className="progress-section">
        <h3>Learning Progress</h3>
        <p>0 / 7 Modules Completed</p>

        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>

      <div className="modules-grid">
        <div
          className="module-card"
          onClick={() => navigate("/digital-literacy")}
        >
          <h2>📱 Digital Literacy</h2>
          <span className="difficulty beginner">🟢 Beginner</span>
          <p>
            Learn smartphone usage, internet basics, email,
            search engines, and digital tools.
          </p>

          <button className="quiz-btn">
            Start Learning
          </button>
        </div>

        <div className="module-card">
          <h2>💳 UPI & Banking Safety</h2>
          <span className="difficulty beginner">🟢 Beginner</span>

          <p>
            Stay safe while using UPI, mobile banking,
            QR codes, and online payments.
          </p>

          <button className="quiz-btn">
            Start Learning
          </button>
        </div>

        <div className="module-card">
          <h2>🎣 Cyber Crime Awareness</h2>
          <span className="difficulty intermediate">
            🟡 Intermediate
          </span>

          <p>
            Learn about phishing, fake calls,
            fake SMS, parcel scams, and lottery scams.
          </p>

          <button className="quiz-btn">
            Start Learning
          </button>
        </div>

        <div className="module-card">
          <h2>📱 Social Media Safety</h2>
          <span className="difficulty beginner">🟢 Beginner</span>

          <p>
            Protect yourself on WhatsApp,
            Instagram, Facebook, and YouTube.
          </p>

          <button className="quiz-btn">
            Start Learning
          </button>
        </div>

        <div className="module-card">
          <h2>🔑 Password Security</h2>
          <span className="difficulty beginner">🟢 Beginner</span>

          <p>
            Create strong passwords and
            secure your online accounts.
          </p>

          <button className="quiz-btn">
            Start Learning
          </button>
        </div>

        <div className="module-card">
          <h2>🚨 Emergency Response</h2>
          <span className="difficulty advanced">
            🔴 Advanced
          </span>

          <p>
            Learn how to call 1930,
            report cyber crime and protect money.
          </p>

          <button className="quiz-btn">
            Start Learning
          </button>
        </div>

        <div className="module-card">
          <h2>🤖 AI Assistant Learning</h2>
          <span className="difficulty intermediate">
            🟡 Intermediate
          </span>

          <p>
            Ask questions and receive
            personalized cyber safety guidance.
          </p>

          <button className="quiz-btn">
            Start Learning
          </button>
        </div>
      </div>
    </div>
  );
}

export default Learn;