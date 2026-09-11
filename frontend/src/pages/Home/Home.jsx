import { useNavigate } from "react-router-dom";
import "./Home.css";

const coreActions = [
  { icon: "🔍", title: "Check Something", text: "Analyze a suspicious message or link before you act.", path: "/check", label: "Open checker" },
  { icon: "🆘", title: "I Need Help", text: "See the safest next steps when money, accounts or identity may be at risk.", path: "/emergency-help", label: "Get help" },
  { icon: "🎓", title: "Learn", text: "Build practical cyber-safety habits through short lessons.", path: "/learn", label: "Start learning" },
  { icon: "⚠️", title: "Report a Scam", text: "Record an incident and understand the official reporting path.", path: "/report-scam", label: "Report" }
];

const checkModes = [
  ["💬", "Messages", "SMS, WhatsApp, email and social-media text"],
  ["🔗", "Links", "URL structure and suspicious link signals"],
  ["💳", "Payments", "UPI and payment-request warning patterns"],
  ["📱", "Telecom", "SIM-swap, eSIM and telecom scam awareness"]
];

const roadmap = ["Screenshot / OCR", "Voice & call analysis", "Deepfake awareness", "Live threat intelligence", "Custom ML", "Realtime alerts", "Flutter app", "School safety"];

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home simple-home">
      <section className="home-hero">
        <div className="home-hero-copy">
          <span className="home-kicker">🛡️ CYBERRAKSHAK</span>
          <h1>Before you click, <span>check.</span></h1>
          <p className="home-lead">A calm, multilingual cyber-safety companion that helps you understand suspicious messages, make safer decisions and find the right next step.</p>
          <div className="home-actions">
            <button className="home-primary" type="button" onClick={() => navigate("/check")}>🔍 Check Something</button>
            <button className="home-secondary" type="button" onClick={() => navigate("/emergency-help")}>🆘 I Need Help</button>
          </div>
          <p className="home-safety-note">We do not need your password, UPI PIN, transaction OTP or CVV to provide safety guidance.</p>
        </div>
        <div className="home-hero-card" aria-label="CyberRakshak safety journey">
          <span>THE SIMPLE JOURNEY</span>
          <strong>Check → Understand → Act → Report → Learn</strong>
          <small>One step at a time. No crowded dashboard.</small>
        </div>
      </section>

      <section className="home-section home-start" aria-labelledby="start-title">
        <div className="home-heading"><span className="home-kicker">START HERE</span><h2 id="start-title">Choose what you need</h2><p>Every card has one purpose and one clear next action.</p></div>
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
        <div className="home-heading"><span className="home-kicker">WHAT WE HANDLE</span><h2 id="checks-title">Real situations, not security jargon</h2><p>Start with a focused check and see the reasons behind the warning.</p></div>
        <div className="home-topic-grid">
          {checkModes.map(([icon, title, text]) => (
            <button className="home-topic" type="button" key={title} onClick={() => navigate("/check")}>
              <span aria-hidden="true">{icon}</span><strong>{title}</strong><small>{text}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="home-section home-difference" aria-labelledby="difference-title">
        <div className="home-heading"><span className="home-kicker">WHY THIS APPROACH</span><h2 id="difference-title">Advanced underneath. Simple on the surface.</h2></div>
        <div className="difference-list">
          <div><b>1</b><span><strong>Explainable</strong> — show the warning signs and uncertainty instead of only giving a score.</span></div>
          <div><b>2</b><span><strong>India-ready</strong> — UPI, telecom, KYC, fake jobs, impersonation and digital-arrest patterns are first-class scenarios.</span></div>
          <div><b>3</b><span><strong>Privacy-aware</strong> — avoid asking users for secrets that are unnecessary for analysis.</span></div>
          <div><b>4</b><span><strong>Action-oriented</strong> — connect detection to safer next steps, reporting guidance and learning.</span></div>
        </div>
      </section>

      <section className="home-section home-roadmap" aria-labelledby="roadmap-title">
        <div className="home-heading"><span className="home-kicker">ROADMAP</span><h2 id="roadmap-title">What comes next</h2><p>Planned capabilities are clearly labelled until they pass implementation and production checks.</p></div>
        <div className="roadmap-list">{roadmap.map((item) => <span key={item}>◌ {item}</span>)}</div>
      </section>

      <section className="home-final">
        <h2>Start with one safe decision.</h2>
        <p>Check something suspicious or learn a safer habit.</p>
        <div className="home-final-actions"><button type="button" onClick={() => navigate("/check")}>Open Safety Checker</button><button type="button" onClick={() => navigate("/learn")}>Explore Learning</button></div>
      </section>
    </div>
  );
}

export default Home;
