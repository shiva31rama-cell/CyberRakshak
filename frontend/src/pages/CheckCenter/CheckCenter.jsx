import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import "./CheckCenter.css";

const INPUTS = [
  ["message", "Message", "SMS, WhatsApp, email or DM"],
  ["url", "Link", "A URL you have not opened yet"],
  ["upi", "UPI", "UPI ID or payment request"],
  ["phone", "Phone", "An unfamiliar Indian number"],
  ["email", "Email", "A sender address or email text"],
  ["qr_payload", "QR", "Decoded QR text or payment payload"],
];

const levelCopy = {
  critical: ["Do not proceed", "Strong warning signals were found. Pause and use the recommended safe actions."],
  high: ["High caution", "Several meaningful scam indicators were found. Do not pay, share codes, or open links yet."],
  medium: ["Needs review", "There are warning signals, but the available evidence is not enough to call it malicious."],
  low: ["Lower risk", "A few signals were found, but keep normal caution and verify important requests independently."],
  info: ["No strong signal", "Nothing in the local checks strongly indicates a known scam pattern. That is not a guarantee of safety."],
};

function CheckCenter() {
  const location = useLocation();
  const navigate = useNavigate();
  const [inputType, setInputType] = useState(location.state?.inputType || "message");
  const [text, setText] = useState(location.state?.text || "");
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.inputType) setInputType(location.state.inputType);
    if (typeof location.state?.text === "string") setText(location.state.text);
  }, [location.state]);

  const selected = useMemo(
    () => INPUTS.find(([id]) => id === inputType) || INPUTS[0],
    [inputType],
  );

  const submit = async (event) => {
    event.preventDefault();
    const clean = text.trim();
    if (!clean) {
      setError("Add the message, link, identifier or QR text you want to check.");
      return;
    }

    setLoading(true);
    setError("");
    setAssessment(null);
    try {
      const result = await apiRequest("/analyze", {
        method: "POST",
        body: JSON.stringify({ text: clean, inputType }),
      });
      setAssessment(result.assessment);
    } catch (requestError) {
      setError(requestError.message || "The safety check could not be completed.");
    } finally {
      setLoading(false);
    }
  };

  const level = assessment?.riskLevel || "info";
  const [headline, explanation] = levelCopy[level] || levelCopy.info;

  return (
    <div className="check-center">
      <header className="check-header">
        <button type="button" className="back-link" onClick={() => navigate(-1)}>← Back</button>
        <div>
          <span className="check-eyebrow">CYBERRAKSHAK CHECK CENTER</span>
          <h1>Pause. Check. Then decide.</h1>
          <p>Start with local analysis. We look for recognizable signals and show the evidence instead of pretending a score is certainty.</p>
        </div>
      </header>

      <main className="check-layout">
        <section className="check-workspace">
          <div className="input-tabs" role="tablist" aria-label="What are you checking?">
            {INPUTS.map(([id, label, hint]) => (
              <button
                key={id}
                type="button"
                className={inputType === id ? "is-active" : ""}
                onClick={() => { setInputType(id); setAssessment(null); setError(""); }}
                title={hint}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={submit}>
            <label htmlFor="safety-input">{selected[1]} to check</label>
            <textarea
              id="safety-input"
              value={text}
              onChange={(event) => setText(event.target.value)}
              maxLength={12000}
              placeholder={`Paste ${selected[2].toLowerCase()} here…`}
              aria-describedby="privacy-note"
            />
            <div className="check-form-footer">
              <span>{text.length.toLocaleString()} / 12,000</span>
              <button className="check-submit" type="submit" disabled={loading}>
                {loading ? "Checking…" : "Run safety check →"}
              </button>
            </div>
          </form>

          <p className="privacy-note" id="privacy-note">
            🔒 Local-first design: the web check uses the CyberRakshak API only when you submit. Do not paste passwords, OTPs, card PINs or other secrets.
          </p>

          {error && <div className="check-error" role="alert">{error}</div>}
        </section>

        <aside className={`assessment-panel ${assessment ? `risk-${level}` : "empty"}`} aria-live="polite">
          {!assessment ? (
            <div className="assessment-empty">
              <div className="shield-mark" aria-hidden="true">◈</div>
              <span>READY</span>
              <h2>Your result appears here.</h2>
              <p>We will show a risk level, the signals found, matching threat evidence and practical next steps.</p>
            </div>
          ) : (
            <>
              <div className="result-topline">
                <span>ASSESSMENT</span>
                <strong>{String(level).toUpperCase()}</strong>
              </div>
              <div className="result-score">
                <span>{assessment.score}</span><small>/100</small>
              </div>
              <h2>{headline}</h2>
              <p>{explanation}</p>

              {assessment.reasons?.length > 0 && (
                <div className="evidence-block">
                  <span className="result-label">WHY</span>
                  <ul>{assessment.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
                </div>
              )}

              {assessment.indicators?.length > 0 && (
                <div className="evidence-block">
                  <span className="result-label">IDENTIFIERS FOUND</span>
                  <div className="indicator-list">
                    {assessment.indicators.map((indicator) => (
                      <span key={`${indicator.type}-${indicator.value}`}>
                        {indicator.type}: {indicator.value}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {assessment.evidence?.length > 0 && (
                <div className="evidence-block">
                  <span className="result-label">THREAT EVIDENCE</span>
                  {assessment.evidence.map((item) => (
                    <article key={item.threatId}>
                      <strong>{item.title}</strong>
                      <small>{item.severity.toUpperCase()} • matched: {item.matches.join(", ")}</small>
                    </article>
                  ))}
                </div>
              )}

              <div className="next-actions">
                <span className="result-label">NEXT SAFEST MOVE</span>
                <p>{assessment.recommendation || "Pause and verify the request through an independent official channel."}</p>
                <button type="button" onClick={() => navigate("/incidents")}>Something already happened? Open Incident Mode →</button>
              </div>
            </>
          )}
        </aside>
      </main>
    </div>
  );
}

export default CheckCenter;
