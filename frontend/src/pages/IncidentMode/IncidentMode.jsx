import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import "./IncidentMode.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const SCENARIOS = ["clicked", "paid", "shared", "installed", "account", "message"];
const fallback = {
  clicked: ["I clicked a suspicious link", "You opened a link and are unsure what happened."],
  paid: ["I sent money or approved a payment", "A UPI, card or bank payment may have gone to the wrong person."],
  shared: ["I shared sensitive information", "You shared a password, OTP, identity detail or banking information."],
  installed: ["I installed a suspicious app", "An unfamiliar APK or app was installed or requested unusual access."],
  account: ["My account may be compromised", "You see unexpected logins, messages, settings or transactions."],
  message: ["I received a suspicious message", "Nothing has happened yet, but the message looks suspicious."],
};

function IncidentMode() {
  const location = useLocation();
  const { language } = useLanguage();
  const telugu = language === "te";
  const suggestedScenario = location.state?.suggestedScenario;
  const assessmentSummary = location.state?.assessmentSummary;
  const [scenarios, setScenarios] = useState(SCENARIOS.map((id) => ({ id, title: fallback[id][0], summary: fallback[id][1], urgency: id === "message" ? "caution" : "critical" })));
  const [scenario, setScenario] = useState("");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadPlan = async (id) => {
    setScenario(id); setLoading(true); setError("");
    try {
      const response = await fetch(`${API_BASE}/incidents/${encodeURIComponent(id)}`);
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to load the recovery plan");
      setPlan(data.plan);
    } catch (requestError) {
      setPlan(null); setError(requestError.message);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE}/incidents/scenarios`)
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => { if (active && data.scenarios?.length) setScenarios(data.scenarios); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (SCENARIOS.includes(suggestedScenario)) loadPlan(suggestedScenario);
  }, [suggestedScenario]);

  const urgencyLabel = useMemo(() => {
    if (!plan) return "";
    if (plan.urgency === "critical") return telugu ? "ఇప్పుడే చర్య తీసుకోండి" : "Act now";
    if (plan.urgency === "high") return telugu ? "త్వరగా చర్య తీసుకోండి" : "Act soon";
    return telugu ? "జాగ్రత్తగా ఉండండి" : "Stay cautious";
  }, [plan, telugu]);

  return <div className="incident-mode">
    <header className="incident-header"><span>{telugu ? "ఇన్సిడెంట్ మోడ్ · రికవరీ" : "INCIDENT MODE · RECOVERY"}</span><h1>{telugu ? "ఏదైనా జరిగిందా? తర్వాతి సురక్షిత చర్యను కలిసి నిర్ణయిద్దాం." : "Something happened. Let’s make the next move safer."}</h1><p>{telugu ? "ముందుగా స్కామ్‌ను గుర్తించాల్సిన అవసరం లేదు. ఏం జరిగిందో ఎంచుకోండి; CyberRakshak క్రమబద్ధమైన రికవరీ మార్గాన్ని చూపిస్తుంది." : "You do not need to diagnose the scam first. Choose what happened and CyberRakshak will give you an ordered recovery path."}</p></header>
    {suggestedScenario && <div className="recovery-loading" role="status">{telugu ? "మీ చెక్ ఫలితానికి సరిపోయే రికవరీ మార్గాన్ని ఎంచుకున్నాం." : "We selected the recovery path that best matches your check result."}{assessmentSummary?.score != null && <span>{telugu ? ` రిస్క్ స్కోర్: ${assessmentSummary.score}/100` : ` Risk score: ${assessmentSummary.score}/100`}</span>}</div>}
    <section className="incident-grid" aria-label={telugu ? "ఏం జరిగిందో ఎంచుకోండి" : "Choose what happened"}>{scenarios.map((item) => <button key={item.id} type="button" className={scenario === item.id ? "incident-choice active" : "incident-choice"} onClick={() => loadPlan(item.id)} aria-pressed={scenario === item.id}><span className={`incident-severity ${item.urgency || "caution"}`}>{item.urgency || "caution"}</span><strong>{item.title}</strong><span>{item.summary || item.text}</span></button>)}</section>
    {loading && <div className="recovery-loading" role="status">{telugu ? "మీ రికవరీ చెక్‌లిస్ట్‌ను సిద్ధం చేస్తోంది…" : "Building your recovery checklist…"}</div>}
    {error && <div className="recovery-error" role="alert">{error}</div>}
    {plan && !loading && <section className={`recovery-panel ${plan.urgency}`} aria-live="polite"><div className="recovery-heading"><div><span>{telugu ? `తదుపరి సురక్షిత చర్యలు · ${urgencyLabel.toUpperCase()}` : `NEXT SAFEST STEPS · ${urgencyLabel.toUpperCase()}`}</span><strong>{plan.title}</strong></div></div><p className="recovery-summary">{plan.summary}</p><div className="recovery-columns"><div><h2>{telugu ? "1. ఇప్పుడే చర్య" : "1. Act now"}</h2><ol>{plan.immediate.map((step) => <li key={step}>{step}</li>)}</ol></div><div><h2>{telugu ? "2. చెక్ చేసి భద్రపరచండి" : "2. Check & preserve"}</h2><ol>{plan.verify.map((step) => <li key={step}>{step}</li>)}</ol></div></div><div className="recovery-resources"><h2>{telugu ? "అధికారిక సహాయం" : "Official help"}</h2>{plan.resources.map((resource) => <a key={resource.id} href={resource.url} target="_blank" rel="noreferrer"><strong>{resource.label}</strong><span>{resource.note}</span></a>)}</div><div className="recovery-links"><Link to="/check">{telugu ? "అసలు మెసేజ్, లింక్ లేదా గుర్తింపును చెక్ చేయండి →" : "Check the original message, link or identifier →"}</Link><Link to="/report-scam">{telugu ? "ఇన్సిడెంట్‌ను నమోదు / రిపోర్ట్ చేయండి →" : "Document / report the incident →"}</Link></div></section>}
    <aside className="incident-note"><strong>{telugu ? "గోప్యత ముందుగా" : "Privacy first"}</strong><p>{telugu ? "పాస్‌వర్డ్‌లు, OTPలు, PINలు, పూర్తి కార్డ్ నంబర్లు లేదా recovery codes పంపవద్దు. రికవరీ మార్గదర్శకానికి ఆ రహస్యాలు అవసరం లేదు." : "Do not submit passwords, OTPs, PINs, full card numbers or recovery codes. CyberRakshak does not need those secrets to guide recovery."}</p></aside>
  </div>;
}

export default IncidentMode;
