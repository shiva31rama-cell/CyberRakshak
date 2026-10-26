import { useState } from "react";
import { apiRequest } from "../../services/api";
import "./URLScanner.css";

const riskClass = (risk) => String(risk || "UNKNOWN").toLowerCase();

function URLScanner() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);

    const value = url.trim();
    if (!value) {
      setError("Enter the complete URL you want to review.");
      return;
    }
    if (value.length > 2048) {
      setError("This URL is too long to analyze. The limit is 2,048 characters.");
      return;
    }

    let parsed;
    try {
      parsed = new URL(value);
    } catch {
      setError("Enter a complete URL including https:// or http://.");
      return;
    }
    if (!["http:", "https:"].includes(parsed.protocol)) {
      setError("Only HTTP and HTTPS URLs can be analyzed.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest("/scan/url", {
        method: "POST",
        body: JSON.stringify({ url: value }),
      });
      if (!response?.data) {
        throw new Error("The scanner returned an unexpected response. Please try again.");
      }
      setResult(response.data);
    } catch (requestError) {
      setError(requestError.message || "We could not analyze this URL right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="url-scanner-page">
      <section className="url-scanner-hero">
        <div>
          <span className="eyebrow">SCAN · URL</span>
          <h1>Inspect a link before you open it.</h1>
          <p>
            Check the URL structure for warning signs such as misleading bank-like hostnames,
            shortened links, raw IP addresses and unusual address patterns.
          </p>
        </div>
        <div className="url-scanner-shield" aria-hidden="true">🔗</div>
      </section>

      <form className="url-scanner-form" onSubmit={analyze}>
        <label htmlFor="url-to-scan">Full URL</label>
        <input
          id="url-to-scan"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com/page"
          maxLength={2048}
          autoComplete="url"
          spellCheck="false"
          aria-describedby="url-scanner-privacy"
        />
        <div className="url-scanner-form-footer">
          <span>{url.length}/2048 characters</span>
          <button type="submit" disabled={loading}>
            {loading ? "Analyzing…" : "Analyze URL"}
          </button>
        </div>
        <p id="url-scanner-privacy" className="url-scanner-privacy">
          The URL is sent to CyberRakshak’s backend for structural analysis. The scanner does not
          open or fetch the destination, and it does not perform a live reputation lookup.
        </p>
        {error && <div className="url-scanner-error" role="alert">{error}</div>}
      </form>

      {result && (
        <section className="url-analysis-result" aria-live="polite">
          <div className="url-result-heading">
            <div>
              <span className="eyebrow">STRUCTURAL ANALYSIS</span>
              <h2>URL review</h2>
              <p className="url-hostname">
                <strong>Hostname:</strong> <code>{result.hostname}</code>
              </p>
            </div>
            <span className={`risk-badge ${riskClass(result.riskLevel)}`}>
              {result.riskLevel === "UNKNOWN" ? "NO CLEAR SIGNAL" : `${result.riskLevel} RISK SIGNAL`}
            </span>
          </div>

          <p className="url-result-explanation">{result.explanation}</p>

          <div className="url-result-panel">
            <h3>Observed indicators</h3>
            {result.indicators?.length ? (
              <ul>{result.indicators.map((indicator) => <li key={indicator}>{indicator}</li>)}</ul>
            ) : (
              <p>No structural warning signs were identified by the current checks.</p>
            )}
          </div>

          <div className="url-result-panel">
            <h3>Safer next steps</h3>
            <ul>
              {(result.recommendedActions || []).map((action) => <li key={action}>{action}</li>)}
            </ul>
          </div>

          <p className="url-result-note">
            <strong>Important:</strong> this is a heuristic check, not proof that a website is
            safe or malicious. A clean-looking URL can still lead to harmful content. Do not
            enter credentials or make payments until you have independently verified the
            destination through an official channel.
          </p>
        </section>
      )}
    </main>
  );
}

export default URLScanner;
