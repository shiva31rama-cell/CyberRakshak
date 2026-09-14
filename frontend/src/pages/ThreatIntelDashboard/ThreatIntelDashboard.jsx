import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../services/api";
import "./ThreatIntelDashboard.css";

const statusMeta = {
  healthy: { label: "Live", icon: "●" },
  degraded: { label: "Curated", icon: "◐" },
  failed: { label: "Unavailable", icon: "○" },
  manual: { label: "Manual", icon: "◐" },
};

const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };

function formatDate(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function sourceLabel(source) {
  if (!source) return "Unknown source";
  return source.name || source.id || "Unknown source";
}

function ThreatIntelDashboard() {
  const [health, setHealth] = useState(null);
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [healthData, threatData] = await Promise.all([
          apiRequest("/intelligence/health"),
          apiRequest("/threats?limit=12"),
        ]);
        if (!active) return;
        setHealth(healthData);
        setThreats(threatData.threats || []);
      } catch (err) {
        if (active) setError(err.message || "Unable to load the intelligence dashboard.");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => { active = false; };
  }, []);

  const sortedThreats = useMemo(() => [...threats].sort((a, b) => {
    const severityDiff = (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9);
    if (severityDiff !== 0) return severityDiff;
    return String(b.publishedAt || b.retrievedAt || "").localeCompare(String(a.publishedAt || a.retrievedAt || ""));
  }), [threats]);

  const summary = health?.summary || {};
  const liveFeeds = (health?.feeds || []).filter((feed) => feed.status === "healthy").length;
  const curatedFeeds = (health?.feeds || []).filter((feed) => feed.status === "manual" || feed.status === "degraded").length;

  return (
    <section className="intel-page">
      <header className="intel-hero">
        <div>
          <span className="intel-eyebrow">CYBERRAKSHAK 2.0 · INTELLIGENCE CENTER</span>
          <h1>Know <span>where the signal comes from.</span></h1>
          <p>See which intelligence feeds are live, which records are curated, and why a threat deserves your attention.</p>
        </div>
        <div className="intel-hero-actions">
          <Link className="intel-primary" to="/check">Check a message →</Link>
          <Link className="intel-secondary" to="/threats">Threat Radar</Link>
        </div>
      </header>

      {error && <div className="intel-error" role="alert">⚠️ {error}</div>}

      <div className="intel-metrics" aria-label="Intelligence health summary">
        <article><span>Feed health</span><strong>{summary.healthPercent ?? 0}%</strong><small>{summary.healthy ?? 0} healthy · {summary.failed ?? 0} failed</small></article>
        <article><span>Live feeds</span><strong>{liveFeeds}</strong><small>Automatically refreshed sources</small></article>
        <article><span>Curated feeds</span><strong>{curatedFeeds}</strong><small>Clearly labelled manual sources</small></article>
        <article><span>Visible threats</span><strong>{threats.length}</strong><small>Records in the current feed</small></article>
      </div>

      <div className="intel-grid">
        <section className="intel-panel feed-panel">
          <div className="intel-panel-heading">
            <div><span className="panel-kicker">PROVENANCE</span><h2>Source health</h2></div>
            <span className="generated">Updated {health?.generatedAt ? formatDate(health.generatedAt) : "—"}</span>
          </div>

          {loading ? <div className="intel-loading">Loading source status…</div> : (
            <div className="feed-list">
              {(health?.feeds || []).map((feed) => {
                const meta = statusMeta[feed.status] || statusMeta.degraded;
                return (
                  <article className="feed-row" key={feed.id}>
                    <div className={`feed-status status-${feed.status}`} title={meta.label}><span>{meta.icon}</span></div>
                    <div className="feed-main">
                      <strong>{feed.name || feed.sourceId}</strong>
                      <span>{feed.type || "intelligence"} · {feed.parser || "manual"}</span>
                    </div>
                    <div className="feed-state">
                      <strong>{meta.label}</strong>
                      <span>{feed.records ?? 0} record{feed.records === 1 ? "" : "s"}</span>
                    </div>
                  </article>
                );
              })}
              {!loading && (health?.feeds || []).length === 0 && <div className="intel-empty">No intelligence feeds are registered yet.</div>}
            </div>
          )}
          <p className="provenance-note">“Live” means the current integration has a working automated parser. “Curated” means the source is registered but its records are maintained manually. Neither label means a source is infallible.</p>
        </section>

        <section className="intel-panel methodology-panel">
          <span className="panel-kicker">TRUST MODEL</span>
          <h2>How to read a threat</h2>
          <div className="trust-step"><b>01</b><div><strong>Source</strong><span>Identify who published the information and whether the source is authoritative.</span></div></div>
          <div className="trust-step"><b>02</b><div><strong>Verification</strong><span>Separate published intelligence from a confirmed incident or definitive attribution.</span></div></div>
          <div className="trust-step"><b>03</b><div><strong>Decision</strong><span>Use the evidence to decide what to check, block, report, or learn next.</span></div></div>
          <Link className="method-link" to="/threats">Explore threat records →</Link>
        </section>
      </div>

      <section className="intel-panel records-panel">
        <div className="intel-panel-heading">
          <div><span className="panel-kicker">LATEST SIGNALS</span><h2>Threat records</h2></div>
          <Link to="/threats">Open full radar →</Link>
        </div>

        {loading ? <div className="intel-loading">Loading threat records…</div> : sortedThreats.length === 0 ? (
          <div className="intel-empty">No threat records are available in the current catalog.</div>
        ) : (
          <div className="record-grid">
            {sortedThreats.map((threat) => (
              <button className={`record-card severity-${threat.severity || "info"}`} key={threat.threatId || threat.id} onClick={() => setSelected(threat)}>
                <div className="record-top"><span>{String(threat.severity || "info").toUpperCase()}</span><small>{threat.category || "general"}</small></div>
                <h3>{threat.title}</h3>
                <p>{threat.description}</p>
                <footer><span>{threat.sourceConfidence ?? 0}% confidence</span><span>{formatDate(threat.publishedAt || threat.retrievedAt)}</span></footer>
              </button>
            ))}
          </div>
        )}
      </section>

      {selected && (
        <div className="intel-modal-backdrop" role="presentation" onClick={() => setSelected(null)}>
          <article className="intel-modal" role="dialog" aria-modal="true" aria-label={selected.title} onClick={(event) => event.stopPropagation()}>
            <button className="intel-close" onClick={() => setSelected(null)} aria-label="Close threat record">×</button>
            <span className={`record-severity severity-${selected.severity || "info"}`}>{String(selected.severity || "info").toUpperCase()}</span>
            <h2>{selected.title}</h2>
            <p>{selected.description}</p>
            <div className="modal-facts">
              <div><span>Category</span><strong>{selected.category || "General"}</strong></div>
              <div><span>Confidence</span><strong>{selected.sourceConfidence ?? 0}%</strong></div>
              <div><span>Published</span><strong>{formatDate(selected.publishedAt)}</strong></div>
              <div><span>Retrieved</span><strong>{formatDate(selected.retrievedAt)}</strong></div>
            </div>
            <h3>Source provenance</h3>
            <div className="modal-sources">
              {(selected.sources || []).map((source) => (
                <div key={source.id || source.name}>
                  <strong>{sourceLabel(source)}</strong>
                  <span>Tier {source.tier ?? "—"} · {source.confidence ?? 0}% confidence</span>
                </div>
              ))}
              {(selected.sources || []).length === 0 && <span>No source metadata was attached to this record.</span>}
            </div>
            <Link className="intel-primary" to="/check">Check related content →</Link>
          </article>
        </div>
      )}
    </section>
  );
}

export default ThreatIntelDashboard;
