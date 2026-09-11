import { useRef, useState } from "react";
import { apiRequest } from "../../services/api";
import { useLanguage } from "../../i18n/LanguageContext";
import { analyzeLocalText, analyzeLocalUrl } from "../../services/localRiskEngine";
import "./ScamAnalyzer.css";

const quickExamples = [
  { label: "KYC message", text: "Your bank KYC will expire today. Update immediately or your account will be suspended. Click https://example.com/kyc and enter OTP." },
  { label: "Fake job", text: "Work from home job available. Pay a refundable security deposit of Rs 2500 and send your ID to our Telegram recruiter." },
  { label: "Digital arrest", text: "Your Aadhaar is linked to an illegal parcel. Stay on video call with police and transfer money for verification to avoid arrest." },
  { label: "SIM warning", text: "Your SIM will be deactivated. Share the OTP now and install the verification app to keep your number active." },
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
  return <div className={`risk-badge risk-${result.color}`}><span className="risk-score">{result.score}</span><span><strong>{result.label}</strong><small>{result.confidence} confidence</small></span></div>;
}

function ScamAnalyzer() {
  const { language, languages, setLanguage, t } = useLanguage();
  const [mode, setMode] = useState("message");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [imageName, setImageName] = useState("");
  const [ageGroup, setAgeGroup] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cyberrakshak:safety-profile"))?.ageGroup || ""; } catch { return ""; }
  });
  const fileInputRef = useRef(null);

  const saveAgeGroup = (value) => {
    setAgeGroup(value);
    try {
      const profile = JSON.parse(localStorage.getItem("cyberrakshak:safety-profile")) || {};
      localStorage.setItem("cyberrakshak:safety-profile", JSON.stringify({ ...profile, ageGroup: value, language }));
    } catch { /* Storage is optional. */ }
  };

  const syncLanguage = (value) => {
    setLanguage(value);
    try {
      const profile = JSON.parse(localStorage.getItem("cyberrakshak:safety-profile")) || {};
      localStorage.setItem("cyberrakshak:safety-profile", JSON.stringify({ ...profile, ageGroup, language: value }));
    } catch { /* Storage is optional. */ }
  };

  const runAnalysis = async (analysisMode, value) => {
    setError("");
    setResult(null);
    setUsingFallback(false);
    const cleanValue = String(value || "").trim();
    if (!cleanValue) {
      setError(analysisMode === "url" ? "Paste a URL first." : "Paste the suspicious message, email, or text first.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest(analysisMode === "url" ? "/scam/analyze-url" : "/scam/analyze", {
        method: "POST",
        body: JSON.stringify(analysisMode === "url" ? { url: cleanValue } : { text: cleanValue }),
        timeoutMs: 12000,
      });
      setResult(response);
    } catch (requestError) {
      const fallback = analysisMode === "url" ? analyzeLocalUrl(cleanValue) : analyzeLocalText(cleanValue);
      if (fallback.success) {
        setResult(fallback);
        setUsingFallback(true);
        setError("The server is temporarily unavailable, so CyberRakshak switched to its local safety engine for this check.");
      } else {
        setError(requestError.message || fallback.message || "Unable to analyze right now.");
      }
    } finally {
      setLoading(false);
    }
  };

  const analyze = async (event) => {
    event?.preventDefault();
    await runAnalysis(mode, mode === "url" ? url : text);
  };

  const selectExample = (example) => {
    setMode("message");
    setText(example.text);
    setUrl("");
    setResult(null);
    setError("");
    setUsingFallback(false);
  };

  const onImageSelected = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please choose an image file."); return; }
    setImageName(file.name);
    setError("Screenshot preview is ready. Text extraction is not enabled in this release; paste the visible text below to analyze it.");
  };

  const analyzeScreenshotText = async () => {
    setMode("message");
    await runAnalysis("message", text);
  };

  return (
    <div className="analyzer-page">
      <section className="analyzer-hero"><div><span className="eyebrow">🛡️ CYBERRAKSHAK SAFETY ENGINE</span><h1>{t("analyzeHeading")}</h1><p>{t("analyzeLead")}</p><div className="hero-trust-row"><span>🔐 No secrets needed</span><span>📱 Mobile ready</span><span>🌐 {language}</span></div></div><div className="hero-shield" aria-hidden="true">🛡️</div></section>

      <section className="profile-strip" aria-label="Personalized safety profile"><div><strong>{t("personalized")}</strong><span>Only a self-declared age group and preferred language are used for guidance.</span></div><div className="profile-controls"><select aria-label={t("ageGroup")} value={ageGroup} onChange={(event) => saveAgeGroup(event.target.value)}><option value="">{t("ageGroup")}</option><option value="teen">Teen</option><option value="young-adult">Young Adult</option><option value="adult">Adult</option><option value="senior">Senior</option></select><select aria-label={t("preferredLanguage")} value={language} onChange={(event) => syncLanguage(event.target.value)}>{languages.map((item) => <option key={item} value={item}>{item === "English" ? "English" : item === "Telugu" ? "తెలుగు" : "हिन्दी"}</option>)}</select></div></section>

      <section className="analyzer-shell">
        <div className="mode-tabs" role="tablist" aria-label="Analyzer input type">{[["message", "💬", t("message")], ["url", "🔗", t("url")], ["screenshot", "📸", t("screenshot")]].map(([value, icon, label]) => <button key={value} className={mode === value ? "active" : ""} onClick={() => setMode(value)} type="button" role="tab" aria-selected={mode === value}>{icon} {label}</button>)}</div>

        {mode === "screenshot" ? (
          <div className="screenshot-box">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onImageSelected} hidden />
            <div className="upload-icon">📸</div><h2>Screenshot assistant</h2>
            <p>Select an image for a local preview, then paste the visible message text for the current deterministic safety analysis.</p>
            <button type="button" className="primary-action" onClick={() => fileInputRef.current?.click()}>Choose screenshot</button>
            {imageName ? <strong className="selected-file">Selected: {imageName}</strong> : null}
            <label className="manual-text-label" htmlFor="screenshot-text">Paste visible text</label>
            <textarea id="screenshot-text" value={text} onChange={(event) => setText(event.target.value)} placeholder="Paste the message text from the screenshot here…" rows={6} />
            <button type="button" className="primary-action secondary-action" onClick={analyzeScreenshotText} disabled={loading}>{loading ? "Checking…" : t("analyzeSafely")}</button>
          </div>
        ) : (
          <form onSubmit={analyze} className="analyzer-form"><label htmlFor="analysis-input">{mode === "url" ? t("suspiciousUrl") : t("suspiciousMessage")}</label>{mode === "url" ? <input id="analysis-input" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com/..." autoComplete="off" inputMode="url" /> : <textarea id="analysis-input" value={text} onChange={(event) => setText(event.target.value)} placeholder="Paste the message exactly as you received it…" rows={8} />}<div className="form-actions"><button id="run-analysis" type="submit" className="primary-action" disabled={loading}>{loading ? "Checking…" : `🔍 ${t("analyzeSafely")}`}</button><button type="button" className="ghost-action" onClick={() => { setText(""); setUrl(""); setResult(null); setError(""); setUsingFallback(false); setImageName(""); }}>{t("clear")}</button></div></form>
        )}

        <div className="example-row"><span>{t("tryExample")}</span>{quickExamples.map((example) => <button key={example.label} type="button" onClick={() => selectExample(example)}>{example.label}</button>)}</div>
        {error ? <div className={`notice ${usingFallback ? "fallback-notice" : "error"}`} role="alert">{usingFallback ? "ℹ️" : "⚠️"} {error}</div> : null}

        {result ? <section className="result-panel" aria-live="polite"><div className="result-heading"><div><span className="eyebrow">ANALYSIS RESULT</span><h2>{result.category === "unknown" ? "General safety assessment" : result.category.replaceAll("-", " ")}</h2></div><RiskBadge result={result} /></div>{result.signals?.length ? <div className="result-grid"><div className="result-card"><h3>🚩 Why it was flagged</h3><ul>{result.signals.map((signal) => <li key={signal.id}><strong>{signal.title}:</strong> {signal.reason}</li>)}</ul></div><div className="result-card"><h3>✅ What to do</h3><ul>{result.recommendedActions?.map((action) => <li key={action}>{action}</li>)}</ul></div></div> : <div className="result-card single"><h3>✅ No strong indicators detected</h3><p>That does not prove the content is safe. Verify unexpected requests independently, especially before sharing money or credentials.</p></div>}{result.nextStep ? <div className="next-step"><strong>Next step</strong><span>{result.nextStep}</span></div> : null}<p className="disclaimer">{result.disclaimer}</p></section> : null}
      </section>

      <section className="emergency-callout"><div><span className="eyebrow">{t("needHelpNow")}</span><h2>🆘 {t("emergencyCalloutTitle")}</h2><p>Open the incident-response checklist and official reporting guidance.</p></div><a href="/emergency-help">{t("openEmergency")} →</a></section>
      <section className="category-grid-section"><div className="section-heading"><span className="eyebrow">PROTECT YOURSELF</span><h2>Modern scam categories</h2><p>Focused scenarios instead of a generic trust score.</p></div><div className="category-grid">{["💳 UPI & payment fraud", "🚨 Digital arrest", "💼 Fake job scams", "📱 SIM & telecom safety", "🎣 Phishing & smishing", "🎭 Impersonation", "📈 Investment scams", "💬 Social-media scams"].map((item) => <button type="button" key={item} className="category-card" onClick={() => { setMode("message"); setText(`${item}: please teach me the warning signs and safe next steps.`); window.scrollTo({ top: 0, behavior: "smooth" }); }}>{item}<span>→</span></button>)}</div></section>
      <section className="coming-soon-section"><div className="section-heading"><span className="eyebrow">ROADMAP</span><h2>🚀 Coming soon</h2><p>These capabilities stay labelled until implementation and production checks are complete.</p></div><div className="coming-grid">{comingSoon.map(([icon, title, description]) => <article key={title} className="coming-card"><span className="coming-icon">{icon}</span><div><h3>{title}</h3><p>{description}</p></div><span className="coming-badge">COMING SOON</span></article>)}</div></section>
    </div>
  );
}

export default ScamAnalyzer;
