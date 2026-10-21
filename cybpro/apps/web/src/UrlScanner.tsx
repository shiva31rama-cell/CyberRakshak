import { useState } from "react";
import { ArrowUpRight, Link2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

type Report = {
  status: string;
  risk: "elevated" | "some" | "no_obvious_indicators";
  confidence: "limited";
  indicators: string[];
  guidance: string[];
  caveat: string;
  reputation: {
    status: "not_configured" | "checked" | "unavailable" | "not_checked_private_address";
    source: string | null;
    checkedAt: string | null;
    matches: string[];
    detail: string;
  };
};

export default function UrlScanner() {
  const [url, setUrl] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function analyze() {
    if (!url.trim() || busy) return;
    setBusy(true);
    setError("");
    setReport(null);
    try {
      const response = await fetch(`${API_BASE}/api/v1/analyze/url`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url })
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "URL analysis is unavailable.");
      setReport(body as Report);
    } catch {
      setError("The URL analysis service is not reachable. Start the CYBPRO API and try again.");
    } finally {
      setBusy(false);
    }
  }

  const reputationLabel = report?.reputation.status === "checked"
    ? (report.reputation.matches.length ? "Threat match reported" : "No known match returned")
    : report?.reputation.status === "unavailable"
      ? "Lookup unavailable"
      : report?.reputation.status === "not_checked_private_address"
        ? "Private/local address not checked externally"
        : "Live lookup not configured";

  return (
    <section className="url-workspace">
      <div className="section-heading">
        <div><span className="eyebrow"><Link2 size={14} /> CHECK THE ADDRESS, NOT THE WEBSITE</span><h2>Inspect a URL</h2><p>CYBPRO checks visible URL traits locally and can optionally query a configured reputation provider. It never opens the submitted destination.</p></div>
        <span className="preview-tag">EARLY PREVIEW</span>
      </div>
      <div className="scanner-card">
        <label htmlFor="url-input">Website address</label>
        <input id="url-input" type="url" value={url} onChange={(event) => setUrl(event.target.value)} maxLength={2048} placeholder="https://example.com" />
        <div className="input-footer"><span>Never enter passwords or private tokens in a URL. If live lookup is enabled, the submitted URL is shared with the configured provider.</span><button onClick={analyze} disabled={!url.trim() || busy}>{busy ? "Checking…" : "Inspect URL"} <ArrowUpRight size={16} /></button></div>
      </div>
      {error && <p className="error-message" role="alert">{error}</p>}
      {report && <div className="report-card" aria-live="polite"><div className="report-title"><Link2 size={20} /><div><b>URL signal report</b><small>Local parsing plus optional reputation lookup · not a destination verdict</small></div></div><p className="risk-label">Risk signal: {report.risk.replaceAll("_", " ")}</p><p>Confidence: {report.confidence} (limited rule-based coverage)</p><p>{report.caveat}</p><h3>Observable URL traits</h3>{report.indicators.length ? <ul>{report.indicators.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No configured URL warning traits were observed. This does not mean the destination is safe.</p>}<h3>Live reputation evidence</h3><p><b>{reputationLabel}</b></p><p>{report.reputation.detail}</p>{report.reputation.source && <p>Source: {report.reputation.source}{report.reputation.checkedAt ? ` · Checked at ${new Date(report.reputation.checkedAt).toLocaleString()}` : ""}</p>}{report.reputation.matches.length > 0 && <ul>{report.reputation.matches.map((item) => <li key={item}>{item}</li>)}</ul>}</div>}
    </section>
  );
}
