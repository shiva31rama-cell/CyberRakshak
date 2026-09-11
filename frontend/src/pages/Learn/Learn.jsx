import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Learn.css";

const modules = [
  { id: "digital", title: "Digital Literacy Basics", icon: "📱", level: "beginner", description: "Learn safe everyday habits for phones, apps, websites and online identity.", lessons: 5, duration: "30 min", link: "/digital-literacy", image: "/education/digital-basics.svg", outcome: "Recognise safer digital choices" },
  { id: "passwords", title: "Password Security", icon: "🔐", level: "beginner", description: "Build strong account-protection habits, passkeys awareness and recovery safety.", lessons: 6, duration: "25 min", link: "/password-security", image: "/education/password-safety.svg", outcome: "Protect your accounts" },
  { id: "payments", title: "UPI & Payment Safety", icon: "💳", level: "beginner", description: "Understand payment requests, fake support calls, QR-code tricks and refund scams.", lessons: 8, duration: "35 min", link: "/upi-safety", image: "/education/payment-safety.svg", outcome: "Pause before paying" },
  { id: "social", title: "Social Media Safety", icon: "💬", level: "intermediate", description: "Protect your identity, account, conversations and privacy on social platforms.", lessons: 7, duration: "30 min", link: "/social-media-safety", image: "/education/social-safety.svg", outcome: "Control what you share" },
  { id: "phishing", title: "Phishing & Smishing", icon: "🎣", level: "intermediate", description: "Learn how fake links, urgent messages and impersonation attempts work.", lessons: 6, duration: "28 min", link: "/cyber-crime-awareness", image: "/education/phishing.svg", outcome: "Spot common red flags" },
  { id: "device", title: "Device & App Safety", icon: "📲", level: "intermediate", description: "Learn safer update, app-permission, attachment and device-lock habits.", lessons: 6, duration: "28 min", link: "/digital-literacy", image: "/education/device-safety.svg", outcome: "Reduce device risk" },
];

const tracks = [
  { icon: "🤖", title: "AI, Deepfake & Impersonation", text: "Understand how synthetic media and AI-assisted social engineering can mislead people.", state: "Coming soon", image: "/education/ai-deepfake.svg" },
  { icon: "🧑‍⚕️", title: "Health & Medical Scam Safety", text: "Learn how to verify medical claims, payment requests, appointments and support messages.", state: "Coming soon", image: "/education/health-safety.svg" },
  { icon: "🧠", title: "Human & Online Abuse Safety", text: "Build privacy, consent, boundary and reporting habits for harmful online interactions.", state: "Coming soon", image: "/education/human-online-safety.svg" },
];

function Learn() {
  const navigate = useNavigate();
  const [level, setLevel] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return modules.filter((module) => {
      const levelMatch = level === "all" || module.level === level;
      const queryMatch = !normalized || `${module.title} ${module.description}`.toLowerCase().includes(normalized);
      return levelMatch && queryMatch;
    });
  }, [level, query]);

  return (
    <div className="learn-container">
      <section className="learn-hero">
        <div>
          <span className="learn-kicker">LEARN • SEE • PRACTISE</span>
          <h1>Cyber safety should feel like learning, not reading a manual.</h1>
          <p>Every core lesson is designed around one visual idea, one real-world scenario and one practical action. Open a topic when you are ready instead of loading everything onto one page.</p>
        </div>
        <div className="learn-hero-orbit" aria-hidden="true">🛡️</div>
      </section>

      <section className="learning-command" aria-label="Learning controls">
        <div>
          <label htmlFor="learning-search">Find a lesson</label>
          <input id="learning-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search phishing, UPI, passwords…" />
        </div>
        <div>
          <span className="filter-label">Level</span>
          <div className="level-tabs" role="tablist" aria-label="Filter learning level">
            {["all", "beginner", "intermediate"].map((item) => (
              <button key={item} type="button" className={level === item ? "active" : ""} onClick={() => setLevel(item)}>{item === "all" ? "All" : item[0].toUpperCase() + item.slice(1)}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="learn-section">
        <div className="section-title-row">
          <div><span className="learn-kicker">CORE PATH</span><h2>Start with the skills you use every day</h2></div>
          <span className="result-count">{filtered.length} lessons paths</span>
        </div>

        <div className="learning-grid">
          {filtered.map((module) => (
            <article className="learning-card" key={module.id}>
              <img src={module.image} alt="" className="learning-image" loading="lazy" />
              <div className="learning-card-body">
                <div className="learning-card-top"><span className="learning-icon">{module.icon}</span><span className={`level-pill ${module.level}`}>{module.level}</span></div>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
                <div className="learning-outcome"><strong>🎯 Takeaway</strong><span>{module.outcome}</span></div>
                <div className="learning-meta"><span>📖 {module.lessons} lessons</span><span>⏱️ {module.duration}</span></div>
                <button type="button" onClick={() => navigate(module.link)} className="learning-open">Open lesson <span>→</span></button>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && <div className="empty-learning"><strong>No matching lesson.</strong><span>Try another word or choose All.</span></div>}
      </section>

      <section className="learning-media">
        <div className="media-copy">
          <span className="learn-kicker">SEE IT IN ACTION</span>
          <h2>Videos, booklets and official awareness material</h2>
          <p>Some topics are easier to understand by seeing the warning signs. We keep official external media separate from CyberRakshak's own explanations so the source is clear.</p>
          <div className="media-actions">
            <a href="https://www.cert-in.org.in/s2cMainServlet?pageid=digitalpayment" target="_blank" rel="noreferrer">▶ Digital Payment awareness</a>
            <a href="https://cert-in.org.in/AwarenessBooklets.jsp" target="_blank" rel="noreferrer">📘 CERT-In awareness booklets</a>
            <a href="https://cybercrime.gov.in/" target="_blank" rel="noreferrer">🇮🇳 I4C cyber awareness</a>
          </div>
        </div>
        <div className="media-preview" aria-hidden="true"><div className="play-button">▶</div><span>Visual learning layer</span></div>
      </section>

      <section className="learn-section">
        <div className="section-title-row"><div><span className="learn-kicker">EXPANSION TRACKS</span><h2>More domains we are building carefully</h2></div><span className="result-count">Validated before release</span></div>
        <div className="track-grid">
          {tracks.map((track) => <article className="track-card" key={track.title}><img src={track.image} alt="" loading="lazy" /><div><span>{track.icon}</span><h3>{track.title}</h3><p>{track.text}</p><small>{track.state}</small></div></article>)}
        </div>
      </section>
    </div>
  );
}

export default Learn;
