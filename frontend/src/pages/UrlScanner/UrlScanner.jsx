import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import "./UrlScanner.css";

const riskClass = (risk) => String(risk || "UNKNOWN").toLowerCase();

function UrlScanner() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);
    if (!url.trim()) {
      setError("Enter the URL you want to check.");
      return;
    }
    setLoading(true);
    try {
      const response = await apiRequest("/scan/url", {
        method: "POST",
        body: JSON.stringify({ url: url.trim() }),
      });
      setResult(response.data);
    } catch (requestError) {
      setError(requestError.message || "We could not analyze this URL right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="url-scanner-page">
      <section className="url-scanner-hero">
        <span className="url-eyebrow">SCAN · URL</span>
        <h1>Check a link before you trust it.</h1>
        <p>CyberRakshak checks the URL's visible structure for warning signs. It does not claim that a URL is malicious without evidence.</p>
      </section>

      <div className="scanner-switcher" aria-label="Scanner types">
        <button type="button" onClick={() => navigate("/scan")}>💬 Message Scanner</button>
        <button type="button" className="active">🔗 URL Scanner</button>
      </div>

      <form className="url-form" onSubmit={analyze}>
        <label htmlFor="url-input">URL to analyze</label>
        <input id="url-input" type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com" maxLength={2048} autoComplete="off" />
        <div className="url-form-footer">
          <span>Never paste passwords, OTPs, PINs or recovery codes.</span>
          <button type="submit" disabled={loading}>{loading ? "Checking…" : "Analyze URL"}</button>
        </div>
        {error && <div className="url-error" role="alert">{error}</div>}
      </form>

      {result && (
        <section className="url-result" aria-live="polite">
          <div className="url-result-heading">
            <div>
              <span className="url-eyebrow">STRUCTURAL ANALYSIS</span>
              <h2>{result.hostname}</h2>
            </div>
            <span className={"url-risk " + riskClass(result.riskLevel)}>{result.riskLevel} RISK</span>
          </div>
          <div className="url-result-grid">
            <div>
              <h3>Warning signs</h3>
              {result.indicators?.length ? <ul>{result.indicators.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No obvious structural warning signs were detected.</p>}
            </div>
            <div>
              <h3>Safer next steps</h3>
              <ul>{result.recommendedActions?.map((item) => <li key={item}>✓ {item}</li>)}</ul>
            </div>
          </div>
          <div className="url-note"><strong>Important:</strong> {result.explanation}</div>
        </section>
      )}
    </div>
  );
}

export default UrlScanner;
