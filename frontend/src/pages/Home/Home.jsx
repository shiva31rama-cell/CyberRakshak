import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const coreActions = [
    { icon: "🔍", title: t("checkSomething"), text: "Analyze a suspicious message or link before you act.", path: "/check", label: t("openChecker") },
    { icon: "🆘", title: t("needHelp"), text: "See the safest next steps when money, accounts or identity may be at risk.", path: "/emergency-help", label: t("getHelp") },
    { icon: "🎓", title: t("learnAction"), text: "Build practical cyber-safety habits through short lessons.", path: "/learn", label: t("startLearning") },
    { icon: "⚠️", title: t("reportAction"), text: "Record an incident and understand the official reporting path.", path: "/report-scam", label: t("reportLabel") },
  ];

  const checkModes = [
    ["💬", "Messages", "SMS, WhatsApp, email and social-media text"],
    ["🔗", "Links", "URL structure and suspicious link signals"],
    ["💳", "Payments", "UPI and payment-request warning patterns"],
    ["📱", "Telecom", "SIM-swap, eSIM and telecom scam awareness"],
  ];

  const roadmap = ["Screenshot / OCR", "Voice & call analysis", "Deepfake awareness", "Live threat intelligence", "Custom ML", "Realtime alerts", "Flutter app", "School safety"];

  return (
    <div className="home simple-home">
      <section className="home-hero">
        <div className="home-hero-copy">
          <span className="home-kicker">🛡️ CYBERRAKSHAK</span>
          <h1>{t("homeTitle")}</h1>
          <p className="home-lead">{t("homeLead")}</p>
          <div className="home-actions">
            <button className="home-primary" type="button" onClick={() => navigate("/check")}>🔍 {t("checkSomething")}</button>
            <button className="home-secondary" type="button" onClick={() => navigate("/emergency-help")}>🆘 {t("needHelp")}</button>
          </div>
          <p className="home-safety-note">{t("noSecrets")}</p>
        </div>
        <div className="home-hero-card" aria-label="CyberRakshak safety journey">
          <span>THE SIMPLE JOURNEY</span>
          <strong>Check → Understand → Act → Report → Learn</strong>
          <small>One step at a time. No crowded dashboard.</small>
        </div>
      </section>

      <section className="home-section home-start" aria-labelledby="start-title">
        <div className="home-heading"><span className="home-kicker">{t("startHere")}</span><h2 id="start-title">{t("chooseNeed")}</h2><p>{t("startHereDescription")}</p></div>
        <div className="home-action-grid">
          {coreActions.map((item) => (
            <article className="home-action-card" key={item.title}>
              <div className="home-card-icon" aria-hidden="true">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <button type="button" onClick={() => navigate(item.path)}>{item.label} →</button>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="checks-title">
        <div className="home-heading"><span className="home-kicker">{t("whatWeHandle")}</span><h2 id="checks-title">{t("realSituations")}</h2><p>Start with a focused check and see the reasons behind the warning.</p></div>
        <div className="home-topic-grid">
          {checkModes.map(([icon, title, text]) => (
            <button className="home-topic" type="button" key={title} onClick={() => navigate("/check")}>
              <span aria-hidden="true">{icon}</span><strong>{title}</strong><small>{text}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="home-section home-difference" aria-labelledby="difference-title">
        <div className="home-heading"><span className="home-kicker">{t("whyApproach")}</span><h2 id="difference-title">{t("advancedSimple")}</h2></div>
        <div className="difference-list">
          <div><b>1</b><span><strong>Explainable</strong> — show the warning signs and uncertainty instead of only giving a score.</span></div>
          <div><b>2</b><span><strong>India-ready</strong> — UPI, telecom, KYC, fake jobs, impersonation and digital-arrest patterns are first-class scenarios.</span></div>
          <div><b>3</b><span><strong>Privacy-aware</strong> — avoid asking users for secrets that are unnecessary for analysis.</span></div>
          <div><b>4</b><span><strong>Action-oriented</strong> — connect detection to safer next steps, reporting guidance and learning.</span></div>
        </div>
      </section>

      <section className="home-section home-roadmap" aria-labelledby="roadmap-title">
        <div className="home-heading"><span className="home-kicker">{t("roadmap")}</span><h2 id="roadmap-title">{t("whatNext")}</h2><p>Planned capabilities are clearly labelled until they pass implementation and production checks.</p></div>
        <div className="roadmap-list">{roadmap.map((item) => <span key={item}>◌ {item}</span>)}</div>
      </section>

      <section className="home-final">
        <h2>{t("startHere")}</h2>
        <p>{t("noSecrets")}</p>
        <div className="home-final-actions"><button type="button" onClick={() => navigate("/check")}>{t("openSafetyChecker")}</button><button type="button" onClick={() => navigate("/learn")}>{t("exploreLearning")}</button></div>
      </section>
    </div>
  );
}

export default Home;
