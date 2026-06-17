import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "📚",
      title: "Learn Cyber Safety",
      description: "Comprehensive courses on cybersecurity topics",
      action: "/learn",
    },
    {
      icon: "🎯",
      title: "Take Quizzes",
      description: "Test your knowledge with interactive quizzes",
      action: "/digital-literacy-quiz",
    },
    {
      icon: "🆘",
      title: "Emergency Help",
      description: "Get immediate help and emergency contacts",
      action: "/emergency-help",
    },
    {
      icon: "⚠️",
      title: "Report a Scam",
      description: "Report scams and get a case number",
      action: "/report-scam",
    },
  ];

  const topicCards = [
    {
      icon: "💳",
      title: "UPI & Payment Security",
      description: "Learn how to protect your digital payments",
      link: "/upi-safety",
    },
    {
      icon: "🔐",
      title: "Password Security",
      description: "Create and manage strong passwords",
      link: "/password-security",
    },
    {
      icon: "💬",
      title: "Social Media Safety",
      description: "Stay safe on social media platforms",
      link: "/social-media-safety",
    },
    {
      icon: "🚨",
      title: "Cyber Crime Awareness",
      description: "Understand common cyber crimes",
      link: "/cyber-crime-awareness",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Learners" },
    { number: "50+", label: "Modules" },
    { number: "100%", label: "Free Access" },
    { number: "24/7", label: "AI Support" },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>🛡️ CyberRakshak</h1>
          <p className="hero-subtitle">Your Complete Guide to Cyber Security</p>
          <p className="hero-description">
            Learn how to protect yourself from cyber threats, scams, and online
            dangers. Free, comprehensive cyber security education for everyone.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate("/learn")}>
              Start Learning
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/emergency-help")}
            >
              Emergency Help
            </button>
          </div>
        </div>

        <div className="hero-image">
          <div className="shield-icon">🛡️</div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>📋 Main Features</h2>
        <p className="section-subtitle">
          Everything you need to stay cyber safe
        </p>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card"
              onClick={() => navigate(feature.action)}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <button className="feature-btn">Explore</button>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Topics Section */}
      <section className="topics">
        <h2>📖 Popular Learning Topics</h2>
        <p className="section-subtitle">
          Master essential cyber security skills
        </p>

        <div className="topics-grid">
          {topicCards.map((topic, index) => (
            <div
              key={index}
              className="topic-card"
              onClick={() => navigate(topic.link)}
            >
              <div className="topic-icon">{topic.icon}</div>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Section */}
      <section className="why">
        <h2>Why CyberRakshak?</h2>

        <div className="why-grid">
          <div className="why-card">
            <span className="why-icon">✅</span>
            <h3>Comprehensive Coverage</h3>
            <p>
              From basics to advanced topics, we cover everything about cyber
              security
            </p>
          </div>

          <div className="why-card">
            <span className="why-icon">✅</span>
            <h3>Free for Everyone</h3>
            <p>
              Access all our learning materials and resources completely free
            </p>
          </div>

          <div className="why-card">
            <span className="why-icon">✅</span>
            <h3>Interactive Learning</h3>
            <p>
              Engage with interactive quizzes, case studies, and real-world
              examples
            </p>
          </div>

          <div className="why-card">
            <span className="why-icon">✅</span>
            <h3>Expert Resources</h3>
            <p>
              Content reviewed by cyber security experts and government
              advisories
            </p>
          </div>

          <div className="why-card">
            <span className="why-icon">✅</span>
            <h3>24/7 Support</h3>
            <p>Get instant answers from our AI chatbot anytime, anywhere</p>
          </div>

          <div className="why-card">
            <span className="why-icon">✅</span>
            <h3>Emergency Help</h3>
            <p>
              Quick access to emergency contacts and resources in cyber
              incidents
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to Stay Cyber Safe?</h2>
        <p>
          Join thousands of learners protecting themselves from cyber threats
        </p>

        <div className="cta-buttons">
          <button className="btn-large" onClick={() => navigate("/learn")}>
            Start Learning Now
          </button>
          <button
            className="btn-large-outline"
            onClick={() => navigate("/feedback")}
          >
            Send Feedback
          </button>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="quick-links">
        <h3>Quick Links</h3>
        <div className="quick-links-grid">
          <button className="quick-link-btn" onClick={() => navigate("/learn")}>
            📚 Learn
          </button>
          <button
            className="quick-link-btn"
            onClick={() => navigate("/emergency-help")}
          >
            🆘 Emergency Help
          </button>
          <button
            className="quick-link-btn"
            onClick={() => navigate("/report-scam")}
          >
            ⚠️ Report Scam
          </button>
          <button
            className="quick-link-btn"
            onClick={() => navigate("/feedback")}
          >
            💬 Feedback
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
