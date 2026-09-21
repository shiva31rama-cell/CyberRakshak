import { useNavigate } from "react-router-dom";
import VideoEmbed from "../../components/VideoEmbed/VideoEmbed";
import "./Home.css";

const capabilities = [
  { icon: "💬", title: "ASK CyberRakshak", text: "Describe a cyber-safety problem and get practical, focused guidance.", action: "/" },
  { icon: "🔎", title: "SCAN a Message", text: "Paste a suspicious SMS, WhatsApp message, email or offer and check its warning signs.", action: "/scan" },
  { icon: "📚", title: "LEARN Safety", text: "Understand phishing, UPI fraud, passwords, privacy and other everyday risks.", action: "/learn" },
  { icon: "🆘", title: "GET HELP", text: "Find immediate defensive steps and official reporting/help resources when something goes wrong.", action: "/emergency-help" },
];

const threats = [
  ["💳", "UPI & payment fraud", "/upi-safety"],
  ["🎣", "Phishing & fake links", "/learn"],
  ["🔐", "Password & account safety", "/password-security"],
  ["👤", "Impersonation & social scams", "/social-media-safety"],
];

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-v2">
      <section className="home-hero">
        <div className="hero-copy-v2">
          <span className="home-eyebrow">AI-POWERED · MULTILINGUAL · CYBER SAFETY</span>
          <h1>Understand the threat.<br /><span>Take the safer next step.</span></h1>
          <p>CyberRakshak helps everyday users understand suspicious messages, online scams and cyber incidents in simple language — before a small mistake becomes a bigger problem.</p>
          <div className="hero-actions-v2">
            <button className="primary-action" onClick={() => navigate("/scan")}>🔎 Scan a Message</button>
            <button className="secondary-action" onClick={() => navigate("/")}>💬 Ask CyberRakshak</button>
          </div>
          <div className="hero-trust"><span>✓ Cyber-safety focused</span><span>✓ English · తెలుగు · हिन्दी foundation</span><span>✓ Never ask for your OTP or password</span></div>
        </div>
        <div className="hero-visual-v2" aria-hidden="true">
          <div className="shield-orbit"><div className="hero-shield">🛡️</div></div>
          <div className="floating-alert alert-one">⚠️ Suspicious link detected</div>
          <div className="floating-alert alert-two">✓ Safety steps ready</div>
        </div>
      </section>

      <section className="section-v2 intro-section">
        <div className="section-heading"><span className="home-eyebrow">WHAT IS CYBERRAKSHAK?</span><h2>More than a chatbot.</h2><p>CyberRakshak connects understanding, analysis, education and help into one cyber-safety journey.</p></div>
        <div className="capability-grid">
          {capabilities.map((item) => (
            <button className="capability-card" key={item.title} onClick={() => navigate(item.action)}>
              <span className="capability-icon">{item.icon}</span><h3>{item.title}</h3><p>{item.text}</p><span className="card-arrow">Explore →</span>
            </button>
          ))}
        </div>
      </section>

      <section className="section-v2 threat-section">
        <div className="section-heading"><span className="home-eyebrow">COMMON THREATS</span><h2>Know what to look for.</h2><p>Start with the situations people commonly face online.</p></div>
        <div className="threat-grid">
          {threats.map(([icon, title, path]) => <button key={title} onClick={() => navigate(path)} className="threat-card"><span>{icon}</span><strong>{title}</strong><small>Learn warning signs →</small></button>)}
        </div>
      </section>

      <section className="scan-banner" id="scan-now">
        <div><span className="home-eyebrow">NEED AN ANSWER NOW?</span><h2>Paste the message. Understand the risk.</h2><p>CyberRakshak looks for observable warning signs and gives you practical next steps. It does not treat an AI guess as proof.</p></div>
        <button onClick={() => navigate("/scan")}>Open Message Scanner →</button>
      </section>

      <section className="section-v2 video-section">
        <div className="section-heading"><span className="home-eyebrow">LEARN FROM TRUSTED SOURCES</span><h2>Cyber safety, explained simply.</h2><p>Curated awareness videos can help users understand reporting and everyday online risks.</p></div>
        <div className="video-grid-v2">
          <VideoEmbed videoId="ROh122nHC8o" title="CyberSafeLive — Reporting Cybercrime" description="Official CyberDost I4C awareness session covering reporting and support mechanisms." />
          <VideoEmbed videoId="OKzCeT9v-yo" title="Cyber Crime Awareness" description="Cyber-safety awareness video from State Bank of India." />
        </div>
      </section>

      <section className="section-v2 help-section">
        <div className="help-card"><span className="home-eyebrow">IF SOMETHING ALREADY HAPPENED</span><h2>Protect first. Report next. Learn after.</h2><p>When money, an account or personal information may be at risk, CyberRakshak should help you focus on the next safe action instead of overwhelming you with theory.</p><div className="help-actions"><button onClick={() => navigate("/emergency-help")}>🆘 Get Immediate Help</button><button onClick={() => navigate("/report-scam")} className="outline-action">Report / Find Resources</button></div></div>
      </section>

      <section className="section-v2 final-cta"><span className="home-eyebrow">CYBERRAKSHAK</span><h2>Stay curious. Stay cautious. Stay safer.</h2><p>Use CyberRakshak to ASK, SCAN, LEARN and GET HELP — all in one place.</p><button onClick={() => navigate("/learn")}>Start Learning →</button></section>
    </div>
  );
}

export default Home;
