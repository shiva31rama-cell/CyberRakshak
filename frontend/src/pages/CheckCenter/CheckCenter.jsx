import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import { useLanguage } from "../../i18n/LanguageContext";
import "./CheckCenter.css";

const INPUTS = ["message", "url", "upi", "phone", "email", "qr_payload"];

const formatEvidenceMatches = (item) => {
  const indicators = (item.matchedIndicators || []).map((match) => `${match.type || "indicator"}: ${match.value}`);
  const signals = (item.matchedSignals || []).map((match) => `signal: ${match}`);
  return [...indicators, ...signals];
};

const recoveryScenarioFor = (assessment) => {
  const categories = new Set(assessment?.categories || []);
  if (categories.has("payment_fraud") || categories.has("upi_fraud")) return "paid";
  if (categories.has("malicious_app")) return "installed";
  if (categories.has("account_takeover")) return "account";
  if (categories.has("malicious_attachment")) return "clicked";
  if (categories.has("phishing") || categories.has("malicious_link")) return "clicked";
  if (assessment?.riskLevel === "critical" || assessment?.riskLevel === "high") return "message";
  return "message";
};

function CheckCenter() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const copy = t.check;
  const [inputType, setInputType] = useState(location.state?.inputType || "message");
  const [text, setText] = useState(location.state?.text || "");
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.inputType) setInputType(location.state.inputType);
    if (typeof location.state?.text === "string") setText(location.state.text);
  }, [location.state]);

  const selected = useMemo(() => copy.inputs[inputType] || copy.inputs.message, [copy, inputType]);

  const submit = async (event) => {
    event.preventDefault();
    const clean = text.trim();
    if (!clean) { setError(copy.errorEmpty); return; }
    setLoading(true); setError(""); setAssessment(null);
    try {
      const result = await apiRequest("/analyze", { method: "POST", body: JSON.stringify({ text: clean, inputType }) });
      setAssessment(result.assessment);
    } catch (requestError) {
      setError(requestError.message || copy.errorGeneric);
    } finally { setLoading(false); }
  };

  const level = assessment?.riskLevel || "info";
  const [headline, explanation] = copy.risk[level] || copy.risk.info;

  const openRecovery = () => {
    navigate("/incidents", {
      state: {
        suggestedScenario: recoveryScenarioFor(assessment),
        assessmentSummary: assessment ? {
          riskLevel: assessment.riskLevel,
          score: assessment.score,
          categories: assessment.categories,
          evidenceCount: assessment.evidence?.length || 0,
        } : null,
      },
    });
  };

  return (
    <div className="check-center">
      <header className="check-header">
        <button type="button" className="back-link" onClick={() => navigate(-1)}>{copy.back}</button>
        <div><span className="check-eyebrow">{copy.eyebrow}</span><h1>{copy.title}</h1><p>{copy.intro}</p></div>
      </header>
      <main className="check-layout">
        <section className="check-workspace">
          <div className="input-tabs" role="tablist" aria-label="What are you checking?">
            {INPUTS.map((id) => <button key={id} type="button" className={inputType === id ? "is-active" : ""} onClick={() => { setInputType(id); setAssessment(null); setError(""); }} title={copy.inputs[id][1]}>{copy.inputs[id][0]}</button>)}
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
            {assessment.reasons?.length > 0 && <div className="evidence-block"><span className="result-label">{copy.why}</span><ul>{assessment.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></div>}
            {assessment.indicators?.length > 0 && <div className="evidence-block"><span className="result-label">{copy.identifiers}</span><div className="indicator-list">{assessment.indicators.map((indicator) => <span key={`${indicator.type}-${indicator.value}`}>{indicator.type}: {indicator.value}</span>)}</div></div>}
            {assessment.evidence?.length > 0 && <div className="evidence-block"><span className="result-label">{copy.evidence}</span>{assessment.evidence.map((item) => {
              const matches = formatEvidenceMatches(item);
              return <article key={item.threatId || item.title}><strong>{item.title}</strong><small>{String(item.severity || "info").toUpperCase()} • {item.confidence ?? 0}% confidence</small>{matches.length > 0 && <div className="indicator-list">{matches.map((match) => <span key={match}>{match}</span>)}</div>}</article>;
            })}</div>}
            <div className="next-actions"><span className="result-label">{copy.next}</span><p>{assessment.recommendation || assessment.actionPlan?.steps?.[0] || "Pause and verify the request through an independent official channel."}</p><button type="button" onClick={openRecovery}>{copy.incident}</button></div>
          </>}
        </aside>
      </main>
    </div>
  );
}

export default CheckCenter;
