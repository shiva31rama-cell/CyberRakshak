import { useState } from "react";
import { apiRequest } from "../../services/api";
import "./URLScanner.css";

function URLScanner() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);
    if (!url.trim()) return setError("Enter a URL first.");
    setLoading(true);
    try {
      const response = await apiRequest("/scan/url", { method: "POST", body: JSON.stringify({ url: url.trim() }) });
      setResult(response.data);
    } catch (err) {
      setError(err.message || "Unable to analyze the URL.");
    } finally { setLoading(false); }
  };

  return <main className="tool-page">
    <section className="tool-hero"><span>🔗 URL SCANNER</span><h1>Check a link before you trust it.</h1><p>CyberRakshak checks observable URL characteristics. A heuristic result is not proof that a site is safe or malicious.</p></section>
    <form className="tool-card" onSubmit={submit}>
      <label htmlFor="url">Website URL</label>
      <input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" maxLength={2048} />
      <button disabled={loading}>{loading ? "Checking…" : "Analyze URL"}</button>
      {error && <p className="tool-error" role="alert">{error}</p>}
    </form>
    {result && <section className="tool-result" aria-live="polite">
      <div className="result-top"><h2>{result.riskLevel} RISK</h2><span>{Math.round((result.confidence || 0) * 100)}% heuristic confidence</span></div>
      <p>{result.explanation}</p>
      <h3>Observed indicators</h3>
      {result.indicators?.length ? <ul>{result.indicators.map((x) => <li key={x}>{x}</li>)}</ul> : <p>No strong indicators detected.</p>}
      <h3>Safer next steps</h3><ul>{result.recommendedActions?.map((x) => <li key={x}>{x}</li>)}</ul>
    </section>}
  </main>;
}
export default URLScanner;
