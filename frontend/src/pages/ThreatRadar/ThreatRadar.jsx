import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../services/api";
import "./ThreatRadar.css";

const CATEGORIES = ["all", "payments", "mobile", "phishing", "social-engineering", "malware", "identity"];

const severityMeta = {
  critical: { label: "Critical", icon: "⛔" },
  high: { label: "High", icon: "🔴" },
  medium: { label: "Medium", icon: "🟠" },
  low: { label: "Low", icon: "🟡" },
  info: { label: "Info", icon: "🔵" },
};

const ThreatRadar = () => {
  const [threats, setThreats] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        if (category !== "all") params.set("category", category);
        params.set("limit", "20");
        const data = await apiRequest(`/threats?${params.toString()}`);
        if (active) setThreats(data.threats || []);
      } catch (err) {
        if (active) setError(err.message || "Unable to load threat intelligence.");
      } finally {
        if (active) setLoading(false);
      }
    };

    const timer = window.setTimeout(load, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query, category]);

  const summary = useMemo(() => threats.reduce((acc, threat) => {
    acc[threat.severity] = (acc[threat.severity] || 0) + 1;
    return acc;
  }, {}), [threats]);

  const openThreat = async (threat) => {
    try {
      const data = await apiRequest(`/threats/${encodeURIComponent(threat.threatId || threat.id)}`);
      setSelected(data.threat || threat);
    } catch {
      setSelected(threat);
    }
  };

  return (
    <section className="threat-radar-page">
      <div className="threat-radar-hero">
        <div>
          <span className="eyebrow">CYBERRAKSHAK 2.0 · THREAT INTELLIGENCE</span>
          <h1>Know what is targeting people <span>right now.</span></h1>
          <p>Explore verified cyber-safety intelligence and understand the warning signs before you click, pay, install, or share.</p>
        </div>
        <Link className="radar-check" to="/check">Check something →</Link>
      </div>

      <div className="radar-stats" aria-label="Threat summary">
        <div><strong>{threats.length}</strong><span>Visible threats</span></div>
        <div><strong>{summary.critical || 0}</strong><span>Critical</span></div>
        <div><strong>{summary.high || 0}</strong><span>High risk</span></div>
        <div><strong>{new Set(threats.flatMap((item) => (item.sources || []).map((source) => source.id))).size}</strong><span>Sources</span></div>
      </div>

      <div className="radar-controls">
        <label className="radar-search">
          <span>⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search threats, scams, malware..." aria-label="Search threats" />
        </label>
        <div className="category-scroll" role="group" aria-label="Threat categories">
          {CATEGORIES.map((item) => (
            <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item.replace("-", " ")}</button>
          ))}
        </div>
      </div>

      {error && <div className="radar-error" role="alert">⚠️ {error}</div>}

      {loading ? (
        <div className="radar-loading">Loading current intelligence…</div>
      ) : threats.length === 0 ? (
        <div className="radar-empty"><strong>No matching threats found.</strong><span>Try a broader search or another category.</span></div>
      ) : (
        <div className="threat-grid">
          {threats.map((threat) => {
            const meta = severityMeta[threat.severity] || severityMeta.info;
            return (
              <button className={`threat-card severity-${threat.severity}`} key={threat.threatId || threat.id} onClick={() => openThreat(threat)}>
                <div className="threat-card-top"><span className="severity-pill">{meta.icon} {meta.label}</span><span>{threat.category}</span></div>
                <h2>{threat.title}</h2>
                <p>{threat.description}</p>
                <div className="threat-card-bottom"><span>{threat.sources?.length || 0} source{threat.sources?.length === 1 ? "" : "s"}</span><span>{threat.sourceConfidence ?? 0}% confidence</span></div>
              </button>
            );
          })}
        </div>
      )}

      {selected && (
        <div className="threat-modal-backdrop" role="presentation" onClick={() => setSelected(null)}>
          <article className="threat-modal" role="dialog" aria-modal="true" aria-label={selected.title} onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close threat details">×</button>
            <span className="severity-pill">{(severityMeta[selected.severity] || severityMeta.info).icon} {(severityMeta[selected.severity] || severityMeta.info).label}</span>
            <h2>{selected.title}</h2>
            <p className="modal-description">{selected.description}</p>
            <h3>What to watch for</h3>
            <ul>{(selected.indicators || selected.matchedIndicators || []).slice(0, 8).map((indicator, index) => <li key={`${index}-${String(indicator)}`}>{typeof indicator === "string" ? indicator : indicator.value || indicator.description}</li>)}</ul>
            <h3>Trusted sources</h3>
            <div className="source-list">{(selected.sources || []).map((source) => <div key={source.id}><strong>{source.name}</strong><span>Tier {source.tier} · {source.confidence ?? 0}% confidence</span></div>)}</div>
            <Link className="modal-action" to="/check">Check a message or link →</Link>
          </article>
        </div>
      )}
    </section>
  );
};

export default ThreatRadar;
