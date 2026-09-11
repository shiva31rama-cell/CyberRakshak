import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import "./EmergencyHelp.css";

const emergencyContacts = [
  {
    key: "cyber",
    title: "Cyber Crime Helpline",
    number: "1930",
    href: "tel:1930",
    description: "For cyber financial fraud and cyber-crime reporting assistance.",
    icon: "🛡️",
    primary: true,
  },
  {
    key: "police",
    title: "Emergency Services",
    number: "112",
    href: "tel:112",
    description: "Unified emergency response number for urgent situations in India.",
    icon: "🚨",
    primary: true,
  },
  {
    key: "women",
    title: "Women Helpline",
    number: "181",
    href: "tel:181",
    description: "National women helpline listed by the Government of India.",
    icon: "🤝",
  },
  {
    key: "ambulance",
    title: "Ambulance / Medical",
    number: "102",
    href: "tel:102",
    description: "National ambulance service.",
    icon: "🏥",
  },
  {
    key: "fire",
    title: "Fire Emergency",
    number: "101",
    href: "tel:101",
    description: "Fire and rescue emergency line.",
    icon: "🚒",
  },
];

function EmergencyHelp() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const quickActions = [
    {
      title: t("report"),
      description: "Record what happened and review the official reporting path.",
      icon: "📝",
      action: () => navigate("/report-scam"),
    },
    {
      title: "National Cyber Crime Portal",
      description: "Open the official Government of India cyber-crime reporting portal.",
      icon: "🇮🇳",
      href: "https://cybercrime.gov.in/",
    },
    {
      title: "Payment Safety",
      description: "Review what to do when a payment, UPI or account is at risk.",
      icon: "💳",
      action: () => navigate("/upi-safety"),
    },
    {
      title: t("learn"),
      description: "Learn how to recognise common scams before they cause harm.",
      icon: "📚",
      action: () => navigate("/learn"),
    },
  ];

  const stepsTake = [
    ["1", "Pause", "Stop replying, paying or following instructions until the claim is verified."],
    ["2", "Protect accounts", "Change affected passwords and secure important accounts from a trusted device."],
    ["3", "Contact your bank", "For a financial incident, use your bank's official app, website or verified support number."],
    ["4", "Report quickly", "For financial cyber fraud, call 1930 and use the official cybercrime portal as appropriate."],
    ["5", "Keep evidence", "Save messages, transaction references, phone numbers, URLs and timestamps needed for a complaint."],
    ["6", "Monitor", "Watch the affected account, SIM and payment activity for further suspicious changes."],
  ];

  return (
    <div className="emergency-container">
      <section className="emergency-header">
        <div className="emergency-header-icon" aria-hidden="true">🆘</div>
        <div>
          <span className="emergency-kicker">CYBERRAKSHAK • {t("emergency")}</span>
          <h1>{t("needHelp")}</h1>
          <p>Use the actions below to reach the right official channel without hunting through the internet.</p>
        </div>
      </section>

      <div className="emergency-content">
        <section className="emergency-priority" aria-label="Priority help">
          <div>
            <span className="emergency-kicker">START HERE</span>
            <h2>Need immediate help?</h2>
            <p>For cyber financial fraud, contact 1930 as soon as possible. For an immediate emergency, use 112.</p>
          </div>
          <div className="priority-actions">
            <a className="priority-button primary" href="tel:1930"><span>📞</span><span><strong>1930</strong><small>{t("callNow")}</small></span></a>
            <a className="priority-button secondary" href="tel:112"><span>🚨</span><span><strong>112</strong><small>{t("callNow")}</small></span></a>
          </div>
        </section>

        <section className="quick-actions-section">
          <div className="section-heading">
            <span className="emergency-kicker">QUICK ACTIONS</span>
            <h2>Take the right next step</h2>
          </div>
          <div className="quick-actions-grid">
            {quickActions.map((item) => item.href ? (
              <a key={item.title} className="quick-action-card" href={item.href} target="_blank" rel="noopener noreferrer">
                <span className="action-icon" aria-hidden="true">{item.icon}</span>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
                <span className="action-link">Open official site →</span>
              </a>
            ) : (
              <button key={item.title} type="button" className="quick-action-card" onClick={item.action}>
                <span className="action-icon" aria-hidden="true">{item.icon}</span>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
                <span className="action-link">Continue →</span>
              </button>
            ))}
          </div>
        </section>

        <section className="emergency-contacts-section">
          <div className="section-heading">
            <span className="emergency-kicker">{t("emergencyContacts")}</span>
            <h2>Tap a number to call</h2>
            <p>Phone actions use the device dialer on supported phones. On desktop, your operating system or calling app may handle the action.</p>
          </div>
          <div className="contacts-grid">
            {emergencyContacts.map((contact) => (
              <article key={contact.key} className={`contact-card ${contact.primary ? "primary-contact" : ""}`}>
                <div className="contact-top"><span className="contact-icon" aria-hidden="true">{contact.icon}</span>{contact.primary ? <span className="priority-pill">Priority</span> : null}</div>
                <h3>{contact.title}</h3>
                <p className="contact-desc">{contact.description}</p>
                <a className="contact-call" href={contact.href}><span>{contact.number}</span><span>↗</span></a>
              </article>
            ))}
          </div>
        </section>

        <section className="steps-section">
          <div className="section-heading">
            <span className="emergency-kicker">WHEN SOMETHING HAPPENED</span>
            <h2>What to do next</h2>
          </div>
          <div className="steps-grid">
            {stepsTake.map(([number, title, description]) => (
              <article key={number} className="step-card">
                <span className="step-number">{number}</span>
                <div><h3>{title}</h3><p>{description}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="official-box">
          <div>
            <span className="emergency-kicker">OFFICIAL SOURCES</span>
            <h2>Use trusted government channels</h2>
            <p>CyberRakshak guides you, but official agencies handle complaints and emergency response.</p>
          </div>
          <div className="official-links">
            <a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer">🇮🇳 National Cyber Crime Reporting Portal</a>
            <a href="https://www.cert-in.org.in/" target="_blank" rel="noopener noreferrer">🛡️ CERT-In</a>
            <a href="https://www.sancharsaathi.gov.in/" target="_blank" rel="noopener noreferrer">📱 Sanchar Saathi</a>
          </div>
        </section>

        <section className="safety-note">
          <strong>🔐 CyberRakshak rule:</strong> We will never ask you to paste a password, OTP, UPI PIN, CVV, recovery code or authentication token into the app for safety guidance.
        </section>
      </div>

      <button className="back-home-btn" type="button" onClick={() => navigate("/")}>← {t("home")}</button>
    </div>
  );
}

export default EmergencyHelp;
