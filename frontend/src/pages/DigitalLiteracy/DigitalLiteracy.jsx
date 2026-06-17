import { useNavigate } from "react-router-dom";
import "./DigitalLiteracy.css";

function DigitalLiteracy() {
  const navigate = useNavigate();

  const lessons = [
    {
      id: 1,
      icon: "📱",
      title: "Smartphone Basics",
      description:
        "Learn how smartphones work, settings, storage, apps, and updates.",
      keyPoints: [
        "Operating systems (Android, iOS)",
        "App installation and permissions",
        "Device settings and privacy controls",
        "Storage management",
        "Software updates and security patches",
      ],
    },
    {
      id: 2,
      icon: "🌐",
      title: "Internet & Browsers",
      description:
        "Understand how the internet works and browse safely online.",
      keyPoints: [
        "What is the internet and how it works",
        "Web browsers and search engines",
        "URLs and website addresses",
        "Cookies and browser history",
        "Safe browsing practices",
      ],
    },
    {
      id: 3,
      icon: "👤",
      title: "User Accounts & Profiles",
      description: "Manage your accounts securely across different platforms.",
      keyPoints: [
        "Creating secure accounts",
        "Username and password basics",
        "Email verification",
        "Account recovery options",
        "Managing multiple accounts",
      ],
    },
    {
      id: 4,
      icon: "🔒",
      title: "Security Basics",
      description: "Learn fundamental security concepts to protect yourself.",
      keyPoints: [
        "What is cybersecurity",
        "Common threats and risks",
        "Antivirus and anti-malware",
        "Firewall protection",
        "Backup and recovery",
      ],
    },
    {
      id: 5,
      icon: "💬",
      title: "Communication Tools",
      description: "Use messaging, email, and video calls securely.",
      keyPoints: [
        "Email basics and etiquette",
        "Instant messaging apps",
        "Video calling safety",
        "Group chats and communities",
        "Avoiding communication scams",
      ],
    },
  ];

  const tips = [
    {
      title: "Keep Software Updated",
      description:
        "Always update your apps and operating system to get security patches",
      icon: "⚙️",
    },
    {
      title: "Use Strong Passwords",
      description:
        "Create unique passwords with uppercase, numbers, and special characters",
      icon: "🔐",
    },
    {
      title: "Enable Two-Factor Authentication",
      description: "Add an extra layer of security to your important accounts",
      icon: "🔑",
    },
    {
      title: "Verify Links Before Clicking",
      description: "Hover over links to see where they lead before clicking",
      icon: "🔍",
    },
    {
      title: "Be Cautious of Unknown Sources",
      description: "Don't download from untrusted websites or unknown senders",
      icon: "⚠️",
    },
    {
      title: "Back Up Your Data",
      description:
        "Regularly backup important files to cloud storage or external devices",
      icon: "💾",
    },
  ];

  const commonMistakes = [
    {
      mistake: "Using the same password everywhere",
      solution: "Create unique passwords for each account",
    },
    {
      mistake: "Opening suspicious email attachments",
      solution: "Verify sender identity before opening attachments",
    },
    {
      mistake: "Using public Wi-Fi without VPN",
      solution: "Use a VPN or avoid sensitive transactions on public Wi-Fi",
    },
    {
      mistake: "Sharing personal information online",
      solution: "Be selective about what information you share",
    },
    {
      mistake: "Not logging out from shared devices",
      solution: "Always logout especially on public computers",
    },
    {
      mistake: "Ignoring software update notifications",
      solution: "Install updates promptly for security improvements",
    },
  ];

  return (
    <div className="digital-container">
      <button className="back-button" onClick={() => navigate("/learn")}>
        ← Back to Learning Center
      </button>

      {/* Header */}
      <div className="digital-header">
        <h1>📱 Digital Literacy Fundamentals</h1>
        <p>
          Build essential digital skills for safe and effective online usage
        </p>
      </div>

      {/* Lessons Section */}
      <section className="lessons-section">
        <h2>📚 Core Lessons</h2>

        <div className="lessons-grid">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="lesson-card">
              <div className="lesson-icon">{lesson.icon}</div>
              <h3>{lesson.title}</h3>
              <p className="lesson-description">{lesson.description}</p>

              <div className="key-points">
                <p className="key-points-title">Key Topics:</p>
                <ul>
                  {lesson.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tips Section */}
      <section className="tips-section">
        <h2>💡 Essential Tips</h2>
        <p className="section-subtitle">
          Follow these tips to stay safe while using digital devices
        </p>

        <div className="tips-grid">
          {tips.map((tip, index) => (
            <div key={index} className="tip-card">
              <span className="tip-icon">{tip.icon}</span>
              <h3>{tip.title}</h3>
              <p>{tip.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Common Mistakes Section */}
      <section className="mistakes-section">
        <h2>❌ Common Mistakes to Avoid</h2>
        <p className="section-subtitle">
          Learn from common digital literacy mistakes
        </p>

        <div className="mistakes-grid">
          {commonMistakes.map((item, index) => (
            <div key={index} className="mistake-card">
              <h4>❌ {item.mistake}</h4>
              <div className="mistake-divider"></div>
              <p className="solution">✅ {item.solution}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Action Section */}
      <section className="action-section">
        <h2>Ready to Test Your Knowledge?</h2>
        <p>
          Take the Digital Literacy Quiz to assess your understanding and see
          how much you've learned
        </p>

        <div className="action-buttons">
          <button
            className="btn-quiz"
            onClick={() => navigate("/digital-literacy-quiz")}
          >
            Take Quiz
          </button>
          <button
            className="btn-learn-more"
            onClick={() => navigate("/password-security")}
          >
            Next Module: Password Security
          </button>
        </div>
      </section>
    </div>
  );
}

export default DigitalLiteracy;
