import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./IncidentMode.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const FALLBACK_SCENARIOS = [
  { id: "clicked", title: "I clicked a suspicious link", urgency: "high", summary: "You opened a link and are unsure what happened." },
  { id: "paid", title: "I sent money or approved a payment", urgency: "critical", summary: "A UPI, card or bank payment may have gone to the wrong person." },
  { id: "shared", title: "I shared sensitive information", urgency: "critical", summary: "You shared a password, OTP, identity detail or banking information." },
  { id: "installed", title: "I installed a suspicious app", urgency: "critical", summary: "An unfamiliar APK or app was installed or requested unusual access." },
  { id: "account", title: "My account may be compromised", urgency: "critical", summary: "You see unexpected logins, messages, settings or transactions." },
  { id: "message", title: "I received a suspicious message", urgency: "caution", summary: "Nothing has happened yet, but the message looks suspicious." },
];

function IncidentMode() {
  const [scenarios, setScenarios] = useState(FALLBACK_SCENARIOS);
  const [scenario, setScenario] = useState("");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE}/incidents/scenarios`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Unable to load recovery scenarios")))
      .then((data) => { if (active && data.scenarios?.length) setScenarios(data.scenarios); })
      .catch(() => {})
      .finally(() => {});
    return () => { active = false; };
  }, []);

  const selectScenario = async (id) => {
    setScenario(id);
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/incidents/${encodeURIComponent(id)}`);
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to load the recovery plan");
      setPlan(data.plan);
    } catch (requestError) {
      setPlan(null);
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const urgencyLabel = useMemo(() => {
    if (!plan) return "";
    return plan.urgency === "critical" ? "Act now" : plan.urgency === "high" ? "Act soon" : "Stay cautious";
  }, [plan]);

  return (
    <div className="incident-mode">
      <header className="incident-header">
        <span>INCIDENT MODE · RECOVERY</span>
        <h1>Something happened. Let’s make the next move safer.</h1>
        <p>You do not need to diagnose the scam first. Choose what happened and CyberRakshak will give you an ordered recovery path.</p>
      </header>

      <section className="incident-grid" aria-label="Choose what happened">
        {scenarios.map((item) => (
          <button key={item.id} type="button" className={scenario === item.id ? "incident-choice active" : "incident-choice"} onClick={() => selectScenario(item.id)} aria-pressed={scenario === item.id}>
            <span className={`incident-severity ${item.urgency || "caution"}`}>{item.urgency || "caution"}</span>
            <strong>{item.title}</strong>
            <span>{item.summary || item.text}</span>
          </button>
        ))}
      </section>

      {loading && <div className="recovery-loading" role="status">Building your recovery checklist…</div>}
      {error && <div className="recovery-error" role="alert">{error}</div>}

      {plan && !loading && (
        <section className={`recovery-panel ${plan.urgency}`} aria-live="polite">
          <div className="recovery-heading">
            <div>
              <span>NEXT SAFEST STEPS · {urgencyLabel.toUpperCase()}</span>
              <strong>{plan.title}</strong>
            </div>
          </div>
          <p className="recovery-summary">{plan.summary}</p>

          <div className="recovery-columns">
            <div>
              <h2>1. Act now</h2>
              <ol>{plan.immediate.map((step) => <li key={step}>{step}</li>)}</ol>
            </div>
            <div>
              <h2>2. Check & preserve</h2>
              <ol>{plan.verify.map((step) => <li key={step}>{step}</li>)}</ol>
            </div>
          </div>

          <div className="recovery-resources">
            <h2>Official help</h2>
            {plan.resources.map((resource) => (
              <a key={resource.id} href={resource.url} target="_blank" rel="noreferrer">
                <strong>{resource.label}</strong>
                <span>{resource.note}</span>
              </a>
            ))}
          </div>

          <div className="recovery-links">
            <Link to="/check">Check the original message, link or identifier →</Link>
            <Link to="/report-scam">Document / report the incident →</Link>
          </div>
        </section>
      )}

      <aside className="incident-note">
        <strong>Privacy first</strong>
        <p>Do not submit passwords, OTPs, PINs, full card numbers or recovery codes. CyberRakshak does not need those secrets to guide recovery.</p>
      </aside>
    </div>
  );
}

export default IncidentMode;
