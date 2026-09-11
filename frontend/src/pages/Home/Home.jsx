import { useNavigate } from "react-router-dom";
import "./Home.css";

const coreActions = [
  { icon: "🔍", title: "Check Something", text: "Analyze a suspicious message or link before you act.", path: "/check" },
  { icon: "🆘", title: "I May Have Been Scammed", text: "Open a simple incident-response checklist and official help guidance.", path: "/emergency-help" },
  { icon: "🎓", title: "Learn Cyber Safety", text: "Learn through simple lessons, scenarios, and quizzes.", path: "/learn" },
  { icon: "⚠️", title: "Report a Scam", text: "Submit a report and track your case safely.", path: "/report-scam" }
];

const checkModes = [
  { icon: "💬", title: "Message", text: "SMS, WhatsApp, email or social-media text" },
  { icon: "🔗", title: "Link", text: "Inspect a URL for structural warning signs" },
  { icon: "📸", title: "Screenshot", text: "Preview it and prepare the text for analysis" },
  { icon: "📱", title: "SIM Safety", text: "Learn about SIM swap, eSIM and telecom scams" }
];

const comingSoon = [
  ["🎙️", "Voice CyberRakshak"],
  ["🎭", "Deepfake Protection"],
  ["📞", "Call Analysis"],
  ["🗺️", "Live Threat Map"],
  ["🔔", "Real-Time Alerts"],
  ["🤖", "Advanced ML Detection"],
  ["📱", "Flutter Mobile App"],
  ["🏫", "School Safety Platform"]
];

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home modern-home">
      <section className="hero modern-hero">
        <div className="hero-content">
          <span className="home-eyebrow">🛡️ SIMPLE • PRIVATE • DEFENSIVE</span>
          <h1>Something suspicious? <span>Let&apos;s check it.</span></h1>
          <p className="hero-subtitle">CyberRakshak is a multilingual cyber-safety companion for ordinary people, students, families and seniors.</p>
          <p className="hero-description">Understand the warning signs, make safer decisions, get incident guidance and learn how to avoid the same scam next time.</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate("/check")}>🔍 Check Something</button>
            <button className="btn-secondary" onClick={() => navigate("/emergency-help")}>🆘 Need Help Now</button>
          </div>
          <div className="hero-trust">No banking passwords • No UPI PINs • No transaction OTPs • No unnecessary biometric storage</div>
        </div>
        <div className="hero-image" aria-hidden="true"><div className="shield-icon">🛡️</div><div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/></div>
      </section>

      <section className="features core-actions-section">
        <div className="section-heading"><span className="home-eyebrow">START HERE</span><h2>What do you need right now?</h2><p>One clear action at a time. No technical knowledge required.</p></div>
        <div className="features-grid">
          {coreActions.map((item) => <button className="feature-card action-card" key={item.title} onClick={() => navigate(item.path)}><div className="feature-icon">{item.icon}</div><h3>{item.title}</h3><p>{item.text}</p><span className="feature-btn">Open →</span></button>)}
        </div>
      </section>

      <section className="stats modern-stats">
        <div className="stats-container">
          {[['🧠','Explainable','Why a situation looks risky'],['🌐','Multilingual','Designed for Indian users'],['🔐','Privacy-first','Collect only what is needed'],['⚡','Fast guidance','Clear next actions']].map(([icon,title,text]) => <div className="stat-card" key={title}><div className="stat-number">{icon}</div><div className="stat-label"><strong>{title}</strong><span>{text}</span></div></div>)}
        </div>
      </section>

      <section className="topics check-section">
        <div className="section-heading"><span className="home-eyebrow">SAFETY CHECKS</span><h2>Check the things people actually receive</h2><p>Modern scams move through messages, links, phones, payments and social platforms.</p></div>
        <div className="topics-grid">
          {checkModes.map((item) => <button className="topic-card" key={item.title} onClick={() => navigate('/check')}><div className="topic-icon">{item.icon}</div><h3>{item.title}</h3><p>{item.text}</p></button>)}
        </div>
      </section>

      <section className="why modern-why">
        <div className="section-heading"><span className="home-eyebrow">BUILT DIFFERENTLY</span><h2>Protection should be understandable</h2></div>
        <div className="why-grid">
          {[['🧩','Understand first','We explain the red flags in simple words instead of expecting users to understand cybersecurity jargon.'],['🎯','Action over fear','We focus on safe next steps and official help rather than alarming the user.'],['🧠','Learn from the incident','Real-world scam patterns become personalized learning opportunities.'],['📱','India-ready','UPI, telecom, SIM, KYC, job, digital-arrest and impersonation scenarios are first-class use cases.'],['♻️','Honest status','Working features are clearly separated from planned capabilities.'],['🛡️','Defensive by design','The product never asks for passwords, UPI PINs, transaction OTPs or unnecessary sensitive secrets.']].map(([icon,title,text]) => <article className="why-card" key={title}><span className="why-icon">{icon}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="coming-home">
        <div className="section-heading"><span className="home-eyebrow">ROADMAP</span><h2>🚀 Coming Soon</h2><p>These are planned capabilities, shown openly so users know what is next.</p></div>
        <div className="coming-home-grid">{comingSoon.map(([icon,title]) => <div className="coming-home-card" key={title}><span>{icon}</span><div><strong>{title}</strong><small>COMING SOON</small></div></div>)}</div>
      </section>

      <section className="cta modern-cta"><h2>Build safer digital habits, one decision at a time.</h2><p>Start with a check, learn the reason, and know what to do next.</p><div className="cta-buttons"><button className="btn-large" onClick={() => navigate('/check')}>Open Safety Checker</button><button className="btn-large-outline" onClick={() => navigate('/learn')}>Explore Learning</button></div></section>
    </div>
  );
}

export default Home;
