import { useNavigate } from "react-router-dom";
import "./DigitalLiteracy.css";

function DigitalLiteracy() {
  const navigate = useNavigate();

  return (
    <div className="digital-page">

      <button
        className="back-btn"
        onClick={() => navigate("/learn")}
      >
        ← Back to Learning Center
      </button>

      <div className="digital-header">
        <h1>📱 Digital Literacy</h1>
        <p>Build essential digital skills for safe online usage.</p>
      </div>

      <div className="lesson-container">

        <div className="lesson-card">
          <h2>📱 Smartphone Basics</h2>
          <p>
            Learn how smartphones work, settings,
            storage, apps, and updates.
          </p>
        </div>

        <div className="lesson-card">
          <h2>🌐 Internet Basics</h2>
          <p>
            Understand websites, browsers,
            Wi-Fi, and mobile data.
          </p>
        </div>

        <div className="lesson-card">
          <h2>📧 Email Usage</h2>
          <p>
            Learn how to create, send,
            receive, and manage emails.
          </p>
        </div>

        <div className="lesson-card">
          <h2>🔎 Google Search</h2>
          <p>
            Learn effective searching,
            information verification,
            and online research.
          </p>
        </div>

        <div className="lesson-card">
          <h2>☁ Cloud Storage</h2>
          <p>
            Understand Google Drive,
            OneDrive, and secure backups.
          </p>
        </div>

        <div className="lesson-card">
          <h2>💻 Digital Services</h2>
          <p>
            Learn how to access online
            government and banking services.
          </p>
        </div>

      </div>

      <button
        className="quiz-btn"
      >
        Start Quiz
      </button>

    </div>
  );
}

export default DigitalLiteracy;