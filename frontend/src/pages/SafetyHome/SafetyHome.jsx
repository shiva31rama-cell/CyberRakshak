import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SafetyHome.css";

const checks = [
  { id: "message", icon: "✦", label: "Message", hint: "Paste SMS, WhatsApp, email or DM text" },
  { id: "link", icon: "↗", label: "Link", hint: "Check a suspicious URL before opening it" },
  { id: "upi", icon: "₹", label: "UPI / payment", hint: "Review a UPI ID or payment request" },
  { id: "phone", icon: "☎", label: "Phone", hint: "Check an unfamiliar Indian number" },
  { id: "qr", icon: "▦", label: "QR / screenshot", hint: "Use import/share on your device" },
  { id: "incident", icon: "!", label: "I already acted", hint: "Get the next safest steps" },
];

function SafetyHome() {
  const [selected, setSelected] = useState("message");
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const submit = (event) => {
    event.preventDefault();
    if (selected === "incident") {
      navigate("/incidents");
      return;
    }
    navigate("/check", { state: { inputType: selected, text: value } });
  };

  return (
    <div className="safety-home">
      <section className="safety-hero">
        <div className="safety-hero-copy">
          <span className="eyebrow">CYBERRAKSHAK 2.0</span>
          <h1>Before you click.<br />Before you pay.<br /><span>Before you trust.</span></h1>
          <p className="hero-lead">
            A privacy-first digital safety layer for messages, links, payments, notifications and the moments when something suddenly feels wrong.
          </p>
          <div className="hero-pills" aria-label="Product principles">
            <span>Local-first</span>
            <span>India-ready</span>
            <span>Evidence-led</span>
          </div>
        </div>

        <div className="safety-check-panel">
          <div className="panel-kicker">CHECK SOMETHING NOW</div>
          <div className="check-grid">
            {checks.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`check-choice ${selected === item.id ? "is-active" : ""}`}
                onClick={() => setSelected(item.id)}
              >
                <span className="choice-icon">{item.icon}</span>
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.hint}</small>
                </span>
              </button>
            ))}
          </div>

          {selected !== "incident" ? (
            <form onSubmit={submit} className="check-form">
              <label htmlFor="quick-check">Paste the thing that feels suspicious</label>
              <textarea
                id="quick-check"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="Example: ‘Your account will be blocked. Send OTP immediately…’"
                maxLength={12000}
              />
              <button className="primary-action" type="submit">
                Check safely <span>→</span>
              </button>
            </form>
          ) : (
            <div className="incident-callout">
              <div>
                <strong>Already clicked, paid, shared something or installed an app?</strong>
                <p>Start Incident Mode. It gives you a calm, ordered recovery path instead of making you guess what to do next.</p>
              </div>
              <Link className="primary-action" to="/incidents">Open Incident Mode <span>→</span></Link>
            </div>
          )}
        </div>
      </section>

      <section className="trust-strip" aria-label="Safety capabilities">
        <div><strong>DETECT</strong><span>Signals across messages, links, identifiers and notifications</span></div>
        <div><strong>UNDERSTAND</strong><span>Plain-language reasons instead of scary black-box scores</span></div>
        <div><strong>ACT</strong><span>Clear next steps with verified official resources</span></div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">LIVE SAFETY INTELLIGENCE</span>
            <h2>What’s changing around you?</h2>
          </div>
          <Link to="/threats">Explore Threat Radar →</Link>
        </div>
        <div className="threat-preview">
          <article>
            <span className="severity high">HIGH</span>
            <h3>Malicious attachments can arrive from familiar accounts</h3>
            <p>Trust the conversation less than the evidence. Unexpected files deserve a pause even when the sender looks known.</p>
            <small>CERT-In • India • verified source</small>
          </article>
          <article>
            <span className="severity caution">CAUTION</span>
            <h3>Pressure is becoming the attack surface</h3>
            <p>Urgency, fear, authority and “do this now” language are common scam signals across payments and account alerts.</p>
            <small>CyberRakshak local detection model</small>
          </article>
        </div>
      </section>

      <section className="home-section learn-banner">
        <div>
          <span className="eyebrow">LEARN WITHOUT THE LECTURE</span>
          <h2>One real scenario at a time.</h2>
          <p>Short, visual lessons built around what people actually see: fake KYC notices, payment requests, job offers, deepfake pressure and suspicious app prompts.</p>
        </div>
        <Link className="secondary-action" to="/learn">Open Learning Hub →</Link>
      </section>
    </div>
  );
}

export default SafetyHome;
