import { useMemo, useRef, useState } from "react";
import { apiRequest } from "../../services/api";
import "./ScamAnalyzer.css";

const quickExamples = [
  {
    label: "KYC message",
    text: "Your bank KYC will expire today. Update immediately or your account will be suspended. Click https://example.com/kyc and enter OTP."
  },
  {
    label: "Fake job",
    text: "Work from home job available. Pay a refundable security deposit of Rs 2500 and send your ID to our Telegram recruiter."
  },
  {
    label: "Digital arrest",
    text: "Your Aadhaar is linked to an illegal parcel. Stay on video call with police and transfer money for verification to avoid arrest."
  },
  {
    label: "SIM warning",
    text: "Your SIM will be deactivated. Share the OTP now and install the verification app to keep your number active."
  }
];

const comingSoon = [
  ["🎙️", "Voice analysis", "Talk naturally and receive safety guidance."],
  ["🎭", "Deepfake protection", "Identify common voice and video impersonation signals."],
  ["📞", "Call analysis", "Analyze suspicious call patterns without storing call audio."],
  ["🗺️", "Threat map", "See validated emerging scam campaigns by region."],
  ["🔔", "Real-time alerts", "Receive timely, verified cyber-safety warnings."],
  ["🤖", "Advanced ML", "Privacy-safe models trained and evaluated on labelled data."],
  ["📱", "Flutter app", "A mobile-first CyberRakshak experience using the same secure API."],
];

function RiskBadge({ result }) {
  if (!result) return null;
  return (
    <div className={`risk-badge risk-${result.color}`}>
      <span className="risk-score">{result.score}</span>
      <span>
        <strong>{result.label}</strong>
        <small>{result.confidence} confidence</small>
      </span>
    </div>
  );
}

