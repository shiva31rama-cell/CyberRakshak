import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import "./SafetyHome.css";

function SafetyHome() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState("message");
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const checks = [
    { id: "message", icon: "✦", label: t.home.checks.message, hint: t.home.checks.messageHint },
    { id: "link", icon: "↗", label: t.home.checks.link, hint: t.home.checks.linkHint },
    { id: "upi", icon: "₹", label: t.home.checks.upi, hint: t.home.checks.upiHint },
    { id: "phone", icon: "☎", label: t.home.checks.phone, hint: t.home.checks.phoneHint },
    { id: "qr", icon: "▦", label: t.home.checks.qr, hint: t.home.checks.qrHint },
    { id: "incident", icon: "!", label: t.home.checks.incident, hint: t.home.checks.incidentHint },
  ];

  const submit = (event) => {
    event.preventDefault();
    if (selected === "incident") return navigate("/incidents");
    navigate("/check", { state: { inputType: selected, text: value } });
  };

  return (
    <div className="safety-home">
      <section className="safety-hero">
        <div className="safety-hero-copy">
          <span className="eyebrow">{t.home.eyebrow}</span>
          <h1>{t.home.title1}<br />{t.home.title2}<br /><span>{t.home.title3}</span></h1>
          <p className="hero-lead">{t.home.lead}</p>
          <div className="hero-pills" aria-label="Product principles">{t.home.principles.map((item) => <span key={item}>{item}</span>)}</div>
        </div>

        <div className="safety-check-panel">
          <div className="panel-kicker">{t.home.checkNow}</div>
          <div className="check-grid">
            {checks.map((item) => <button type="button" key={item.id} className={`check-choice ${selected === item.id ? "is-active" : ""}`} onClick={() => setSelected(item.id)}><span className="choice-icon">{item.icon}</span><span><strong>{item.label}</strong><small>{item.hint}</small></span></button>)}
          </div>
          {selected !== "incident" ? (
            <form onSubmit={submit} className="check-form">
              <label htmlFor="quick-check">{t.home.pasteLabel}</label>
              <textarea id="quick-check" value={value} onChange={(event) => setValue(event.target.value)} placeholder={t.home.placeholder} maxLength={12000} />
              <button className="primary-action" type="submit">{t.home.checkSafely} <span>→</span></button>
            </form>
          ) : (
            <div className="incident-callout"><div><strong>{t.home.alreadyTitle}</strong><p>{t.home.alreadyText}</p></div><Link className="primary-action" to="/incidents">{t.home.openIncident} <span>→</span></Link></div>
          )}
        </div>
      </section>

      <section className="trust-strip" aria-label="Safety capabilities">
        <div><strong>DETECT</strong><span>{t.home.detect}</span></div>
        <div><strong>UNDERSTAND</strong><span>{t.home.understand}</span></div>
        <div><strong>ACT</strong><span>{t.home.act}</span></div>
      </section>

      <section className="home-section">
        <div className="section-heading"><div><span className="eyebrow">LIVE SAFETY INTELLIGENCE</span><h2>{t.home.whatChanging}</h2></div><Link to="/threats">{t.home.explore}</Link></div>
        <div className="threat-preview">
          <article><span className="severity high">HIGH</span><h3>Malicious attachments can arrive from familiar accounts</h3><p>Trust the conversation less than the evidence. Unexpected files deserve a pause even when the sender looks known.</p><small>CERT-In • India • verified source</small></article>
          <article><span className="severity caution">CAUTION</span><h3>Pressure is becoming the attack surface</h3><p>Urgency, fear, authority and “do this now” language are common scam signals across payments and account alerts.</p><small>CyberRakshak local detection model</small></article>
        </div>
      </section>

      <section className="home-section learn-banner"><div><span className="eyebrow">{t.home.learnEyebrow}</span><h2>{t.home.learnTitle}</h2><p>{t.home.learnText}</p></div><Link className="secondary-action" to="/learn">{t.home.learningHub}</Link></section>
    </div>
  );
}

export default SafetyHome;
