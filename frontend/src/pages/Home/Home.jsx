import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const actions = [
    {
      icon: "🔎",
      title: t("checkSomething"),
      description: "Check a suspicious message, link or screenshot before you act.",
      action: "/check",
      tone: "primary",
    },
    {
      icon: "🆘",
      title: t("needHelp"),
      description: "Find the right emergency number and official reporting path.",
      action: "/emergency-help",
      tone: "urgent",
    },
    {
      icon: "📚",
      title: t("learnAction"),
      description: "Build practical habits with visual lessons and trusted resources.",
      action: "/learn",
      tone: "learning",
    },
    {
      icon: "⚠️",
      title: t("reportAction"),
      description: "Report a scam and follow the safest next steps without sharing secrets.",
      action: "/report-scam",
      tone: "report",
    },
  ];

  const topics = [
    { icon: "💳", title: t("upiSafety"), link: "/upi-safety" },
    { icon: "🔐", title: t("passwordSafety"), link: "/password-security" },
    { icon: "💬", title: t("socialSafety"), link: "/social-media-safety" },
    { icon: "🚨", title: t("cyberCrime"), link: "/cyber-crime-awareness" },
  ];

  return (
    <div className="home">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <span className="eyebrow">🛡️ CYBERRAKSHAK</span>
          <h1 id="home-title">{t("homeTitle")}</h1>
          <p className="home-lead">{t("homeLead")}</p>

          <div className="hero-actions">
            <button className="home-primary" onClick={() => navigate("/check")}>
              🔎 {t("openChecker")}
            </button>
            <button className="home-secondary" onClick={() => navigate("/emergency-help")}>
              🆘 {t("getHelp")}
            </button>
          </div>

          <p className="privacy-note">🔒 {t("noSecrets")}</p>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="shield-orbit">
            <span className="shield-mark">🛡️</span>
            <span className="orbit-dot orbit-dot-one">✓</span>
            <span className="orbit-dot orbit-dot-two">!</span>
            <span className="orbit-dot orbit-dot-three">🔎</span>
          </div>
        </div>
      </section>

      <section className="journey-section" aria-labelledby="journey-title">
        <div className="section-heading">
          <span className="eyebrow">{t("startHere")}</span>
          <h2 id="journey-title">{t("chooseNeed")}</h2>
          <p>{t("startHereDescription")}</p>
        </div>

        <div className="journey-grid">
          {actions.map((item) => (
            <button
              key={item.title}
              className={`journey-card journey-card-${item.tone}`}
              onClick={() => navigate(item.action)}
            >
              <span className="journey-icon">{item.icon}</span>
              <span className="journey-content">
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </span>
              <span className="journey-arrow" aria-hidden="true">→</span>
            </button>
          ))}
        </div>
      </section>

      <section className="safety-strip" aria-label="Cyber safety reminder">
        <div>
          <span className="eyebrow">{t("whyApproach")}</span>
          <strong>{t("advancedSimple")}</strong>
        </div>
        <div className="trust-points">
          <span>✓ {t("secure")}</span>
          <span>✓ {t("verified")}</span>
          <span>✓ {t("multiLanguage")}</span>
        </div>
      </section>

      <section className="topic-section" aria-labelledby="topics-title">
        <div className="section-heading section-heading-row">
          <div>
            <span className="eyebrow">{t("whatWeHandle")}</span>
            <h2 id="topics-title">{t("realSituations")}</h2>
          </div>
          <button className="text-link" onClick={() => navigate("/learn")}>
            {t("exploreLearning")} →
          </button>
        </div>

        <div className="topic-grid">
          {topics.map((topic) => (
            <button key={topic.link} className="topic-tile" onClick={() => navigate(topic.link)}>
              <span>{topic.icon}</span>
              <strong>{topic.title}</strong>
              <small>Learn the safer next step →</small>
            </button>
          ))}
        </div>
      </section>

      <section className="emergency-callout" aria-labelledby="emergency-callout-title">
        <div>
          <span className="eyebrow">{t("needHelpNow")}</span>
          <h2 id="emergency-callout-title">{t("emergencyCalloutTitle")}</h2>
          <p>For suspected cyber financial fraud in India, contact the official cybercrime helpline immediately.</p>
        </div>
        <div className="emergency-actions">
          <a href="tel:1930" className="emergency-call-button">📞 1930 · {t("callNow")}</a>
          <button className="emergency-link-button" onClick={() => navigate("/emergency-help")}>
            {t("openEmergency")} →
          </button>
        </div>
      </section>

      <section className="roadmap-section" aria-labelledby="roadmap-title">
        <span className="eyebrow">{t("roadmap")}</span>
        <h2 id="roadmap-title">{t("whatNext")}</h2>
        <p>
          The product is being expanded carefully: stronger multilingual coverage, richer visual learning,
          safer AI assistance, and more verification tools — without pretending unfinished capabilities are live.
        </p>
      </section>
    </div>
  );
}

export default Home;
