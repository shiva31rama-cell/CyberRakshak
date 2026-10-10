import { useState } from "react";
import UrlScanner from "./UrlScanner";
import { ArrowUpRight, AudioLines, FileSearch, Fingerprint, Link2, ScanSearch, ShieldCheck, ShieldAlert, Sparkles } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

type Report = {
  status: string;
  risk: "elevated" | "some" | "no_obvious_indicators";
  confidence: "limited";
  indicators: string[];
  guidance: string[];
  caveat: string;
};

export default function App() {
  const [input, setInput] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function analyze() {
    if (!input.trim() || busy) return;
    setBusy(true);
    setError("");
    setReport(null);
    try {
      const response = await fetch(`${API_BASE}/api/v1/analyze/text`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content: input })
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Analysis is temporarily unavailable.");
      setReport(body as Report);
    } catch {
      setError("The analysis service is not reachable yet. Start the CYBPRO API and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      <nav className="nav">
        <a className="brand" href="#" aria-label="CYBPRO home"><span className="brand-mark"><ShieldCheck size={21} /></span><span>CYB<span className="brand-accent">PRO</span><small>CYBER PROTECTION</small></span></a>
        <div className="nav-status"><span className="status-dot" /> Evidence-first safety <span className="nav-divider">/</span> Preview</div>
        <a className="github-link" href="https://github.com/shiva31rama-cell/CyberRakshak/tree/cybpro-rebuild" target="_blank" rel="noreferrer">Project branch <ArrowUpRight size={15} /></a>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14} /> DIGITAL TRUST, BUILT DIFFERENTLY</div>
          <h1>Pause before you<br /><span>trust the message.</span></h1>
          <p className="hero-sub">Understand suspicious messages and links with clear signals, source evidence, and practical next steps — not just an AI guess.</p>
          <div className="hero-points"><span><ShieldCheck size={16} /> Privacy-minded</span><span><FileSearch size={16} /> Explainable results</span><span><Fingerprint size={16} /> Risk ≠ confidence</span></div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="shield-illustration"><ShieldCheck size={88} strokeWidth={1.15} /></div>
          <div className="floating-card card-top"><span className="mini-icon"><ScanSearch size={16} /></span><span><b>Evidence-led</b><small>Check signals, not assumptions</small></span></div>
          <div className="floating-card card-bottom"><span className="mini-icon warning"><ShieldAlert size={16} /></span><span><b>Honest uncertainty</b><small>Unknown is a valid result</small></span></div>
        </div>
      </section>

      <section className="workspace">
        <div className="section-heading"><div><span className="eyebrow">YOUR FIRST LINE OF DEFENCE</span><h2>Check a message</h2><p>Paste suspicious text to inspect basic warning signs.</p></div><span className="preview-tag">EARLY PREVIEW</span></div>
        <div className="scanner-card">
          <label htmlFor="message-input">Suspicious message or text</label>
          <textarea id="message-input" value={input} onChange={(event) => setInput(event.target.value)} maxLength={12000} placeholder="Example: Your account will be blocked today. Verify immediately using this link..." />
          <div className="input-footer"><span>{input.length.toLocaleString()} / 12,000 characters · Avoid sharing private information</span><button onClick={analyze} disabled={!input.trim() || busy}>{busy ? "Checking…" : "Analyze safely"} <ArrowUpRight size={16} /></button></div>
        </div>
        {error && <p className="error-message" role="alert">{error}</p>}
        {report && <div className="report-card" aria-live="polite"><div className="report-title"><ShieldAlert size={20} /><div><b>Initial signal report</b><small>Rule-based preview · not a definitive verdict</small></div></div><p className="risk-label">Result: {report.risk.replaceAll("_", " ")}</p><p>{report.caveat}</p><h3>Indicators observed</h3>{report.indicators.length ? <ul>{report.indicators.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No configured warning patterns were detected. That does not prove the message is safe.</p>}<h3>Safer next steps</h3><ul>{report.guidance.map((item) => <li key={item}>{item}</li>)}</ul></div>}
      </section>

      <UrlScanner />

      <section className="capabilities">
        <div className="capability"><span className="cap-icon"><Link2 size={19} /></span><b>Link analysis</b><p>URL parsing and reputation evidence will be added through safe, policy-compliant connectors.</p><span className="planned">PLANNED</span></div>
        <div className="capability"><span className="cap-icon"><AudioLines size={19} /></span><b>Voice & media</b><p>Controlled image, audio, video, and document ingestion is planned for Phase 2.</p><span className="planned">PLANNED</span></div>
        <div className="capability"><span className="cap-icon"><FileSearch size={19} /></span><b>Evidence trail</b><p>Source, freshness, uncertainty, and model limitations are core product requirements.</p><span className="planned">IN DEVELOPMENT</span></div>
      </section>

      <footer><div className="brand footer-brand"><span className="brand-mark"><ShieldCheck size={18} /></span><span>CYB<span className="brand-accent">PRO</span></span></div><span>Built for safer digital decisions. Not a substitute for official incident response.</span><span>© {new Date().getFullYear()} CYBPRO</span></footer>
    </main>
  );
}