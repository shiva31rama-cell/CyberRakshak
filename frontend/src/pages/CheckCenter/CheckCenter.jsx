import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import { useLanguage } from "../../i18n/LanguageContext";
import "./CheckCenter.css";

const INPUTS = ["message", "url", "upi", "phone", "email", "qr_payload"];

const formatEvidenceMatches = (item) => [
  ...(item.matchedIndicators || []).map((match) => `${match.type || "indicator"}: ${match.value}`),
  ...(item.matchedSignals || []).map((match) => `signal: ${match}`),
];

const recoveryScenarioFor = (assessment) => {
  const categories = new Set(assessment?.categories || []);
  if (categories.has("payment_fraud") || categories.has("upi_fraud")) return "paid";
  if (categories.has("malicious_app")) return "installed";
  if (categories.has("account_takeover")) return "account";
  if (categories.has("malicious_attachment")) return "clicked";
  if (categories.has("phishing") || categories.has("malicious_link")) return "clicked";
  return "message";
};

function CheckCenter() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const copy = t.check;
  const telugu = language === "te";
  const [inputType, setInputType] = useState(location.state?.inputType || "message");
  const [text, setText] = useState(location.state?.text || "");
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pasteBusy, setPasteBusy] = useState(false);

  useEffect(() => {
    if (location.state?.inputType) setInputType(location.state.inputType);
    if (typeof location.state?.text === "string") setText(location.state.text);
  }, [location.state]);

  const selected = useMemo(() => copy.inputs[inputType] || copy.inputs.message, [copy, inputType]);
  const score = Number(assessment?.score || 0);
  const evidenceCount = assessment?.evidence?.length || 0;
  const sourceCount = assessment?.verifiedSources?.length || 0;
  const level = assessment?.riskLevel || "info";
  const [headline, explanation] = copy.risk[level] || copy.risk.info;

  const reset = () => {
    setText("");
    setAssessment(null);
    setError("");
  };

  const pasteFromClipboard = async () => {
    if (!navigator.clipboard?.readText) {
      setError(telugu ? "ఈ బ్రౌజర్‌లో clipboard access అందుబాటులో లేదు." : "Clipboard access is not available in this browser.");
      return;
    }
    setPasteBusy(true);
    setError("");
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText.slice(0, 12000));
      setAssessment(null);
    } catch {
      setError(telugu ? "Clipboard చదవలేకపోయాం. టెక్స్ట్‌ను స్వయంగా paste చేయండి." : "Clipboard could not be read. Paste the text manually instead.");
    } finally {
      setPasteBusy(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    const clean = text.trim();
    if (!clean) { setError(copy.errorEmpty); return; }
    setLoading(true);
    setError("");
    setAssessment(null);
    try {
      const result = await apiRequest("/analyze", { method: "POST", body: JSON.stringify({ text: clean, inputType }) });
      setAssessment(result.assessment);
    } catch (requestError) {
      setError(requestError.message || copy.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  const openRecovery = () => navigate("/incidents", {
    state: {
      suggestedScenario: recoveryScenarioFor(assessment),
      assessmentSummary: assessment ? { riskLevel: assessment.riskLevel, score: assessment.score, categories: assessment.categories, evidenceCount } : null,
    },
  });

  return (
    <div className="check-center">
      <header className="check-header">
        <button type="button" className="back-link" onClick={() => navigate(-1)}>{copy.back}</button>
        <div>
          <span className="check-eyebrow">{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
        </div>
      </header>

      <main className="check-layout">
        <section className="check-workspace">
          <div className="workspace-topline">
            <div>
              <span className="micro-label">01 / INPUT</span>
              <strong>{selected[0]}</strong>
            </div>
            <div className="privacy-badge" title={copy.privacy}>🔒 {telugu ? "లోకల్-ఫస్ట్" : "Privacy-first"}</div>
          </div>

          <div className="input-tabs" role="tablist" aria-label={copy.inputAria}>
            {INPUTS.map((id) => (
              <button key={id} type="button" role="tab" aria-selected={inputType === id} className={inputType === id ? "is-active" : ""} onClick={() => { setInputType(id); setAssessment(null); setError(""); }} title={copy.inputs[id][1]}>
                <span>{copy.inputs[id][0]}</span><small>{copy.inputs[id][1]}</small>
              </button>
            ))}
          </div>

          <form onSubmit={submit}>
            <label htmlFor="safety-input">{selected[0]} {copy.labelSuffix}</label>
            <div className="input-shell">
              <textarea id="safety-input" value={text} onChange={(event) => { setText(event.target.value); if (assessment) setAssessment(null); }} maxLength={12000} placeholder={copy.placeholder.replace("{item}", selected[1].toLowerCase())} aria-describedby="privacy-note" />
              <div className="textarea-tools">
                <span>{text.length.toLocaleString()} / 12,000</span>
                <div>
                  <button type="button" onClick={pasteFromClipboard} disabled={pasteBusy}>{pasteBusy ? "…" : copy.paste}</button>
                  <button type="button" onClick={reset} disabled={!text && !assessment}>{copy.clear}</button>
                </div>
              </div>
            </div>
            <div className="check-form-footer">
              <span>{telugu ? "సబ్మిట్ చేసిన టెక్స్ట్ మాత్రమే విశ్లేషించబడుతుంది." : "Only the text you submit is analyzed."}</span>
              <button className="check-submit" type="submit" disabled={loading}>{loading ? copy.checking : copy.submit} <span aria-hidden="true">→</span></button>
            </div>
          </form>
          <p className="privacy-note" id="privacy-note">{copy.privacy}</p>
          {error && <div className="check-error" role="alert">⚠ {error}</div>}
        </section>

        <aside className={`assessment-panel ${assessment ? `risk-${level}` : "empty"}`} aria-live="polite">
          {!assessment ? (
            <div className="assessment-empty">
              <div className="shield-mark" aria-hidden="true">◈</div>
              <span>{copy.emptyReady}</span>
              <h2>{copy.emptyTitle}</h2>
              <p>{copy.emptyText}</p>
              <div className="empty-flow"><span>Detect</span><i>→</i><span>Understand</span><i>→</i><span>Protect</span></div>
            </div>
          ) : (
            <>
              <div className="result-topline"><span>{copy.assessment}</span><strong>{String(level).toUpperCase()}</strong></div>
              <div className="score-row">
                <div className="score-ring" style={{ "--score": `${score * 3.6}deg` }} aria-label={`${score} out of 100`}><span>{score}</span><small>/100</small></div>
                <div className="score-copy"><span className="micro-label">DECISION SIGNAL</span><h2>{headline}</h2><p>{explanation}</p></div>
              </div>
              <div className="decision-summary"><strong>{telugu ? "ఫలితం ఎలా వచ్చింది?" : "Evidence behind the decision"}</strong><span>{evidenceCount > 0 ? (telugu ? `${evidenceCount} థ్రెట్ ఇంటెలిజెన్స్ ఆధారం(లు) సరిపోలాయి.` : `${evidenceCount} threat-intelligence match(es) support the result.`) : (telugu ? "లోకల్ భద్రతా నియమాలు మరియు గుర్తించిన సంకేతాల ఆధారంగా." : "Based on local safety rules and extracted signals.")}</span></div>
              <div className="result-stats"><span><b>{evidenceCount}</b> {telugu ? "మ్యాచ్‌లు" : "matches"}</span><span><b>{sourceCount}</b> {telugu ? "ధృవీకరించిన మూలాలు" : "verified sources"}</span><span><b>{assessment.indicators?.length || 0}</b> {telugu ? "గుర్తింపులు" : "identifiers"}</span></div>

              {assessment.reasons?.length > 0 && <div className="evidence-block"><span className="result-label">{copy.why}</span><ul>{assessment.reasons.slice(0, 6).map((reason) => <li key={reason}>{reason}</li>)}</ul></div>}
              {assessment.indicators?.length > 0 && <div className="evidence-block"><span className="result-label">{copy.identifiers}</span><div className="indicator-list">{assessment.indicators.map((indicator) => <span key={`${indicator.type}-${indicator.value}`}>{indicator.type}: {indicator.value}</span>)}</div></div>}
              {evidenceCount > 0 && <div className="evidence-block"><span className="result-label">{copy.evidence}</span>{assessment.evidence.slice(0, 4).map((item) => <article key={item.threatId || item.title}><strong>{item.title}</strong><small>{String(item.severity || "info").toUpperCase()} • {item.confidence ?? 0}% confidence</small>{formatEvidenceMatches(item).slice(0, 5).map((match) => <span className="evidence-chip" key={match}>{match}</span>)}</article>)}</div>}
              {sourceCount > 0 && <div className="evidence-block"><span className="result-label">{copy.verified}</span><div className="indicator-list">{assessment.verifiedSources.slice(0, 4).map((source) => <span key={source.id || source.name}>{source.name || source.id}</span>)}</div></div>}

              <div className="next-actions"><span className="result-label">{copy.next}</span><p>{assessment.actionPlan?.steps?.[0] || (telugu ? "స్వతంత్ర అధికారిక ఛానల్ ద్వారా అభ్యర్థనను ధృవీకరించండి." : "Pause and verify the request through an independent official channel.")}</p>{(level === "critical" || level === "high" || evidenceCount > 0) && <button type="button" onClick={openRecovery}>{copy.incident} <span aria-hidden="true">→</span></button>}</div>
            </>
          )}
        </aside>
      </main>
    </div>
  );
}

export default CheckCenter;