function ScamAnalyzer() {
  const [mode, setMode] = useState("message");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageName, setImageName] = useState("");
  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cyberrakshak:safety-profile")) || { ageGroup: "", language: "English" };
    } catch {
      return { ageGroup: "", language: "English" };
    }
  });
  const fileInputRef = useRef(null);

  const translatedLabel = useMemo(() => {
    if (profile.language === "Telugu") return "తెలుగులో వివరించండి";
    if (profile.language === "Hindi") return "हिंदी में समझाएं";
    return "Explain simply";
  }, [profile.language]);

  const saveProfile = (next) => {
    setProfile(next);
    localStorage.setItem("cyberrakshak:safety-profile", JSON.stringify(next));
  };

  const analyze = async (event) => {
    event?.preventDefault();
    setError("");
    setResult(null);
    const value = mode === "url" ? url : text;
    if (!value.trim()) {
      setError(mode === "url" ? "Paste a URL first." : "Paste the suspicious message, email, or text first.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest(mode === "url" ? "/scam/analyze-url" : "/scam/analyze", {
        method: "POST",
        body: JSON.stringify(mode === "url" ? { url: value } : { text: value }),
        timeoutMs: 12000,
      });
      setResult(response);
    } catch (requestError) {
      setError(requestError.message || "Unable to analyze right now.");
    } finally {
      setLoading(false);
    }
  };

  const selectExample = (example) => {
    setMode("message");
    setText(example.text);
    setUrl("");
    setResult(null);
    setError("");
  };

  const onImageSelected = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setImageName(file.name);
    setError("Screenshot preview is ready. For the current release, paste the visible text into the analyzer so the deterministic risk engine can assess it.");
  };

  return (
    <div className="analyzer-page">
      <section className="analyzer-hero">
        <div>
          <span className="eyebrow">🛡️ CYBERRAKSHAK SAFETY ENGINE</span>
          <h1>Something suspicious? Let&apos;s check it.</h1>
          <p>
            Analyze a message or URL for common scam signals, understand the warning signs,
            and get a simple next step. CyberRakshak is a defensive aid, not a guarantee.
          </p>
        </div>
        <div className="hero-shield" aria-hidden="true">🛡️</div>
      </section>

      <section className="profile-strip" aria-label="Personalized safety profile">
        <div>
          <strong>Personalize your safety guidance</strong>
          <span>Only a self-declared age group and preferred language are used here.</span>
        </div>
        <div className="profile-controls">
          <select
            aria-label="Age group"
            value={profile.ageGroup}
            onChange={(event) => saveProfile({ ...profile, ageGroup: event.target.value })}
          >
            <option value="">Age group</option>
            <option value="teen">Teen</option>
            <option value="young-adult">Young Adult</option>
            <option value="adult">Adult</option>
            <option value="senior">Senior</option>
          </select>
          <select
            aria-label="Preferred language"
            value={profile.language}
            onChange={(event) => saveProfile({ ...profile, language: event.target.value })}
          >
            <option>English</option>
            <option>Telugu</option>
            <option>Hindi</option>
          </select>
          <span className="profile-note">{translatedLabel}</span>
        </div>
      </section>

      <section className="analyzer-shell">
        <div className="mode-tabs" role="tablist" aria-label="Analyzer input type">
          <button className={mode === "message" ? "active" : ""} onClick={() => setMode("message")} type="button">💬 Message</button>
          <button className={mode === "url" ? "active" : ""} onClick={() => setMode("url")} type="button">🔗 URL</button>
          <button className={mode === "screenshot" ? "active" : ""} onClick={() => setMode("screenshot")} type="button">📸 Screenshot</button>
        </div>

        {mode === "screenshot" ? (
          <div className="screenshot-box">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onImageSelected} hidden />
            <div className="upload-icon">📸</div>
            <h2>Drop or choose a screenshot</h2>
            <p>We do not upload the image in this release. The selected image stays in your browser for preview.</p>
            <button type="button" className="primary-action" onClick={() => fileInputRef.current?.click()}>Choose screenshot</button>
            {imageName ? <strong className="selected-file">Selected: {imageName}</strong> : null}
            <label className="manual-text-label" htmlFor="screenshot-text">Paste the visible text for analysis</label>
            <textarea id="screenshot-text" value={text} onChange={(event) => setText(event.target.value)} placeholder="Paste the message text from the screenshot here..." />
            <button type="button" className="primary-action" onClick={() => { setMode("message"); setTimeout(() => document.getElementById("run-analysis")?.click(), 0); }}>Analyze pasted text</button>
          </div>
        ) : (
          <form onSubmit={analyze} className="analyzer-form">
            <label htmlFor="analysis-input">{mode === "url" ? "Suspicious URL" : "Suspicious message / email / text"}</label>
            {mode === "url" ? (
              <input id="analysis-input" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com/..." autoComplete="off" />
            ) : (
              <textarea id="analysis-input" value={text} onChange={(event) => setText(event.target.value)} placeholder="Paste the message exactly as you received it..." rows={9} />
            )}
            <div className="form-actions">
              <button id="run-analysis" type="submit" className="primary-action" disabled={loading}>{loading ? "Analyzing..." : "🔍 Analyze safely"}</button>
              <button type="button" className="ghost-action" onClick={() => { setText(""); setUrl(""); setResult(null); setError(""); }}>Clear</button>
            </div>
          </form>
        )}

        <div className="example-row">
          <span>Try a safe example:</span>
          {quickExamples.map((example) => <button key={example.label} type="button" onClick={() => selectExample(example)}>{example.label}</button>)}
        </div>

        {error ? <div className="notice error">⚠️ {error}</div> : null}

        {result ? (
          <section className="result-panel" aria-live="polite">
            <div className="result-heading">
              <div>
                <span className="eyebrow">ANALYSIS RESULT</span>
                <h2>{result.category === "unknown" ? "General safety assessment" : result.category.replaceAll("-", " ")}</h2>
              </div>
              <RiskBadge result={result} />
            </div>

            {result.signals?.length ? (
              <div className="result-grid">
                <div className="result-card">
                  <h3>🚩 Why it was flagged</h3>
                  <ul>{result.signals.map((signal) => <li key={signal.id}><strong>{signal.title}:</strong> {signal.reason}</li>)}</ul>
                </div>
                <div className="result-card">
                  <h3>✅ What to do</h3>
                  <ul>{result.recommendedActions?.map((action) => <li key={action}>{action}</li>)}</ul>
                </div>
              </div>
            ) : (
              <div className="result-card single"><h3>✅ No strong indicators detected</h3><p>That does not prove the content is safe. Verify unexpected requests independently, especially before sharing money or credentials.</p></div>
            )}
            <p className="disclaimer">{result.disclaimer}</p>
          </section>
        ) : null}
      </section>

      <section className="emergency-callout">
        <div><span className="eyebrow">NEED HELP NOW?</span><h2>🆘 I may have been scammed</h2><p>Start the incident-response checklist and find official reporting guidance for India.</p></div>
        <a href="/emergency-help">Open emergency help →</a>
      </section>

      <section className="category-grid-section">
        <div className="section-heading"><span className="eyebrow">PROTECT YOURSELF</span><h2>Modern scam categories</h2><p>Built around the patterns people actually encounter online.</p></div>
        <div className="category-grid">
          {["💳 UPI & payment fraud", "🚨 Digital arrest", "💼 Fake job scams", "📱 SIM & telecom safety", "🎣 Phishing & smishing", "🎭 Impersonation", "📈 Investment scams", "💬 Social-media scams"].map((item) => <div key={item} className="category-card">{item}</div>)}
        </div>
      </section>

      <section className="coming-soon-section">
        <div className="section-heading"><span className="eyebrow">ROADMAP</span><h2>🚀 Coming soon</h2><p>These cards show planned product capabilities without pretending they are live.</p></div>
        <div className="coming-grid">
          {comingSoon.map(([icon, title, description]) => <article key={title} className="coming-card"><span className="coming-icon">{icon}</span><div><h3>{title}</h3><p>{description}</p></div><span className="coming-badge">COMING SOON</span></article>)}
        </div>
      </section>
    </div>
  );
}

export default ScamAnalyzer;
