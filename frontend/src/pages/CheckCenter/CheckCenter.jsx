import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import { consumeLatestSharedText } from "../../services/shareInbox";
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
  const [sharedImport, setSharedImport] = useState(false);

  useEffect(() => {
    if (location.state?.inputType) setInputType(location.state.inputType);
    if (typeof location.state?.text === "string") setText(location.state.text);
  }, [location.state]);

  useEffect(() => {
    if (!location.search.includes("share=1")) return;
    let cancelled = false;
    const loadSharedSignal = async () => {
      try {
        const shared = await consumeLatestSharedText();
        if (cancelled || !shared) return;
        const imported = [shared.title, shared.text, shared.url].filter(Boolean).join("\n").slice(0, 12000);
        setInputType("message");
        setText(imported);
        setSharedImport(true);
        window.history.replaceState({}, "", "/check");
      } catch {
        if (!cancelled) setError(telugu ? "షేర్ చేసిన భద్రతా సంకేతాన్ని చదవలేకపోయాము." : "The shared safety signal could not be imported.");
      }
    };
    loadSharedSignal();
    return () => { cancelled = true; };
  }, [location.search, telugu]);

  const selected = useMemo(() => copy.inputs[inputType] || copy.inputs.message, [copy, inputType]);

  const runAnalysis = async (value = text, type = inputType) => {
    const clean = String(value || "").trim();
    if (!clean) { setError(copy.errorEmpty); return; }
    setLoading(true); setError(""); setAssessment(null);
    try {
      const result = await apiRequest("/analyze", { method: "POST", body: JSON.stringify({ text: clean, inputType: type }) });
      setAssessment(result.assessment);
    } catch (requestError) {
      setError(requestError.message || copy.errorGeneric);
    } finally { setLoading(false); }
  };

  const submit = async (event) => {
    event.preventDefault();
    await runAnalysis();
  };

  const level = assessment?.riskLevel || "info";
  const [headline, explanation] = copy.risk[level] || copy.risk.info;
  const evidenceCount = assessment?.evidence?.length || 0;
  const sourceCount = assessment?.verifiedSources?.length || 0;

  const openRecovery = () => navigate("/incidents", {
    state: {
      suggestedScenario: recoveryScenarioFor(assessment),
      assessmentSummary: assessment ? {
        riskLevel: assessment.riskLevel,
        score: assessment.score,
        categories: assessment.categories,
        evidenceCount,
      } : null,
    },
  });

  return (
    <div className="check-center">
      <header className="check-header">
        <button type="button" className="back-link" onClick={() => navigate(-1)}>{copy.back}</button>
        <div><span className="check-eyebrow">{copy.eyebrow}</span><h1>{copy.title}</h1><p>{copy.intro}</p></div>
      </header>
      {sharedImport && <div className="share-import-banner" role="status">
        <strong>{telugu ? "Android భద్రతా సంకేతం దిగుమతి అయింది" : "Android safety signal imported"}</strong>
        <span>{telugu ? "ఇది స్థానికంగా గుర్తించిన సంకేతం మాత్రమే. అసలు సందేశం/కంటెంట్‌ను మీరు స్వయంగా ఇక్కడ ధృవీకరించండి." : "This is a local signal, not proof that the original message is malicious. Review the original content here before acting."}</span>
      </div>}
      <main className="check-layout">
        <section className="check-workspace">
          <div className="input-tabs" role="tablist" aria-label={telugu ? "ఏం చెక్ చేస్తున్నారు?" : "What are you checking?"}>
            {INPUTS.map((id) => <button key={id} type="button" className={inputType === id ? "is-active" : ""} onClick={() => { setInputType(id); setAssessment(null); setError(""); }}>{copy.inputs[id][0]}</button>)}
          </div>
          <form onSubmit={submit}>
            <label htmlFor="safety-input">{selected[0]} {copy.labelSuffix}</label>
            <textarea id="safety-input" value={text} onChange={(event) => setText(event.target.value)} maxLength={12000} placeholder={copy.placeholder.replace("{item}", selected[1].toLowerCase())} aria-describedby="privacy-note" />
            <div className="check-form-footer"><span>{copy.count.replace("{count}", text.length.toLocaleString())}</span><button className="check-submit" type="submit" disabled={loading}>{loading ? copy.checking : copy.submit}</button></div>
          </form>
          <p className="privacy-note" id="privacy-note">{copy.privacy}</p>
          {error && <div className="check-error" role="alert">{error}</div>}
        </section>
        <aside className={`assessment-panel ${assessment ? `risk-${level}` : "empty"}`} aria-live="polite">
          {!assessment ? <div className="assessment-empty"><div className="shield-mark" aria-hidden="true">◈</div><span>{copy.emptyReady}</span><h2>{copy.emptyTitle}</h2><p>{copy.emptyText}</p></div> : <>
            <div className="result-topline"><span>{copy.assessment}</span><strong>{String(level).toUpperCase()}</strong></div>
            <div className="result-score"><span>{assessment.score}</span><small>/100</small></div>
            <h2>{headline}</h2><p>{explanation}</p>
            <div className="decision-summary">
              <strong>{telugu ? "ఫలితం ఎలా వచ్చింది?" : "How this result was reached"}</strong>
              <span>{evidenceCount > 0 ? (telugu ? `${evidenceCount} థ్రెట్ ఇంటెలిజెన్స్ ఆధారం(లు) సరిపోలాయి.` : `${evidenceCount} threat-intelligence match(es) support the result.`) : (telugu ? "లోకల్ భద్రతా నియమాలు మరియు గుర్తించిన సంకేతాల ఆధారంగా." : "Based on local safety rules and extracted signals.")}</span>
            </div>
            {assessment.reasons?.length > 0 && <div className="evidence-block"><span className="result-label">{copy.why}</span><ul>{assessment.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></div>}
            {assessment.indicators?.length > 0 && <div className="evidence-block"><span className="result-label">{copy.identifiers}</span><div className="indicator-list">{assessment.indicators.map((indicator) => <span key={`${indicator.type}-${indicator.value}`}>{indicator.type}: {indicator.value}</span>)}</div></div>}
            {evidenceCount > 0 && <div className="evidence-block"><span className="result-label">{copy.evidence}</span>{assessment.evidence.map((item) => <article key={item.threatId || item.title}><strong>{item.title}</strong><small>{String(item.severity || "info").toUpperCase()} • {item.confidence ?? 0}% confidence</small>{formatEvidenceMatches(item).map((match) => <span className="evidence-chip" key={match}>{match}</span>)}</article>)}</div>}
            {sourceCount > 0 && <div className="evidence-block"><span className="result-label">{telugu ? "ధృవీకరించిన మూలాలు" : "Verified sources"}</span><div className="indicator-list">{assessment.verifiedSources.slice(0, 4).map((source) => <span key={source.id || source.name}>{source.name || source.id}</span>)}</div></div>}
            <div className="next-actions"><span className="result-label">{copy.next}</span><p>{assessment.actionPlan?.steps?.[0] || (telugu ? "స్వతంత్ర అధికారిక ఛానల్ ద్వారా అభ్యర్థనను ధృవీకరించండి." : "Pause and verify the request through an independent official channel.")}</p>{(level === "critical" || level === "high" || evidenceCount > 0) && <button type="button" onClick={openRecovery}>{copy.incident}</button>}</div>
          </>}
        </aside>
      </main>
    </div>
  );
}

export default CheckCenter;
